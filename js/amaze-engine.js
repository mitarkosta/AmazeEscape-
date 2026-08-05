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
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v2
   PART 2 / 3
   SPIN ENGINE + REELS
   ========================================================== */


/* ==========================================================
   SPIN GAME
   ========================================================== */


function spinGame(){


    if(AMAZE.playing)
    return;



    if(
        !slots[0] ||
        !slots[1] ||
        !slots[2]
    )
    {

        console.warn(
            "Reels missing"
        );

        return;

    }




    AMAZE.playing=true;


    AMAZE.attempts++;


    updateCounter();



    if(button){

        button.disabled=true;

    }



    setMessage(
        "🎰 SPINNING..."
    );



    leverPull();


    if(AMAZE.machine){

        AMAZE.machine.classList.add(
            "playing"
        );

    }



    tone(
        120,
        .25,
        "sawtooth",
        .08
    );



    startReels();



}






/* ==========================================================
   START REELS
   ========================================================== */


function startReels(){



    slots.forEach(
    slot=>{


        slot.classList.remove(
            "reel-stop"
        );


        slot.classList.add(
            "reel-spin"
        );


    });





    let timer =
    setInterval(()=>{


        slots.forEach(
        slot=>{


            slot.innerHTML =
            randomSymbol();


            tone(
                800,
                .03,
                "square",
                .02
            );


        });



    },80);





    setTimeout(()=>{


        clearInterval(timer);



        stopReels();



    },2000);



}






/* ==========================================================
   STOP REELS
   ========================================================== */


function stopReels(){


    let result=[];



    slots.forEach(
    (slot,index)=>{


        setTimeout(()=>{


            slot.classList.remove(
                "reel-spin"
            );



            slot.classList.add(
                "reel-stop"
            );



            let symbol =
            randomSymbol();



            slot.innerHTML =
            symbol;



            result[index]=
            symbol;



            tone(
                700-index*100,
                .08,
                "square",
                .04
            );





            if(index===2){


                finishSpin(
                    result
                );


            }



        },
        index*600);



    });



}







/* ==========================================================
   FINISH
   ========================================================== */


function finishSpin(result){



    AMAZE.playing=false;



    if(button){

        button.disabled=false;

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



    let a=result[0];

    let b=result[1];

    let c=result[2];





    if(
        a===b &&
        b===c
    ){


        setMessage(
            "🎉 JACKPOT 🎉"
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


        tone(
            500,
            .3,
            "triangle",
            .06
        );


        return;


    }



    setMessage(
        "❌ TRY AGAIN"
    );



}
