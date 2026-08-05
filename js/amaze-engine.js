/* ==========================================================
   AMAZE ESCAPE
   ENGINE v2
   PART 1 / 3
   CORE + INITIALIZATION
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

    lever:null,

    lamp:null

};



let button=null;

let message=null;

let counter=null;

let slots=[];




/* ==========================================================
   START ENGINE
   ========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    button =
    document.getElementById("button")
    ||
    document.getElementById("spin");



    message =
    document.getElementById("message");



    counter =
    document.getElementById("counter");



    slots=[

        document.getElementById("slot1"),

        document.getElementById("slot2"),

        document.getElementById("slot3")

    ];



    AMAZE.machine =
    document.querySelector(".machine");



    AMAZE.lever =
    document.querySelector(".real-lever");



    AMAZE.lamp =
    document.querySelector(".jackpot-lamp");



    console.log(
        "Slots:",
        slots
    );



    if(button){


        button.addEventListener(
            "click",
            spinGame
        );


    }



    updateCounter();



    console.log(
        "🎰 AmazeEscape Engine Loaded"
    );


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
   COUNTER
   ========================================================== */


function updateCounter(){


    if(counter){


        counter.innerHTML =
        "Attempts: "
        +
        AMAZE.attempts;


    }


}





/* ==========================================================
   MESSAGE
   ========================================================== */


function setMessage(text){


    if(message){


        message.innerHTML=text;


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





function tone(
frequency,
duration=.1,
type="square",
volume=.05
){


    try{


        let ctx=getAudio();


        let osc=
        ctx.createOscillator();



        let gain=
        ctx.createGain();



        osc.type=type;


        osc.frequency.value=
        frequency;



        gain.gain.value=
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
