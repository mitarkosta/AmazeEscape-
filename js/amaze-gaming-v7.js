"use strict";


/* ==========================================================
   AMAZE ESCAPE v7
   CLEAN GAME ENGINE
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

    persistentTarget: 10,

    attempts: 0,

    round: 1,

    persistentCoins: 0,

    playing: false,

    hold: false,

    holdUntil: null,

    anticipationActive: false,

    audio: null,

    slots: [],

    machine: null,

    button: null,

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

    anticipationReelWrap: null,

    persistentValue: null,

    persistentFill: null,

    persistentBar: null,

    persistentCoinsElement: null,

    finalReelFire: null,

    holdTimer: null,

    anticipationTimer: null,

    storageKey: "AmazeEscape_v71_State"
};


/* ==========================================================
   START
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);


/* ==========================================================
   INITIALIZE
========================================================== */

function initializeGame() {

    cacheDOM();

    if (!validateDOM()) {
        return;
    }

    createCasinoParticles();

    createSnowParticles();

    loadGameState();

    updateProgress();

    updatePersistentProgress();

    updateRoundStatus();

    updateButtonState();

    console.log("🎰 AmazeEscape v7.1 READY");
}


/* ==========================================================
   DOM CACHE
========================================================== */

function cacheDOM() {

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
        document.getElementById("jackpotLamp");

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

    AMAZE.anticipationOverlay =
        document.getElementById("anticipationOverlay");

    AMAZE.anticipationParticles =
        document.getElementById("anticipationParticles");

    AMAZE.anticipationReelWrap =
        document.getElementById("anticipationReelWrap");

    AMAZE.persistentValue =
        document.getElementById("persistentValue");

    AMAZE.persistentFill =
        document.getElementById("persistentFill");

    AMAZE.persistentBar =
        document.getElementById("persistentBar");

    AMAZE.persistentCoinsElement =
        document.getElementById("persistentCoins");

    AMAZE.finalReelFire =
        document.getElementById("finalReelFire");

    if (AMAZE.button) {

        AMAZE.button.addEventListener(
            "click",
            spinGame
        );
    }
}


/* ==========================================================
   VALIDATE DOM
========================================================== */

function validateDOM() {

    const required = [
        AMAZE.machine,
        AMAZE.button,
        AMAZE.message,
        AMAZE.slots[0],
        AMAZE.slots[1],
        AMAZE.slots[2]
    ];

    const valid =
        required.every(Boolean);

    if (!valid) {

        console.error(
            "AmazeEscape: required DOM elements are missing."
        );
    }

    return valid;
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
        AMAZE.message.textContent = text;
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
            .catch(() => {});
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

        if (!ctx) {
            return;
        }

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.type = type;

        osc.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            ctx.currentTime + .01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
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
        navigator.vibrate(pattern);
    }
    catch {
        /* optional */
    }
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
   BUTTON STATE
========================================================== */

function updateButtonState() {

    if (!AMAZE.button) {
        return;
    }

    AMAZE.button.disabled =
        AMAZE.playing ||
        AMAZE.hold;
}


/* ==========================================================
   SPIN
========================================================== */

function spinGame() {

    if (
        AMAZE.playing ||
        AMAZE.hold
    ) {
        return;
    }

    if (
        AMAZE.attempts >=
        AMAZE.maxSpins
    ) {
        return;
    }

    getAudio();

    AMAZE.playing = true;

    AMAZE.attempts++;

    updateProgress();

    updateButtonState();

    saveGameState();

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

            slot.classList.remove(
                "flash"
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

                        if (slot) {
                            slot.textContent =
                                randomSymbol();
                        }
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
        1700
    );
}


/* ==========================================================
   STOP REELS
========================================================== */

function stopReels() {

    const result = [];

    setTimeout(
        () => {

            stopSingleReel(
                0,
                result
            );

        },
        0
    );

    setTimeout(
        () => {

            stopSingleReel(
                1,
                result
            );

        },
        550
    );

    setTimeout(
        () => {

            /*
             * Anticipation is triggered
             * when the first two reels match.
             */

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
        1100
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

    if (!slot) {
        return;
    }

    slot.classList.remove(
        "reel-spin"
    );

    slot.classList.add(
        "reel-stop"
    );

    const symbol =
        randomSymbol();

    slot.textContent =
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

        stopAnticipation();

        finishSpin(result);
    }
}


/* ==========================================================
   ANTICIPATION
========================================================== */

function startAnticipation(callback) {

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


    /*
     * Machine
     */

    AMAZE.machine
        ?.classList
        .add(
            "anticipation-mode"
        );


    /*
     * Overlay
     */

    AMAZE.anticipationOverlay
        ?.classList
        .add(
            "active"
        );

    AMAZE.anticipationOverlay
        ?.setAttribute(
            "aria-hidden",
            "false"
        );


    /*
     * Reel 3
     */

    AMAZE.anticipationReelWrap
        ?.classList
        .add(
            "active"
        );


    createAnticipationParticles();

    createFinalReelFire();


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
   STOP ANTICIPATION
========================================================== */

function stopAnticipation() {

    clearTimeout(
        AMAZE.anticipationTimer
    );

    AMAZE.anticipationTimer =
        null;

    AMAZE.anticipationActive =
        false;


    AMAZE.machine
        ?.classList
        .remove(
            "anticipation-mode"
        );


    AMAZE.anticipationOverlay
        ?.classList
        .remove(
            "active"
        );

    AMAZE.anticipationOverlay
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    AMAZE.anticipationReelWrap
        ?.classList
        .remove(
            "active"
        );


    if (
        AMAZE.anticipationParticles
    ) {

        AMAZE.anticipationParticles
            .replaceChildren();
    }


    clearFinalReelFire();
}


/* ==========================================================
   FINAL REEL FIRE
========================================================== */

function createFinalReelFire() {

    const fire =
        AMAZE.finalReelFire;

    if (!fire) {
        return;
    }

    fire.replaceChildren();


    /*
     * Flames
     */

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
            `${15 + Math.random() * 30}px`
        );

        flame.style.setProperty(
            "--fire-left",
            `${8 + Math.random() * 84}%`
        );

        flame.style.setProperty(
            "--fire-bottom",
            `${-12 + Math.random() * 25}px`
        );

        flame.style.setProperty(
            "--fire-opacity",
            `${.45 + Math.random() * .55}`
        );

        flame.style.setProperty(
            "--fire-rotate",
            `${-35 + Math.random() * 70}deg`
        );

        flame.style.setProperty(
            "--fire-duration",
            `${.18 + Math.random() * .3}s`
        );

        fire.appendChild(flame);
    }


    /*
     * Particles
     */

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
            `${3 + Math.random() * 7}px`
        );

        particle.style.setProperty(
            "--particle-left",
            `${Math.random() * 100}%`
        );

        particle.style.setProperty(
            "--particle-bottom",
            `${Math.random() * 50}%`
        );

        particle.style.setProperty(
            "--particle-drift",
            `${-70 + Math.random() * 140}px`
        );

        particle.style.setProperty(
            "--particle-rise",
            `${-80 - Math.random() * 130}px`
        );

        particle.style.setProperty(
            "--particle-duration",
            `${.5 + Math.random() * .9}s`
        );

        particle.style.setProperty(
            "--particle-delay",
            `${-Math.random() * 1.2}s`
        );

        fire.appendChild(particle);
    }
}


function clearFinalReelFire() {

    if (AMAZE.finalReelFire) {
        AMAZE.finalReelFire.replaceChildren();
    }
}


/* ==========================================================
   GLOBAL ANTICIPATION PARTICLES
========================================================== */

function createAnticipationParticles() {

    if (
        !AMAZE.anticipationParticles
    ) {
        return;
    }

    AMAZE.anticipationParticles
        .replaceChildren();


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
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--drift",
            `${-150 + Math.random() * 300}px`
        );

        particle.style.setProperty(
            "--duration",
            `${1 + Math.random() * 1.5}s`
        );


        particle.style.animationDelay =
            `${Math.random() * .8}s`;


        AMAZE.anticipationParticles
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

    AMAZE.playing = false;

    updateButtonState();

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


    /*
     * JACKPOT
     */

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


    /*
     * TWO MATCH
     */

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

        AMAZE.persistentCoins = 0;

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

        createPersistentCoins(true);

    }
    else {

        createPersistentCoins(false);
    }


    updatePersistentProgress();

    saveGameState();
}


/* ==========================================================
   UPDATE PERSISTENT
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


    if (
        AMAZE.persistentFill
    ) {

        AMAZE.persistentFill.style.width =
            `${percentage}%`;
    }


    if (
        AMAZE.persistentValue
    ) {

        AMAZE.persistentValue.textContent =
            `${AMAZE.persistentCoins} / ${AMAZE.persistentTarget}`;
    }


    if (
        AMAZE.persistentBar
    ) {

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

    const parent =
        AMAZE.persistentCoinsElement;

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
            `${10 + Math.random() * 80}%`;

        coin.style.top =
            `${Math.random() * 100}%`;

        coin.style.animationDelay =
            `${Math.random() * .35}s`;

        parent.appendChild(coin);


        setTimeout(
            () => {

                coin.remove();

            },
            1200
        );
    }
}


/* ==========================================================
   MAIN PROGRESS
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


    if (
        AMAZE.counterValue
    ) {

        AMAZE.counterValue.textContent =
            `${AMAZE.attempts} / ${AMAZE.maxSpins}`;
    }


    if (
        AMAZE.progressFill
    ) {

        AMAZE.progressFill.style.width =
            `${percentage}%`;
    }


    if (
        AMAZE.progressBar
    ) {

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
        AMAZE.holdEvery === 0
    ) {

        startHold();
    }
}


/* ==========================================================
   ROUND STATUS
========================================================== */

function updateRoundStatus() {

    if (
        AMAZE.roundStatus
    ) {

        AMAZE.roundStatus.textContent =
            `ROUND ${AMAZE.round}`;
    }
}


/* ==========================================================
   STORAGE
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
   LOAD STORAGE
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
                ? Math.max(
                    0,
                    Math.min(
                        state.attempts,
                        AMAZE.maxSpins
                    )
                )
                : 0;


        AMAZE.round =
            Number.isFinite(
                state.round
            )
                ? Math.max(
                    1,
                    state.round
                )
                : 1;


        AMAZE.persistentCoins =
            Number.isFinite(
                state.persistentCoins
            )
                ? Math.max(
                    0,
                    Math.min(
                        state.persistentCoins,
                        AMAZE.persistentTarget - 1
                    )
                )
                : 0;


        AMAZE.hold =
            state.hold === true;


        AMAZE.holdUntil =
            Number.isFinite(
                state.holdUntil
            )
                ? state.holdUntil
                : null;


        /*
         * Completed round saved
         */

        if (
            AMAZE.attempts >=
            AMAZE.maxSpins
        ) {

            AMAZE.attempts = 0;

            AMAZE.round++;

            AMAZE.hold = false;

            AMAZE.holdUntil = null;

            saveGameState();

            return;
        }


        /*
         * Resume HOLD
         */

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
   HOLD
========================================================== */

function startHold() {

    if (
        AMAZE.hold ||
        AMAZE.playing
    ) {
        return;
    }


    AMAZE.hold = true;

    AMAZE.holdUntil =
        Date.now() +
        AMAZE.holdDuration * 1000;


    vibrationHoldEnter();

    playSound(
        300,
        .25,
        "triangle",
        .06
    );


    freezeMachine();

    showHoldOverlay();

    saveGameState();

    runHoldTimer();
}


function resumeSavedHold() {

    freezeMachine();

    showHoldOverlay();

    runHoldTimer();
}


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


    if (
        AMAZE.holdCountdown
    ) {

        AMAZE.holdCountdown.textContent =
            seconds;
    }


    if (
        AMAZE.holdProgressFill
    ) {

        AMAZE.holdProgressFill.style.width =
            `${percentage}%`;
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

    AMAZE.machine
        ?.classList
        .add(
            "ice-mode"
        );


    AMAZE.slots.forEach(
        slot => {

            slot?.classList
                .remove(
                    "reel-spin"
                );
        }
    );


    if (
        AMAZE.holdStatus
    ) {

        AMAZE.holdStatus.textContent =
            "MACHINE FROZEN";
    }


    setMessage(
        "❄ ICE HOLD ❄"
    );


    updateButtonState();
}


/* ==========================================================
   HOLD OVERLAY
========================================================== */

function showHoldOverlay() {

    AMAZE.holdOverlay
        ?.classList
        .add(
            "active"
        );


    AMAZE.holdOverlay
        ?.setAttribute(
            "aria-hidden",
            "false"
        );
}


function releaseHold() {

    AMAZE.hold = false;

    AMAZE.holdUntil = null;


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


    AMAZE.machine
        ?.classList
        .remove(
            "ice-mode"
        );


    AMAZE.holdOverlay
        ?.classList
        .remove(
            "active"
        );


    AMAZE.holdOverlay
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    if (
        AMAZE.holdStatus
    ) {

        AMAZE.holdStatus.textContent =
            "ICE MODE COMPLETE";
    }


    setMessage(
        "🔥 BACK TO THE GAME"
    );


    updateButtonState();

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


    AMAZE.lamp
        ?.classList
        .add(
            "on"
        );


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

    AMAZE.lamp
        ?.classList
        .remove(
            "on"
        );


    AMAZE.slots.forEach(
        slot => {

            slot?.classList
                .remove(
                    "flash"
                );
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
            `${Math.random() * 100}vw`;

        coin.style.animationDelay =
            `${Math.random() * 1.5}s`;

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
            `${Math.random() * 100}vw`;

        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        piece.style.animationDelay =
            `${Math.random() * 1.5}s`;

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

    if (
        !AMAZE.casinoBackground
    ) {
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
            `${Math.random() * 100}%`;

        particle.style.setProperty(
            "--duration",
            `${8 + Math.random() * 14}s`
        );

        particle.style.setProperty(
            "--opacity",
            `${.2 + Math.random() * .7}`
        );

        particle.style.setProperty(
            "--drift",
            `${-100 + Math.random() * 200}px`
        );


        const size =
            2 +
            Math.random() * 5;


        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.animationDelay =
            `${-Math.random() * 15}s`;


        AMAZE.casinoBackground
            .appendChild(
                particle
            );
    }
}


/* ==========================================================
   SNOW
========================================================== */

function createSnowParticles() {

    if (
        !AMAZE.snowContainer
    ) {
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
            `${Math.random() * 100}%`;

        snow.style.setProperty(
            "--size",
            `${3 + Math.random() * 9}px`
        );

        snow.style.setProperty(
            "--duration",
            `${5 + Math.random() * 8}s`
        );

        snow.style.setProperty(
            "--opacity",
            `${.25 + Math.random() * .7}`
        );

        snow.style.setProperty(
            "--sway",
            `${-100 + Math.random() * 200}px`
        );

        snow.style.animationDelay =
            `${-Math.random() * 10}s`;


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

    AMAZE.playing = true;

    updateButtonState();


    AMAZE.machine
        ?.classList
        .add(
            "round-complete"
        );


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

    AMAZE.attempts = 0;

    AMAZE.round++;

    AMAZE.playing = false;

    AMAZE.hold = false;

    AMAZE.holdUntil = null;


    clearInterval(
        AMAZE.holdTimer
    );


    resetEffects();


    AMAZE.machine
        ?.classList
        .remove(
            "round-complete"
        );


    updateProgress();

    updateRoundStatus();

    updateButtonState();


    setMessage(
        "🎰 NEW ROUND"
    );


    saveGameState();


    setTimeout(
        () => {

            if (
                !AMAZE.playing &&
                !AMAZE.hold
            ) {

                setMessage(
                    "READY"
                );
            }

        },
        1500
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
    saveGameState
);


/* ==========================================================
   ERROR MONITOR
========================================================== */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "AmazeEscape:",
            event.message
        );
    }
);
