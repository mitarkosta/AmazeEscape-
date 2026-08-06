/* ==========================================================
   AMAZE ESCAPE
   ENGINE v4
   PART 1 / 3
   CORE SYSTEM
   ========================================================== */

"use strict";


const AMAZE = {

    symbols:[
        "🍒",
        "🍋",
        "⭐",
        "💎",
        "🔔",
        "7️⃣"
    ],

    attempts:0,

    playing:false,

    audio:null,

    machine:null,

    button:null,

    slots:[],

    message:null,

    counter:null,

    lever:null,

    lamp:null

};



/* ==========================================================
   INITIALIZE
   ========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    AMAZE.machine =
    document.querySelector(
        ".machine"
    );


    AMAZE.button =
    document.getElementById(
        "button"
    );


    AMAZE.message =
    document.getElementById(
        "message"
    );


    AMAZE.counter =
    document.getElementById(
        "counter"
    );


    AMAZE.slots=[

        document.getElementById("slot1"),

        document.getElementById("slot2"),

        document.getElementById("slot3")

    ];



    AMAZE.lever =
    document.querySelector(
        ".real-lever"
    );


    AMAZE.lamp =
    document.querySelector(
        ".jackpot-lamp"
    );



    console.log(
        "🎰 AmazeEscape v4 loaded"
    );


    console.log(
        "Machine:",
        AMAZE.machine
    );


    console.log(
        "Lever:",
        AMAZE.lever
    );


    console.log(
        "Slots:",
        AMAZE.slots
    );



    if(AMAZE.button){


        AMAZE.button.addEventListener(
            "click",
            spinGame
        );


    }



    updateCounter();


});





/* ==========================================================
   RANDOM SYMBOL
   ========================================================== */


function randomSymbol(){


    return AMAZE.symbols[

        Math.floor(
            Math.random()
            *
            AMAZE.symbols.length
        )

    ];


}





/* ==========================================================
   MESSAGE
   ========================================================== */


function setMessage(text){


    if(AMAZE.message){

        AMAZE.message.innerHTML =
        text;

    }


}





/* ==========================================================
   COUNTER
   ========================================================== */


function updateCounter(){


    if(AMAZE.counter){

        AMAZE.counter.innerHTML =
        "Attempts: "
        +
        AMAZE.attempts;

    }


}





/* ==========================================================
   AUDIO
   ========================================================== */


function getAudio(){


    if(!AMAZE.audio){

        AMAZE.audio =
        new AudioContext();

    }


    return AMAZE.audio;


}




function playSound(
frequency,
duration=0.1,
type="square",
volume=0.05
){


    try{


        const ctx =
        getAudio();


        const osc =
        ctx.createOscillator();


        const gain =
        ctx.createGain();



        osc.type =
        type;


        osc.frequency.value =
        frequency;


        gain.gain.value =
        volume;



        osc.connect(gain);


        gain.connect(
            ctx.destination
        );


        osc.start();


        osc.stop(
            ctx.currentTime+
            duration
        );


    }

    catch(e){}


}
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v4
   PART 2 / 3
   SPIN ENGINE
   ========================================================== */


/* ==========================================================
   SPIN GAME
   ========================================================== */

function spinGame(){


    if(AMAZE.playing)
    return;


    if(
        AMAZE.slots.length!==3 ||
        !AMAZE.slots[0] ||
        !AMAZE.slots[1] ||
        !AMAZE.slots[2]
    ){

        console.warn(
            "Slots missing."
        );

        return;

    }


    AMAZE.playing=true;


    AMAZE.attempts++;


    updateCounter();


    setMessage(
        "🎰 SPINNING..."
    );


    if(AMAZE.button){

        AMAZE.button.disabled=true;

    }


    if(AMAZE.machine){

        AMAZE.machine.classList.add(
            "playing"
        );

    }


    leverPull();


    playSound(
        120,
        .20,
        "sawtooth",
        .07
    );


    startReels();

}





/* ==========================================================
   START REELS
   ========================================================== */

function startReels(){


    AMAZE.slots.forEach(slot=>{

        slot.classList.remove(
            "reel-stop"
        );

        slot.classList.add(
            "reel-spin"
        );

    });



    const timer =
    setInterval(()=>{


        AMAZE.slots.forEach(slot=>{


            slot.innerHTML=
            randomSymbol();


        });


    },80);




    setTimeout(()=>{


        clearInterval(timer);


        stopReels();


    },2200);


}





/* ==========================================================
   STOP REELS
   ========================================================== */

function stopReels(){


    let result=[];


    AMAZE.slots.forEach(
    (slot,index)=>{


        setTimeout(()=>{


            slot.classList.remove(
                "reel-spin"
            );


            slot.classList.add(
                "reel-stop"
            );


            const symbol=
            randomSymbol();


            slot.innerHTML=
            symbol;


            result[index]=
            symbol;


            playSound(
                700-index*120,
                .08,
                "square",
                .05
            );


            if(index===2){

                finishSpin(
                    result
                );

            }


        },

        index*500);


    });


}





/* ==========================================================
   FINISH
   ========================================================== */

function finishSpin(result){


    AMAZE.playing=false;


    if(AMAZE.button){

        AMAZE.button.disabled=false;

    }


    if(AMAZE.machine){

        AMAZE.machine.classList.remove(
            "playing"
        );

    }


    checkResult(
        result
    );

}





/* ==========================================================
   RESULT
   ========================================================== */

function checkResult(result){


    const a=result[0];
    const b=result[1];
    const c=result[2];



    if(a===b && b===c){

        setMessage(
            "🎉 JACKPOT!"
        );

        jackpot();

        return;

    }



    if(
        a===b ||
        b===c ||
        a===c
    ){

        setMessage(
            "🔥 ALMOST WIN"
        );

        playSound(
            500,
            .25,
            "triangle",
            .06
        );

        return;

    }



    setMessage(
        "❌ TRY AGAIN"
    );

}
const symbols = [
    "🍒",
    "🍋",
    "⭐",
    "💎",
    "🔔",
    "7️⃣"
];


const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");


const spinButton =
document.getElementById("spin");


const creditsText =
document.getElementById("credits");


const winText =
document.getElementById("win");


const message =
document.getElementById("message");


const betInput =
document.getElementById("bet");



let credits = 1000;

let totalWin = 0;

let spinning = false;



// ЗВУКОВ ДВИГАТЕЛ

let audioContext;


function playSound(freq,time){


try{


if(!audioContext){

audioContext =
new AudioContext();

}


let osc =
audioContext.createOscillator();


let gain =
audioContext.createGain();



osc.frequency.value=freq;


gain.gain.value=.08;


osc.connect(gain);

gain.connect(
audioContext.destination
);



osc.start();


osc.stop(
audioContext.currentTime+time
);



}

catch(e){}



}




// СЛУЧАЕН СИМВОЛ


function randomSymbol(){


return symbols[
Math.floor(
Math.random()*symbols.length
)
];


}





// АНИМАЦИЯ НА БАРАБАНИ


function startReels(){


let reels=[
slot1,
slot2,
slot3
];


let counter=0;



let timer=setInterval(()=>{


reels.forEach(reel=>{

reel.innerHTML =
randomSymbol();

});


counter++;



playSound(
200+counter*5,
0.05
);



if(counter>25){


clearInterval(timer);


stopReels();



}



},80);



}




// СПИРАНЕ НА БАРАБАНИТЕ


function stopReels(){


let result=[];


let reels=[
slot1,
slot2,
slot3
];



reels.forEach((reel,index)=>{


setTimeout(()=>{


let value =
randomSymbol();


reel.innerHTML=value;


result[index]=value;



if(index===2){

checkWin(result);

}



},500+(index*500));



});



}





// ПРОВЕРКА НА ПЕЧАЛБА


function checkWin(result){



spinning=false;

spinButton.disabled=false;



let bet =
Number(betInput.value);



let prize=0;




if(
result[0]===result[1] &&
result[1]===result[2]
){



prize =
bet*100;



message.innerHTML =
"🎉 JACKPOT +"+prize;



message.className="win";


createCoins();


playSound(
900,
0.5
);



}



else if(

result[0]===result[1] ||

result[1]===result[2] ||

result[0]===result[2]

){



prize =
bet*5;



message.innerHTML =
"🔥 ALMOST WIN +"+prize;



playSound(
500,
0.3
);



}



else{


message.innerHTML =
"❌ TRY AGAIN";


playSound(
150,
0.2
);



}




credits += prize;


totalWin += prize;



creditsText.innerHTML =
credits;



winText.innerHTML =
totalWin;



}




// БУТОН SPIN


spinButton.onclick=function(){



if(spinning)
return;



let bet =
Number(
betInput.value
);



if(
bet<=0
){

message.innerHTML=
"Въведи залог";

return;

}



if(
bet>credits
){


message.innerHTML=
"Нямаш достатъчно кредити";


return;


}




credits -= bet;



creditsText.innerHTML =
credits;



spinning=true;


spinButton.disabled=true;



message.innerHTML =
"🎰 SPINNING...";


message.className="";



startReels();



};





// ПАДАЩИ МОНЕТИ


function createCoins(){



for(let i=0;i<60;i++){



let coin =
document.createElement("div");



coin.className="coin";



coin.style.left =
Math.random()*100+"vw";



coin.style.animationDelay =
Math.random()*2+"s";



document.body.appendChild(
coin
);



setTimeout(()=>{

coin.remove();

},4000);



}



}
