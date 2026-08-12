/* ==========================================================
   AMAZE ESCAPE
   ENGINE v5
   CORE + PROGRESS + PERSISTENCE + ICE HOLD
   ========================================================== */

"use strict";


/* ==========================================================
   CONFIGURATION
   ========================================================== */

const AMAZE = {

    version: "5.0",

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

    holdDuration: 10,

    attempts: 0,

    round: 1,

    playing: false,

    hold: false,

    holdUntil: null,

    audio: null,

    machine: null,

    button: null,

    slots: [],

    message: null,

    counterValue: null,

    progressFill: null,

    progressBar: null,

    roundStatus: null,

    lever: null,

    lamp: null,

    holdOverlay: null,

    holdCountdown: null,

    holdProgressFill: null,

    holdStatus: null,

    casinoBackground: null,

    snowContainer: null,

    holdTimer: null,

    storageKey: "AmazeEscape_v5_State"

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
        document.getElementById("spinProgressFill");

    AMAZE.progressBar =
        document.getElementById("spinProgress");

    AMAZE.roundStatus =
        document.getElementById("roundStatus");

    AMAZE.slots = [

        document.getElementById("slot1"),

        document.getElementById("slot2"),

        document.getElementById("slot3")

    ];

    AMAZE.lever =
        document.querySelector(".real-lever");

    AMAZE.lamp =
        document.querySelector(".jackpot-lamp");

    AMAZE.holdOverlay =
        document.getElementById("holdOverlay");

    AMAZE.holdCountdown =
        document.getElementById("holdCountdown");

    AMAZE.holdProgressFill =
        document.getElementById("holdProgressFill");

    AMAZE.holdStatus =
        document.getElementById("holdStatus");

    AMAZE.casinoBackground =
        document.getElementById("casinoBackground");

    AMAZE.snowContainer =
        document.getElementById("snowContainer");


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

    updateRoundStatus();


    console.log(
        "🎰 AmazeEscape v5 loaded"
    );

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
   MESSAGE
   ========================================================== */

function setMessage(text) {

    if (AMAZE.message) {

        AMAZE.message.innerHTML = text;

    }

}


/* ==========================================================
   AUDIO
   ========================================================== */

function getAudio() {

    if (!AMAZE.audio) {

        AMAZE.audio =
            new AudioContext();

    }

    if (
        AMAZE.audio.state ===
        "suspended"
    ) {

        AMAZE.audio.resume();

    }

    return AMAZE.audio;

}


function playSound(
    frequency,
    duration = .1,
    type = "square",
    volume = .05
) {

    try {

        const ctx =
            getAudio();

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

    catch (error) {

        console.warn(
            "Audio unavailable",
            error
        );

    }

}


/* ==========================================================
   SPIN
   ========================================================== */

function spinGame() {

    if (AMAZE.playing)
        return;

    if (AMAZE.hold)
        return;

    if (AMAZE.attempts >= AMAZE.maxSpins)
        return;


    if (
        !AMAZE.slots[0] ||
        !AMAZE.slots[1] ||
        !AMAZE.slots[2]
    ) {

        console.warn(
            "Slots not found"
        );

        return;

    }


    AMAZE.playing = true;


    AMAZE.attempts++;


    updateProgress();

    saveGameState();


    if (AMAZE.button) {

        AMAZE.button.disabled = true;

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

            slot.classList.remove(
                "reel-stop"
            );

            slot.classList.add(
                "reel-spin"
            );

        }
    );


    const timer =
        setInterval(
            () => {

                AMAZE.slots.forEach(
                    slot => {

                        slot.innerHTML =
                            randomSymbol();

                    }
                );

            },
            80
        );


    setTimeout(
        () => {

            clearInterval(timer);

            stopReels();

        },
        2000
    );

}


/* ==========================================================
   STOP REELS
   ========================================================== */

function stopReels() {

    const result = [];


    AMAZE.slots.forEach(
        (slot, index) => {

            setTimeout(
                () => {

                    slot.classList.remove(
                        "reel-spin"
                    );

                    slot.classList.add(
                        "reel-stop"
                    );


                    const symbol =
                        randomSymbol();


                    slot.innerHTML =
                        symbol;


                    result[index] =
                        symbol;


                    playSound(
                        700 - index * 120,
                        .08,
                        "square",
                        .04
                    );


                    if (index === 2) {

                        finishSpin(
                            result
                        );

                    }

                },
                index * 600
            );

        }
    );

}


/* ==========================================================
   FINISH SPIN
   ========================================================== */

function finishSpin(result) {

    AMAZE.playing = false;


    if (AMAZE.button) {

        AMAZE.button.disabled = false;

    }


    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "playing"
        );

    }


    checkResult(result);


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

    const a = result[0];

    const b = result[1];

    const c = result[2];


    if (
        a === b &&
        b === c
    ) {

        setMessage(
            "🎉 JACKPOT 🎉"
        );

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
   MILESTONE CHECK
   ========================================================== */

function checkGameMilestone() {

    if (AMAZE.attempts >= AMAZE.maxSpins) {

        completeRound();

        return;

    }


    if (
        AMAZE.attempts > 0 &&
        AMAZE.attempts %
        AMAZE.holdEvery === 0
    ) {

        startHold();

    }

}


/* ==========================================================
   PROGRESS BAR
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
                AMAZE.holdUntil

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

            AMAZE.attempts = 0;

            AMAZE.round = 1;

            AMAZE.hold = false;

            AMAZE.holdUntil = null;

            return;

        }


        const state =
            JSON.parse(saved);


        if (
            !state ||
            state.version !==
            AMAZE.version
        ) {

            AMAZE.attempts = 0;

            AMAZE.round = 1;

            AMAZE.hold = false;

            AMAZE.holdUntil = null;

            saveGameState();

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


        AMAZE.hold =
            state.hold === true;


        AMAZE.holdUntil =
            Number.isFinite(
                state.holdUntil
            )
                ? state.holdUntil
                : null;


        if (AMAZE.attempts >= 100) {

            AMAZE.attempts = 0;

            AMAZE.round++;

            AMAZE.hold = false;

            AMAZE.holdUntil = null;

            saveGameState();

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

    }

}


/* ==========================================================
   HOLD SYSTEM
   ========================================================== */

function startHold() {

    if (AMAZE.hold)
        return;


    AMAZE.hold = true;


    AMAZE.holdUntil =
        Date.now() +
        AMAZE.holdDuration * 1000;


    saveGameState();


    freezeMachine();

    showHoldOverlay();

    runHoldTimer();

}


/* ==========================================================
   RESUME SAVED HOLD
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

        AMAZE.button.disabled = true;

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

    if (!AMAZE.holdOverlay)
        return;


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

    AMAZE.hold = false;

    AMAZE.holdUntil = null;


    clearInterval(
        AMAZE.holdTimer
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


    if (AMAZE.holdStatus) {

        AMAZE.holdStatus.innerHTML =
            "ICE MODE COMPLETE";

    }


    if (AMAZE.button) {

        AMAZE.button.disabled = false;

    }


    setMessage(
        "🔥 BACK TO THE GAME"
    );


    playSound(
        600,
        .12,
        "triangle",
        .04
    );


    saveGameState();

}


/* ==========================================================
   ROUND COMPLETE
   ========================================================== */

function completeRound() {

    AMAZE.playing = true;


    if (AMAZE.button) {

        AMAZE.button.disabled = true;

    }


    if (AMAZE.machine) {

        AMAZE.machine.classList.add(
            "round-complete"
        );

    }


    setMessage(
        "🏆 ROUND COMPLETE 🏆"
    );


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

    AMAZE.attempts = 0;

    AMAZE.round++;

    AMAZE.playing = false;

    AMAZE.hold = false;

    AMAZE.holdUntil = null;


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

        AMAZE.button.disabled = false;

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
   LEVER
   ========================================================== */

function leverPull() {

    if (!AMAZE.lever)
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

function jackpot() {

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

            slot.classList.add(
                "flash"
            );

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

    if (!AMAZE.casinoBackground)
        return;


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
            (8 + Math.random() * 14) +
            "s"
        );


        particle.style.setProperty(
            "--opacity",
            (.2 + Math.random() * .7)
        );


        particle.style.setProperty(
            "--drift",
            (-100 + Math.random() * 200) +
            "px"
        );


        const size =
            2 + Math.random() * 5;


        particle.style.width =
            size + "px";


        particle.style.height =
            size + "px";


        particle.style.animationDelay =
            (-Math.random() * 15) +
            "s";


        AMAZE.casinoBackground.appendChild(
            particle
        );

    }

}


/* ==========================================================
   SNOW PARTICLES
   ========================================================== */

function createSnowParticles() {

    if (!AMAZE.snowContainer)
        return;


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
            (3 + Math.random() * 9) +
            "px"
        );


        snow.style.setProperty(
            "--duration",
            (5 + Math.random() * 8) +
            "s"
        );


        snow.style.setProperty(
            "--opacity",
            (.25 + Math.random() * .7)
        );


        snow.style.setProperty(
            "--sway",
            (-100 + Math.random() * 200) +
            "px"
        );


        snow.style.animationDelay =
            (-Math.random() * 10) +
            "s";


        AMAZE.snowContainer.appendChild(
            snow
        );

    }

}


/* ==========================================================
   PAGE VISIBILITY
   ========================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
         * The game state is already saved after every
         * important action. If the player returns while
         * HOLD is active, the countdown is recalculated
         * from the real timestamp.
         */

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
            "AmazeEscape v5:",
            event.message
        );

    }
);


console.log(
    "🎰 AmazeEscape v5 READY"
);
