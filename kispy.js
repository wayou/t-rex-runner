


let tapCount = 0;

const tapKispy = () => {
	console.log('tapcount', tapCount);
    if (tapCount == 16){
    		kispy.style.backgroundImage = "url(assets/kispyPng1.png)";
    		console.log('reset', tapCount);
    		headSpin();
    		playAudio();
    		tapCount = 0;
    };

    tapCount += 1;
};



// let tapCount = 0;
// const kispy = document.getElementById('kispy');
// kispy.addEventListener("click", function(){
// 	tapCount += 1;
//     tapKispy();
//     if (tapCount == 10){
//     		kispy.style.backgroundImage = "url(assets/kispyPng1.png)";
//     		console.log('reset', tapCount);
//     		playAudio();
//     		tapCount = 0;
//     };
// });

let headSpinCounter = 1;

var meowSound = document.getElementById("meowSound"); 

function playAudio() { 
  meowSound.play(); 
} 

const headSpin = ()=>{
let chase = setInterval(function() {
        	
            if (headSpinCounter==9) { headSpinCounter = 1};
            console.log('reset', headSpinCounter);
 		kispy.style.backgroundImage = "url(assets/kispyPng"+headSpinCounter+".png)";
 		headSpinCounter += 1;
        }, 50);
  setTimeout(function() {
            clearInterval(chase)
        }, 1000)

};



        

      