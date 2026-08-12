/* ==========================================================
   AMAZE ESCAPE
   ENGINE v7.1

   VERTICAL REAL REELS
   CLASSIC CASINO VIEW
   PROGRESS
   PERSISTENCE
   ANTICIPATION 2.5 SEC
   FINAL REEL FIRE
   HOLD
   MOBILE VIBRATION
   AUDIO SAFE
========================================================== */

"use strict";


/* ==========================================================
   CONFIG
========================================================== */

const AMAZE = {

    version: "7.1",

    symbols: [
        "🍒",
        "🍋",
        "⭐",
        "💎",
        "🔔",
        "7️⃣"
    ],

    maxSpins: 100,

    holdEvery: 20,

    holdDuration: 30,

    anticipationDuration: 2500,

    reelSpinDuration: 1550,

    reelStopDelay: 480,

    reelSymbolHeight: 100,

    attempts: 0,

    round: 1,

    playing: false,

    hold: false,

    holdUntil: null,

    audio: null,

    slots: [],

    tracks: [],

    button: null,

    machine: null,

    message: null,

    lever: null,

    lamp: null,

    progressFill: null,

    progressBar: null,

    counterValue: null,

    roundStatus: null,

    holdOverlay: null,

    holdCountdown: null,

    holdProgressFill: null,

    holdStatus: null,

    casinoBackground: null,

    snowContainer: null,

    anticipationOverlay: null,

    anticipationParticles: null,

    persistentValue: null,

    persistentFill: null,

    persistentBar: null,

    holdTimer: null,

    anticipationTimer: null,

    anticipationActive: false,

    persistentCoins: 0,

    persistentTarget: 10,

    storageKey: "AmazeEscape_v7_State",

    reelStates: [
        {
            position: 0,
            index: 0
        },
        {
            position: 0,
            index: 0
        },
        {
            position: 0,
            index: 0
        }
    ]

};


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);


/* ==========================================================
   INITIALIZATION
========================================================== */

function initializeGame() {

    AMAZE.machine =
        document.getElementById("machine");

    AMAZE.button =
        document.getElementById("button");

    AMAZE.message =
        document.getElementById("message");

    AMAZE.counterValue =
        document.getElementById("counterValue");

    AMAZE.progressFill =
        document.getElementById(
            "spinProgressFill"
        );

    AMAZE.progressBar =
        document.getElementById(
            "spinProgress"
        );

    AMAZE.roundStatus =
        document.getElementById(
            "roundStatus"
        );


    AMAZE.slots = [

        document.getElementById("slot1"),

        document.getElementById("slot2"),

        document.getElementById("slot3")

    ];


    AMAZE.tracks =
        AMAZE.slots.map(
            slot =>
                slot
                    ? slot.querySelector(
                        ".reel-track"
                    )
                    : null
        );


    AMAZE.lever =
        document.querySelector(
            ".real-lever"
        );

    AMAZE.lamp =
        document.getElementById(
            "jackpotLamp"
        );


    AMAZE.holdOverlay =
        document.getElementById(
            "holdOverlay"
        );

    AMAZE.holdCountdown =
        document.getElementById(
            "holdCountdown"
        );

    AMAZE.holdProgressFill =
        document.getElementById(
            "holdProgressFill"
        );

    AMAZE.holdStatus =
        document.getElementById(
            "holdStatus"
        );


    AMAZE.casinoBackground =
        document.getElementById(
            "casinoBackground"
        );

    AMAZE.snowContainer =
        document.getElementById(
            "snowContainer"
        );


    AMAZE.anticipationOverlay =
        document.getElementById(
            "anticipationOverlay"
        );

    AMAZE.anticipationParticles =
        document.getElementById(
            "anticipationParticles"
        );


    AMAZE.persistentValue =
        document.getElementById(
            "persistentValue"
        );

    AMAZE.persistentFill =
        document.getElementById(
            "persistentFill"
        );

    AMAZE.persistentBar =
        document.getElementById(
            "persistentBar"
        );


    injectAnticipationStyles();


    buildReels();


    if (AMAZE.button) {

        AMAZE.button.addEventListener(
            "click",
            spinGame
        );

    }


    createCasinoParticles();

    createSnowParticles();

    loadGameState();

    updateProgress();

    updatePersistentProgress();

    updateRoundStatus();


    console.log(
        "🎰 AmazeEscape v7.1 loaded"
    );
}


/* ==========================================================
   BUILD REAL REELS
========================================================== */

function buildReels() {

    AMAZE.tracks.forEach(
        (track, reelIndex) => {

            if (!track) {
                return;
            }


            track.innerHTML = "";


            /*
             * 36 symbols give us a long
             * physical-looking reel strip.
             */

            const stripLength = 36;


            for (
                let i = 0;
                i < stripLength;
                i++
            ) {

                const symbol =
                    AMAZE.symbols[
                        i %
                        AMAZE.symbols.length
                    ];


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "reel-symbol";


                element.textContent =
                    symbol;


                track.appendChild(
                    element
                );

            }


            /*
             * Start each reel at a
             * different physical position.
             */

            const start =
                10 +
                reelIndex * 4;


            AMAZE.reelStates[
                reelIndex
            ].position = start;


            AMAZE.reelStates[
                reelIndex
            ].index =
                start %
                AMAZE.symbols.length;


            setTrackPosition(
                reelIndex,
                start,
                false
            );

        }
    );

}


/* ==========================================================
   TRACK POSITION
========================================================== */

function setTrackPosition(
    reelIndex,
    position,
    animate = true
) {

    const track =
        AMAZE.tracks[
            reelIndex
        ];


    if (!track) {
        return;
    }


    const y =
        -(position *
            getSymbolHeight());


    if (!animate) {

        track.style.transition =
            "none";

    }

    else {

        track.style.transition =
            "transform .8s cubic-bezier(.12,.72,.2,1)";

    }


    track.style.transform =
        `translateY(${y}px)`;


    AMAZE.reelStates[
        reelIndex
    ].position =
        position;

}


/* ==========================================================
   SYMBOL HEIGHT
========================================================== */

function getSymbolHeight() {

    const symbol =
        AMAZE.tracks[0]
            ?.querySelector(
                ".reel-symbol"
            );


    if (symbol) {

        return symbol.getBoundingClientRect()
            .height;

    }


    return AMAZE.reelSymbolHeight;
}


/* ==========================================================
   RANDOM SYMBOL
========================================================== */

function randomSymbol() {

    return AMAZE.symbols[
        Math.floor(
            Math.random() *
            AMAZE.symbols.length
        )
    ];

}


/* ==========================================================
   RANDOM INDEX
========================================================== */

function randomSymbolIndex() {

    return Math.floor(
        Math.random() *
        AMAZE.symbols.length
    );

}


/* ==========================================================
   MESSAGE
========================================================== */

function setMessage(text) {

    if (AMAZE.message) {

        AMAZE.message.innerHTML =
            text;

    }

}


/* ==========================================================
   AUDIO
========================================================== */

function getAudio() {

    if (!AMAZE.audio) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return null;
        }


        AMAZE.audio =
            new AudioContext();

    }


    if (
        AMAZE.audio.state ===
        "suspended"
    ) {

        AMAZE.audio
            .resume()
            .catch(
                () => {}
            );

    }


    return AMAZE.audio;

}


/* ==========================================================
   SOUND
========================================================== */

function playSound(
    frequency,
    duration = .1,
    type = "square",
    volume = .05
) {

    try {

        const ctx =
            getAudio();


        if (!ctx) {
            return;
        }


        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();


        osc.type =
            type;

        osc.frequency.value =
            frequency;


        gain.gain.setValueAtTime(
            .0001,
            ctx.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            volume,
            ctx.currentTime + .01
        );


        gain.gain.exponentialRampToValueAtTime(
            .0001,
            ctx.currentTime + duration
        );


        osc.connect(gain);

        gain.connect(
            ctx.destination
        );


        osc.start();

        osc.stop(
            ctx.currentTime +
            duration +
            .02
        );

    }

    catch (error) {

        console.warn(
            "Audio unavailable",
            error
        );

    }

}


/* ==========================================================
   VIBRATION
========================================================== */

function vibrate(pattern) {

    if (
        typeof navigator.vibrate !==
        "function"
    ) {

        return;
    }


    try {

        navigator.vibrate(
            pattern
        );

    }

    catch (error) {}

}


function vibrationSpin() {
    vibrate(35);
}


function vibrationAnticipation() {

    vibrate([
        70,
        35,
        100,
        35,
        140,
        35,
        180
    ]);

}


function vibrationWin() {

    vibrate([
        80,
        40,
        100,
        40,
        180,
        50,
        220
    ]);

}


function vibrationHoldEnter() {

    vibrate([
        100,
        50,
        180
    ]);

}


function vibrationHoldExit() {

    vibrate([
        180,
        60,
        100
    ]);

}


/* ==========================================================
   SPIN GAME
========================================================== */

function spinGame() {

    if (AMAZE.playing) {
        return;
    }


    if (AMAZE.hold) {
        return;
    }


    if (
        AMAZE.attempts >=
        AMAZE.maxSpins
    ) {
        return;
    }


    if (
        AMAZE.slots.length !== 3
    ) {

        console.warn(
            "Reels not found"
        );

        return;
    }


    getAudio();


    AMAZE.playing =
        true;

    AMAZE.attempts++;


    updateProgress();

    saveGameState();


    if (AMAZE.button) {

        AMAZE.button.disabled =
            true;

    }


    setMessage(
        "🎰 SPINNING..."
    );


    vibrationSpin();


    playSound(
        120,
        .25,
        "sawtooth",
        .08
    );


    leverPull();


    if (AMAZE.machine) {

        AMAZE.machine.classList.add(
            "playing"
        );

    }


    startReels();

}


/* ==========================================================
   START REELS
========================================================== */

function startReels() {

    AMAZE.slots.forEach(
        slot => {

            if (!slot) {
                return;
            }

            slot.classList.remove(
                "reel-stop"
            );

            slot.classList.remove(
                "final-reel-anticipation"
            );

            slot.classList.add(
                "reel-spin"
            );

        }
    );


    /*
     * Move every reel several
     * complete rotations.
     */

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        spinReelVisually(
            i,
            14 +
            Math.floor(
                Math.random() * 8
            )
        );

    }


    setTimeout(
        () => {

            stopReels();

        },
        AMAZE.reelSpinDuration
    );

}


/* ==========================================================
   VISUAL REEL SPIN
========================================================== */

function spinReelVisually(
    reelIndex,
    rotations
) {

    const state =
        AMAZE.reelStates[
            reelIndex
        ];


    const target =
        state.position +
        rotations *
        AMAZE.symbols.length +
        Math.floor(
            Math.random() *
            AMAZE.symbols.length
        );


    const track =
        AMAZE.tracks[
            reelIndex
        ];


    if (!track) {
        return;
    }


    track.style.transition =
        `transform ${
            AMAZE.reelSpinDuration / 1000
        }s cubic-bezier(.08,.7,.16,1)`;


    const y =
        -(target *
            getSymbolHeight());


    track.style.transform =
        `translateY(${y}px)`;


    state.position =
        target;

}


/* ==========================================================
   STOP REELS
========================================================== */

function stopReels() {

    const result = [];


    /*
     * Reel 1
     */

    setTimeout(
        () => {

            stopSingleReel(
                0,
                result
            );

        },
        0
    );


    /*
     * Reel 2
     */

    setTimeout(
        () => {

            stopSingleReel(
                1,
                result
            );

        },
        AMAZE.reelStopDelay
    );


    /*
     * Reel 3
     */

    setTimeout(
        () => {

            if (
                result[0] &&
                result[1] &&
                result[0] === result[1]
            ) {

                startAnticipation(
                    () => {

                        stopSingleReel(
                            2,
                            result
                        );

                    }
                );

            }

            else {

                stopSingleReel(
                    2,
                    result
                );

            }

        },
        AMAZE.reelStopDelay * 2
    );

}


/* ==========================================================
   STOP SINGLE REEL
========================================================== */

function stopSingleReel(
    index,
    result
) {

    const slot =
        AMAZE.slots[index];

    const track =
        AMAZE.tracks[index];


    if (!slot || !track) {
        return;
    }


    /*
     * Choose actual symbol.
     */

    const targetIndex =
        randomSymbolIndex();


    /*
     * Current position.
     */

    const current =
        AMAZE.reelStates[
            index
        ].position;


    const currentIndex =
        ((Math.round(current) %
            AMAZE.symbols.length)
            +
            AMAZE.symbols.length)
        %
        AMAZE.symbols.length;


    /*
     * Move forward until the
     * desired symbol appears.
     */

    let distance =
        targetIndex -
        currentIndex;


    if (distance <= 0) {
        distance +=
            AMAZE.symbols.length;
    }


    /*
     * Add one full rotation
     * for a convincing stop.
     */

    distance +=
        AMAZE.symbols.length;


    const target =
        current +
        distance;


    const duration =
        index === 2
            ? 850
            : 650;


    track.style.transition =
        `transform ${duration}ms cubic-bezier(.12,.72,.18,1)`;


    track.style.transform =
        `translateY(${
            -(target *
                getSymbolHeight())
        }px)`;


    AMAZE.reelStates[
        index
    ].position =
        target;


    AMAZE.reelStates[
        index
    ].index =
        targetIndex;


    slot.classList.remove(
        "reel-spin"
    );

    slot.classList.add(
        "reel-stop"
    );


    result[index] =
        AMAZE.symbols[
            targetIndex
        ];


    playSound(
        700 -
        index * 120,
        .08,
        "square",
        .04
    );


    /*
     * Reel 3 finishes entire spin.
     */

    if (index === 2) {

        setTimeout(
            () => {

                stopFinalReelEffects();

                finishSpin(result);

            },
            duration
        );

    }

}


/* ==========================================================
   ANTICIPATION START
========================================================== */

function startAnticipation(
    callback
) {

    if (
        AMAZE.anticipationActive
    ) {
        return;
    }


    AMAZE.anticipationActive =
        true;


    setMessage(
        "🔥 TWO MATCH... FINAL REEL!"
    );


    vibrationAnticipation();


    playSound(
        180,
        .35,
        "sawtooth",
        .07
    );


    setTimeout(
        () => {

            if (
                AMAZE.anticipationActive
            ) {

                playSound(
                    260,
                    .3,
                    "square",
                    .06
                );

            }

        },
        350
    );


    setTimeout(
        () => {

            if (
                AMAZE.anticipationActive
            ) {

                playSound(
                    360,
                    .3,
                    "sawtooth",
                    .05
                );

            }

        },
        1200
    );


    if (AMAZE.machine) {

        AMAZE.machine.classList.add(
            "anticipation-mode"
        );

    }


    if (AMAZE.anticipationOverlay) {

        AMAZE.anticipationOverlay.classList.add(
            "active"
        );

        AMAZE.anticipationOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    const finalReel =
        AMAZE.slots[2];


    if (finalReel) {

        finalReel.classList.add(
            "final-reel-anticipation"
        );

    }


    createAnticipationParticles();

    createFinalReelFire();


    /*
     * The final reel keeps moving
     * during the entire 2.5 sec.
     */

    spinFinalReelDuringAnticipation();


    clearTimeout(
        AMAZE.anticipationTimer
    );


    AMAZE.anticipationTimer =
        setTimeout(
            () => {

                AMAZE.anticipationActive =
                    false;


                stopAnticipation();


                if (
                    typeof callback ===
                    "function"
                ) {

                    callback();

                }

            },
            AMAZE.anticipationDuration
        );

}


/* ==========================================================
   FINAL REEL ANTICIPATION SPIN
========================================================== */

function spinFinalReelDuringAnticipation() {

    const index = 2;

    const track =
        AMAZE.tracks[index];


    if (!track) {
        return;
    }


    const state =
        AMAZE.reelStates[index];


    const extra =
        AMAZE.symbols.length *
        5;


    const target =
        state.position +
        extra;


    track.style.transition =
        `transform ${
            AMAZE.anticipationDuration / 1000
        }s linear`;


    track.style.transform =
        `translateY(${
            -(target *
                getSymbolHeight())
        }px)`;


    state.position =
        target;

}


/* ==========================================================
   ANTICIPATION END
========================================================== */

function stopAnticipation() {

    clearTimeout(
        AMAZE.anticipationTimer
    );


    AMAZE.anticipationTimer =
        null;


    AMAZE.anticipationActive =
        false;


    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "anticipation-mode"
        );

    }


    if (AMAZE.anticipationOverlay) {

        AMAZE.anticipationOverlay.classList.remove(
            "active"
        );

        AMAZE.anticipationOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    const finalReel =
        AMAZE.slots[2];


    if (finalReel) {

        finalReel.classList.remove(
            "final-reel-anticipation"
        );

    }


    removeFinalReelFire();

}


/* ==========================================================
   FINAL REEL FIRE
========================================================== */

function createFinalReelFire() {

    const slot =
        AMAZE.slots[2];


    if (!slot) {
        return;
    }


    removeFinalReelFire();


    const fire =
        document.createElement(
            "div"
        );


    fire.className =
        "final-reel-fire";


    slot.appendChild(
        fire
    );


    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const flame =
            document.createElement(
                "div"
            );


        flame.className =
            "final-reel-flame";


        flame.style.setProperty(
            "--fire-size",
            (
                15 +
                Math.random() * 30
            ) + "px"
        );


        flame.style.setProperty(
            "--fire-left",
            (
                8 +
                Math.random() * 84
            ) + "%"
        );


        flame.style.setProperty(
            "--fire-bottom",
            (
                -12 +
                Math.random() * 25
            ) + "px"
        );


        flame.style.setProperty(
            "--fire-opacity",
            (
                .45 +
                Math.random() * .55
            )
        );


        flame.style.setProperty(
            "--fire-rotate",
            (
                -35 +
                Math.random() * 70
            ) + "deg"
        );


        flame.style.setProperty(
            "--fire-duration",
            (
                .18 +
                Math.random() * .3
            ) + "s"
        );


        fire.appendChild(
            flame
        );

    }


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "final-reel-particle";


        particle.style.setProperty(
            "--particle-size",
            (
                3 +
                Math.random() * 7
            ) + "px"
        );


        particle.style.setProperty(
            "--particle-left",
            Math.random() * 100 +
            "%"
        );


        particle.style.setProperty(
            "--particle-bottom",
            Math.random() * 50 +
            "%"
        );


        particle.style.setProperty(
            "--particle-drift",
            (
                -70 +
                Math.random() * 140
            ) + "px"
        );


        particle.style.setProperty(
            "--particle-rise",
            (
                -80 -
                Math.random() * 130
            ) + "px"
        );


        particle.style.setProperty(
            "--particle-duration",
            (
                .5 +
                Math.random() * .9
            ) + "s"
        );


        particle.style.setProperty(
            "--particle-delay",
            (
                -Math.random() * 1.2
            ) + "s"
        );


        fire.appendChild(
            particle
        );

    }

}


/* ==========================================================
   REMOVE FIRE
========================================================== */

function removeFinalReelFire() {

    document
        .querySelectorAll(
            ".final-reel-fire"
        )
        .forEach(
            element =>
                element.remove()
        );

}


/* ==========================================================
   STOP FINAL REEL EFFECTS
========================================================== */

function stopFinalReelEffects() {

    const finalReel =
        AMAZE.slots[2];


    if (finalReel) {

        finalReel.classList.remove(
            "final-reel-anticipation"
        );

    }


    removeFinalReelFire();

}


/* ==========================================================
   ANTICIPATION PARTICLES
========================================================== */

function createAnticipationParticles() {

    if (
        !AMAZE.anticipationParticles
    ) {
        return;
    }


    AMAZE.anticipationParticles.innerHTML =
        "";


    const count =
        window.innerWidth < 600
            ? 25
            : 45;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "anticipation-particle";


        const size =
            3 +
            Math.random() * 8;


        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.setProperty(
            "--drift",
            (
                -150 +
                Math.random() * 300
            ) + "px"
        );


        particle.style.setProperty(
            "--duration",
            (
                1 +
                Math.random() * 1.5
            ) + "s"
        );


        particle.style.animationDelay =
            Math.random() * .8 +
            "s";


        AMAZE
            .anticipationParticles
            .appendChild(
                particle
            );

    }

}


/* ==========================================================
   FINISH SPIN
========================================================== */

function finishSpin(result) {

    stopAnticipation();


    AMAZE.playing =
        false;


    if (AMAZE.button) {

        AMAZE.button.disabled =
            false;

    }


    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "playing"
        );

    }


    checkResult(
        result
    );


    saveGameState();


    setTimeout(
        checkGameMilestone,
        350
    );

}


/* ==========================================================
   RESULT
========================================================== */

function checkResult(result) {

    const a =
        result[0];

    const b =
        result[1];

    const c =
        result[2];


    if (
        a === b &&
        b === c
    ) {

        setMessage(
            "🎉 JACKPOT 🎉"
        );


        collectPersistentReward();

        jackpot();

        return;

    }


    if (
        a === b ||
        b === c ||
        a === c
    ) {

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
   PERSISTENT REWARD
========================================================== */

function collectPersistentReward() {

    AMAZE.persistentCoins++;


    if (
        AMAZE.persistentCoins >=
        AMAZE.persistentTarget
    ) {

        AMAZE.persistentCoins =
            0;


        setMessage(
            "💰 PERSISTENT PRIZE! 💰"
        );


        vibrationWin();


        playSound(
            1000,
            .25,
            "square",
            .08
        );


        setTimeout(
            () => {

                playSound(
                    1400,
                    .3,
                    "triangle",
                    .08
                );

            },
            180
        );


        createPersistentCoins(
            true
        );

    }

    else {

        createPersistentCoins(
            false
        );

    }


    updatePersistentProgress();

    saveGameState();

}


/* ==========================================================
   PERSISTENT PROGRESS
========================================================== */

function updatePersistentProgress() {

    const percentage =
        Math.min(
            (
                AMAZE.persistentCoins /
                AMAZE.persistentTarget
            ) * 100,
            100
        );


    if (AMAZE.persistentFill) {

        AMAZE.persistentFill.style.width =
            percentage + "%";

    }


    if (AMAZE.persistentValue) {

        AMAZE.persistentValue.innerHTML =
            AMAZE.persistentCoins +
            " / " +
            AMAZE.persistentTarget;

    }


    if (AMAZE.persistentBar) {

        AMAZE.persistentBar.setAttribute(
            "aria-valuenow",
            AMAZE.persistentCoins
        );

    }

}


/* ==========================================================
   PERSISTENT COINS
========================================================== */

function createPersistentCoins(
    jackpotReward
) {

    if (!AMAZE.persistentFill) {
        return;
    }


    const parent =
        AMAZE.persistentFill.parentElement;


    if (!parent) {
        return;
    }


    const count =
        jackpotReward
            ? 15
            : 5;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const coin =
            document.createElement(
                "div"
            );


        coin.className =
            "mini-coin";


        coin.style.left =
            10 +
            Math.random() * 80 +
            "%";


        coin.style.top =
            Math.random() * 100 +
            "%";


        coin.style.animationDelay =
            Math.random() * .35 +
            "s";


        parent.appendChild(
            coin
        );


        setTimeout(
            () => {

                coin.remove();

            },
            1200
        );

    }

}


/* ==========================================================
   PROGRESS
========================================================== */

function updateProgress() {

    const percentage =
        Math.min(
            (
                AMAZE.attempts /
                AMAZE.maxSpins
            ) * 100,
            100
        );


    if (AMAZE.counterValue) {

        AMAZE.counterValue.innerHTML =
            AMAZE.attempts +
            " / " +
            AMAZE.maxSpins;

    }


    if (AMAZE.progressFill) {

        AMAZE.progressFill.style.width =
            percentage + "%";

    }


    if (AMAZE.progressBar) {

        AMAZE.progressBar.setAttribute(
            "aria-valuenow",
            AMAZE.attempts
        );

    }

}


/* ==========================================================
   MILESTONE
========================================================== */

function checkGameMilestone() {

    if (
        AMAZE.attempts >=
        AMAZE.maxSpins
    ) {

        completeRound();

        return;
    }


    if (
        AMAZE.attempts > 0 &&
        AMAZE.attempts %
        AMAZE.holdEvery ===
        0
    ) {

        startHold();

    }

}


/* ==========================================================
   ROUND STATUS
========================================================== */

function updateRoundStatus() {

    if (AMAZE.roundStatus) {

        AMAZE.roundStatus.innerHTML =
            "ROUND " +
            AMAZE.round;

    }

}


/* ==========================================================
   SAVE STATE
========================================================== */

function saveGameState() {

    try {

        const state = {

            version:
                AMAZE.version,

            attempts:
                AMAZE.attempts,

            round:
                AMAZE.round,

            hold:
                AMAZE.hold,

            holdUntil:
                AMAZE.holdUntil,

            persistentCoins:
                AMAZE.persistentCoins

        };


        localStorage.setItem(
            AMAZE.storageKey,
            JSON.stringify(state)
        );

    }

    catch (error) {

        console.warn(
            "Could not save game state",
            error
        );

    }

}


/* ==========================================================
   LOAD STATE
========================================================== */

function loadGameState() {

    try {

        const saved =
            localStorage.getItem(
                AMAZE.storageKey
            );


        if (!saved) {
            return;
        }


        const state =
            JSON.parse(saved);


        if (
            !state ||
            state.version !==
            AMAZE.version
        ) {

            return;
        }


        AMAZE.attempts =
            Number.isFinite(
                state.attempts
            )
                ? state.attempts
                : 0;


        AMAZE.round =
            Number.isFinite(
                state.round
            )
                ? state.round
                : 1;


        AMAZE.persistentCoins =
            Number.isFinite(
                state.persistentCoins
            )
                ? state.persistentCoins
                : 0;


        AMAZE.hold =
            state.hold === true;


        AMAZE.holdUntil =
            Number.isFinite(
                state.holdUntil
            )
                ? state.holdUntil
                : null;


        if (
            AMAZE.attempts >=
            AMAZE.maxSpins
        ) {

            AMAZE.attempts =
                0;

            AMAZE.round++;

            AMAZE.hold =
                false;

            AMAZE.holdUntil =
                null;

        }


        if (AMAZE.hold) {

            if (
                AMAZE.holdUntil &&
                Date.now() <
                AMAZE.holdUntil
            ) {

                resumeSavedHold();

            }

            else {

                releaseHold();

            }

        }

    }

    catch (error) {

        console.warn(
            "Could not load saved state",
            error
        );


        AMAZE.attempts = 0;

        AMAZE.round = 1;

        AMAZE.hold = false;

        AMAZE.holdUntil = null;

        AMAZE.persistentCoins = 0;

    }

}


/* ==========================================================
   HOLD START
========================================================== */

function startHold() {

    if (AMAZE.hold) {
        return;
    }


    AMAZE.hold =
        true;


    AMAZE.holdUntil =
        Date.now() +
        AMAZE.holdDuration *
        1000;


    vibrationHoldEnter();


    playSound(
        300,
        .25,
        "triangle",
        .06
    );


    saveGameState();


    freezeMachine();

    showHoldOverlay();

    runHoldTimer();

}


/* ==========================================================
   RESUME HOLD
========================================================== */

function resumeSavedHold() {

    freezeMachine();

    showHoldOverlay();

    runHoldTimer();

}


/* ==========================================================
   HOLD TIMER
========================================================== */

function runHoldTimer() {

    clearInterval(
        AMAZE.holdTimer
    );


    updateHoldTimer();


    AMAZE.holdTimer =
        setInterval(
            updateHoldTimer,
            100
        );

}


/* ==========================================================
   UPDATE HOLD TIMER
========================================================== */

function updateHoldTimer() {

    if (!AMAZE.hold) {

        clearInterval(
            AMAZE.holdTimer
        );

        return;
    }


    const remaining =
        Math.max(
            0,
            AMAZE.holdUntil -
            Date.now()
        );


    const seconds =
        Math.ceil(
            remaining / 1000
        );


    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (
                    remaining /
                    (
                        AMAZE.holdDuration *
                        1000
                    )
                ) * 100
            )
        );


    if (AMAZE.holdCountdown) {

        AMAZE.holdCountdown.innerHTML =
            seconds;

    }


    if (AMAZE.holdProgressFill) {

        AMAZE.holdProgressFill.style.width =
            percentage + "%";

    }


    if (remaining <= 0) {

        clearInterval(
            AMAZE.holdTimer
        );


        releaseHold();

    }

}


/* ==========================================================
   FREEZE MACHINE
========================================================== */

function freezeMachine() {

    if (AMAZE.machine) {

        AMAZE.machine.classList.add(
            "ice-mode"
        );

    }


    if (AMAZE.button) {

        AMAZE.button.disabled =
            true;

    }


    AMAZE.slots.forEach(
        slot => {

            if (slot) {

                slot.classList.remove(
                    "reel-spin"
                );

            }

        }
    );


    if (AMAZE.holdStatus) {

        AMAZE.holdStatus.innerHTML =
            "MACHINE FROZEN";

    }


    setMessage(
        "❄ ICE HOLD ❄"
    );

}


/* ==========================================================
   SHOW HOLD
========================================================== */

function showHoldOverlay() {

    if (!AMAZE.holdOverlay) {
        return;
    }


    AMAZE.holdOverlay.classList.add(
        "active"
    );


    AMAZE.holdOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    if (AMAZE.snowContainer) {

        AMAZE.snowContainer.classList.add(
            "active"
        );

    }

}


/* ==========================================================
   RELEASE HOLD
========================================================== */

function releaseHold() {

    AMAZE.hold =
        false;

    AMAZE.holdUntil =
        null;


    clearInterval(
        AMAZE.holdTimer
    );


    vibrationHoldExit();


    playSound(
        600,
        .12,
        "triangle",
        .04
    );


    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "ice-mode"
        );

    }


    if (AMAZE.holdOverlay) {

        AMAZE.holdOverlay.classList.remove(
            "active"
        );


        AMAZE.holdOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (AMAZE.snowContainer) {

        AMAZE.snowContainer.classList.remove(
            "active"
        );

    }


    if (AMAZE.holdStatus) {

        AMAZE.holdStatus.innerHTML =
            "ICE MODE COMPLETE";

    }


    if (AMAZE.button) {

        AMAZE.button.disabled =
            false;

    }


    setMessage(
        "🔥 BACK TO THE GAME"
    );


    saveGameState();

}


/* ==========================================================
   JACKPOT
========================================================== */

function jackpot() {

    vibrationWin();


    playSound(
        900,
        .3,
        "square",
        .08
    );


    setTimeout(
        () => {

            playSound(
                1200,
                .3,
                "square",
                .08
            );

        },
        200
    );


    if (AMAZE.lamp) {

        AMAZE.lamp.classList.add(
            "on"
        );

    }


    createCoins();

    createConfetti();


    AMAZE.slots.forEach(
        slot => {

            if (slot) {

                slot.classList.add(
                    "flash"
                );

            }

        }
    );


    setTimeout(
        resetEffects,
        2500
    );

}


/* ==========================================================
   RESET EFFECTS
========================================================== */

function resetEffects() {

    if (AMAZE.lamp) {

        AMAZE.lamp.classList.remove(
            "on"
        );

    }


    AMAZE.slots.forEach(
        slot => {

            if (slot) {

                slot.classList.remove(
                    "flash"
                );

            }

        }
    );

}


/* ==========================================================
   COINS
========================================================== */

function createCoins() {

    for (
        let i = 0;
        i < 60;
        i++
    ) {

        const coin =
            document.createElement(
                "div"
            );


        coin.className =
            "coin";


        coin.style.left =
            Math.random() * 100 +
            "vw";


        coin.style.animationDelay =
            Math.random() * 1.5 +
            "s";


        document.body.appendChild(
            coin
        );


        setTimeout(
            () => {

                coin.remove();

            },
            4000
        );

    }

}


/* ==========================================================
   CONFETTI
========================================================== */

function createConfetti() {

    const colors = [
        "gold",
        "red",
        "blue",
        "green",
        "purple"
    ];


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.className =
            "confetti";


        piece.style.left =
            Math.random() * 100 +
            "vw";


        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        piece.style.animationDelay =
            Math.random() * 1.5 +
            "s";


        document.body.appendChild(
            piece
        );


        setTimeout(
            () => {

                piece.remove();

            },
            4500
        );

    }

}


/* ==========================================================
   CASINO PARTICLES
========================================================== */

function createCasinoParticles() {

    if (!AMAZE.casinoBackground) {
        return;
    }


    const count =
        window.innerWidth < 600
            ? 35
            : 65;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "casino-particle";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.setProperty(
            "--duration",
            (
                8 +
                Math.random() * 14
            ) + "s"
        );


        particle.style.setProperty(
            "--opacity",
            .2 +
            Math.random() * .7
        );


        particle.style.setProperty(
            "--drift",
            (
                -100 +
                Math.random() * 200
            ) + "px"
        );


        const size =
            2 +
            Math.random() * 5;


        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particle.style.animationDelay =
            -Math.random() * 15 +
            "s";


        AMAZE.casinoBackground
            .appendChild(
                particle
            );

    }

}


/* ==========================================================
   SNOW PARTICLES
========================================================== */

function createSnowParticles() {

    if (!AMAZE.snowContainer) {
        return;
    }


    const count =
        window.innerWidth < 600
            ? 45
            : 80;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const snow =
            document.createElement(
                "div"
            );


        snow.className =
            "snowflake";


        snow.style.left =
            Math.random() * 100 +
            "%";


        snow.style.setProperty(
            "--size",
            (
                3 +
                Math.random() * 9
            ) + "px"
        );


        snow.style.setProperty(
            "--duration",
            (
                5 +
                Math.random() * 8
            ) + "s"
        );


        snow.style.setProperty(
            "--opacity",
            (
                .25 +
                Math.random() * .7
            )
        );


        snow.style.setProperty(
            "--sway",
            (
                -100 +
                Math.random() * 200
            ) + "px"
        );


        snow.style.animationDelay =
            -Math.random() * 10 +
            "s";


        AMAZE.snowContainer
            .appendChild(
                snow
            );

    }

}


/* ==========================================================
   LEVER
========================================================== */

function leverPull() {

    if (!AMAZE.lever) {
        return;
    }


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
   ROUND COMPLETE
========================================================== */

function completeRound() {

    AMAZE.playing =
        true;


    if (AMAZE.button) {

        AMAZE.button.disabled =
            true;

    }


    if (AMAZE.machine) {

        AMAZE.machine.classList.add(
            "round-complete"
        );

    }


    setMessage(
        "🏆 ROUND COMPLETE 🏆"
    );


    vibrationWin();


    playSound(
        700,
        .2,
        "square",
        .07
    );


    setTimeout(
        () => {

            playSound(
                900,
                .25,
                "square",
                .07
            );

        },
        180
    );


    setTimeout(
        () => {

            playSound(
                1200,
                .4,
                "triangle",
                .08
            );


            createCoins();

            createConfetti();

        },
        350
    );


    setTimeout(
        resetRound,
        3000
    );

}


/* ==========================================================
   RESET ROUND
========================================================== */

function resetRound() {

    AMAZE.attempts =
        0;


    AMAZE.round++;


    AMAZE.playing =
        false;


    AMAZE.hold =
        false;


    AMAZE.holdUntil =
        null;


    resetEffects();


    updateProgress();

    updateRoundStatus();


    setMessage(
        "🎰 NEW ROUND"
    );


    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "round-complete"
        );

    }


    if (AMAZE.button) {

        AMAZE.button.disabled =
            false;

    }


    saveGameState();


    setTimeout(
        () => {

            setMessage(
                "READY"
            );

        },
        1500
    );

}


/* ==========================================================
   ANTICIPATION DYNAMIC CSS
========================================================== */

function injectAnticipationStyles() {

    if (
        document.getElementById(
            "amaze-v71-style"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "amaze-v71-style";


    style.textContent = `

        #slot3.final-reel-anticipation
        .reel-track {

            filter:
                blur(1px)
                brightness(1.2);

        }

        #slot3.final-reel-anticipation
        .reel-symbol {

            filter:
                blur(1px)
                brightness(1.3);

        }

    `;


    document.head.appendChild(
        style
    );

}


/* ==========================================================
   VISIBILITY
========================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !document.hidden &&
            AMAZE.hold
        ) {

            updateHoldTimer();

        }

    }
);


/* ==========================================================
   BEFORE UNLOAD
========================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        saveGameState();

    }
);


/* ==========================================================
   ERROR MONITOR
========================================================== */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "AmazeEscape v7.1:",
            event.message
        );

    }
);


/* ==========================================================
   READY
========================================================== */

console.log(
    "🎰 AmazeEscape v7.1 READY"
);
