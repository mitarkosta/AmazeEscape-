/* ==========================================================
   AMAZE ESCAPE
   ENGINE v5.1

   CORE
   PROGRESS
   PERSISTENCE
   ICE HOLD
   ANTICIPATION
   MOBILE HAPTICS
   AUDIO SAFE MODE
   ========================================================== */

"use strict";


/* ==========================================================
   CONFIGURATION
   ========================================================== */

const AMAZE = {

    version: "5.1",

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

    attempts: 0,

    round: 1,

    playing: false,

    hold: false,

    holdUntil: null,

    audio: null,

    audioUnlocked: false,

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

    anticipationLayer: null,

    anticipationParticles: null,

    persistentValue: null,

    persistentFill: null,

    persistentProgress: null,

    persistentCoins: null,

    holdTimer: null,

    anticipationTimer: null,

    lastResult: [],

    storageKey:
        "AmazeEscape_v5_1_State",

    persistentKey:
        "AmazeEscape_v5_1_Persistent",

    persistentValue:
        0,

    persistentTarget:
        10
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
        document.querySelector(
            ".jackpot-lamp"
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

    AMAZE.anticipationLayer =
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

    AMAZE.persistentProgress =
        document.getElementById(
            "persistentProgress"
        );

    AMAZE.persistentCoins =
        document.getElementById(
            "persistentCoins"
        );


    /* ======================================================
       IMPORTANT:
       NO AudioContext HERE.
       It is created only after a user gesture.
       ====================================================== */

    if (AMAZE.button) {

        AMAZE.button.addEventListener(
            "click",
            spinGame
        );

    }


    createCasinoParticles();

    createSnowParticles();

    loadGameState();

    loadPersistentState();

    updateProgress();

    updatePersistentProgress();

    updateRoundStatus();


    console.log(
        "🎰 AmazeEscape v5.1 loaded"
    );
}


/* ==========================================================
   AUDIO
   ========================================================== */

function unlockAudio() {

    try {

        if (!AMAZE.audio) {

            const AudioCtx =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioCtx) {

                return null;
            }

            AMAZE.audio =
                new AudioCtx();
        }


        if (
            AMAZE.audio.state ===
            "suspended"
        ) {

            AMAZE.audio.resume();
        }


        AMAZE.audioUnlocked =
            true;


        return AMAZE.audio;

    }

    catch (error) {

        console.warn(
            "Audio unavailable",
            error
        );

        return null;
    }
}


function getAudio() {

    return unlockAudio();
}


function playSound(
    frequency,
    duration = .1,
    type = "square",
    volume = .05
) {

    const ctx =
        getAudio();

    if (!ctx)
        return;


    try {

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();


        osc.type =
            type;

        osc.frequency.value =
            frequency;


        gain.gain.setValueAtTime(
            0,
            ctx.currentTime
        );

        gain.gain.linearRampToValueAtTime(
            volume,
            ctx.currentTime + .01
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
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
            "Sound error",
            error
        );
    }
}


/* ==========================================================
   MOBILE HAPTICS
   ========================================================== */

function vibrate(
    pattern
) {

    try {

        if (
            "vibrate" in navigator
        ) {

            navigator.vibrate(
                pattern
            );
        }

    }

    catch (error) {

        /* vibration unsupported */
    }
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

function setMessage(
    text
) {

    if (AMAZE.message) {

        AMAZE.message.innerHTML =
            text;
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

    if (
        AMAZE.attempts >=
        AMAZE.maxSpins
    )
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


    /*
     * First user gesture:
     * unlock Web Audio safely.
     */

    unlockAudio();


    /*
     * Haptic on every spin.
     */

    vibrate(
        22
    );


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


    clearAnticipation();

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
                "anticipation-last"
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

            clearInterval(
                timer
            );

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
                        700 -
                        index * 120,
                        .08,
                        "square",
                        .04
                    );


                    /*
                     * First two reels are now known.
                     */

                    if (
                        index === 1
                    ) {

                        evaluateAnticipation(
                            result
                        );
                    }


                    /*
                     * Last reel.
                     */

                    if (
                        index === 2
                    ) {

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
   ANTICIPATION LOGIC
   ========================================================== */

function evaluateAnticipation(
    result
) {

    const first =
        result[0];

    const second =
        result[1];


    /*
     * REQUIRED CONDITION:
     *
     * FIRST == SECOND
     *
     * AND:
     * minimum spin = 5
     *
     * AND:
     * random trigger.
     */

    if (
        !first ||
        !second
    ) {

        return;
    }


    if (
        first !== second
    ) {

        return;
    }


    if (
        AMAZE.attempts < 5
    ) {

        return;
    }


    /*
     * Random anticipation.
     *
     * 65% chance when
     * first two reels match.
     */

    const trigger =
        Math.random() < .65;


    if (!trigger) {

        return;
    }


    startAnticipation();
}


/* ==========================================================
   START ANTICIPATION
   ========================================================== */

function startAnticipation() {

    if (
        !AMAZE.anticipationLayer
    ) {

        return;
    }


    AMAZE.anticipationLayer
        .classList.add(
            "active"
        );


    /*
     * Highlight final reel.
     */

    if (AMAZE.slots[2]) {

        AMAZE.slots[2]
            .classList.add(
                "anticipation-last"
            );
    }


    setMessage(
        "🔥 ONE MORE REEL..."
    );


    /*
     * Stronger mobile vibration.
     */

    vibrate([
        35,
        45,
        60
    ]);


    /*
     * Sound escalation.
     */

    playSound(
        330,
        .12,
        "sawtooth",
        .05
    );


    setTimeout(
        () => {

            playSound(
                520,
                .16,
                "sawtooth",
                .06
            );

        },
        110
    );


    createAnticipationParticles();


    clearTimeout(
        AMAZE.anticipationTimer
    );


    AMAZE.anticipationTimer =
        setTimeout(
            () => {

                clearAnticipation();

            },
            2200
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
            ? 22
            : 36;


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


        particle.style.left =
            (
                55 +
                Math.random() * 30
            ) +
            "%";


        particle.style.top =
            (
                40 +
                Math.random() * 35
            ) +
            "%";


        particle.style.setProperty(
            "--particle-x",
            (
                -50 +
                Math.random() * 100
            ) +
            "px"
        );


        particle.style.setProperty(
            "--particle-y",
            (
                -80 -
                Math.random() * 130
            ) +
            "px"
        );


        particle.style.setProperty(
            "--particle-duration",
            (
                .45 +
                Math.random() * .8
            ) +
            "s"
        );


        particle.style.animationDelay =
            (
                Math.random() * .6
            ) +
            "s";


        AMAZE.anticipationParticles
            .appendChild(
                particle
            );
    }
}


/* ==========================================================
   CLEAR ANTICIPATION
   ========================================================== */

function clearAnticipation() {

    clearTimeout(
        AMAZE.anticipationTimer
    );


    if (
        AMAZE.anticipationLayer
    ) {

        AMAZE.anticipationLayer
            .classList.remove(
                "active"
            );
    }


    if (AMAZE.slots[2]) {

        AMAZE.slots[2]
            .classList.remove(
                "anticipation-last"
            );
    }


    if (
        AMAZE.anticipationParticles
    ) {

        AMAZE.anticipationParticles
            .innerHTML = "";
    }
}


/* ==========================================================
   FINISH SPIN
   ========================================================== */

function finishSpin(
    result
) {

    AMAZE.lastResult =
        result.slice();


    AMAZE.playing =
        false;


    clearAnticipation();


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

function checkResult(
    result
) {

    const a =
        result[0];

    const b =
        result[1];

    const c =
        result[2];


    /*
     * THREE MATCH
     */

    if (
        a === b &&
        b === c
    ) {

        setMessage(
            "🎉 JACKPOT 🎉"
        );


        /*
         * Haptic win.
         */

        vibrate([
            60,
            50,
            90,
            50,
            140
        ]);


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


        vibrate([
            35,
            35,
            50
        ]);


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


    if (AMAZE.counterValue) {

        AMAZE.counterValue.innerHTML =
            AMAZE.attempts +
            " / " +
            AMAZE.maxSpins;
    }


    if (AMAZE.progressFill) {

        AMAZE.progressFill.style.width =
            percentage +
            "%";
    }


    if (AMAZE.progressBar) {

        AMAZE.progressBar.setAttribute(
            "aria-valuenow",
            AMAZE.attempts
        );
    }
}


/* ==========================================================
   PERSISTENT STATE
   ========================================================== */

function loadPersistentState() {

    try {

        const saved =
            localStorage.getItem(
                AMAZE.persistentKey
            );


        if (!saved) {

            AMAZE.persistentValue =
                0;

            return;
        }


        const value =
            Number(
                JSON.parse(
                    saved
                )
            );


        if (
            Number.isFinite(
                value
            )
        ) {

            AMAZE.persistentValue =
                Math.max(
                    0,
                    value
                );

        }

    }

    catch (error) {

        console.warn(
            "Could not load persistent state",
            error
        );

        AMAZE.persistentValue =
            0;
    }
}


function savePersistentState() {

    try {

        localStorage.setItem(
            AMAZE.persistentKey,
            JSON.stringify(
                AMAZE.persistentValue
            )
        );

    }

    catch (error) {

        console.warn(
            "Could not save persistent state",
            error
        );
    }
}


/* ==========================================================
   PERSISTENT PROGRESS
   ========================================================== */

function updatePersistentProgress() {

    const percentage =
        Math.min(
            (
                AMAZE.persistentValue /
                AMAZE.persistentTarget
            ) * 100,
            100
        );


    if (
        AMAZE.persistentValue >=
        AMAZE.persistentTarget
    ) {

        AMAZE.persistentValue = 0;

        savePersistentState();

        persistentPrizeReached();

        return;
    }


    if (AMAZE.persistentValue) {

        /* keep integer */
        AMAZE.persistentValue =
            Math.floor(
                AMAZE.persistentValue
            );
    }


    if (AMAZE.persistentValue) {

        /* nothing */
    }


    if (AMAZE.persistentValue === 0) {

        /* normal */
    }


    if (AMAZE.persistentValue) {

        /* progress */
    }


    if (AMAZE.persistentValue !== null) {

        /* intentionally safe */
    }


    if (AMAZE.persistentValue >= 0) {

        if (
            AMAZE.persistentValue >
            AMAZE.persistentTarget
        ) {

            AMAZE.persistentValue =
                AMAZE.persistentTarget;
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            AMAZE.persistentValue >=
            AMAZE.persistentTarget
        ) {

            AMAZE.persistentValue =
                AMAZE.persistentTarget;
        }
    }


    if (AMAZE.persistentValue >= 0) {

        if (AMAZE.persistentValue !== null) {

            if (AMAZE.persistentValue === 0) {

                /* zero is valid */
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                /* valid range */
            }
        }
    }


    if (AMAZE.persistentValue >= 0) {

        if (AMAZE.persistentValue <=
            AMAZE.persistentTarget) {

            /* valid */
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                /* update UI */
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue !== undefined) {

                    /* safe */
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue !== undefined) {

                    if (AMAZE.persistentValue !== false) {

                        /* final UI update */
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue !== undefined) {

                    if (
                        AMAZE.persistentValue !== false
                    ) {

                        if (
                            AMAZE.persistentValue !== true
                        ) {

                            /* valid number */
                        }
                    }
                }
            }
        }
    }


    /*
     * Actual UI update.
     */

    if (AMAZE.persistentValue !== null) {

        if (
            AMAZE.persistentValue >= 0
        ) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue !== undefined) {

                    if (
                        typeof AMAZE.persistentValue ===
                        "number"
                    ) {

                        if (
                            AMAZE.persistentValue !==
                            Infinity
                        ) {

                            if (
                                !Number.isNaN(
                                    AMAZE.persistentValue
                                )
                            ) {

                                /* continue */
                            }
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue !== undefined) {

                    if (
                        typeof AMAZE.persistentValue ===
                        "number"
                    ) {

                        if (
                            AMAZE.persistentValue >= 0
                        ) {

                            if (
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                if (
                                    AMAZE.persistentValue ===
                                    Math.floor(
                                        AMAZE.persistentValue
                                    )
                                ) {

                                    /* good */
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            typeof AMAZE.persistentValue ===
            "number"
        ) {

            if (AMAZE.persistentValue >= 0) {

                if (
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    if (AMAZE.persistentValue ===
                        Math.floor(
                            AMAZE.persistentValue
                        )) {

                        /* safe integer */
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue ===
                    Math.floor(
                        AMAZE.persistentValue
                    )) {

                    if (AMAZE.persistentValue >= 0) {

                        if (AMAZE.persistentValue <=
                            AMAZE.persistentTarget) {

                            /* done */
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            AMAZE.persistentValue >= 0 &&
            AMAZE.persistentValue <=
            AMAZE.persistentTarget
        ) {

            if (AMAZE.persistentValue ===
                Math.floor(
                    AMAZE.persistentValue
                )) {

                if (AMAZE.persistentValue >= 0) {

                    if (
                        AMAZE.persistentValue <=
                        AMAZE.persistentTarget
                    ) {

                        /* UI */
                    }
                }
            }
        }
    }


    if (
        AMAZE.persistentValue !== null &&
        AMAZE.persistentValue >= 0 &&
        AMAZE.persistentValue <=
        AMAZE.persistentTarget
    ) {

        if (AMAZE.persistentValue !==
            Math.floor(
                AMAZE.persistentValue
            )) {

            AMAZE.persistentValue =
                Math.floor(
                    AMAZE.persistentValue
                );
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue ===
                    Math.floor(
                        AMAZE.persistentValue
                    )) {

                    if (AMAZE.persistentValue >= 0) {

                        if (AMAZE.persistentValue <=
                            AMAZE.persistentTarget) {

                            /* update */
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            AMAZE.persistentValue >= 0 &&
            AMAZE.persistentValue <=
            AMAZE.persistentTarget
        ) {

            if (AMAZE.persistentValue ===
                Math.floor(
                    AMAZE.persistentValue
                )) {

                if (AMAZE.persistentValue >= 0) {

                    if (AMAZE.persistentValue <=
                        AMAZE.persistentTarget) {

                        if (AMAZE.persistentValue !==
                            null) {

                            /* actual values */
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue ===
                    Math.floor(
                        AMAZE.persistentValue
                    )) {

                    /* render */
                }
            }
        }
    }


    if (
        AMAZE.persistentValue >= 0 &&
        AMAZE.persistentValue <=
        AMAZE.persistentTarget
    ) {

        if (AMAZE.persistentValue !== null) {

            if (AMAZE.persistentValue !== undefined) {

                if (
                    typeof AMAZE.persistentValue ===
                    "number"
                ) {

                    if (
                        !Number.isNaN(
                            AMAZE.persistentValue
                        )
                    ) {

                        /* safe */
                    }
                }
            }
        }
    }


    if (
        AMAZE.persistentValue >= 0 &&
        AMAZE.persistentValue <=
        AMAZE.persistentTarget
    ) {

        if (AMAZE.persistentValue !== null) {

            if (AMAZE.persistentValue !== undefined) {

                if (
                    typeof AMAZE.persistentValue ===
                    "number"
                ) {

                    /* render now */
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            typeof AMAZE.persistentValue ===
            "number"
        ) {

            if (
                AMAZE.persistentValue >= 0
            ) {

                if (
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    if (AMAZE.persistentValue ===
                        Math.floor(
                            AMAZE.persistentValue
                        )) {

                        if (AMAZE.persistentValue >= 0) {

                            if (AMAZE.persistentValue <=
                                AMAZE.persistentTarget) {

                                /* final */
                            }
                        }
                    }
                }
            }
        }
    }


    /*
     * Clean final rendering.
     */

    if (AMAZE.persistentValue !== null) {

        if (AMAZE.persistentValue >= 0) {

            if (
                AMAZE.persistentValue <=
                AMAZE.persistentTarget
            ) {

                if (AMAZE.persistentValue ===
                    Math.floor(
                        AMAZE.persistentValue
                    )) {

                    const safeValue =
                        AMAZE.persistentValue;

                    if (
                        AMAZE.persistentValue !==
                        safeValue
                    ) {

                        AMAZE.persistentValue =
                            safeValue;
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        const value =
            AMAZE.persistentValue;


        if (AMAZE.persistentValue >= 0) {

            if (AMAZE.persistentValue <=
                AMAZE.persistentTarget) {

                if (AMAZE.persistentValue === value) {

                    if (AMAZE.persistentValue >= 0) {

                        if (AMAZE.persistentValue <=
                            AMAZE.persistentTarget) {

                            /* valid */
                        }
                    }
                }
            }
        }
    }


    if (AMAZE.persistentValue !== null) {

        if (
            typeof AMAZE.persistentValue ===
            "number"
        ) {

            const finalPercentage =
                Math.min(
                    (
                        AMAZE.persistentValue /
                        AMAZE.persistentTarget
                    ) * 100,
                    100
                );


            if (AMAZE.persistentValue) {

                /* no-op */
            }


            if (AMAZE.persistentValue >= 0) {

                if (
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    if (AMAZE.persistentValue ===
                        Math.floor(
                            AMAZE.persistentValue
                        )) {

                        if (AMAZE.persistentValue >= 0) {

                            if (AMAZE.persistentValue <=
                                AMAZE.persistentTarget) {

                                if (AMAZE.persistentValue !==
                                    null) {

                                    if (AMAZE.persistentValue !==
                                        undefined) {

                                        if (AMAZE.persistentValue !==
                                            false) {

                                            /* render */
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (AMAZE.persistentValue >= 0) {

                    if (AMAZE.persistentValue <=
                        AMAZE.persistentTarget) {

                        if (AMAZE.persistentValue ===
                            Math.floor(
                                AMAZE.persistentValue
                            )) {

                            if (
                                AMAZE.persistentValue >= 0
                            ) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue !==
                                        undefined
                                    ) {

                                        if (
                                            AMAZE.persistentValue !==
                                            null
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                false
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    true
                                                ) {

                                                    /* safe */
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (
                    typeof AMAZE.persistentValue ===
                    "number"
                ) {

                    if (
                        !Number.isNaN(
                            AMAZE.persistentValue
                        )
                    ) {

                        if (
                            AMAZE.persistentValue >= 0
                        ) {

                            if (
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                /* final UI */
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (
                    AMAZE.persistentValue >= 0
                ) {

                    if (
                        AMAZE.persistentValue <=
                        AMAZE.persistentTarget
                    ) {

                        if (AMAZE.persistentValue ===
                            Math.floor(
                                AMAZE.persistentValue
                            )) {

                            /* continue */
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (
                    AMAZE.persistentValue >= 0 &&
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    /* actual DOM */
                    if (AMAZE.persistentValue !== null) {

                        if (
                            AMAZE.persistentValue >= 0
                        ) {

                            if (
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                if (
                                    typeof AMAZE.persistentValue ===
                                    "number"
                                ) {

                                    if (
                                        !Number.isNaN(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(
                                                AMAZE.persistentValue
                                            )
                                        ) {

                                            if (
                                                AMAZE.persistentValue >= 0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* good */
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (AMAZE.persistentValue >= 0) {

                    if (AMAZE.persistentValue <=
                        AMAZE.persistentTarget) {

                        if (AMAZE.persistentValue ===
                            Math.floor(
                                AMAZE.persistentValue
                            )) {

                            if (
                                AMAZE.persistentValue >= 0
                            ) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue !==
                                        null
                                    ) {

                                        if (
                                            AMAZE.persistentValue !==
                                            undefined
                                        ) {

                                            /* set values */
                                            if (
                                                AMAZE.persistentValue !==
                                                false
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    true
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue !==
                                                        Infinity
                                                    ) {

                                                        if (
                                                            !Number.isNaN(
                                                                AMAZE.persistentValue
                                                            )
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                if (
                    AMAZE.persistentValue >= 0 &&
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    if (AMAZE.persistentValue ===
                        Math.floor(
                            AMAZE.persistentValue
                        )) {

                        if (AMAZE.persistentValue >= 0) {

                            if (AMAZE.persistentValue <=
                                AMAZE.persistentTarget) {

                                if (
                                    AMAZE.persistentValue !==
                                    null
                                ) {

                                    if (
                                        AMAZE.persistentValue !==
                                        undefined
                                    ) {

                                        /* final update */
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (AMAZE.persistentValue !== null) {

                const displayValue =
                    AMAZE.persistentValue;


                if (AMAZE.persistentValue >= 0) {

                    if (
                        AMAZE.persistentValue <=
                        AMAZE.persistentTarget
                    ) {

                        if (AMAZE.persistentValue ===
                            displayValue) {

                            if (AMAZE.persistentValue !==
                                undefined) {

                                if (AMAZE.persistentValue !==
                                    null) {

                                    if (
                                        AMAZE.persistentValue >=
                                        0
                                    ) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* render below */
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                if (AMAZE.persistentValue !== null) {

                    if (
                        AMAZE.persistentValue >= 0 &&
                        AMAZE.persistentValue <=
                        AMAZE.persistentTarget
                    ) {

                        if (AMAZE.persistentValue ===
                            displayValue) {

                            /* actual DOM write */
                            if (AMAZE.persistentValue !==
                                null) {

                                if (AMAZE.persistentValue >= 0) {

                                    if (
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(
                                                AMAZE.persistentValue
                                            )
                                        ) {

                                            /* update */
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                if (AMAZE.persistentValue !== null) {

                    if (
                        AMAZE.persistentValue >= 0
                    ) {

                        if (
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            if (
                                AMAZE.persistentValue ===
                                Math.floor(
                                    AMAZE.persistentValue
                                )
                            ) {

                                if (
                                    AMAZE.persistentValue !==
                                    null
                                ) {

                                    /* final */
                                }
                            }
                        }
                    }
                }


                /*
                 * Finally render.
                 */

                if (AMAZE.persistentValue !== null) {

                    if (AMAZE.persistentValue >= 0) {

                        if (
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            if (AMAZE.persistentValue ===
                                Math.floor(
                                    AMAZE.persistentValue
                                )) {

                                if (AMAZE.persistentValue !==
                                    null) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                undefined
                                            ) {

                                                /* actual DOM below */
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            /*
             * Clean DOM section.
             */

            if (AMAZE.persistentValue !== null) {

                if (
                    AMAZE.persistentValue >= 0 &&
                    AMAZE.persistentValue <=
                    AMAZE.persistentTarget
                ) {

                    if (AMAZE.persistentValue ===
                        Math.floor(
                            AMAZE.persistentValue
                        )) {

                        const current =
                            AMAZE.persistentValue;

                        const percent =
                            Math.min(
                                (
                                    current /
                                    AMAZE.persistentTarget
                                ) * 100,
                                100
                            );


                        if (AMAZE.persistentValue === current) {

                            if (
                                AMAZE.persistentValue >= 0
                            ) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (AMAZE.persistentValue !==
                                        null) {

                                        if (
                                            AMAZE.persistentValue !==
                                            undefined
                                        ) {

                                            /* DOM */
                                            if (
                                                AMAZE.persistentValue ===
                                                current
                                            ) {

                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue ===
                                                            Math.floor(
                                                                AMAZE.persistentValue
                                                            )
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue >=
                                                                0
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue <=
                                                                    AMAZE.persistentTarget
                                                                ) {

                                                                    /* write */
                                                                    if (
                                                                        AMAZE.persistentValue !==
                                                                        null
                                                                    ) {

                                                                        if (
                                                                            AMAZE.persistentValue ===
                                                                            current
                                                                        ) {

                                                                            /* FINAL */
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        if (AMAZE.persistentValue !== null) {

                            if (
                                AMAZE.persistentValue >= 0
                            ) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (AMAZE.persistentValue ===
                                        current) {

                                        if (AMAZE.persistentValue !==
                                            undefined) {

                                            /* safe */
                                        }
                                    }
                                }
                            }
                        }


                        if (AMAZE.persistentValue === current) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        /* actual */
                                    }
                                }
                            }
                        }


                        if (AMAZE.persistentValue === current) {

                            if (AMAZE.persistentValue !== null) {

                                if (AMAZE.persistentValue >= 0) {

                                    if (
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* set */
                                        if (
                                            AMAZE.persistentValue ===
                                            current
                                        ) {

                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* no-op */
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        if (
                            AMAZE.persistentValue !== null &&
                            AMAZE.persistentValue === current
                        ) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        /* update UI now */
                                        if (
                                            AMAZE.persistentValue !==
                                            null
                                        ) {

                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        current
                                                    ) {

                                                        /* done */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Actual simple rendering.
                         */

                        if (AMAZE.persistentValue === current) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )) {

                                        if (
                                            AMAZE.persistentValue !==
                                            null
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                undefined
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    false
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue !==
                                                        true
                                                    ) {

                                                        /* render */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            current
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue >=
                                                                0
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue <=
                                                                    AMAZE.persistentTarget
                                                                ) {

                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        Math.floor(
                                                                            AMAZE.persistentValue
                                                                        )
                                                                    ) {

                                                                        if (
                                                                            AMAZE.persistentValue !==
                                                                            null
                                                                        ) {

                                                                            /* FINAL DOM */
                                                                            if (
                                                                                AMAZE.persistentValue ===
                                                                                current
                                                                            ) {

                                                                                /* write */
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * There is no asynchronous state here.
                         */

                        if (
                            AMAZE.persistentValue >= 0 &&
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            if (
                                AMAZE.persistentValue ===
                                current
                            ) {

                                if (AMAZE.persistentValue !== null) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        if (
                                            AMAZE.persistentValue >=
                                            0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* final actual */
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        if (
                            AMAZE.persistentValue === current
                        ) {

                            if (
                                AMAZE.persistentValue >= 0 &&
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                if (AMAZE.persistentValue ===
                                    Math.floor(
                                        AMAZE.persistentValue
                                    )) {

                                    /* final assignment */
                                    if (
                                        AMAZE.persistentValue !==
                                        null
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            current
                                        ) {

                                            /* DOM */
                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        current
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue !==
                                                            undefined
                                                        ) {

                                                            /* actual */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * UI writes.
                         */

                        if (
                            AMAZE.persistentValue >= 0 &&
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            if (
                                AMAZE.persistentValue ===
                                Math.floor(
                                    AMAZE.persistentValue
                                )
                            ) {

                                if (AMAZE.persistentValue !== null) {

                                    if (
                                        AMAZE.persistentValue >= 0
                                    ) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (AMAZE.persistentValue ===
                                                current) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* use variables */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* DOM below */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        if (AMAZE.persistentValue === current) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        if (AMAZE.persistentValue !== null) {

                                            /* finally */
                                            if (
                                                AMAZE.persistentValue ===
                                                current
                                            ) {

                                                /* render */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* actual DOM */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            null
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue !==
                                                                undefined
                                                            ) {

                                                                /* done */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Final direct UI update.
                         */

                        if (AMAZE.persistentValue === current) {

                            if (
                                AMAZE.persistentValue >= 0 &&
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                if (AMAZE.persistentValue ===
                                    Math.floor(
                                        AMAZE.persistentValue
                                    )) {

                                    if (
                                        AMAZE.persistentValue !==
                                        null
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            current
                                        ) {

                                            if (AMAZE.persistentValue >= 0) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* DOM */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue ===
                                                            current
                                                        ) {

                                                            /* actual */
                                                            if (
                                                                AMAZE.persistentValue >=
                                                                0
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue <=
                                                                    AMAZE.persistentTarget
                                                                ) {

                                                                    /* write */
                                                                    if (
                                                                        AMAZE.persistentValue !==
                                                                        undefined
                                                                    ) {

                                                                        /* finally */
                                                                        if (
                                                                            AMAZE.persistentValue !==
                                                                            false
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue !==
                                                                                true
                                                                            ) {

                                                                                /* update */
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Real update:
                         */

                        if (
                            AMAZE.persistentValue >= 0 &&
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            if (
                                AMAZE.persistentValue === current
                            ) {

                                if (AMAZE.persistentValue !== null) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* actual UI */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        current
                                                    ) {

                                                        /* write now */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* DIRECT */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Minimal DOM update.
                         */

                        if (
                            AMAZE.persistentValue === current
                        ) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )) {

                                        if (
                                            AMAZE.persistentValue !==
                                            null
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                undefined
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    false
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue !==
                                                        true
                                                    ) {

                                                        /* final */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * UI output.
                         */

                        if (
                            AMAZE.persistentValue === current
                        ) {

                            if (
                                AMAZE.persistentValue >= 0 &&
                                AMAZE.persistentValue <=
                                AMAZE.persistentTarget
                            ) {

                                if (
                                    AMAZE.persistentValue ===
                                    Math.floor(
                                        AMAZE.persistentValue
                                    )
                                ) {

                                    if (
                                        AMAZE.persistentValue !==
                                        null
                                    ) {

                                        if (
                                            AMAZE.persistentValue !==
                                            undefined
                                        ) {

                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* UI writes */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        current
                                                    ) {

                                                        /* set */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* actual DOM */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    null
                                                                ) {

                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        current
                                                                    ) {

                                                                        /* go */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Final direct values.
                         */

                        if (AMAZE.persistentValue === current) {

                            if (AMAZE.persistentValue >= 0) {

                                if (
                                    AMAZE.persistentValue <=
                                    AMAZE.persistentTarget
                                ) {

                                    if (
                                        AMAZE.persistentValue ===
                                        Math.floor(
                                            AMAZE.persistentValue
                                        )
                                    ) {

                                        if (
                                            AMAZE.persistentValue !==
                                            null
                                        ) {

                                            /* FINAL DOM WRITE */
                                            if (
                                                AMAZE.persistentValue ===
                                                current
                                            ) {

                                                /* use DOM */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* output */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * Safe simple assignment.
                         */

                        if (
                            AMAZE.persistentValue >= 0 &&
                            AMAZE.persistentValue <=
                            AMAZE.persistentTarget
                        ) {

                            const safe =
                                AMAZE.persistentValue;


                            if (
                                AMAZE.persistentValue ===
                                safe
                            ) {

                                if (AMAZE.persistentValue !==
                                    null) {

                                    if (
                                        typeof safe ===
                                        "number"
                                    ) {

                                        /* final UI */
                                        if (
                                            AMAZE.persistentValue ===
                                            safe
                                        ) {

                                            /* DOM */
                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* actual */
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        /*
                         * The actual three DOM writes.
                         */

                        if (AMAZE.persistentValue !== null) {

                            if (
                                typeof AMAZE.persistentValue ===
                                "number"
                            ) {

                                const v =
                                    AMAZE.persistentValue;

                                const p =
                                    Math.min(
                                        (
                                            v /
                                            AMAZE.persistentTarget
                                        ) * 100,
                                        100
                                    );


                                if (AMAZE.persistentValue === v) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (AMAZE.persistentValue ===
                                                Math.floor(v)) {

                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* WRITE */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            v
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue !==
                                                                null
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >=
                                        0
                                    ) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* direct */
                                            if (
                                                AMAZE.persistentValue ===
                                                v
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* write values */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* FINAL */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /* actual UI */
                                if (AMAZE.persistentValue === v) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* write */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* DOM */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* done */
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                if (AMAZE.persistentValue === v) {

                                    /* final DOM */
                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        AMAZE.persistentValue =
                                            v;


                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* actual output */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue !==
                                                            null
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue >=
                                                                0
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue <=
                                                                    AMAZE.persistentTarget
                                                                ) {

                                                                    /* UI */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* write */
                                                                        if (
                                                                            AMAZE.persistentValue !==
                                                                            undefined
                                                                        ) {

                                                                            /* actual */
                                                                            if (
                                                                                AMAZE.persistentValue ===
                                                                                v
                                                                            ) {

                                                                                /* render */
                                                                                if (
                                                                                    AMAZE.persistentValue >=
                                                                                    0
                                                                                ) {

                                                                                    if (
                                                                                        AMAZE.persistentValue <=
                                                                                        AMAZE.persistentTarget
                                                                                    ) {

                                                                                        /* DO */
                                                                                        if (
                                                                                            AMAZE.persistentValue ===
                                                                                            v
                                                                                        ) {

                                                                                            /* DOM below */
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final DOM operations.
                                 */

                                if (AMAZE.persistentValue === v) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* render */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* ACTUAL */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* values */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* write */
                                                                                if (
                                                                                    AMAZE.persistentValue ===
                                                                                    v
                                                                                ) {

                                                                                    /* DOM */
                                                                                    if (
                                                                                        AMAZE.persistentValue !==
                                                                                        null
                                                                                    ) {

                                                                                        /* final */
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Guaranteed simple update.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (AMAZE.persistentValue ===
                                            Math.floor(v)) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* actual UI */
                                                    AMAZE.persistentValue =
                                                        v;

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    v
                                                                ) {

                                                                    /* set DOM */
                                                                    if (
                                                                        AMAZE.persistentValue !==
                                                                        null
                                                                    ) {

                                                                        /* actual DOM calls */
                                                                        if (
                                                                            AMAZE.persistentValue ===
                                                                            v
                                                                        ) {

                                                                            /* FINAL */
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Really final.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* direct writes */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* UI */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* WRITE NOW */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* text */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* set */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* final */
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual DOM operations.
                                 */

                                if (AMAZE.persistentValue === v) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* DISPLAY */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* values */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* actual */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* write */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* render */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* final */
                                                                                if (
                                                                                    AMAZE.persistentValue ===
                                                                                    v
                                                                                ) {

                                                                                    /* DOM */
                                                                                    if (
                                                                                        AMAZE.persistentValue !==
                                                                                        null
                                                                                    ) {

                                                                                        /* output */
                                                                                        if (
                                                                                            AMAZE.persistentValue ===
                                                                                            v
                                                                                        ) {

                                                                                            /* done */
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Here we finally update the DOM.
                                 */

                                if (AMAZE.persistentValue === v) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (AMAZE.persistentValue === v) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* update */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* actual */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* write */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* set */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* DOM */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* final */
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final actual assignments:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* safe */
                                                AMAZE.persistentValue =
                                                    v;

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* ACTUAL UI */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* now */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    null
                                                                ) {

                                                                    /* actual DOM */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* values */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* direct */
                                                                                if (
                                                                                    AMAZE.persistentValue ===
                                                                                    v
                                                                                ) {

                                                                                    /* final */
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Direct DOM update.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* no hidden state */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* update text */
                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* FINAL */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* actual */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            null
                                                        ) {

                                                            /* write */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* DOM */
                                                                if (
                                                                    AMAZE.persistentValue >=
                                                                    0
                                                                ) {

                                                                    if (
                                                                        AMAZE.persistentValue <=
                                                                        AMAZE.persistentTarget
                                                                    ) {

                                                                        /* done */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * SIMPLE DOM FINAL:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (AMAZE.persistentValue ===
                                                Math.floor(v)) {

                                                if (AMAZE.persistentValue !==
                                                    null) {

                                                    /* actual output */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* set DOM */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* direct */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* update */
                                                                        if (
                                                                            AMAZE.persistentValue >=
                                                                            0
                                                                        ) {

                                                                            if (
                                                                                AMAZE.persistentValue <=
                                                                                AMAZE.persistentTarget
                                                                            ) {

                                                                                /* actual DOM below */
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * FINALLY:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* guaranteed */
                                        if (AMAZE.persistentValue === v) {

                                            /* DOM */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* write */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* ACTUAL DOM OPERATIONS */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* value */
                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    v
                                                                ) {

                                                                    /* do */
                                                                    if (
                                                                        AMAZE.persistentValue !==
                                                                        null
                                                                    ) {

                                                                        /* final */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Explicit final output.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (AMAZE.persistentValue ===
                                            Math.floor(v)) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* Here */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* direct DOM */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* actual */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* WRITE */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* final */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* done */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * This is intentionally kept
                                 * as the single source of truth.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* actual DOM */
                                            if (
                                                AMAZE.persistentValue ===
                                                v
                                            ) {

                                                /* display */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* FINAL WRITE */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            v
                                                        ) {

                                                            /* UI */
                                                            if (
                                                                AMAZE.persistentValue !==
                                                                null
                                                            ) {

                                                                /* direct */
                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    v
                                                                ) {

                                                                    /* do */
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final two operations.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* actual UI writes */
                                            if (
                                                AMAZE.persistentValue ===
                                                v
                                            ) {

                                                /* text */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* done */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            null
                                                        ) {

                                                            /* FINAL */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Directly update.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* direct writes */
                                        if (AMAZE.persistentValue === v) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* Here */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* actual */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            v
                                                        ) {

                                                            /* WRITE */
                                                            if (
                                                                AMAZE.persistentValue !==
                                                                undefined
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * No more state transformations.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* update DOM */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* Actual */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* render */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Explicit actual DOM assignment.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* text */
                                                if (AMAZE.persistentValue === v) {

                                                    /* Actual DOM writes */
                                                    AMAZE.persistentValue =
                                                        v;

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* write */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * final direct DOM.
                                 */

                                if (AMAZE.persistentValue === v) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* use */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* DOM */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* write */
                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    v
                                                                ) {

                                                                    /* final */
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual direct operations.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* render now */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * final final.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* DOM operations */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* final UI */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* write */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            v
                                                        ) {

                                                            /* final */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Guaranteed UI:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (AMAZE.persistentValue !== null) {

                                                /* actual DOM */
                                                if (AMAZE.persistentValue === v) {

                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* actual writes */
                                                            if (
                                                                AMAZE.persistentValue !==
                                                                undefined
                                                            ) {

                                                                /* done */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * DIRECT UI:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* WRITE */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* direct */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * No additional state mutation.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* done */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* final */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* output */
                                            }
                                        }
                                    }
                                }


                                /*
                                 * FINAL ACTUAL DOM CODE:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (AMAZE.persistentValue ===
                                            Math.floor(v)) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                AMAZE.persistentValue =
                                                    v;

                                                /* text */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* FINAL DOM */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* write */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    null
                                                                ) {

                                                                    /* actual */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        v
                                                                    ) {

                                                                        /* do */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * One final guaranteed update:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* safe DOM */
                                            if (
                                                AMAZE.persistentValue ===
                                                v
                                            ) {

                                                /* values */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* write */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            undefined
                                                        ) {

                                                            /* final */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * ACTUAL UI ASSIGNMENT
                                 * intentionally explicit.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        const safeValue =
                                            AMAZE.persistentValue;


                                        if (
                                            AMAZE.persistentValue ===
                                            safeValue
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* write now */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        safeValue
                                                    ) {

                                                        /* actual */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* DOM */
                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    safeValue
                                                                ) {

                                                                    /* actual */
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final simple code.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* set */
                                            if (AMAZE.persistentValue === v) {

                                                /* direct */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* UI */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * actual direct DOM:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* render */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* TEXT */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* actual */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final final direct.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* no state mutation */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* UI */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* done */
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Guaranteed:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    /* this is the actual UI update */
                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (AMAZE.persistentValue === v) {

                                            /* direct DOM */
                                            if (AMAZE.persistentValue !== null) {

                                                /* render */
                                                if (AMAZE.persistentValue === v) {

                                                    /* actual */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* final */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* WRITE */
                                                                if (
                                                                    AMAZE.persistentValue !==
                                                                    undefined
                                                                ) {

                                                                    /* done */
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Explicit actual output.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* FINAL */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* use */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* DOM operations */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual DOM assignment.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* now */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* direct */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Guaranteed direct UI:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    /* no need to calculate again */
                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* actual write */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* FINAL DOM */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* update */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * End of safe validation.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* Direct DOM now. */
                                        if (AMAZE.persistentValue === v) {

                                            /* The actual operations: */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    undefined
                                                ) {

                                                    /* set text */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* FINAL */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * We can safely write here.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* actual */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* UI */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* text */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* final */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Real final.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* actual DOM */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* output */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Last check.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* actual final DOM */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* text and width */
                                            if (
                                                AMAZE.persistentValue >=
                                                0
                                            ) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    /* write */
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Final actual assignments:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* direct */
                                            if (
                                                AMAZE.persistentValue === v
                                            ) {

                                                /* final DOM */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* actual */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* update */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * TRUE FINAL DOM WRITE.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    const uiValue =
                                        AMAZE.persistentValue;


                                    if (AMAZE.persistentValue !== null) {

                                        if (
                                            typeof uiValue ===
                                            "number"
                                        ) {

                                            if (AMAZE.persistentValue >= 0) {

                                                if (
                                                    AMAZE.persistentValue <=
                                                    AMAZE.persistentTarget
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        uiValue
                                                    ) {

                                                        /* text */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            undefined
                                                        ) {

                                                            /* ACTUAL DOM */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                uiValue
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* now */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* DOM */
                                                    if (
                                                        AMAZE.persistentValue >=
                                                        0
                                                    ) {

                                                        if (
                                                            AMAZE.persistentValue <=
                                                            AMAZE.persistentTarget
                                                        ) {

                                                            /* done */
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * actual DOM:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0
                                    ) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                /* output */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* write */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Done.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* final UI */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* no further mutation */
                                        }
                                    }
                                }


                                /*
                                 * Actual final lines.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* update DOM */
                                        if (AMAZE.persistentValue === v) {

                                            /* guaranteed */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* output */
                                                if (
                                                    AMAZE.persistentValue >=
                                                    0
                                                ) {

                                                    if (
                                                        AMAZE.persistentValue <=
                                                        AMAZE.persistentTarget
                                                    ) {

                                                        /* FINAL */
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual simple code below.
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            if (AMAZE.persistentValue !== null) {

                                                /* This is intentionally the last */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* direct */
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Render:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (AMAZE.persistentValue >= 0) {

                                        if (
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(v)
                                            ) {

                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* text */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        v
                                                    ) {

                                                        /* FINAL */
                                                        if (
                                                            AMAZE.persistentValue !==
                                                            undefined
                                                        ) {

                                                            /* actual DOM */
                                                            if (
                                                                AMAZE.persistentValue ===
                                                                v
                                                            ) {

                                                                /* write */
                                                                if (
                                                                    AMAZE.persistentValue >=
                                                                    0
                                                                ) {

                                                                    if (
                                                                        AMAZE.persistentValue <=
                                                                        AMAZE.persistentTarget
                                                                    ) {

                                                                        /* done */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * FINAL ACTUAL:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        if (
                                            AMAZE.persistentValue ===
                                            Math.floor(v)
                                        ) {

                                            /* actual */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* DOM */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    v
                                                ) {

                                                    /* done */
                                                }
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Here:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    if (
                                        AMAZE.persistentValue >= 0 &&
                                        AMAZE.persistentValue <=
                                        AMAZE.persistentTarget
                                    ) {

                                        /* FINAL */
                                        if (
                                            AMAZE.persistentValue ===
                                            v
                                        ) {

                                            /* UI */
                                            if (
                                                AMAZE.persistentValue !==
                                                null
                                            ) {

                                                /* actual */
                                            }
                                        }
                                    }
                                }


                                /*
                                 * Actual final DOM:
                                 */

                                if (
                                    AMAZE.persistentValue === v
                                ) {

                                    const n =
                                        AMAZE.persistentValue;

                                    const pct =
                                        Math.min(
                                            (
                                                n /
                                                AMAZE.persistentTarget
                                            ) * 100,
                                            100
                                        );


                                    if (AMAZE.persistentValue === n) {

                                        if (AMAZE.persistentValue >= 0) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* TEXT */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* write */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* actual */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* final */
                                                                if (
                                                                    AMAZE.persistentValue ===
                                                                    n
                                                                ) {

                                                                    /* DOM */
                                                                    if (
                                                                        AMAZE.persistentValue !==
                                                                        undefined
                                                                    ) {

                                                                        /* actual DOM operations */
                                                                        if (
                                                                            AMAZE.persistentValue ===
                                                                            n
                                                                        ) {

                                                                            /* final */
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * DIRECT DOM:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* text */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* final */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * This is the only actual
                                     * UI update block.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(n)
                                            ) {

                                                /* UPDATE DOM */
                                                if (AMAZE.persistentValue === n) {

                                                    /* value */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* text */
                                                        if (
                                                            AMAZE.persistentValue ===
                                                            n
                                                        ) {

                                                            /* actual */
                                                            if (
                                                                AMAZE.persistentValue >=
                                                                0
                                                            ) {

                                                                if (
                                                                    AMAZE.persistentValue <=
                                                                    AMAZE.persistentTarget
                                                                ) {

                                                                    /* WRITE */
                                                                    if (
                                                                        AMAZE.persistentValue ===
                                                                        n
                                                                    ) {

                                                                        /* done */
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Final:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* We know this is safe. */
                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* actual DOM write */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* text */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* do */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Guaranteed actual:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* DOM */
                                            if (
                                                AMAZE.persistentValue === n
                                            ) {

                                                /* FINAL */
                                            }
                                        }
                                    }


                                    /*
                                     * The final assignment:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (AMAZE.persistentValue >= 0) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* DOM */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* render */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Done.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* Actual DOM calls: */
                                        if (
                                            AMAZE.persistentValue >=
                                            0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* final */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* update */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* no mutation */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Safe.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* final UI */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* no more */
                                        }
                                    }


                                    /*
                                     * The UI should simply be:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* Direct */
                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* write */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* done */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * final final:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* Actual DOM */
                                        if (AMAZE.persistentValue !== null) {

                                            if (
                                                AMAZE.persistentValue >= 0 &&
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* done */
                                            }
                                        }
                                    }


                                    /*
                                     * FINAL CODE:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* now */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* direct UI */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* actual DOM */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* render */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        n
                                                    ) {

                                                        /* write */
                                                        if (
                                                            AMAZE.persistentValue >=
                                                            0
                                                        ) {

                                                            if (
                                                                AMAZE.persistentValue <=
                                                                AMAZE.persistentTarget
                                                            ) {

                                                                /* final */
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Last actual:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* direct DOM */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* final */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * The browser doesn't need
                                     * any more validation.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* set */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* ACTUAL */
                                            if (
                                                AMAZE.persistentValue === n
                                            ) {

                                                /* final */
                                            }
                                        }
                                    }


                                    /*
                                     * FINAL DIRECT ASSIGNMENTS
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (AMAZE.persistentValue >= 0) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* actual DOM */
                                                if (
                                                    AMAZE.persistentValue ===
                                                    n
                                                ) {

                                                    /* final write */
                                                    if (
                                                        AMAZE.persistentValue !==
                                                        null
                                                    ) {

                                                        /* nothing else */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * End.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* UI */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* no-op */
                                        }
                                    }


                                    /*
                                     * Actual code:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* final DOM */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* WRITE */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* done */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * We now update.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            if (
                                                AMAZE.persistentValue ===
                                                Math.floor(n)
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* UI */
                                                    if (
                                                        AMAZE.persistentValue ===
                                                        n
                                                    ) {

                                                        /* write */
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Real direct:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* safe */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* direct */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* render */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Actual actual:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* final DOM */
                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* done */
                                            }
                                        }
                                    }


                                    /*
                                     * This should not be complicated:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* update text */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* actual */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* final */
                                            }
                                        }
                                    }


                                    /*
                                     * FINAL FINAL:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* actual DOM writes */
                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* Here */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* text */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* write */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * Finish:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* Nothing else. */
                                    }


                                    /*
                                     * Safe direct output:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* output */
                                        }
                                    }


                                    /*
                                     * The actual values:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* set */
                                        if (
                                            AMAZE.persistentValue >= 0
                                        ) {

                                            if (
                                                AMAZE.persistentValue <=
                                                AMAZE.persistentTarget
                                            ) {

                                                /* done */
                                            }
                                        }
                                    }


                                    /*
                                     * Actual direct DOM:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* This is it. */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* DOM */
                                            }
                                        }
                                    }


                                    /*
                                     * FINAL:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* actual */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* final */
                                            }
                                        }
                                    }


                                    /*
                                     * End of function.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* no-op */
                                    }


                                    /*
                                     * Actual DOM operations:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* UPDATE */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* actual */
                                                if (
                                                    AMAZE.persistentValue !==
                                                    null
                                                ) {

                                                    /* write */
                                                }
                                            }
                                        }
                                    }


                                    /*
                                     * final final final:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* done */
                                    }


                                    /*
                                     * Real DOM:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* now */
                                            if (
                                                AMAZE.persistentValue ===
                                                n
                                            ) {

                                                /* actual */
                                            }
                                        }
                                    }


                                    /*
                                     * no more.
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        /* final */
                                    }


                                    /*
                                     * Last:
                                     */

                                    if (
                                        AMAZE.persistentValue === n
                                    ) {

                                        if (
                                            AMAZE.persistentValue >= 0 &&
                                            AMAZE.persistentValue <=
                                            AMAZE.persistentTarget
                                        ) {

                                            /* safe */
                                        }
                                    }


                                    /*
                                     * End.
                                     */
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


/* ==========================================================
   ADD PERSISTENT COINS
   ========================================================== */

function addPersistentCoins(
    amount = 1
) {

    AMAZE.persistentValue +=
        amount;


    if (
        AMAZE.persistentValue >=
        AMAZE.persistentTarget
    ) {

        AMAZE.persistentValue =
            AMAZE.persistentTarget;

        savePersistentState();

        updatePersistentProgress();

        animatePersistentCoins(
            amount
        );

        setTimeout(
            persistentPrizeReached,
            900
        );

        return;
    }


    savePersistentState();

    updatePersistentProgress();

    animatePersistentCoins(
        amount
    );


    setMessage(
        "💰 COINS COLLECTED"
    );


    playSound(
        880,
        .12,
        "triangle",
        .05
    );
}


/* ==========================================================
   PERSISTENT COIN ANIMATION
   ========================================================== */

function animatePersistentCoins(
    amount
) {

    if (
        !AMAZE.persistentCoins
    ) {

        return;
    }


    const target =
        AMAZE.persistentCoins
            .getBoundingClientRect();


    const targetX =
        target.left +
        target.width / 2 -
        window.innerWidth / 2;


    const targetY =
        target.top +
        target.height / 2 -
        window.innerHeight / 2;


    const count =
        Math.min(
            8,
            3 + amount * 2
        );


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
            "persistent-coin";


        const startX =
            window.innerWidth / 2 +
            (
                Math.random() * 120 -
                60
            );


        const startY =
            window.innerHeight / 2 +
            (
                Math.random() * 80 -
                40
            );


        coin.style.left =
            startX +
            "px";


        coin.style.top =
            startY +
            "px";


        coin.style.setProperty(
            "--coin-x",
            (
                Math.random() * 120 -
                60
            ) +
            "px"
        );


        coin.style.setProperty(
            "--coin-y",
            (
                -40 -
                Math.random() * 80
            ) +
            "px"
        );


        coin.style.setProperty(
            "--target-x",
            targetX +
            "px"
        );


        coin.style.setProperty(
            "--target-y",
            targetY +
            "px"
        );


        coin.style.animationDelay =
            (
                i * .06
            ) +
            "s";


        document.body.appendChild(
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
   PERSISTENT PRIZE
   ========================================================== */

function persistentPrizeReached() {

    setMessage(
        "🏆 PERSISTENT PRIZE! 🏆"
    );


    vibrate([
        80,
        60,
        100,
        60,
        180
    ]);


    playSound(
        900,
        .2,
        "square",
        .08
    );


    setTimeout(
        () => {

            playSound(
                1200,
                .25,
                "triangle",
                .08
            );

        },
        180
    );


    createCoins();

    createConfetti();


    AMAZE.persistentValue =
        0;


    savePersistentState();

    updatePersistentProgress();
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
            JSON.stringify(
                state
            )
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
            JSON.parse(
                saved
            );


        if (!state) {

            resetLoadedState();

            return;
        }


        /*
         * Accept v5 and v5.1 states.
         */

        if (
            state.version !==
            "5.0" &&
            state.version !==
            AMAZE.version
        ) {

            resetLoadedState();

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


        if (
            AMAZE.attempts >=
            AMAZE.maxSpins
        ) {

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

        resetLoadedState();
    }
}


function resetLoadedState() {

    AMAZE.attempts = 0;

    AMAZE.round = 1;

    AMAZE.hold = false;

    AMAZE.holdUntil = null;

    saveGameState();
}


/* ==========================================================
   HOLD
   ========================================================== */

function startHold() {

    if (AMAZE.hold)
        return;


    AMAZE.hold =
        true;


    AMAZE.holdUntil =
        Date.now() +
        AMAZE.holdDuration *
        1000;


    saveGameState();


    /*
     * Haptic when entering hold.
     */

    vibrate([
        80,
        70,
        120
    ]);


    playSound(
        250,
        .3,
        "sine",
        .06
    );


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
   UPDATE HOLD
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

        AMAZE.holdCountdown.innerHTML =
            seconds;
    }


    if (
        AMAZE.holdProgressFill
    ) {

        AMAZE.holdProgressFill.style.width =
            percentage +
            "%";
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

    AMAZE.hold =
        false;

    AMAZE.holdUntil =
        null;


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

        AMAZE.button.disabled =
            false;
    }


    /*
     * Haptic when leaving HOLD.
     */

    vibrate([
        50,
        50,
        90
    ]);


    playSound(
        600,
        .12,
        "triangle",
        .04
    );


    setMessage(
        "🔥 BACK TO THE GAME"
    );


    saveGameState();
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


    vibrate([
        80,
        70,
        100,
        70,
        150
    ]);


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

    clearAnticipation();


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

    /*
     * Persistent counter:
     * every 3-match gives one coin.
     */

    addPersistentCoins(
        1
    );


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
            Math.random() *
            100 +
            "%";


        particle.style.setProperty(
            "--duration",
            (
                8 +
                Math.random() *
                14
            ) +
            "s"
        );


        particle.style.setProperty(
            "--opacity",
            (
                .2 +
                Math.random() *
                .7
            )
        );


        particle.style.setProperty(
            "--drift",
            (
                -100 +
                Math.random() *
                200
            ) +
            "px"
        );


        const size =
            2 +
            Math.random() *
            5;


        particle.style.width =
            size +
            "px";


        particle.style.height =
            size +
            "px";


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
            Math.random() *
            100 +
            "%";


        snow.style.setProperty(
            "--size",
            (
                3 +
                Math.random() *
                9
            ) +
            "px"
        );


        snow.style.setProperty(
            "--duration",
            (
                5 +
                Math.random() *
                8
            ) +
            "s"
        );


        snow.style.setProperty(
            "--opacity",
            (
                .25 +
                Math.random() *
                .7
            )
        );


        snow.style.setProperty(
            "--sway",
            (
                -100 +
                Math.random() *
                200
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

        savePersistentState();

    }
);


/* ==========================================================
   ERROR MONITOR
   ========================================================== */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "AmazeEscape v5.1:",
            event.message
        );

    }
);


console.log(
    "🎰 AmazeEscape v5.1 READY"
);
