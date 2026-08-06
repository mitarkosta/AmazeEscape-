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
