/* ==========================================================
   AMAZE ESCAPE
   ENGINE v7 OPTIMIZED

   CORE
   PROGRESS
   PERSISTENCE
   ANTICIPATION
   HOLD
   MOBILE VIBRATION
   AUDIO SAFE
   DOM SAFE
   PERFORMANCE OPTIMIZED
========================================================== */

"use strict";

/* ==========================================================
   CONFIG
========================================================== */

const AMAZE = {

    version: "7.0",

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

    anticipationDelay: 650,

    reelSpinDuration: 1700,

    reelStopDelay: 550,

    attempts: 0,

    round: 1,

    playing: false,

    hold: false,

    holdUntil: null,

    audio: null,

    slots: [],

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

    reelTimer: null,

    persistentCoins: 0,

    persistentTarget: 10,

    anticipationActive: false,

    storageKey: "AmazeEscape_v6_State"

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


    /*
     * HTML няма id="jackpotLamp",
     * затова използваме class selector.
     */

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


    /*
     * Existing HTML uses:
     *
     * anticipation-layer
     *
     * NOT anticipationOverlay.
     */

    AMAZE.anticipationOverlay =
        document.getElementById(
            "anticipationLayer"
        );


    AMAZE.anticipationParticles =
        document.querySelector(
            ".anticipation-particles"
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
            "persistentProgress"
        );


    if (
        AMAZE.button
    ) {

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
        "🎰 AmazeEscape v7 Optimized loaded"
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

    if (
        AMAZE.message
    ) {

        AMAZE.message.textContent =
            text;

    }

}


/* ==========================================================
   AUDIO
   Created only after real user interaction.
========================================================== */

function getAudio() {

    if (
        !AMAZE.audio
    ) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (
            !AudioContext
        ) {

            return null;

        }

        try {

            AMAZE.audio =
                new AudioContext();

        }

        catch (
            error
        ) {

            return null;

        }

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

        if (
            !ctx ||
            ctx.state === "closed"
        ) {

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


        const now =
            ctx.currentTime;


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, .0002),
            now + .01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );


        osc.connect(
            gain
        );

        gain.connect(
            ctx.destination
        );


        osc.start(
            now
        );

        osc.stop(
            now +
            duration +
            .02
        );

    }

    catch (
        error
    ) {

        /*
         * Audio is optional.
         * Never allow sound to break gameplay.
         */

    }

}


/* ==========================================================
   MOBILE VIBRATION
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

    catch (
        error
    ) {

        /*
         * Vibration is optional.
         */

    }

}


/* ==========================================================
   VIBRATION - EVERY SPIN
========================================================== */

function vibrationSpin() {

    vibrate(
        35
    );

}


/* ==========================================================
   VIBRATION - ANTICIPATION
========================================================== */

function vibrationAnticipation() {

    vibrate(
        [
            60,
            35,
            100,
            35,
            160
        ]
    );

}


/* ==========================================================
   VIBRATION - WINNING LINE
========================================================== */

function vibrationWinLine() {

    vibrate(
        [
            70,
            35,
            110
        ]
    );

}


/* ==========================================================
   VIBRATION - JACKPOT
========================================================== */

function vibrationJackpot() {

    vibrate(
        [
            90,
            40,
            130,
            40,
            200,
            50,
            260
        ]
    );

}


/* ==========================================================
   VIBRATION - HOLD ENTER
========================================================== */

function vibrationHoldEnter() {

    vibrate(
        [
            100,
            50,
            180
        ]
    );

}


/* ==========================================================
   VIBRATION - HOLD EXIT
========================================================== */

function vibrationHoldExit() {

    vibrate(
        [
            180,
            60,
            100
        ]
    );

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


    if (
        AMAZE.slots.length !== 3 ||
        AMAZE.slots.some(
            slot => !slot
        )
    ) {

        console.warn(
            "AmazeEscape: slots not found"
        );

        return;

    }


    /*
     * Real user gesture.
     * Safe moment to start/resume AudioContext.
     */

    getAudio();


    AMAZE.playing =
        true;

    AMAZE.attempts++;


    updateProgress();

    saveGameState();


    if (
        AMAZE.button
    ) {

        AMAZE.button.disabled =
            true;

    }


    setMessage(
        "🎰 SPINNING..."
    );


    /*
     * Vibration on EVERY spin.
     */

    vibrationSpin();


    playSound(
        120,
        .25,
        "sawtooth",
        .08
    );


    leverPull();


    if (
        AMAZE.machine
    ) {

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

    clearTimeout(
        AMAZE.reelTimer
    );


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

                        slot.textContent =
                            randomSymbol();

                    }
                );

            },
            80
        );


    AMAZE.reelTimer =
        setTimeout(
            () => {

                clearInterval(
                    timer
                );

                stopReels();

            },
            AMAZE.reelSpinDuration
        );

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

            /*
             * IMPORTANT:
             *
             * Anticipation ONLY if:
             *
             * Reel 1 === Reel 2
             */

            if (
                result[0] &&
                result[1] &&
                result[0] ===
                result[1]
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


    if (
        !slot
    ) {

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


    if (
        index === 2
    ) {

        finishSpin(
            result
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

        callback();

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
        .06
    );


    setTimeout(
        () => {

            playSound(
                260,
                .3,
                "square",
                .05
            );

        },
        180
    );


    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.add(
            "anticipation-mode"
        );

    }


    if (
        AMAZE.anticipationOverlay
    ) {

        AMAZE
            .anticipationOverlay
            .classList.add(
                "active"
            );

        AMAZE
            .anticipationOverlay
            .setAttribute(
                "aria-hidden",
                "false"
            );

    }


    createAnticipationParticles();


    clearTimeout(
        AMAZE.anticipationTimer
    );


    AMAZE.anticipationTimer =
        setTimeout(
            () => {

                if (
                    typeof callback ===
                    "function"
                ) {

                    callback();

                }

            },
            AMAZE.anticipationDelay
        );

}


/* ==========================================================
   ANTICIPATION END
========================================================== */

function stopAnticipation() {

    AMAZE.anticipationActive =
        false;


    clearTimeout(
        AMAZE.anticipationTimer
    );


    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.remove(
            "anticipation-mode"
        );

    }


    if (
        AMAZE.anticipationOverlay
    ) {

        AMAZE
            .anticipationOverlay
            .classList.remove(
                "active"
            );

        AMAZE
            .anticipationOverlay
            .setAttribute(
                "aria-hidden",
                "true"
            );

    }

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


    AMAZE
        .anticipationParticles
        .replaceChildren();


    const count =
        window.innerWidth < 600
            ? 25
            : 45;


    const fragment =
        document.createDocumentFragment();


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
            (
                Math.random() * .8
            ) + "s";


        fragment.appendChild(
            particle
        );

    }


    AMAZE
        .anticipationParticles
        .appendChild(
            fragment
        );

}


/* ==========================================================
   FINISH SPIN
========================================================== */

function finishSpin(result) {

    stopAnticipation();


    AMAZE.playing =
        false;


    if (
        AMAZE.button
    ) {

        AMAZE.button.disabled =
            false;

    }


    if (
        AMAZE.machine
    ) {

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


    /*
     * THREE IDENTICAL
     */

    if (
        a === b &&
        b === c
    ) {

        setMessage(
            "🎉 JACKPOT 🎉"
        );


        vibrationJackpot();


        collectPersistentReward();


        jackpot();


        return;

    }


    /*
     * ANY WINNING LINE:
     *
     * A === B
     * B === C
     * A === C
     */

    if (
        a === b ||
        b === c ||
        a === c
    ) {

        setMessage(
            "🔥 WIN!"
        );


        /*
         * Vibration specifically for
         * winning line.
         */

        vibrationWinLine();


        playSound(
            500,
            .25,
            "triangle",
            .06
        );


        setTimeout(
            () => {

                playSound(
                    700,
                    .16,
                    "square",
                    .04
                );

            },
            120
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


        vibrationJackpot();


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
            percentage + "%";

    }


    if (
        AMAZE.persistentValue
    ) {

        AMAZE.persistentValue.textContent =
            AMAZE.persistentCoins +
            " / " +
            AMAZE.persistentTarget;

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

    if (
        !AMAZE.persistentFill
    ) {

        return;

    }


    const parent =
        AMAZE.persistentFill.parentElement;


    if (
        !parent
    ) {

        return;

    }


    const count =
        jackpotReward
            ? 15
            : 5;


    const fragment =
        document.createDocumentFragment();


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
            (
                10 +
                Math.random() * 80
            ) + "%";


        coin.style.top =
            (
                Math.random() * 100
            ) + "%";


        coin.style.animationDelay =
            (
                Math.random() * .35
            ) + "s";


        fragment.appendChild(
            coin
        );


        setTimeout(
            () => {

                coin.remove();

            },
            1200
        );

    }


    parent.appendChild(
        fragment
    );

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


    if (
        AMAZE.counterValue
    ) {

        AMAZE.counterValue.textContent =
            AMAZE.attempts +
            " / " +
            AMAZE.maxSpins;

    }


    if (
        AMAZE.progressFill
    ) {

        AMAZE.progressFill.style.width =
            percentage + "%";

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

    if (
        AMAZE.roundStatus
    ) {

        AMAZE.roundStatus.textContent =
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

    catch (
        error
    ) {

        console.warn(
            "AmazeEscape: could not save state"
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


        if (
            !saved
        ) {

            return;

        }


        const state =
            JSON.parse(
                saved
            );


        if (
            !state
        ) {

            return;

        }


        /*
         * v6 state remains usable.
         * We deliberately keep the same storage key.
         */

        if (
            state.version !== "6.0" &&
            state.version !== "7.0"
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


        if (
            AMAZE.hold
        ) {

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

    catch (
        error
    ) {

        console.warn(
            "AmazeEscape: could not load state"
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

    if (
        AMAZE.hold
    ) {

        return;

    }


    AMAZE.hold =
        true;


    AMAZE.holdUntil =
        Date.now() +
        AMAZE.holdDuration *
        1000;


    /*
     * HOLD ENTER VIBRATION
     */

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

    if (
        !AMAZE.hold
    ) {

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
            percentage + "%";

    }


    if (
        remaining <= 0
    ) {

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

    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.add(
            "ice-mode"
        );

    }


    if (
        AMAZE.button
    ) {

        AMAZE.button.disabled =
            true;

    }


    AMAZE.slots.forEach(
        slot => {

            if (
                slot
            ) {

                slot.classList.remove(
                    "reel-spin"
                );

            }

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

}


/* ==========================================================
   SHOW HOLD
========================================================== */

function showHoldOverlay() {

    if (
        !AMAZE.holdOverlay
    ) {

        return;

    }


    AMAZE.holdOverlay.classList.add(
        "active"
    );


    AMAZE.holdOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    if (
        AMAZE.snowContainer
    ) {

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


    /*
     * HOLD EXIT VIBRATION
     */

    vibrationHoldExit();


    playSound(
        600,
        .12,
        "triangle",
        .04
    );


    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.remove(
            "ice-mode"
        );

    }


    if (
        AMAZE.holdOverlay
    ) {

        AMAZE.holdOverlay.classList.remove(
            "active"
        );

        AMAZE.holdOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (
        AMAZE.holdStatus
    ) {

        AMAZE.holdStatus.textContent =
            "ICE MODE COMPLETE";

    }


    if (
        AMAZE.button
    ) {

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

    vibrationJackpot();


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


    if (
        AMAZE.lamp
    ) {

        AMAZE.lamp.classList.add(
            "on"
        );

    }


    createCoins();

    createConfetti();


    AMAZE.slots.forEach(
        slot => {

            if (
                slot
            ) {

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

    if (
        AMAZE.lamp
    ) {

        AMAZE.lamp.classList.remove(
            "on"
        );

    }


    AMAZE.slots.forEach(
        slot => {

            if (
                slot
            ) {

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

    const fragment =
        document.createDocumentFragment();


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


        fragment.appendChild(
            coin
        );


        setTimeout(
            () => {

                coin.remove();

            },
            4000
        );

    }


    document.body.appendChild(
        fragment
    );

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


    const fragment =
        document.createDocumentFragment();


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


        fragment.appendChild(
            piece
        );


        setTimeout(
            () => {

                piece.remove();

            },
            4500
        );

    }


    document.body.appendChild(
        fragment
    );

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


    /*
     * Prevent duplicate background particles.
     */

    AMAZE.casinoBackground.replaceChildren();


    const count =
        window.innerWidth < 600
            ? 35
            : 65;


    const fragment =
        document.createDocumentFragment();


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
            (
                -Math.random() * 15
            ) + "s";


        fragment.appendChild(
            particle
        );

    }


    AMAZE
        .casinoBackground
        .appendChild(
            fragment
        );

}


/* ==========================================================
   SNOW PARTICLES
========================================================== */

function createSnowParticles() {

    if (
        !AMAZE.snowContainer
    ) {

        return;

    }


    AMAZE.snowContainer.replaceChildren();


    const count =
        window.innerWidth < 600
            ? 45
            : 80;


    const fragment =
        document.createDocumentFragment();


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
            (
                -Math.random() * 10
            ) + "s";


        fragment.appendChild(
            snow
        );

    }


    AMAZE
        .snowContainer
        .appendChild(
            fragment
        );

}


/* ==========================================================
   LEVER
========================================================== */

function leverPull() {

    if (
        !AMAZE.lever
    ) {

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


    if (
        AMAZE.button
    ) {

        AMAZE.button.disabled =
            true;

    }


    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.add(
            "round-complete"
        );

    }


    setMessage(
        "🏆 ROUND COMPLETE 🏆"
    );


    vibrationJackpot();


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


    if (
        AMAZE.machine
    ) {

        AMAZE.machine.classList.remove(
            "round-complete"
        );

    }


    if (
        AMAZE.button
    ) {

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
   PAGE VISIBILITY
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
            "AmazeEscape v7:",
            event.message
        );

    }
);


/* ==========================================================
   READY
========================================================== */

console.log(
    "🎰 AmazeEscape v7 READY"
);
