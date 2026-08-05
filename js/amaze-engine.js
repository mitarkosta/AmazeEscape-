/* ==========================================================
   AMAZE ESCAPE
   GAME ENGINE v2.0
   PART 1A
   ========================================================== */

"use strict";

/* ===========================
   GAME CONFIG
=========================== */

const SYMBOLS = [
    "🍒",
    "🍋",
    "⭐",
    "💎",
    "🔔",
    "7️⃣"
];

const GAME = {

    attempts: 0,

    playing: false,

    audio: null

};


/* ===========================
   DOM
=========================== */

const machine =
document.querySelector(".machine");

const button =
document.getElementById("button");

const message =
document.getElementById("message");

const counter =
document.getElementById("counter");

const slot1 =
document.getElementById("slot1");

const slot2 =
document.getElementById("slot2");

const slot3 =
document.getElementById("slot3");

const slots = [
    slot1,
    slot2,
    slot3
];


/* ===========================
   RANDOM SYMBOL
=========================== */

function randomSymbol(){

    return SYMBOLS[
        Math.floor(
            Math.random() *
            SYMBOLS.length
        )
    ];

}


/* ===========================
   AUDIO
=========================== */

function audio(){

    if(!GAME.audio){

        GAME.audio =
        new AudioContext();

    }

    return GAME.audio;

}


function tone(
frequency,
duration,
type="sine",
volume=.05
){

    const ctx = audio();

    const osc =
    ctx.createOscillator();

    const gain =
    ctx.createGain();

    osc.type = type;

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
        ctx.currentTime +
        duration
    );

}


/* ===========================
   BACKGROUND
=========================== */

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
        (80+Math.random()*120)+"px";

        light.style.animationDelay =
        Math.random()*4+"s";

        bg.appendChild(light);

    }

    for(let i=0;i<40;i++){

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


/* ===========================
   MACHINE PARTS
=========================== */

function createCabinet(){

    const leds =
    document.createElement("div");

    leds.className =
    "led-border";

    machine.appendChild(leds);


    const lamp =
    document.createElement("div");

    lamp.className =
    "jackpot-lamp";

    machine.appendChild(lamp);


    const lever =
    document.createElement("div");

    lever.className =
    "real-lever";

    lever.innerHTML =
    '<div class="ball"></div>';

    machine.appendChild(lever);

}


/* ===========================
   HELPERS
=========================== */

function updateCounter(){

    counter.textContent =
    "Attempts: " +
    GAME.attempts;

}

function disableButton(){

    button.disabled = true;

}

function enableButton(){

    button.disabled = false;

}
