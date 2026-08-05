/* ==========================================================
   AMAZE ESCAPE
   ENGINE v2
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


window.addEventListener(
"DOMContentLoaded",
()=>{


    console.log(
        "🎰 AmazeEscape starting..."
    );



    button =
    document.getElementById(
        "button"
    );



    if(!button){

        button =
        document.getElementById(
            "spin"
        );

    }



    message =
    document.getElementById(
        "message"
    );



    counter =
    document.getElementById(
        "counter"
    );





    slots=[

        document.getElementById(
            "slot1"
        ),


        document.getElementById(
            "slot2"
        ),


        document.getElementById(
            "slot3"
        )

    ];





    AMAZE.machine =
    document.querySelector(
        ".machine"
    );





    if(
        !button ||
        slots.includes(null)
    ){

        console.error(
            "AmazeEscape: Missing HTML elements"
        );

        return;

    }





    createCabinet();



    updateCounter();





    button.addEventListener(
        "click",
        spinGame
    );





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
   CABINET ELEMENTS
   ========================================================== */


function createCabinet(){



    if(!AMAZE.machine)
    return;





    if(
        !document.querySelector(
            ".led-border"
        )
    ){


        let led =
        document.createElement(
            "div"
        );


        led.className =
        "led-border";


        AMAZE.machine.appendChild(
            led
        );


    }






    AMAZE.lamp =
    document.querySelector(
        ".jackpot-lamp"
    );



    if(!AMAZE.lamp){


        AMAZE.lamp =
        document.createElement(
            "div"
        );


        AMAZE.lamp.className =
        "jackpot-lamp";


        AMAZE.machine.appendChild(
            AMAZE.lamp
        );


    }







    AMAZE.lever =
    document.querySelector(
        ".real-lever"
    );



    if(!AMAZE.lever){


        AMAZE.lever =
        document.createElement(
            "div"
        );


        AMAZE.lever.className =
        "real-lever";


        AMAZE.lever.innerHTML =
        '<div class="ball"></div>';



        AMAZE.machine.appendChild(
            AMAZE.lever
        );


    }



}
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v2
   PART 2 / 3
   SPIN ENGINE
   ========================================================== */



/* ==========================================================
   SPIN GAME
   ========================================================== */


function spinGame(){



    if(AMAZE.playing)
    return;



    AMAZE.playing=true;



    AMAZE.attempts++;


    updateCounter();



    setMessage(
        "🎰 Spinning..."
    );



    if(button){

        button.disabled=true;

    }



    pullLever();



    if(AMAZE.machine){

        AMAZE.machine.classList.add(
            "reel-shake"
        );



        setTimeout(()=>{


            AMAZE.machine.classList.remove(
                "reel-shake"
            );


        },300);


    }



    startReels();



}







/* ==========================================================
   START REELS
   ========================================================== */


function startReels(){


    let timer =
    setInterval(()=>{


        slots.forEach(
        slot=>{


            slot.innerHTML =
            randomSymbol();



            slot.classList.add(
                "reel-spin"
            );


        });



    },90);





    setTimeout(()=>{


        clearInterval(timer);



        stopReels();



    },1800);



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



            playClick();



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



    checkResult(
        result
    );



}







/* ==========================================================
   CHECK RESULT
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



        return;


    }






    setMessage(
        "❌ TRY AGAIN"
    );



}







/* ==========================================================
   LEVER
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



}







/* ==========================================================
   SIMPLE SOUND
   ========================================================== */


function playClick(){



    try{


        if(!AMAZE.audio){


            AMAZE.audio =
            new AudioContext();


        }



        let osc =
        AMAZE.audio.createOscillator();



        let gain =
        AMAZE.audio.createGain();




        osc.frequency.value=700;


        gain.gain.value=.03;




        osc.connect(gain);


        gain.connect(
            AMAZE.audio.destination
        );



        osc.start();



        osc.stop(
            AMAZE.audio.currentTime+.05
        );



    }

    catch(e){}



}
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v2
   PART 3 / 3
   EFFECTS + JACKPOT
   ========================================================== */



/* ==========================================================
   JACKPOT
   ========================================================== */


function jackpot(){


    setMessage(
        "🎉 JACKPOT 🎉"
    );



    if(AMAZE.lamp){


        AMAZE.lamp.classList.add(
            "on"
        );


    }



    playJackpotSound();


    createCoins();


    createConfetti();



    slots.forEach(
    slot=>{


        if(slot){


            slot.classList.add(
                "flash"
            );


            setTimeout(()=>{


                slot.classList.remove(
                    "flash"
                );


            },3000);



        }


    });



}







/* ==========================================================
   JACKPOT SOUND
   ========================================================== */


function playJackpotSound(){


    let notes=[

        700,
        900,
        1100,
        1400

    ];



    notes.forEach(
    (note,index)=>{


        setTimeout(()=>{


            playToneSimple(
                note,
                .25
            );


        },index*150);



    });



}







/* ==========================================================
   SIMPLE TONE
   ========================================================== */


function playToneSimple(
frequency,
duration
){


    try{


        if(!AMAZE.audio){

            AMAZE.audio =
            new AudioContext();

        }



        let osc =
        AMAZE.audio.createOscillator();



        let gain =
        AMAZE.audio.createGain();



        osc.frequency.value =
        frequency;



        gain.gain.value =
        .08;



        osc.connect(gain);


        gain.connect(
            AMAZE.audio.destination
        );



        osc.start();



        osc.stop(
            AMAZE.audio.currentTime
            +
            duration
        );


    }

    catch(e){}



}







/* ==========================================================
   COINS
   ========================================================== */


function createCoins(){



    for(
        let i=0;
        i<70;
        i++
    ){



        let coin =
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



    let colors=[

        "gold",
        "red",
        "blue",
        "green"

    ];



    for(
        let i=0;
        i<100;
        i++
    ){



        let piece =
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


        },5000);



    }



}







/* ==========================================================
   GLOBAL ERROR CHECK
   ========================================================== */


window.addEventListener(
"error",
(event)=>{


    console.warn(
        "AmazeEscape:",
        event.message
    );


});
