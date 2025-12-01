#!/usr/bin/env python3
"""
Roar Runner Local Data Collection Server
Simple Flask server with SQLite database for local development/testing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

# Configuration
DATABASE = 'roar_runner_data.db'
AUDIO_FOLDER = 'audio_recordings'
UPLOAD_FOLDER = 'uploads'

# Create folders if they don't exist
os.makedirs(AUDIO_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def init_db():
    """Initialize the SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_uuid TEXT NOT NULL,
            age_range TEXT,
            baseline_stress INTEGER,
            jump_threshold REAL,
            score INTEGER,
            distance_ran REAL,
            duration REAL,
            jump_count INTEGER,
            timestamp TEXT,
            game_over_reason TEXT,
            user_agent TEXT,
            screen_resolution TEXT,
            game_version TEXT,
            audio_file_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print(f"✓ Database initialized: {DATABASE}")

@app.route('/')
def index():
    """Simple index page to confirm server is running"""
    return """
    <h1>Roar Runner Data Collection Server</h1>
    <p>Server is running!</p>
    <p><a href="/api/sessions">View all sessions</a></p>
    <p><a href="/api/stats">View statistics</a></p>
    """

@app.route('/api/submit-session', methods=['POST'])
def submit_session():
    """
    Endpoint to receive session data from the game
    Accepts multipart/form-data with:
    - sessionData: JSON string with participant and game stats
    - audioRecording: Blob (audio/webm file)
    """
    try:
        # Get JSON data
        session_data_str = request.form.get('sessionData')
        if not session_data_str:
            return jsonify({
                'success': False,
                'message': 'No session data provided'
            }), 400

        session_data = json.loads(session_data_str)

        # Extract data
        participant = session_data.get('participant', {})
        game_stats = session_data.get('gameStats', {})
        metadata = session_data.get('metadata', {})

        # Handle audio file
        audio_file_path = None
        if 'audioRecording' in request.files:
            audio_file = request.files['audioRecording']
            if audio_file.filename:
                # Create safe filename
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{participant.get('uuid', 'unknown')}_{timestamp}.webm"
                filename = secure_filename(filename)
                audio_file_path = os.path.join(AUDIO_FOLDER, filename)
                audio_file.save(audio_file_path)
                print(f"✓ Audio saved: {audio_file_path}")

        # Insert into database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO sessions (
                participant_uuid, age_range, baseline_stress, jump_threshold,
                score, distance_ran, duration, jump_count, timestamp,
                game_over_reason, user_agent, screen_resolution, game_version,
                audio_file_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            participant.get('uuid'),
            participant.get('ageRange'),
            participant.get('baselineStress'),
            participant.get('jumpThreshold'),
            game_stats.get('score'),
            game_stats.get('distanceRan'),
            game_stats.get('duration'),
            game_stats.get('jumpCount'),
            game_stats.get('timestamp'),
            game_stats.get('gameOverReason'),
            metadata.get('userAgent'),
            metadata.get('screenResolution'),
            metadata.get('gameVersion'),
            audio_file_path
        ))

        session_id = cursor.lastrowid
        conn.commit()
        conn.close()

        print(f"✓ Session saved: ID={session_id}, UUID={participant.get('uuid')}")

        return jsonify({
            'success': True,
            'message': 'Session data received successfully',
            'sessionId': session_id
        }), 200

    except Exception as e:
        print(f"✗ Error processing session: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing session: {str(e)}'
        }), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all sessions from the database"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM sessions ORDER BY created_at DESC')
        rows = cursor.fetchall()

        sessions = []
        for row in rows:
            sessions.append(dict(row))

        conn.close()

        return jsonify({
            'success': True,
            'count': len(sessions),
            'sessions': sessions
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving sessions: {str(e)}'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get aggregate statistics from all sessions"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Get basic stats
        cursor.execute('''
            SELECT
                COUNT(*) as total_sessions,
                AVG(score) as avg_score,
                MAX(score) as max_score,
                AVG(duration) as avg_duration,
                AVG(jump_count) as avg_jumps,
                COUNT(DISTINCT participant_uuid) as unique_participants
            FROM sessions
        ''')
        stats = dict(zip([d[0] for d in cursor.description], cursor.fetchone()))

        # Get age distribution
        cursor.execute('''
            SELECT age_range, COUNT(*) as count
            FROM sessions
            GROUP BY age_range
        ''')
        age_distribution = [dict(zip([d[0] for d in cursor.description], row))
                           for row in cursor.fetchall()]

        # Get baseline stress distribution
        cursor.execute('''
            SELECT baseline_stress, COUNT(*) as count
            FROM sessions
            GROUP BY baseline_stress
        ''')
        stress_distribution = [dict(zip([d[0] for d in cursor.description], row))
                              for row in cursor.fetchall()]

        conn.close()

        return jsonify({
            'success': True,
            'stats': stats,
            'age_distribution': age_distribution,
            'stress_distribution': stress_distribution
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving stats: {str(e)}'
        }), 500

@app.route('/api/export', methods=['GET'])
def export_data():
    """Export all data as JSON for analysis"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM sessions ORDER BY created_at DESC')
        rows = cursor.fetchall()

        sessions = []
        for row in rows:
            sessions.append(dict(row))

        conn.close()

        return jsonify({
            'success': True,
            'export_date': datetime.now().isoformat(),
            'total_sessions': len(sessions),
            'sessions': sessions
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error exporting data: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("Roar Runner Local Data Collection Server")
    print("=" * 60)

    # Initialize database
    init_db()

    print("\nServer endpoints:")
    print("  - POST /api/submit-session  (receives game data)")
    print("  - GET  /api/sessions         (view all sessions)")
    print("  - GET  /api/stats            (view statistics)")
    print("  - GET  /api/export           (export data as JSON)")
    print("\nStarting server...")
    print("=" * 60)

    # Run the server
    app.run(host='127.0.0.1', port=5000, debug=True)
