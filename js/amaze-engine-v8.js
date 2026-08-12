/* ==========================================================
   AMAZE GAMING
   ESCAPE ENGINE v8
   ENGINE
========================================================== */

"use strict";

/* ==========================================================
   CONFIG
========================================================== */

const AMAZE = {

    version: "8.0",

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

    reelHeight: 0,

    attempts: 0,

    round: 1,

    playing: false,

    hold: false,

    holdUntil: null,

    audio: null,

    slots: [],

    reels: [],

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

    storageKey:
        "AmazeEscape_v8_State"
};

/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeGame() {

    AMAZE.machine =
        document.getElementById(
            "machine"
        );

    AMAZE.button =
        document.getElementById(
            "button"
        );

    AMAZE.message =
        document.getElementById(
            "message"
        );

    AMAZE.counterValue =
        document.getElementById(
            "counterValue"
        );

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

    if (
        AMAZE.slots.length !== 3 ||
        AMAZE.slots.some(
            slot => !slot
        )
    ) {

        console.error(
            "AMAZE v8: Reel elements missing."
        );

        return;

    }

    if (AMAZE.button) {

        AMAZE.button.addEventListener(
            "click",
            spinGame
        );

    }

    createCasinoParticles();

    createSnowParticles();

    loadGameState();

    createReelDrums();

    updateProgress();

    updatePersistentProgress();

    updateRoundStatus();

    console.log(
        "🎰 AMAZE GAMING v8 loaded"
    );
}

/* ==========================================================
   CREATE REAL REEL DRUMS
========================================================== */

function createReelDrums() {

    AMAZE.reels = [];

    AMAZE.slots.forEach(
        (slot, reelIndex) => {

            if (!slot) {
                return;
            }

            slot.innerHTML = "";

            const reelData = {

                slot,

                index:
                    reelIndex,

                symbols: [],

                position: 0,

                offset: 0,

                spinning: false,

                animationFrame: null,

                targetIndex: 0,

                cellHeight: 70

            };

            /*
             * Long repeated strip.
             * This creates the visual impression
             * of a continuous casino drum.
             */

            const stripLength = 80;

            const fragment =
                document.createDocumentFragment();

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

                reelData.symbols.push(
                    symbol
                );

                const cell =
                    document.createElement(
                        "div"
                    );

                cell.className =
                    "reel-symbol";

                cell.textContent =
                    symbol;

                fragment.appendChild(
                    cell
                );
            }

            slot.appendChild(
                fragment
            );

            /*
             * Start with the center position
             * around the middle of the strip.
             */

            reelData.position = 30;

            reelData.offset =
                reelData.position *
                reelData.cellHeight;

            slot.style.transform =
                `translate3d(0, -${reelData.offset}px, 0)`;

            AMAZE.reels.push(
                reelData
            );

        }
    );

    requestAnimationFrame(
        updateReelGeometry
    );
}

/* ==========================================================
   REEL GEOMETRY
========================================================== */

function updateReelGeometry() {

    AMAZE.reels.forEach(
        reel => {

            const cell =
                reel.slot.querySelector(
                    ".reel-symbol"
                );

            if (!cell) {
                return;
            }

            reel.cellHeight =
                cell.getBoundingClientRect()
                    .height;

            reel.offset =
                reel.position *
                reel.cellHeight;

            reel.slot.style.transform =
                `translate3d(0, -${reel.offset}px, 0)`;
        }
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

        AMAZE.message.textContent =
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

        AMAZE.audio.resume()
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
            ctx.currentTime +
            duration
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
    catch (error) {

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
   SPIN
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

    getAudio();

    AMAZE.playing = true;

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

    spinAllReels();
}

/* ==========================================================
   SPIN ALL REELS
========================================================== */

function spinAllReels() {

    AMAZE.reels.forEach(
        (reel, index) => {

            reel.spinning = true;

            spinReelVisual(
                reel,
                1500 +
                index * 180
            );
        }
    );

    /*
     * Reel 1 stops first.
     */

    setTimeout(
        () => {

            const first =
                stopReel(
                    0
                );

            /*
             * Reel 2 stops second.
             */

            setTimeout(
                () => {

                    const second =
                        stopReel(
                            1
                        );

                    /*
                     * If first and second match,
                     * activate the full 2.5 sec
                     * final reel anticipation.
                     */

                    setTimeout(
                        () => {

                            if (
                                first ===
                                second
                            ) {

                                startAnticipation(
                                    () => {

                                        stopReel(
                                            2
                                        );

                                    }
                                );

                            }
                            else {

                                stopReel(
                                    2
                                );

                            }

                        },
                        350
                    );

                },
                550
            );

        },
        1000
    );
}

/* ==========================================================
   CONTINUOUS REEL VISUAL MOTION
========================================================== */

function spinReelVisual(
    reel,
    duration
) {

    reel.spinning = true;

    reel.slot.classList.add(
        "reel-spin"
    );

    const start =
        performance.now();

    const startPosition =
        reel.position;

    const rotations =
        22 +
        reel.index * 3;

    const target =
        startPosition +
        rotations;

    function animate(
        now
    ) {

        if (!reel.spinning) {
            return;
        }

        const elapsed =
            now - start;

        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );

        /*
         * Continuous fast motion.
         * Slight acceleration/deceleration
         * gives a mechanical slot feel.
         */

        const eased =
            progress < .15
                ? progress / .15 * .15
                : progress > .8
                    ? .8 +
                      (
                          progress - .8
                      ) /
                      .2 *
                      .2
                    : progress;

        reel.offset =
            (
                startPosition +
                (
                    target -
                    startPosition
                ) *
                eased
            ) *
            reel.cellHeight;

        reel.slot.style.transform =
            `translate3d(0, -${reel.offset}px, 0)`;

        if (
            progress < 1
        ) {

            reel.animationFrame =
                requestAnimationFrame(
                    animate
                );

        }
        else {

            reel.position =
                target;
        }
    }

    reel.animationFrame =
        requestAnimationFrame(
            animate
        );
}

/* ==========================================================
   STOP ONE REEL
========================================================== */

function stopReel(index) {

    const reel =
        AMAZE.reels[index];

    if (!reel) {
        return null;
    }

    reel.spinning = false;

    if (
        reel.animationFrame
    ) {

        cancelAnimationFrame(
            reel.animationFrame
        );
    }

    /*
     * Pick the final symbol.
     */

    const symbol =
        randomSymbol();

    const symbolIndex =
        AMAZE.symbols.indexOf(
            symbol
        );

    /*
     * Keep the reel away from the
     * end of the strip.
     */

    let base =
        Math.floor(
            reel.position
        );

    if (
        base >
        55
    ) {

        base =
            30;
    }

    /*
     * We align the selected symbol
     * exactly on the center line.
     */

    const targetPosition =
        base +
        (
            symbolIndex -
            (
                base %
                AMAZE.symbols.length
            )
        );

    /*
     * Add a few physical rotations
     * before final alignment.
     */

    const finalPosition =
        targetPosition +
        (
            Math.ceil(
                (
                    reel.position -
                    targetPosition
                ) / 6
            ) * 6
        );

    const startOffset =
        reel.offset;

    const endOffset =
        finalPosition *
        reel.cellHeight;

    const startTime =
        performance.now();

    const stopDuration =
        420 +
        index * 90;

    reel.slot.classList.remove(
        "reel-spin"
    );

    reel.slot.classList.add(
        "reel-stop"
    );

    function settle(now) {

        const elapsed =
            now -
            startTime;

        const progress =
            Math.min(
                elapsed /
                stopDuration,
                1
            );

        /*
         * Cubic ease-out.
         */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const offset =
            startOffset +
            (
                endOffset -
                startOffset
            ) *
            eased;

        reel.offset =
            offset;

        reel.slot.style.transform =
            `translate3d(0, -${offset}px, 0)`;

        if (
            progress < 1
        ) {

            requestAnimationFrame(
                settle
            );

        }
        else {

            reel.position =
                finalPosition;

            /*
             * Snap exactly to the selected
             * symbol position.
             */

            reel.offset =
                finalPosition *
                reel.cellHeight;

            reel.slot.style.transform =
                `translate3d(0, -${reel.offset}px, 0)`;

            playSound(
                700 -
                index * 120,
                .08,
                "square",
                .04
            );

            markCenterSymbol(
                reel
            );
        }
    }

    requestAnimationFrame(
        settle
    );

    return symbol;
}

/* ==========================================================
   CENTER SYMBOL
========================================================== */

function markCenterSymbol(
    reel
) {

    const cells =
        reel.slot.querySelectorAll(
            ".reel-symbol"
        );

    cells.forEach(
        cell => {

            cell.classList.remove(
                "center-symbol"
            );

        }
    );

    const index =
        Math.round(
            reel.position
        );

    if (
        cells[index]
    ) {

        cells[index].classList.add(
            "center-symbol"
        );
    }
}

/* ==========================================================
   ANTICIPATION
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

    if (
        AMAZE.anticipationOverlay
    ) {

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
     * Final reel continues to spin
     * during the entire anticipation.
     */

    const reel =
        AMAZE.reels[2];

    if (reel) {

        if (
            !reel.spinning
        ) {

            spinReelVisual(
                reel,
                999999
            );
        }

    }

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

    if (AMAZE.machine) {

        AMAZE.machine.classList.remove(
            "anticipation-mode"
        );
    }

    if (
        AMAZE.anticipationOverlay
    ) {

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

    const parent =
        slot.parentElement;

    if (!parent) {
        return;
    }

    parent.style.position =
        "relative";

    const fire =
        document.createElement(
            "div"
        );

    fire.className =
        "final-reel-fire";

    parent.appendChild(
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
            ) +
            "px"
        );

        flame.style.setProperty(
            "--fire-left",
            (
                8 +
                Math.random() * 84
            ) +
            "%"
        );

        flame.style.setProperty(
            "--fire-bottom",
            (
                -12 +
                Math.random() * 25
            ) +
            "px"
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
            ) +
            "deg"
        );

        flame.style.setProperty(
            "--fire-duration",
            (
                .18 +
                Math.random() * .3
            ) +
            "s"
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
            ) +
            "px"
        );

        particle.style.setProperty(
            "--particle-left",
            Math.random() *
            100 +
            "%"
        );

        particle.style.setProperty(
            "--particle-bottom",
            Math.random() *
            50 +
            "%"
        );

        particle.style.setProperty(
            "--particle-drift",
            (
                -70 +
                Math.random() * 140
            ) +
            "px"
        );

        particle.style.setProperty(
            "--particle-rise",
            (
                -80 -
                Math.random() * 130
            ) +
            "px"
        );

        particle.style.setProperty(
            "--particle-duration",
            (
                .5 +
                Math.random() * .9
            ) +
            "s"
        );

        particle.style.setProperty(
            "--particle-delay",
            -Math.random() *
            1.2 +
            "s"
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
            element => {

                element.remove();
            }
        );
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

    AMAZE.anticipationParticles
        .innerHTML = "";

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
            Math.random() *
            100 +
            "%";

        particle.style.setProperty(
            "--drift",
            (
                -150 +
                Math.random() * 300
            ) +
            "px"
        );

        particle.style.setProperty(
            "--duration",
            (
                1 +
                Math.random() * 1.5
            ) +
            "s"
        );

        particle.style.animationDelay =
            Math.random() *
            .8 +
            "s";

        AMAZE.anticipationParticles
            .appendChild(
                particle
            );
    }
}

/* ==========================================================
   FINISH SPIN
========================================================== */

function finishSpin(
    result
) {

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
   GET CURRENT RESULT
========================================================== */

function getReelResult(
    reel
) {

    const position =
        Math.round(
            reel.position
        );

    const symbolIndex =
        (
            (
                position %
                AMAZE.symbols.length
            ) +
            AMAZE.symbols.length
        ) %
        AMAZE.symbols.length;

    return AMAZE.symbols[
        symbolIndex
    ];
}

/* ==========================================================
   RESULT
========================================================== */

function checkResult(
    result
) {

    /*
     * Safety fallback:
     * derive actual center symbols
     * from the drums.
     */

    if (
        !result ||
        result.length !== 3
    ) {

        result =
            AMAZE.reels.map(
                getReelResult
            );
    }

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
   IMPORTANT FINALIZATION
========================================================== */

function finalizeCurrentSpin() {

    const result =
        AMAZE.reels.map(
            getReelResult
        );

    finishSpin(
        result
    );
}

/*
 * The third reel is the final reel.
 * Patch stopReel completion so the game
 * ends only after reel 3 has physically settled.
 */

const originalStopReel =
    stopReel;

/*
 * Replace with wrapped version.
 */

stopReel =
    function(index) {

        const result =
            originalStopReel(
                index
            );

        if (index === 2) {

            /*
             * Wait for final settling.
             */

            setTimeout(
                finalizeCurrentSpin,
                500
            );
        }

        return result;
    };

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
            (
                10 +
                Math.random() * 80
            ) +
            "%";

        coin.style.top =
            Math.random() *
            100 +
            "%";

        coin.style.animationDelay =
            Math.random() *
            .35 +
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
   SAVE
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
            "AMAZE v8 save error",
            error
        );
    }
}

/* ==========================================================
   LOAD
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
            JSON.parse(
                saved
            );

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

            AMAZE.attempts = 0;

            AMAZE.round++;

            AMAZE.hold = false;

            AMAZE.holdUntil = null;
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
            "AMAZE v8 load error",
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
            remaining /
            1000
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
                ) *
                100
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
   FREEZE
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

    AMAZE.reels.forEach(
        reel => {

            reel.spinning =
                false;

            if (
                reel.animationFrame
            ) {

                cancelAnimationFrame(
                    reel.animationFrame
                );
            }

            reel.slot.classList.remove(
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
        AMAZE.snowContainer
    ) {

        AMAZE.snowContainer.classList.remove(
            "active"
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

    if (
        AMAZE.lamp
    ) {

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
            Math.random() *
            100 +
            "vw";

        coin.style.animationDelay =
            Math.random() *
            1.5 +
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
            Math.random() *
            100 +
            "vw";

        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        piece.style.animationDelay =
            Math.random() *
            1.5 +
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
            Math.random() *
            100 +
            "%";

        particle.style.setProperty(
            "--duration",
            (
                8 +
                Math.random() * 14
            ) +
            "s"
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
            ) +
            "px"
        );

        const size =
            2 +
            Math.random() * 5;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        particle.style.animationDelay =
            -Math.random() *
            15 +
            "s";

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
            Math.random() *
            100 +
            "%";

        snow.style.setProperty(
            "--size",
            (
                3 +
                Math.random() * 9
            ) +
            "px"
        );

        snow.style.setProperty(
            "--duration",
            (
                5 +
                Math.random() * 8
            ) +
            "s"
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
            ) +
            "px"
        );

        snow.style.animationDelay =
            -Math.random() *
            10 +
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
   COMPLETE ROUND
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
   RESIZE
========================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            !AMAZE.playing &&
            !AMAZE.hold
        ) {

            updateReelGeometry();
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
            "AMAZE GAMING v8:",
            event.message
        );

    }
);

/* ==========================================================
   READY
========================================================== */

console.log(
    "🎰 AMAZE GAMING v8 READY"
);
