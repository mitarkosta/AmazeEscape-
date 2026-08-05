/* ==========================================================
   AMAZE ESCAPE
   ENGINE v3
   PART 1 / 3
   CORE + DOM + CABINET SYSTEM
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
    document.getElementById("button");


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



    if(!AMAZE.machine){

        console.warn(
            "Machine missing"
        );

        return;

    }



    createCabinet();



    if(button){

        button.addEventListener(
            "click",
            spinGame
        );

    }



    updateCounter();



    console.log(
        "🎰 AmazeEscape Engine v3 Loaded"
    );


});







/* ==========================================================
   CREATE CABINET ELEMENTS
   ========================================================== */


function createCabinet(){



    /*
       LED BORDER
    */


    if(
        !document.querySelector(".led-border")
    ){


        let led =
        document.createElement("div");


        led.className =
        "led-border";


        AMAZE.machine.appendChild(
            led
        );


    }





    /*
       JACKPOT LAMP
    */


    AMAZE.lamp =
    document.querySelector(
        ".jackpot-lamp"
    );



    if(!AMAZE.lamp){


        AMAZE.lamp =
        document.createElement("div");


        AMAZE.lamp.className =
        "jackpot-lamp";


        AMAZE.machine.appendChild(
            AMAZE.lamp
        );


    }







    /*
       REAL LEVER
    */


    AMAZE.lever =
    document.querySelector(
        ".real-lever"
    );



    if(!AMAZE.lever){


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



}







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

        message.innerHTML =
        text;

    }


}
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v3
   PART 1 / 3
   CORE + DOM + CABINET SYSTEM
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
    document.getElementById("button");


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



    if(!AMAZE.machine){

        console.warn(
            "Machine missing"
        );

        return;

    }



    createCabinet();



    if(button){

        button.addEventListener(
            "click",
            spinGame
        );

    }



    updateCounter();



    console.log(
        "🎰 AmazeEscape Engine v3 Loaded"
    );


});







/* ==========================================================
   CREATE CABINET ELEMENTS
   ========================================================== */


function createCabinet(){



    /*
       LED BORDER
    */


    if(
        !document.querySelector(".led-border")
    ){


        let led =
        document.createElement("div");


        led.className =
        "led-border";


        AMAZE.machine.appendChild(
            led
        );


    }





    /*
       JACKPOT LAMP
    */


    AMAZE.lamp =
    document.querySelector(
        ".jackpot-lamp"
    );



    if(!AMAZE.lamp){


        AMAZE.lamp =
        document.createElement("div");


        AMAZE.lamp.className =
        "jackpot-lamp";


        AMAZE.machine.appendChild(
            AMAZE.lamp
        );


    }







    /*
       REAL LEVER
    */


    AMAZE.lever =
    document.querySelector(
        ".real-lever"
    );



    if(!AMAZE.lever){


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



}







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

        message.innerHTML =
        text;

    }


}
/* ==========================================================
   AMAZE ESCAPE
   ENGINE v3
   PART 3 / 3
   EFFECTS + JACKPOT + ANIMATIONS
   ========================================================== */





/* ==========================================================
   LEVER ANIMATION
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


function jackpot(){



    playTone(
        900,
        .3,
        "square",
        .08
    );



    setTimeout(
    ()=>{


        playTone(
            1200,
            .3,
            "square",
            .08
        );


    },
    200
    );





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
        i<50;
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



        setTimeout(
        ()=>{


            coin.remove();


        },
        4000
        );



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
        "green",
        "purple"

    ];





    for(
        let i=0;
        i<80;
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



        setTimeout(
        ()=>{


            piece.remove();


        },
        4000
        );


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
   TEST COMMANDS
   ========================================================== */


window.AmazeTest = {


    spin:function(){

        spinGame();

    },


    jackpot:function(){

        jackpot();

    },


    lever:function(){

        pullLever();

    }


};







/* ==========================================================
   ENGINE READY
   ========================================================== */


console.log(
    "🎰 AmazeEscape Engine v3 READY"
);
