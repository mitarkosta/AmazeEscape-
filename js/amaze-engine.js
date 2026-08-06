/* ==========================================================
   AMAZE ESCAPE
   ENGINE v4 FINAL
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
   INIT
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
        "🎰 AmazeEscape v4 FINAL loaded"
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
   RANDOM
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

        AMAZE.message.innerHTML=text;

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
   SOUND
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
duration=.1,
type="square",
volume=.05
){


    try{


        const ctx =
        getAudio();


        const osc =
        ctx.createOscillator();


        const gain =
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
   ENGINE v4 FINAL
   PART 2 / 3
   SPIN ENGINE
   ========================================================== */


/* ==========================================================
   SPIN
   ========================================================== */


function spinGame(){


    if(AMAZE.playing)
    return;



    if(
        !AMAZE.slots[0] ||
        !AMAZE.slots[1] ||
        !AMAZE.slots[2]
    ){

        console.warn(
            "Slots not found"
        );

        return;

    }



    AMAZE.playing=true;


    AMAZE.attempts++;


    updateCounter();



    if(AMAZE.button){

        AMAZE.button.disabled=true;

    }



    setMessage(
        "🎰 SPINNING..."
    );



    playSound(
        120,
        .25,
        "sawtooth",
        .08
    );



    leverPull();



    if(AMAZE.machine){

        AMAZE.machine.classList.add(
            "playing"
        );

    }



    startReels();



}





/* ==========================================================
   REELS START
   ========================================================== */


function startReels(){


    AMAZE.slots.forEach(
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


        AMAZE.slots.forEach(
        slot=>{


            slot.innerHTML =
            randomSymbol();


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



    AMAZE.slots.forEach(
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



            playSound(
                700-index*120,
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


    const a =
    result[0];


    const b =
    result[1];


    const c =
    result[2];



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
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v4 FINAL
   PART 3 / 3
   EFFECTS SYSTEM
   ========================================================== */



/* ==========================================================
   LEVER
   ========================================================== */


function leverPull(){


    if(!AMAZE.lever)
    return;



    AMAZE.lever.classList.remove(
        "pull-lever"
    );


    void AMAZE.lever.offsetWidth;


    AMAZE.lever.classList.add(
        "pull-lever"
    );



    playSound(
        90,
        .25,
        "square",
        .08
    );


}





/* ==========================================================
   JACKPOT
   ========================================================== */


function jackpot(){


    playSound(
        900,
        .3,
        "square",
        .08
    );



    setTimeout(()=>{


        playSound(
            1200,
            .3,
            "square",
            .08
        );


    },200);





    if(AMAZE.lamp){


        AMAZE.lamp.classList.add(
            "on"
        );


    }





    createCoins();


    createConfetti();



    AMAZE.slots.forEach(
    slot=>{


        slot.classList.add(
            "flash"
        );


    });


}






/* ==========================================================
   COINS
   ========================================================== */


function createCoins(){


    for(
        let i=0;
        i<60;
        i++
    ){


        const coin =
        document.createElement(
            "div"
        );



        coin.className =
        "coin";



        coin.style.left =
        Math.random()*100
        +
        "vw";



        coin.style.animationDelay =
        Math.random()*2
        +
        "s";



        document.body.appendChild(
            coin
        );



        setTimeout(()=>{


            coin.remove();


        },4000);



    }


}





/* ==========================================================
   CONFETTI
   ========================================================== */


function createConfetti(){


    const colors=[

        "gold",
        "red",
        "blue",
        "green",
        "purple"

    ];



    for(
        let i=0;
        i<100;
        i++
    ){



        const piece =
        document.createElement(
            "div"
        );



        piece.className =
        "confetti";



        piece.style.left =
        Math.random()*100
        +
        "vw";



        piece.style.background =
        colors[
            Math.floor(
                Math.random()
                *
                colors.length
            )
        ];



        piece.style.animationDelay =
        Math.random()*2
        +
        "s";



        document.body.appendChild(
            piece
        );



        setTimeout(()=>{


            piece.remove();


        },4000);



    }


}





/* ==========================================================
   RESET EFFECTS
   ========================================================== */


function resetEffects(){


    if(AMAZE.lamp){


        AMAZE.lamp.classList.remove(
            "on"
        );


    }



    AMAZE.slots.forEach(
    slot=>{


        if(slot){

            slot.classList.remove(
                "flash"
            );

        }


    });


}





/* ==========================================================
   ERROR MONITOR
   ========================================================== */


window.addEventListener(
"error",
event=>{


    console.warn(
        "AmazeEscape:",
        event.message
    );


});





console.log(
    "🎰 AmazeEscape v4 FINAL READY"
);

// AmazeEscape v4 deployment test
