/* ==========================================================
   AMAZE GAMING
   ESCAPE ENGINE V8
   MASTER GAME ENGINE
========================================================== */

(() => {
    "use strict";


    /* ======================================================
       CONFIG
    ======================================================= */

    const CONFIG = {

        roundSpins: 10,

        symbols: [
            "🍒",
            "🍋",
            "🍊",
            "🍇",
            "🍉",
            "⭐",
            "💎",
            "7️⃣"
        ],

        spinDuration: [
            1500,
            2050,
            2700
        ],

        anticipationThreshold: 0.65,

        holdDuration: 3000,

        persistentStep: 10
    };


    /* ======================================================
       DOM
    ======================================================= */

    const machine =
        document.getElementById("machine");

    const reelsContainer =
        document.getElementById("reels");

    const slotElements = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")
    ];

    const reelStrips =
        slotElements.map(
            slot => slot.querySelector(".reel-strip")
        );

    const spinButton =
        document.getElementById("spinButton");

    const lever =
        document.getElementById("lever");

    const message =
        document.getElementById("message");

    const roundStatus =
        document.getElementById("roundStatus");

    const jackpotLamp =
        document.getElementById("jackpotLamp");

    const counterValue =
        document.getElementById("counterValue");

    const spinProgressFill =
        document.getElementById("spinProgressFill");

    const persistentValue =
        document.getElementById("persistentValue");

    const persistentFill =
        document.getElementById("persistentFill");

    const anticipationOverlay =
        document.getElementById("anticipationOverlay");

    const anticipationParticles =
        document.getElementById("anticipationParticles");

    const finalReelFire =
        document.getElementById("finalReelFire");

    const snowContainer =
        document.getElementById("snowContainer");

    const holdOverlay =
        document.getElementById("holdOverlay");

    const holdCountdown =
        document.getElementById("holdCountdown");

    const holdProgressFill =
        document.getElementById("holdProgressFill");

    const holdStatus =
        document.getElementById("holdStatus");

    const casinoBackground =
        document.getElementById("casinoBackground");


    /* ======================================================
       STATE
    ======================================================= */

    const state = {

        spinning: false,

        round: 0,

        persistent: 0,

        results: [
            0,
            0,
            0
        ],

        anticipation: false,

        holdActive: false,

        jackpot: false,

        roundComplete: false
    };


    /* ======================================================
       HELPERS
    ======================================================= */

    const random =
        (min, max) =>
            Math.random() *
                (max - min) +
                min;


    const randomInt =
        (min, max) =>
            Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;


    const sleep =
        ms =>
            new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        ms
                    )
            );


    /* ======================================================
       SYMBOL STRIP
    ======================================================= */

    function createStrip(
        strip,
        startIndex
    ) {

        strip.innerHTML = "";

        const count =
            36;

        const fragment =
            document.createDocumentFragment();

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const symbol =
                document.createElement("div");

            symbol.className =
                "reel-symbol";

            const index =
                (
                    startIndex +
                    i
                ) % CONFIG.symbols.length;

            symbol.textContent =
                CONFIG.symbols[index];

            fragment.appendChild(
                symbol
            );
        }

        strip.appendChild(
            fragment
        );
    }


    /* ======================================================
       INITIALIZE REELS
    ======================================================= */

    function initializeReels() {

        reelStrips.forEach(
            (strip, reelIndex) => {

                createStrip(
                    strip,
                    reelIndex * 2
                );

                strip.style.setProperty(
                    "--symbol-height",
                    "120px"
                );

                strip.style.setProperty(
                    "--reel-offset",
                    "0px"
                );
            }
        );

        requestAnimationFrame(
            updateSymbolHeight
        );
    }


    /* ======================================================
       RESPONSIVE SYMBOL HEIGHT
    ======================================================= */

    function updateSymbolHeight() {

        reelStrips.forEach(
            strip => {

                const reel =
                    strip.closest(
                        ".slot-reel"
                    );

                if (!reel) {
                    return;
                }

                const height =
                    reel.clientHeight;

                const symbolHeight =
                    height / 3;

                strip.style.setProperty(
                    "--symbol-height",
                    `${symbolHeight}px`
                );
            }
        );
    }


    window.addEventListener(
        "resize",
        updateSymbolHeight
    );


    /* ======================================================
       GET SYMBOL HEIGHT
    ======================================================= */

    function getSymbolHeight() {

        const reel =
            slotElements[0]
                .querySelector(".slot-reel");

        if (!reel) {
            return 80;
        }

        return reel.clientHeight / 3;
    }


    /* ======================================================
       SET MESSAGE
    ======================================================= */

    function setMessage(
        text
    ) {

        message.textContent =
            text;
    }


    /* ======================================================
       ROUND UI
    ======================================================= */

    function updateRoundUI() {

        counterValue.textContent =
            `${state.round} / ${CONFIG.roundSpins}`;

        const percent =
            Math.min(
                100,
                (
                    state.round /
                    CONFIG.roundSpins
                ) * 100
            );

        spinProgressFill.style.width =
            `${percent}%`;

        persistentValue.textContent =
            `${state.persistent}%`;

        persistentFill.style.width =
            `${state.persistent}%`;

        roundStatus.textContent =
            state.spinning
                ? "SPINNING"
                : state.roundComplete
                    ? "COMPLETE"
                    : "READY";
    }


    /* ======================================================
       LEVER
    ======================================================= */

    function animateLever() {

        lever.classList.remove(
            "pull-lever"
        );

        void lever.offsetWidth;

        lever.classList.add(
            "pull-lever"
        );
    }


    /* ======================================================
       BACKGROUND PARTICLES
    ======================================================= */

    function createCasinoParticles() {

        const fragment =
            document.createDocumentFragment();

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const particle =
                document.createElement("div");

            particle.className =
                "casino-particle";

            particle.style.left =
                `${random(0, 100)}%`;

            particle.style.setProperty(
                "--size",
                `${random(2, 6)}px`
            );

            particle.style.setProperty(
                "--opacity",
                random(.2, .7)
            );

            particle.style.setProperty(
                "--duration",
                `${random(5, 12)}s`
            );

            particle.style.setProperty(
                "--drift",
                `${random(-100, 100)}px`
            );

            particle.style.animationDelay =
                `${random(-10, 0)}s`;

            fragment.appendChild(
                particle
            );
        }

        casinoBackground.appendChild(
            fragment
        );
    }


    /* ======================================================
       ANTICIPATION PARTICLES
    ======================================================= */

    function createAnticipationParticles() {

        anticipationParticles.innerHTML =
            "";

        const fragment =
            document.createDocumentFragment();

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            const particle =
                document.createElement("div");

            particle.className =
                "anticipation-particle";

            particle.style.left =
                `${random(0, 100)}%`;

            particle.style.setProperty(
                "--particle-size",
                `${random(3, 9)}px`
            );

            particle.style.setProperty(
                "--duration",
                `${random(2, 5)}s`
            );

            particle.style.setProperty(
                "--drift",
                `${random(-120, 120)}px`
            );

            particle.style.animationDelay =
                `${random(-5, 0)}s`;

            fragment.appendChild(
                particle
            );
        }

        anticipationParticles.appendChild(
            fragment
        );
    }


    /* ======================================================
       FINAL REEL FIRE
    ======================================================= */

    function createFireEffect() {

        finalReelFire.innerHTML =
            "";

        const fragment =
            document.createDocumentFragment();


        /* Flames */

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const flame =
                document.createElement("div");

            flame.className =
                "final-reel-flame";

            flame.style.setProperty(
                "--fire-size",
                `${random(18, 42)}px`
            );

            flame.style.setProperty(
                "--fire-left",
                `${random(-15, 85)}%`
            );

            flame.style.setProperty(
                "--fire-bottom",
                `${random(-10, 35)}px`
            );

            flame.style.setProperty(
                "--fire-opacity",
                random(.45, 1)
            );

            flame.style.setProperty(
                "--fire-rotate",
                `${random(-35, 35)}deg`
            );

            flame.style.setProperty(
                "--fire-duration",
                `${random(.25, .6)}s`
            );

            fragment.appendChild(
                flame
            );
        }


        /* Particles */

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            const particle =
                document.createElement("div");

            particle.className =
                "final-reel-particle";

            particle.style.setProperty(
                "--particle-size",
                `${random(3, 8)}px`
            );

            particle.style.setProperty(
                "--particle-left",
                `${random(0, 100)}%`
            );

            particle.style.setProperty(
                "--particle-bottom",
                `${random(0, 80)}px`
            );

            particle.style.setProperty(
                "--particle-drift",
                `${random(-100, 100)}px`
            );

            particle.style.setProperty(
                "--particle-rise",
                `${random(-80, -220)}px`
            );

            particle.style.setProperty(
                "--particle-duration",
                `${random(1, 2.5)}s`
            );

            particle.style.setProperty(
                "--particle-delay",
                `${random(-2, 0)}s`
            );

            fragment.appendChild(
                particle
            );
        }

        finalReelFire.appendChild(
            fragment
        );
    }


    /* ======================================================
       ANTICIPATION
    ======================================================= */

    function setAnticipation(
        active
    ) {

        state.anticipation =
            active;

        machine.classList.toggle(
            "anticipation-mode",
            active
        );

        anticipationOverlay.classList.toggle(
            "active",
            active
        );

        slotElements[2].classList.toggle(
            "final-reel-anticipation",
            active
        );

        if (active) {

            jackpotLamp.classList.add(
                "on"
            );

        } else {

            jackpotLamp.classList.remove(
                "on"
            );
        }
    }


    /* ======================================================
       ICE HOLD
    ======================================================= */

    async function runIceHold() {

        if (state.holdActive) {
            return;
        }

        state.holdActive =
            true;

        machine.classList.add(
            "ice-mode"
        );

        holdOverlay.classList.add(
            "active"
        );

        snowContainer.classList.add(
            "active"
        );

        holdOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        const start =
            performance.now();

        const end =
            start +
            CONFIG.holdDuration;


        function update() {

            const now =
                performance.now();

            const remaining =
                Math.max(
                    0,
                    end - now
                );

            const progress =
                remaining /
                CONFIG.holdDuration;

            const seconds =
                Math.ceil(
                    remaining / 1000
                );

            holdCountdown.textContent =
                seconds;

            holdProgressFill.style.width =
                `${progress * 100}%`;

            if (
                remaining > 0
            ) {

                requestAnimationFrame(
                    update
                );

            } else {

                finishIceHold();
            }
        }


        function finishIceHold() {

            machine.classList.remove(
                "ice-mode"
            );

            holdOverlay.classList.remove(
                "active"
            );

            snowContainer.classList.remove(
                "active"
            );

            holdOverlay.setAttribute(
                "aria-hidden",
                "true"
            );

            holdCountdown.textContent =
                "3";

            holdProgressFill.style.width =
                "100%";

            holdStatus.textContent =
                "COOLING COMPLETE";

            state.holdActive =
                false;

            setMessage(
                "ENGINE RESTARTED"
            );
        }


        holdStatus.textContent =
            "COOLING SYSTEM ACTIVE";

        requestAnimationFrame(
            update
        );

        await sleep(
            CONFIG.holdDuration + 50
        );
    }


    /* ======================================================
       CALCULATE RESULT
    ======================================================= */

    function generateResults() {

        /*
         * Small chance of jackpot.
         */

        const jackpotChance =
            Math.random() < .055;


        if (jackpotChance) {

            const seven =
                CONFIG.symbols.indexOf(
                    "7️⃣"
                );

            return [
                seven,
                seven,
                seven
            ];
        }


        return [
            randomInt(
                0,
                CONFIG.symbols.length - 1
            ),

            randomInt(
                0,
                CONFIG.symbols.length - 1
            ),

            randomInt(
                0,
                CONFIG.symbols.length - 1
            )
        ];
    }


    /* ======================================================
       SHOW RESULT
    ======================================================= */

    function showResult(
        reelIndex,
        resultIndex
    ) {

        const strip =
            reelStrips[reelIndex];

        const symbolHeight =
            getSymbolHeight();

        const target =
            resultIndex +
            12;

        const offset =
            -target *
            symbolHeight;

        strip.style.setProperty(
            "--reel-offset",
            `${offset}px`
        );

        strip.classList.remove(
            "reel-spin"
        );

        strip.classList.remove(
            "reel-stop"
        );

        void strip.offsetWidth;

        strip.classList.add(
            "reel-stop"
        );
    }


    /* ======================================================
       SPIN REEL
    ======================================================= */

    async function spinReel(
        reelIndex,
        resultIndex,
        duration
    ) {

        const strip =
            reelStrips[reelIndex];

        strip.classList.add(
            "reel-spin"
        );

        const start =
            performance.now();

        const end =
            start + duration;


        /*
         * Fake movement while spinning.
         * This does not depend on CSS transform
         * animation, so stopping is deterministic.
         */

        function animate(now) {

            if (
                now >= end
            ) {
                return;
            }

            const elapsed =
                now - start;

            const movement =
                -(
                    (
                        elapsed * .75
                    ) %
                    (
                        getSymbolHeight()
                    )
                );

            const base =
                -(
                    10 *
                    getSymbolHeight()
                );

            strip.style.setProperty(
                "--reel-offset",
                `${base + movement}px`
            );

            requestAnimationFrame(
                animate
            );
        }

        requestAnimationFrame(
            animate
        );

        await sleep(
            duration
        );

        showResult(
            reelIndex,
            resultIndex
        );

        await sleep(
            300
        );

        strip.classList.remove(
            "reel-spin"
        );
    }


    /* ======================================================
       JACKPOT
    ======================================================= */

    function isJackpot(
        results
    ) {

        return (
            results[0] ===
            results[1] &&
            results[1] ===
            results[2]
        );
    }


    /* ======================================================
       JACKPOT EFFECTS
    ======================================================= */

    async function jackpotEffect() {

        state.jackpot =
            true;

        jackpotLamp.classList.add(
            "on"
        );

        machine.classList.add(
            "round-complete"
        );

        setMessage(
            "🎰 JACKPOT! ESCAPE!"
        );

        reelStrips.forEach(
            strip => {
                strip.classList.add(
                    "flash"
                );
            }
        );

        createCoins();
        createConfetti();

        await sleep(
            4000
        );

        reelStrips.forEach(
            strip => {
                strip.classList.remove(
                    "flash"
                );
            }
        );

        machine.classList.remove(
            "round-complete"
        );

        state.jackpot =
            false;
    }


    /* ======================================================
       COINS
    ======================================================= */

    function createCoins() {

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            const coin =
                document.createElement("div");

            coin.className =
                "coin";

            coin.style.left =
                `${random(0, 100)}vw`;

            coin.style.animationDelay =
                `${random(0, 1.5)}s`;

            document.body.appendChild(
                coin
            );

            setTimeout(
                () => coin.remove(),
                5000
            );
        }
    }


    /* ======================================================
       CONFETTI
    ======================================================= */

    function createConfetti() {

        const colors = [
            "#ff2400",
            "#ffd000",
            "#00d9ff",
            "#ffffff",
            "#ff5a00",
            "#7dff00"
        ];

        for (
            let i = 0;
            i < 80;
            i++
        ) {

            const confetti =
                document.createElement("div");

            confetti.className =
                "confetti";

            confetti.style.left =
                `${random(0, 100)}vw`;

            confetti.style.background =
                colors[
                    randomInt(
                        0,
                        colors.length - 1
                    )
                ];

            confetti.style.transform =
                `rotate(${random(0, 360)}deg)`;

            confetti.style.animationDelay =
                `${random(0, 1.5)}s`;

            document.body.appendChild(
                confetti
            );

            setTimeout(
                () =>
                    confetti.remove(),
                5500
            );
        }
    }


    /* ======================================================
       MINI COINS
    ======================================================= */

    function createMiniCoins() {

        const rect =
            persistentFill.getBoundingClientRect();

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const coin =
                document.createElement("div");

            coin.className =
                "mini-coin";

            coin.style.left =
                `${random(
                    0,
                    Math.max(
                        1,
                        rect.width
                    )
                )}px`;

            coin.style.bottom =
                "0";

            persistentFill.appendChild(
                coin
            );

            setTimeout(
                () =>
                    coin.remove(),
                1300
            );
        }
    }


    /* ======================================================
       UPDATE PERSISTENT PROGRESS
    ======================================================= */

    function updatePersistent(
        results
    ) {

        let gain =
            CONFIG.persistentStep;

        if (
            results[0] ===
            results[1]
        ) {
            gain += 5;
        }

        if (
            results[1] ===
            results[2]
        ) {
            gain += 5;
        }

        state.persistent =
            Math.min(
                100,
                state.persistent +
                gain
            );

        createMiniCoins();

        updateRoundUI();
    }


    /* ======================================================
       ROUND COMPLETE
    ======================================================= */

    async function completeRound() {

        state.roundComplete =
            true;

        state.spinning =
            false;

        machine.classList.remove(
            "playing"
        );

        setAnticipation(
            false
        );

        updateRoundUI();

        await jackpotEffect();

        if (
            state.persistent >= 100
        ) {

            setMessage(
                "❄ ESCAPE ENGINE CHARGED"
            );

            await runIceHold();

            state.round =
                0;

            state.persistent =
                0;

            state.roundComplete =
                false;

            updateRoundUI();

            setMessage(
                "NEW ESCAPE ROUND READY"
            );
        }
    }


    /* ======================================================
       MAIN SPIN
    ======================================================= */

    async function spin() {

        if (
            state.spinning ||
            state.holdActive
        ) {
            return;
        }

        state.spinning =
            true;

        state.roundComplete =
            false;

        spinButton.disabled =
            true;

        machine.classList.add(
            "playing"
        );

        animateLever();

        setMessage(
            "SPINNING..."
        );

        roundStatus.textContent =
            "SPINNING";


        const results =
            generateResults();

        state.results =
            results;


        /*
         * Anticipation begins before
         * the final reel stops.
         */

        const finalReelTime =
            CONFIG.spinDuration[2];

        const anticipationDelay =
            finalReelTime *
            CONFIG.anticipationThreshold;


        /*
         * Reel 1
         */

        const reel1 =
            spinReel(
                0,
                results[0],
                CONFIG.spinDuration[0]
            );


        /*
         * Reel 2
         */

        const reel2 =
            spinReel(
                1,
                results[1],
                CONFIG.spinDuration[1]
            );


        /*
         * Wait before final reel
         */

        await sleep(
            anticipationDelay
        );


        /*
         * Only activate anticipation
         * when reels 1 and 2 match.
         */

        if (
            results[0] ===
            results[1]
        ) {

            createAnticipationParticles();
            setAnticipation(true);

            setMessage(
                "🔥 ONE MORE REEL..."
            );
        }


        /*
         * Final reel
         */

        const reel3 =
            spinReel(
                2,
                results[2],
                CONFIG.spinDuration[2]
            );


        await Promise.all([
            reel1,
            reel2,
            reel3
        ]);


        setAnticipation(
            false
        );


        /*
         * Result
         */

        if (
            isJackpot(results)
        ) {

            setMessage(
                "🎰 JACKPOT!"
            );

            await jackpotEffect();

        } else if (
            results[0] ===
            results[1] ||
            results[1] ===
            results[2]
        ) {

            setMessage(
                "NICE COMBINATION!"
            );

        } else {

            setMessage(
                "TRY AGAIN"
            );
        }


        state.round++;

        updatePersistent(
            results
        );


        /*
         * Round limit
         */

        if (
            state.round >=
            CONFIG.roundSpins
        ) {

            state.round =
                CONFIG.roundSpins;

            await completeRound();

        } else {

            state.spinning =
                false;

            machine.classList.remove(
                "playing"
            );

            spinButton.disabled =
                false;

            updateRoundUI();
        }
    }


    /* ======================================================
       BUTTON
    ======================================================= */

    spinButton.addEventListener(
        "click",
        spin
    );


    /* ======================================================
       LEVER
    ======================================================= */

    lever.addEventListener(
        "click",
        () => {

            if (
                !state.spinning &&
                !state.holdActive
            ) {
                spin();
            }
        }
    );


    /* ======================================================
       KEYBOARD
    ======================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.code ===
                "Space" ||
                event.code ===
                "Enter"
            ) {

                if (
                    document.activeElement ===
                    spinButton
                ) {
                    return;
                }

                event.preventDefault();

                spin();
            }
        }
    );


    /* ======================================================
       INITIALIZATION
    ======================================================= */

    function initialize() {

        initializeReels();

        createCasinoParticles();

        createFireEffect();

        updateRoundUI();

        setMessage(
            "READY TO ESCAPE"
        );

        /*
         * Make sure the fire container
         * does not visually interfere
         * before anticipation.
         */

        finalReelFire.style.opacity =
            "0";
    }


    initialize();

})();
