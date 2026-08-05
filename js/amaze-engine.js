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
