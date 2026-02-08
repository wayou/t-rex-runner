// lists of questions
let iSurvivedQuestionsParagraph1 = ["Who was Josh navigating the wildfire with?", "What did the glowing embers and chunks of flaming wood feel like to Josh?"];
let iSurvivedQuestionsParagraph2 = ["What happened to the tree?", "Where was the tree branch heading?"];
let iSurvivedQuestionsParagraph3 = ["Where did Josh`s dad work?", "How long did Josh wait for his mom?"];
// let iSurvivedQuestionsParagraph4 = ["question 1", "question 2", "question 3", "question 4"];
// let iSurvivedQuestionsParagraph5 = ["question 1", "question 2", "question 3", "question 4"];
// let allISurvivedQuestions = [...iSurvivedQuestionsParagraph1,...iSurvivedQuestionsParagraph2,...iSurvivedQuestionsParagraph3]
let allISurvivedQuestions = [...iSurvivedQuestionsParagraph1,...iSurvivedQuestionsParagraph2]

// lists of answers
let iSurvivedAnswersParagraph1Q1 = ["Cousin Holly", "Greg", "Josh`s Mom"];
let iSurvivedAnswersParagraph1Q2 = ["A flesh eating monster", "A sharped tooth shark", "the claws of a bear"];
let iSurvivedAnswersParagraph2Q1 = ["It exploded", "It flew away", "Someone crashed into it"];
let iSurvivedAnswersParagraph2Q2 = ["For Josh`s skull", "For Holly`s skull", "For a building"];
let iSurvivedAnswersParagraph3Q1 = ["A big New York City bank", "The NBA", "The Airport"];
let iSurvivedAnswersParagraph3Q2 = ["Ten minutes", "Five minutes", "Sixty minutes"];
// let iSurvivedAnswersParagraph4 = ["answer 1", "answer 2", "answer 3", "answer 4"];
// let iSurvivedAnswersParagraph5 = ["answer 1", "answer 2", "answer 3", "answer 4"];
let allISurvivedAnswers = [...iSurvivedAnswersParagraph1Q1,...iSurvivedAnswersParagraph1Q2,...iSurvivedAnswersParagraph2Q1,...iSurvivedAnswersParagraph2Q2];


// lists of paragraphs
const iSurvivedParagraph1 = "Josh stared in horror at the blood-red glow rising up behind him. A massive wildfire was raging through the forest, a wall of flames devouring everything in its path. Josh and his cousin Holly were in a race for their lives.\n\t'Josh!' Holly shouted, grabbing his hand.\n'This way!`\n\tAs they took off along the forest path, the hot wind gusted hard. Suddenly,the air was filled with sparks and glowing embers and chunks of flaming wood. Josh felt them landing on his bare arms and legs, sizzling against his skin like the white-hot teeth of a flesh-eating monster.\n\tHe and Holly ran faster, but the wall of flames was closing in from behind. And all around them, the burning embers were setting fires wherever they landed.";
const iSurvivedParagraph2 = "On treetops. \nWHOOSH! \nOn branches. \nWHOOSH!\nOn the forest floor.\nWHOOSH! WHOOSH! WHOOSH! \nWith every gust of wind, more embers swirled. Flames shot higher and higher into the sky. A nightmare of sounds against Josh`s ears. The fire`s roar, the moaning wind, the cracking and snapping of the trees. It was as though air itself was shrieking in agony. \nJosh glanced around, struggling to breathe in the thickening smoke. Just minutes before, the forest had been peaceful and green. Now it was a terrifying maze of fire. \nHow could everything change so fast? \nAnd then: \nBoom! \nA burning pine tree in front of them exploded. Shards of splintered wood sprayed out. Holly tried to pull Josh sideways, but Josh stumbled. When he looked up, there was a flaming branch speeding through the air. \nIt was headed straight for his skull." ;
const iSurvivedParagraph3 = "Josh snatched the basketball from the air and sprinted down the court. They were down by two points, just seconds left in the game. A monster of a kid was all over Josh, trying to steal the ball. But Josh spun around and took the shot just as the buzzer blared.\nSwish! \nThree points! They`d won! \nJosh dropped to his knees in happy shock. \nHis team swarmed around him, smothering him in sweaty hugs.\n``You were unstoppable!`` said Josh`s best friend, Greg, as they trotted off the court. ``That shot was sick!``\n``You played great, too,`` Josh said, putting an arm around Greg`s skinny shoulders.\nJosh glanced up into the stands, wishing his father had been there to see his buzzer-beater. Dad was going to freak when he found out that Josh made a three-pointer!\nJosh had been practicing in the driveway for months,shooting and missing, shooting and missing, with Dad always cheering him on.\n``Don`t give up!`` he`d shout. Dad always told Josh he could do anything he set his mind to.\n``Just look at me,`` he`d say.\nDad had grown up with practically nothing. He`d worked his butt off. Now he was one of the top guys at the big New York City bank where he worked. Everyone loved Tim Wallace. And Josh admired his father more than anyone in the world.\nJosh packed up his stuff and said goodbye to his coach.\n``Need a ride?`` Greg asked as they headed out into the parking lot.\n``I`m good,`` Josh said, high-fiving Greg. ``I`m sure my mom is on her way.``\nBut five minutes passed, then ten. All Josh`s friends had left, and Mom still wasn`t there. She hadn`t been feeling great today; that`s why she`d skipped the game. But Josh could swear she`d said she`d be here to pick him up.";
// const iSurvivedParagraph4 = "This is the fourth paragraph of the book.";
// const iSurvivedParagraph5 = "This is the fifth paragraph of the book.";
const allISurvivedParagraphs = [iSurvivedParagraph1,iSurvivedParagraph2,iSurvivedParagraph3];

let numOfParagraphs = 5;

let selectedNumOfParagraphs = 0;

let finishedParagraphs = -1;

let currentQuestion = -1;

let randomList = [0, 1, 2];

let correctAnswers = 0;

// function to clear the screen of all html elements
function clearIntroScreen(){
    document.getElementById("introHeading").classList.add("hidden");
    document.getElementById("introHeading2").classList.add("hidden");
    document.getElementById("introButton").classList.add("hidden");
}

// function to show text after book is selected
function promptParagraphNum(){
    clearIntroScreen();
    document.getElementById("numParagraphsHeading2").classList.remove("hidden");
    document.getElementById("numParagraphsButton").classList.remove("hidden");
    document.getElementById("numParagraphsText").classList.remove("hidden");
    document.getElementById("numParagraphsHeading2").innerText = "How many paragraphs would you like to read?";
}

// function to read the number of paragraphs the user wants to read
function readInput(){
    // console.log(document.getElementById("numParagraphsText").value);
    let text = document.getElementById("numParagraphsText").value
    // change these values if the number of paragraphs change
    if (text=="2" || text == "3" || text == "4" || text == "5") {
        if (text=="2"){
            selectedNumOfParagraphs = 2;
        }
        else if (text == "3"){
            selectedNumOfParagraphs = 3;
        }
        // else if (text == "4"){
        //     selectedNumOfParagraphs = 4;
        // }
        // else if (text == "5"){
        //     selectedNumOfParagraphs = 5;
        // }
        setupToShowParagraphs();
    }
    else {
        alert("Please enter a valid input between 2 and "+numOfParagraphs+" paragraphs!");
    }
}

// function to set up the screen to show each paragraph
function setupToShowParagraphs(){
    document.getElementById("numParagraphsHeading2").classList.add("hidden");
    document.getElementById("numParagraphsButton").classList.add("hidden");
    document.getElementById("numParagraphsText").classList.add("hidden");
    document.getElementById("mainParagraph").classList.remove("hidden");
    document.getElementById("nextButton").classList.remove("hidden");
    increment();
}

// function to show each paragraph
function showParagraphs(updatedFinishedParagraphs){
    // console.log(selectedNumOfParagraphs);
    if(updatedFinishedParagraphs < selectedNumOfParagraphs){
        document.getElementById("mainParagraph").innerText = allISurvivedParagraphs[updatedFinishedParagraphs];
    }
    if(updatedFinishedParagraphs == selectedNumOfParagraphs-1){
        document.getElementById("nextButton").classList.add("hidden");
        document.getElementById("finishButton").classList.remove("hidden");
    }
}

// function to increment the current paragraph
function increment(){
    finishedParagraphs+=1;
    showParagraphs(finishedParagraphs);
}

function incrementQuestion(){
    currentQuestion+=1;
    if(currentQuestion<=2){
    document.getElementById("question").innerText = allISurvivedQuestions[randomList[currentQuestion]];
    }
    else{
        showNumOfCorrectAnswers();
    }
}

function showNumOfCorrectAnswers(){
    document.getElementById("questionsContainer").classList.add("hidden");
    document.getElementById("questionsCorrectHeader").classList.remove("hidden");
    document.getElementById("questionsCorrect").classList.remove("hidden");
    document.getElementById("questionsCorrect").innerText = "You got"+ correctAnswers+"out of 3 questions correct!";
    document.getElementById("question").classList.add("hidden");
    document.getElementById("questions").classList.add("hidden");
    document.getElementById("submitButton").classList.add("hidden");
}

function showReminder() {
    document.getElementById("finishButton").classList.add("hidden");
    document.getElementById("mainParagraph").classList.add("hidden");
    document.getElementById("startQuiz").classList.remove("hidden");
}

// function to begin quiz
function startQuiz(){
    document.getElementById("startQuiz").classList.add("hidden");
    document.getElementById("finishButton").classList.add("hidden");
    document.getElementById("mainParagraph").classList.add("hidden");
    document.getElementById("question").classList.remove("hidden");
    document.getElementById("questions").classList.remove("hidden");
    document.getElementById("submitButton").classList.remove("hidden");
    if(selectedNumOfParagraphs==3){
        for(let i=0; i<3; i++){
            randomList[i] = Math.floor(Math.random()*(5-0+1));
        }
        allISurvivedQuestions = [...iSurvivedQuestionsParagraph1,...iSurvivedQuestionsParagraph2,...iSurvivedQuestionsParagraph3]
    }
    else{
        for(let i=0; i<3; i++){
            randomList[i] = Math.floor(Math.random()*(3-0+1));
        }
    }
    incrementQuestion();
}

// function to reveal the game and then hide it again after 5 minutes
function startGame(){
    document.getElementById("gameWindow").classList.remove("hidden");
    setTimeout(document.getElementById("gameWindow").classList.add("hidden"), 5000);
}


// start of program
document.getElementById("introHeading").innerText = "Welcome to the reading app!";
document.getElementById("introHeading2").innerText = "What book would you like to read today?";

// new page to indicate questions starting 
