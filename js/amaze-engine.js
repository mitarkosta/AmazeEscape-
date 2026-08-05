/* ==========================================================
   AMAZE ESCAPE
   GAME ENGINE
   PART 1 / 3
   CORE SYSTEM
   ========================================================== */

"use strict";


/* ==========================================================
   GAME DATA
   ========================================================== */


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



/* ==========================================================
   DOM ELEMENTS
   ========================================================== */


let button;
let message;
let counter;

let slots=[];



/* ==========================================================
   INITIALIZATION
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



    if(!AMAZE.machine)
    return;



    createBackground();

    createCabinet();


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
   AUDIO ENGINE
   ========================================================== */


function getAudio(){


    if(!AMAZE.audio){

        AMAZE.audio =
        new AudioContext();

    }


    return AMAZE.audio;

}




function playTone(
frequency,
duration,
type="sine",
volume=.05
){


    try{


        const ctx =
        getAudio();


        const oscillator =
        ctx.createOscillator();


        const gain =
        ctx.createGain();



        oscillator.type =
        type;


        oscillator.frequency.value =
        frequency;


        gain.gain.value =
        volume;



        oscillator.connect(gain);

        gain.connect(
            ctx.destination
        );



        oscillator.start();


        oscillator.stop(
            ctx.currentTime+
            duration
        );


    }

    catch(error){}


}




/* ==========================================================
   BACKGROUND ENGINE
   ========================================================== */


function createBackground(){


    const bg =
    document.createElement("div");


    bg.className =
    "casino-background";


    document.body.prepend(bg);



    for(let i=0;i<15;i++){


        const light =
        document.createElement("div");


        light.className =
        "maze-light";


        light.style.left =
        Math.random()*100+"vw";


        light.style.height =
        (
            60+
            Math.random()*140
        )
        +"px";


        light.style.animationDelay =
        Math.random()*5+"s";


        bg.appendChild(light);


    }



    for(let i=0;i<35;i++){


        const dot =
        document.createElement("div");


        dot.className =
        "casino-dot";


        dot.style.left =
        Math.random()*100+"vw";


        dot.style.top =
        Math.random()*100+"vh";


        dot.style.animationDelay =
        Math.random()*3+"s";


        bg.appendChild(dot);


    }


}



/* ==========================================================
   CABINET ELEMENTS
   ========================================================== */


function createCabinet(){


    const led =
    document.createElement("div");


    led.className =
    "led-border";


    AMAZE.machine.appendChild(led);



    AMAZE.lamp =
    document.createElement("div");


    AMAZE.lamp.className =
    "jackpot-lamp";


    AMAZE.machine.appendChild(
        AMAZE.lamp
    );



    AMAZE.lever =
    document.createElement("div");


    AMAZE.lever.className =
    "real-lever";


    AMAZE.lever.innerHTML =
    '<div class="ball"></div>';



    AMAZE.machine.appendChild(
        AMAZE.lever
    );


}




/* ==========================================================
   HELPERS
   ========================================================== */


function updateCounter(){


    if(counter){

        counter.innerHTML =
        "Attempts: "
        +
        AMAZE.attempts;

    }

}



function setMessage(text){


    if(message){

        message.innerHTML =
        text;

    }

}



function lockButton(){


    if(button){

        button.disabled =
        true;

    }

}



function unlockButton(){


    if(button){

        button.disabled =
        false;

    }

}
/* ==========================================================
   AMAZE ESCAPE
   GAME ENGINE
   PART 2 / 3
   SPIN ENGINE + REELS
   ========================================================== */


/* ==========================================================
   SPIN START
   ========================================================== */


function spinGame(){


    if(AMAZE.playing)
    return;


    if(!slots[0] || !slots[1] || !slots[2])
    return;



    AMAZE.playing =
    true;


    AMAZE.attempts++;


    updateCounter();


    lockButton();



    setMessage(
        "🎰 Spinning..."
    );



    playTone(
        120,
        .2,
        "square",
        .06
    );



    pullLever();


    if(AMAZE.machine){

        AMAZE.machine.classList.add(
            "playing"
        );

    }



    startReels();



}





/* ==========================================================
   REEL ANIMATION
   ========================================================== */


function startReels(){


    let speed =
    setInterval(()=>{


        slots.forEach(
        slot=>{


            slot.innerHTML =
            randomSymbol();


        });


    },80);





    setTimeout(()=>{


        clearInterval(speed);


        stopReels();



    },1800);



}





/* ==========================================================
   STOP REELS ONE BY ONE
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



            result[index] =
            symbol;



            playTone(
                700-index*100,
                .05,
                "square",
                .03
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
   FINISH SPIN
   ========================================================== */


function finishSpin(result){



    AMAZE.playing =
    false;



    unlockButton();



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
   RESULT CHECK
   ========================================================== */


function checkResult(result){



    let a =
    result[0];


    let b =
    result[1];


    let c =
    result[2];




    if(
        a===b &&
        b===c
    ){


        setMessage(
            "🎉 JACKPOT 🎉"
        );


        jackpotEffect();


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


        playTone(
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





/* ==========================================================
   BUTTON CONNECTION
   ========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    if(button){


         button.onclick = spinGame;
            "click",
            spinGame
        );


    }


});
/* ==========================================================
   AMAZE ESCAPE
   GAME ENGINE
   PART 3 / 3
   EFFECTS + WIN SYSTEM
   ========================================================== */


/* ==========================================================
   LEVER EFFECT
   ========================================================== */


function pullLever(){


    if(!AMAZE.lever)
    return;



    AMAZE.lever.classList.remove(
        "pull-lever"
    );


    void AMAZE.lever.offsetWidth;


    AMAZE.lever.classList.add(
        "pull-lever"
    );



    playTone(
        90,
        .25,
        "square",
        .08
    );


}





/* ==========================================================
   JACKPOT EFFECT
   ========================================================== */


function jackpotEffect(){


    playTone(
        900,
        .3,
        "square",
        .08
    );


    setTimeout(()=>{

        playTone(
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



    slots.forEach(
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
        Math.random()*1.5
        +
        "s";



        document.body.appendChild(
            coin
        );



        setTimeout(()=>{


            coin.remove();


        },3500);



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
   RESET WIN LIGHTS
   ========================================================== */


function resetEffects(){


    if(AMAZE.lamp){

        AMAZE.lamp.classList.remove(
            "on"
        );

    }



    slots.forEach(
    slot=>{


        if(slot){

            slot.classList.remove(
                "flash"
            );

        }


    });


}



/* ==========================================================
   ERROR PROTECTION
   ========================================================== */


window.addEventListener(
"error",
(event)=>{


    console.warn(
        "AmazeEscape Engine:",
        event.message
    );


});



/* ==========================================================
   ENGINE READY
   ========================================================== */


console.log(
    "🎰 AmazeEscape Engine Loaded"
);
