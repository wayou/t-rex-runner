# Aanpassingen aan de T-Rex Runner

Het origineel is het dinospel uit Google Chrome dat je krijgt als je geen internet hebt. Ik heb het spel op zes punten aangepast. De wijzigingen staan in `index.js`, `index.css` en `index.html` en zijn in de code te vinden met de zoekterm `AANPASSING`.

| # | Aanpassing | Wat het doet |
|---|------------|--------------|
| 1 | Sprongsnelheid werkt echt | De instelling `INITIAL_JUMP_VELOCITY` wordt nu ook echt gebruikt |
| 2 | Dubbele sprong | In de lucht kun je nog één keer springen |
| 3 | Levens | Je hebt 3 levens. Pas na 3 botsingen is het game over |
| 4 | Opgeslagen highscore | Je highscore blijft bewaard, ook nadat je de pagina sluit |
| 5 | Achtergrondkleur | Lichtblauwe lucht in plaats van een witte achtergrond |
| 6 | Moeilijkheidsmenu | Kies tussen Makkelijk, Normaal en Moeilijk |

---

## Hoe het spel werkt (basis)

Het spel draait in een **game loop**: de functie `Runner.update()` wordt ongeveer 60 keer per seconde aangeroepen via `requestAnimationFrame`. In elke ronde (*frame*) gebeurt het volgende:

1. Het canvas wordt leeggemaakt.
2. De positie van de dino, de wolken en de obstakels wordt bijgewerkt.
3. Het spel controleert of de dino een obstakel raakt (*collision detection*, botsingsdetectie).
4. Alles wordt opnieuw getekend.

De variabele `deltaTime` is de tijd in milliseconden sinds het vorige frame. Het spel rekent daarmee, zodat het op een trage en een snelle computer even snel loopt.

---

## Aanpassing 1: de sprongsnelheid werkt echt

**Probleem:** in `Runner.config` stond `INITIAL_JUMP_VELOCITY: 100`, maar dat getal had **geen enkel effect**. De dino gebruikt namelijk zijn eigen instelling `Trex.config.INIITAL_JUMP_VELOCITY` (met een typfout in de naam, `INIITAL`). De waarde uit `Runner.config` werd alleen doorgegeven als je hem tijdens het spel veranderde.

**Oplossing:** in `Runner.init()` geef ik de waarde direct door aan de dino:

```js
this.tRex.setJumpVelocity(this.config.INITIAL_JUMP_VELOCITY);
```

`setJumpVelocity` maakt het getal negatief, omdat op een canvas de y-as **naar beneden** loopt: y = 0 is de bovenkant. Omhoog bewegen betekent dus dat y kleiner wordt.

Ik heb de waarde op **12** gezet in plaats van 100. Bij 100 zou de dino al in het eerste frame 100 pixels omhoog schieten, terwijl het hele canvas maar 150 pixels hoog is. 12 is iets hoger dan het origineel (10), zodat de dubbele sprong lekker speelt.

---

## Aanpassing 2: dubbele sprong

**Idee:** als de dino al in de lucht is, mag je nog één keer op spatie drukken om opnieuw omhoog te gaan.

**Hoe:**
- De dino houdt een teller bij: `airJumps` (het aantal sprongen in de lucht).
- In `onKeyDown` staat een extra voorwaarde:

```js
} else if (this.tRex.jumping && !e.repeat &&
    this.tRex.airJumps < this.config.MAX_AIR_JUMPS) {
    this.tRex.airJump(this.currentSpeed);
}
```

  Dus: de dino springt al, het is een **nieuwe** toetsdruk (`e.repeat` is `true` als je de toets alleen ingedrukt houdt) en het maximum is nog niet bereikt.
- `airJump()` zet de snelheid weer omhoog, net als bij een gewone sprong, en verhoogt de teller met 1.
- In `reset()`, als de dino weer op de grond staat, gaat `airJumps` terug naar 0.
- **Plafond:** bij het testen vloog de dino met een dubbele sprong boven het scherm uit (y = −30). Daarom staat in `updateJump()` nu een check: als `yPos < 0`, dan wordt `yPos = 0` en stopt de stijging.

Met `MAX_AIR_JUMPS` in de config kun je instellen hoeveel extra sprongen er mogen (0 = origineel spel).

---

## Aanpassing 3: levens

**Idee:** in plaats van meteen game over heb je 3 levens. Linksboven zie je een hartje per leven.

**Hoe:**
- Nieuwe variabelen: `this.lives` (begint op `LIVES` = 3) en `this.invincibleTimer`.
- Bij een botsing gaat er eerst een leven af:

```js
this.lives--;
if (this.lives > 0) {
    this.loseLife();
} else {
    this.gameOver();
}
```

- `loseLife()` speelt het botsingsgeluid af, haalt het geraakte obstakel weg (`removeFirstObstacle`) en maakt de dino **1,5 seconde onkwetsbaar**. Zonder die onkwetsbaarheid zou je in hetzelfde obstakel meteen alle levens tegelijk verliezen, omdat de botsing elk frame opnieuw wordt gedetecteerd.
- Tijdens die onkwetsbaarheid **knippert** de dino. In `Trex.draw()` wordt om de 100 ms de doorzichtigheid (`globalAlpha`) op 0,3 gezet. Dat gebeurt met `Math.floor(tijd / 100) % 2`: dit is afwisselend 0 en 1.
- `drawLives()` tekent met `fillText` een ♥ per leven op het canvas.
- Bij `restart()` worden de levens weer op 3 gezet.

---

## Aanpassing 4: highscore opslaan

**Probleem:** in het origineel is je highscore weg zodra je de pagina herlaadt, omdat hij alleen in een variabele staat (in het werkgeheugen).

**Oplossing:** de highscore wordt opgeslagen in **`localStorage`**. Dat is een kleine opslagplaats in de browser die blijft bestaan na het sluiten van de pagina.
- `saveHighScore()` gebruikt `localStorage.setItem(...)` bij game over, als je een nieuwe highscore hebt.
- `loadHighScore()` leest met `localStorage.getItem(...)` de score bij het opstarten. `localStorage` slaat alles op als tekst, dus met `parseInt` wordt het weer een getal.
- Beide staan in een `try { } catch { }`. In sommige browsers (bijvoorbeeld in privémodus) is `localStorage` geblokkeerd. Het spel crasht dan niet, maar de highscore wordt dan niet bewaard.

---

## Aanpassing 5: achtergrondkleur

**Idee:** een lichtblauwe lucht in plaats van een witte achtergrond.

**Hoe:** dit staat in `index.css`, niet in JavaScript. Het canvas waarop het spel wordt getekend is doorzichtig: alleen de dino, de grond en de obstakels worden erop getekend. Daarom is het genoeg om de achtergrond van de pagina (`body`) een kleur te geven:

```css
:root {
  --achtergrond: #bfe6ff;
}

html, body {
  background-color: var(--achtergrond);
}
```

`--achtergrond` is een **CSS-variabele**: je definieert de kleur één keer en gebruikt hem met `var(...)`. Wil je een andere kleur, dan hoef je alleen `#bfe6ff` te veranderen. Dit is een hexadecimale kleurcode: twee tekens voor rood, groen en blauw, elk van `00` (niets) tot `ff` (maximaal). `bf e6 ff` is dus weinig rood, veel groen en volledig blauw: lichtblauw.

---

## Aanpassing 6: menu met drie moeilijkheden

**Idee:** voor het spelen, en na elke game over, kies je in een menu hoe moeilijk het spel is. Dat kan door op een knop te klikken of door op **1**, **2** of **3** te drukken.

| Instelling | Makkelijk | Normaal | Moeilijk | Betekenis |
|---|---|---|---|---|
| `SPEED` | 5 | 6 | 8 | beginsnelheid |
| `MAX_SPEED` | 10 | 13 | 16 | topsnelheid |
| `ACCELERATION` | 0,0005 | 0,001 | 0,002 | hoeveel sneller per frame |
| `GAP_COEFFICIENT` | 0,9 | 0,6 | 0,45 | ruimte tussen obstakels (groter = meer ruimte) |
| `LIVES` | 5 | 3 | 1 | aantal levens |

"Normaal" heeft dezelfde snelheden als het originele spel.

**Hoe het werkt:**

- **HTML (`index.html`):** het menu is een `<div id="menu">` met drie knoppen. Elke knop heeft een `data-moeilijkheid`-attribuut, bijvoorbeeld `data-moeilijkheid="moeilijk"`. JavaScript leest dat attribuut uit met `button.dataset.moeilijkheid`. Het oude berichtje "Press Space to start" en het losse scriptje dat het verborg, zijn weggehaald.
- **Gegevens (`Runner.difficulties`):** de drie moeilijkheden staan in één object. Elke moeilijkheid is zelf weer een object met de waarden uit de tabel. Een vierde moeilijkheid toevoegen is daardoor makkelijk: je voegt één regel toe aan het object en één knop aan de HTML.
- **`setDifficulty(name)`:** kopieert de waarden naar `this.config`, het object waar het spel zijn instellingen uit leest. De functie zet ook de snelheid, de ruimte tussen obstakels (`horizon.gapCoefficient`) en de levens meteen goed. Bovenaan staat een **controle**: `if (!settings || this.playing) return;`. Tijdens het spelen kun je de moeilijkheid dus niet veranderen, anders zou je midden in een potje kunnen wisselen.
- **Events:** `initMenu()` koppelt aan elke knop een `click`-*event listener* (een functie die wordt uitgevoerd als er op de knop geklikt wordt). In `onKeyDown` vertaalt `Runner.difficultyKeys` de toetscodes 49, 50 en 51 (de toetsen 1, 2 en 3) naar een moeilijkheid.
- **`blur()`:** na een klik heeft de knop de *focus* (hij is "geselecteerd"). Spatie zou dan de knop nog een keer indrukken in plaats van te springen. `blur()` haalt die focus weg.
- **Tonen en verbergen:** `showMenu(true/false)` zet de CSS-class `verborgen` (met `display: none`) aan of uit. Het menu verdwijnt als het spel start of herstart, en komt terug bij game over.
- **Highscore per moeilijkheid:** de naam in `localStorage` hangt nu af van de moeilijkheid, bijvoorbeeld `t-rex-highscore-moeilijk`. Zo kun je een score op Makkelijk niet vergelijken met een score op Moeilijk.
- **CSS:** het menu heeft `position: fixed` en `bottom: 16px`. Het zweeft dus onderaan het scherm en bedekt de score en "GAME OVER" niet. Bij het testen stond het eerst bovenaan, en toen lag het precies over de score heen.

---

## Testen

Ik heb het spel automatisch getest in een browser (Playwright, Chromium):

| Test | Resultaat |
|------|-----------|
| Sprongsnelheid in de dino | −12 ✔ |
| Dubbele sprong: 2e druk in de lucht | `airJumps` = 1 ✔ |
| 3e druk in de lucht | wordt genegeerd ✔ |
| Plafond: laagste y-positie | 0 (niet meer boven het scherm) ✔ |
| Levens: 3 → 2 → 1 → game over | ✔ |
| Highscore na herladen pagina | nog steeds aanwezig ✔ |
| Menu: klik op Moeilijk | 1 leven, snelheid 8, ruimte 0,45 ✔ |
| Menu verdwijnt bij start en komt terug bij game over | ✔ |
| Toets 1 na game over | Makkelijk: 5 levens, snelheid 5 ✔ |
| Highscore apart per moeilijkheid | `t-rex-highscore-moeilijk` ✔ |
| JavaScript-fouten | geen ✔ |

## Spelen

Open `index.html` in een browser. Kies eerst een moeilijkheid (klik, of druk op 1, 2 of 3). Druk op **spatie** of **pijltje omhoog** om te springen (twee keer voor een dubbele sprong) en op **pijltje omlaag** om te bukken.
