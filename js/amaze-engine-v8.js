/* ==========================================================
   AMAZE GAMING
   STYLE v8.0

   THREE VERTICAL SLOT REELS
   CLASSIC CASINO DRUMS
   METAL SEPARATORS
   FIRE / ICE / JACKPOT EFFECTS
   MOBILE READY
========================================================== */

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
}

body {
    overflow-x: hidden;
    background:
        radial-gradient(
            circle at center,
            #241008 0%,
            #0b0503 45%,
            #020202 100%
        );

    color: #fff;

    font-family:
        Arial,
        Helvetica,
        sans-serif;
}

/* ==========================================================
   MAIN BACKGROUND
========================================================== */

#casinoBackground {
    position: fixed;
    inset: 0;

    overflow: hidden;

    pointer-events: none;

    z-index: 0;

    background:
        radial-gradient(
            ellipse at center,
            rgba(100, 30, 5, .20),
            transparent 65%
        );
}

.casino-particle {
    position: absolute;

    bottom: -20px;

    border-radius: 50%;

    background: #ffb300;

    box-shadow:
        0 0 5px #ff6a00,
        0 0 12px #ff3000;

    opacity: var(--opacity);

    animation:
        casinoFloat
        var(--duration)
        linear
        infinite;
}

@keyframes casinoFloat {

    0% {
        transform:
            translate3d(0, 0, 0);
    }

    100% {
        transform:
            translate3d(
                var(--drift),
                -110vh,
                0
            );
    }
}

/* ==========================================================
   GAME WRAPPER
========================================================== */

#game,
.game-container,
.amaze-game {
    position: relative;

    z-index: 5;

    width: 100%;
    min-height: 100vh;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: flex-start;

    padding:
        20px
        12px
        40px;
}

/* ==========================================================
   MACHINE
========================================================== */

#machine {
    position: relative;

    width: min(
        94vw,
        760px
    );

    margin: 20px auto;

    padding:
        28px
        24px
        32px;

    border:
        6px solid #5b1b0a;

    border-radius: 28px;

    background:
        linear-gradient(
            145deg,
            #781b08,
            #2b0903 45%,
            #7b1a05
        );

    box-shadow:
        0 0 0 3px #d58a22,
        0 0 0 7px #351006,

        0 12px 30px
        rgba(0,0,0,.85),

        inset 0 0 35px
        rgba(255,100,0,.25);

    transition:
        .3s ease;
}

/* ==========================================================
   MACHINE PLAYING
========================================================== */

#machine.playing {
    box-shadow:
        0 0 0 3px #ffae00,
        0 0 25px #ff3c00,
        0 0 60px rgba(255,60,0,.55),
        inset 0 0 40px rgba(255,80,0,.25);
}

/* ==========================================================
   MACHINE ANTICIPATION
========================================================== */

#machine.anticipation-mode {
    box-shadow:
        0 0 0 4px #ff1600,
        0 0 30px #ff3000,
        0 0 70px #ff0000,
        0 0 120px rgba(255,30,0,.7),
        inset 0 0 45px rgba(255,0,0,.3);
}

/* ==========================================================
   MACHINE ICE
========================================================== */

#machine.ice-mode {
    filter:
        saturate(.7)
        brightness(.85);

    box-shadow:
        0 0 0 4px #8eeeff,
        0 0 25px #00cfff,
        0 0 70px rgba(0,190,255,.65),
        inset 0 0 45px rgba(0,150,255,.25);
}

/* ==========================================================
   TITLE
========================================================== */

h1,
.game-title,
#title {
    margin:
        0 0 20px;

    text-align: center;

    color: #ffd43b;

    font-size:
        clamp(
            28px,
            7vw,
            58px
        );

    font-weight: 900;

    letter-spacing: 3px;

    text-shadow:
        0 2px 0 #7c2400,
        0 0 10px #ff9d00,
        0 0 25px #ff4000;
}

/* ==========================================================
   SLOT AREA
========================================================== */

.slots,
.slot-machine,
.reels {
    position: relative;

    width: 100%;

    display: flex;

    justify-content: center;

    align-items: stretch;

    gap: 0;

    margin:
        15px 0
        25px;

    padding: 12px;

    border-radius: 18px;

    background:
        linear-gradient(
            180deg,
            #171717,
            #050505
        );

    border:
        4px solid #444;

    box-shadow:
        inset 0 0 20px #000,
        0 0 15px rgba(0,0,0,.8);

    overflow: hidden;
}

/* ==========================================================
   INDIVIDUAL REEL CONTAINER
========================================================== */

.slot,
.reel {
    position: relative;

    flex: 1;

    height:
        clamp(
            190px,
            34vw,
            270px
        );

    min-width: 0;

    overflow: hidden;

    background:
        linear-gradient(
            90deg,
            #080808,
            #2b2b2b 45%,
            #111 100%
        );

    border:
        3px solid #666;

    box-shadow:
        inset 0 0 18px #000,
        inset 4px 0 8px rgba(255,255,255,.08),
        inset -4px 0 8px rgba(0,0,0,.8);
}

/* ==========================================================
   REEL 1
========================================================== */

#slot1 {
    border-radius:
        12px 0 0 12px;
}

/* ==========================================================
   REEL 3
========================================================== */

#slot3 {
    border-radius:
        0 12px 12px 0;
}

/* ==========================================================
   METAL SEPARATORS
========================================================== */

#slot2,
#slot3 {
    border-left:
        7px solid #777;
}

#slot2::before,
#slot3::before {
    content: "";

    position: absolute;

    left: -7px;
    top: 0;
    bottom: 0;

    width: 7px;

    z-index: 50;

    background:
        linear-gradient(
            90deg,
            #222 0%,
            #eee 22%,
            #999 42%,
            #fff 50%,
            #777 65%,
            #222 100%
        );

    box-shadow:
        0 0 5px #000,
        0 0 10px rgba(255,255,255,.2);
}

/* ==========================================================
   REALISTIC REEL WINDOW
========================================================== */

.slot::after,
.reel::after {
    content: "";

    position: absolute;

    inset: 0;

    z-index: 20;

    pointer-events: none;

    background:
        linear-gradient(
            90deg,
            rgba(0,0,0,.55),
            transparent 18%,
            transparent 82%,
            rgba(0,0,0,.55)
        ),

        linear-gradient(
            180deg,
            rgba(0,0,0,.8),
            transparent 18%,
            transparent 82%,
            rgba(0,0,0,.8)
        );
}

/* ==========================================================
   CENTER PAYLINE
========================================================== */

.slots::after,
.reels::after {
    content: "";

    position: absolute;

    left: 8px;
    right: 8px;

    top: 50%;

    height: 4px;

    transform:
        translateY(-50%);

    z-index: 40;

    pointer-events: none;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(255,215,0,.8),
            transparent
        );

    box-shadow:
        0 0 8px #ffd000;
}

/* ==========================================================
   SLOT SYMBOL
========================================================== */

.slot-symbol,
.reel-symbol {
    position: relative;

    height: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    font-size:
        clamp(
            60px,
            13vw,
            105px
        );

    line-height: 1;

    user-select: none;

    text-shadow:
        0 4px 4px rgba(0,0,0,.8),
        0 0 12px rgba(255,255,255,.15);
}

/* ==========================================================
   SYMBOLS IN CURRENT HTML
========================================================== */

#slot1,
#slot2,
#slot3 {
    display: flex;

    align-items: center;

    justify-content: center;

    font-size:
        clamp(
            65px,
            14vw,
            110px
        );

    line-height: 1;

    user-select: none;
}

/* ==========================================================
   REALISTIC SPIN
========================================================== */

.reel-spin {
    animation:
        reelSpin
        .11s
        linear
        infinite;
}

@keyframes reelSpin {

    0% {
        transform:
            translateY(-18px);
    }

    25% {
        transform:
            translateY(12px);
    }

    50% {
        transform:
            translateY(-14px);
    }

    75% {
        transform:
            translateY(10px);
    }

    100% {
        transform:
            translateY(-18px);
    }
}

/* ==========================================================
   REEL STOP
========================================================== */

.reel-stop {
    animation:
        reelStop
        .32s
        cubic-bezier(.18,.9,.25,1);
}

@keyframes reelStop {

    0% {
        transform:
            translateY(-35px);
    }

    55% {
        transform:
            translateY(10px);
    }

    78% {
        transform:
            translateY(-5px);
    }

    100% {
        transform:
            translateY(0);
    }
}

/* ==========================================================
   FINAL REEL ANTICIPATION
========================================================== */

#slot3.final-reel-anticipation {

    border-color: #ff1800 !important;

    box-shadow:
        0 0 10px #ff0000,
        0 0 25px #ff3b00,
        0 0 50px #ff0000,
        inset 0 0 18px
        rgba(255,0,0,.65) !important;

    animation:
        finalReelFireFrame
        .22s
        infinite alternate !important;

    z-index: 20;
}

@keyframes finalReelFireFrame {

    from {

        border-color: #ff0000;

        box-shadow:
            0 0 8px #ff0000,
            0 0 20px #ff3b00,
            0 0 35px rgba(255,0,0,.75),
            inset 0 0 12px rgba(255,0,0,.45);
    }

    to {

        border-color: #ffb000;

        box-shadow:
            0 0 15px #ff0000,
            0 0 35px #ff4500,
            0 0 70px #ff0000,
            inset 0 0 22px rgba(255,60,0,.9);
    }
}

#slot3.final-reel-anticipation.reel-spin {

    animation:
        reelSpin
        .12s
        linear
        infinite,
        finalReelFireFrame
        .22s
        infinite alternate !important;
}

/* ==========================================================
   FIRE AROUND FINAL REEL
========================================================== */

.final-reel-fire {

    position: absolute;

    left: -22px;
    right: -22px;
    top: -22px;
    bottom: -22px;

    pointer-events: none;

    z-index: 25;

    border-radius: 22px;

    background:
        radial-gradient(
            ellipse at center,
            transparent 25%,
            rgba(255,60,0,.12) 45%,
            rgba(255,0,0,.35) 70%,
            transparent 80%
        );

    filter:
        blur(5px);

    animation:
        finalReelFireGlow
        .35s
        infinite alternate;
}

@keyframes finalReelFireGlow {

    from {

        transform:
            scale(.96);

        opacity: .7;
    }

    to {

        transform:
            scale(1.08);

        opacity: 1;
    }
}

/* ==========================================================
   FLAMES
========================================================== */

.final-reel-flame {

    position: absolute;

    width: var(--fire-size);
    height: var(--fire-size);

    left: var(--fire-left);
    bottom: var(--fire-bottom);

    pointer-events: none;

    border-radius:
        50% 50% 45% 45%;

    background:
        radial-gradient(
            circle at 50% 75%,
            #fff6a0 0%,
            #ffd000 20%,
            #ff6800 48%,
            #ff1800 70%,
            transparent 76%
        );

    filter: blur(1px);

    opacity:
        var(--fire-opacity);

    transform:
        rotate(var(--fire-rotate));

    animation:
        finalReelFlame
        var(--fire-duration)
        ease-in-out
        infinite alternate;
}

@keyframes finalReelFlame {

    from {

        transform:
            translateY(5px)
            scale(.75)
            rotate(var(--fire-rotate));

        opacity: .45;
    }

    to {

        transform:
            translateY(-15px)
            scale(1.25)
            rotate(calc(var(--fire-rotate) * -1));

        opacity: 1;
    }
}

/* ==========================================================
   FIRE PARTICLES
========================================================== */

.final-reel-particle {

    position: absolute;

    width: var(--particle-size);
    height: var(--particle-size);

    left: var(--particle-left);
    bottom: var(--particle-bottom);

    border-radius: 50%;

    pointer-events: none;

    background:
        radial-gradient(
            circle,
            #fff 0%,
            #ffd700 25%,
            #ff5a00 55%,
            #f00 75%,
            transparent 100%
        );

    box-shadow:
        0 0 6px #ffcc00,
        0 0 14px #ff3000;

    animation:
        finalReelParticle
        var(--particle-duration)
        linear
        infinite;

    animation-delay:
        var(--particle-delay);
}

@keyframes finalReelParticle {

    0% {

        transform:
            translate3d(0,0,0)
            scale(.4);

        opacity: 0;
    }

    15% {
        opacity: 1;
    }

    100% {

        transform:
            translate3d(
                var(--particle-drift),
                var(--particle-rise),
                0
            )
            scale(0);

        opacity: 0;
    }
}

/* ==========================================================
   HOLD / ICE
========================================================== */

#holdOverlay {
    position: fixed;

    inset: 0;

    z-index: 100;

    display: flex;

    align-items: center;
    justify-content: center;

    background:
        rgba(0,30,60,.72);

    backdrop-filter:
        blur(4px);

    opacity: 0;

    visibility: hidden;

    transition:
        .3s ease;
}

#holdOverlay.active {

    opacity: 1;

    visibility: visible;
}

.ice-mode {
    filter:
        hue-rotate(120deg)
        saturate(.8);
}

/* ==========================================================
   SNOW
========================================================== */

#snowContainer {

    position: fixed;

    inset: 0;

    pointer-events: none;

    z-index: 110;

    opacity: 0;

    visibility: hidden;
}

#snowContainer.active {

    opacity: 1;

    visibility: visible;
}

.snowflake {

    position: absolute;

    top: -20px;

    width: var(--size);
    height: var(--size);

    border-radius: 50%;

    background: #fff;

    opacity: var(--opacity);

    box-shadow:
        0 0 8px #fff;

    animation:
        snowFall
        var(--duration)
        linear
        infinite;
}

@keyframes snowFall {

    0% {

        transform:
            translate3d(
                0,
                -30px,
                0
            );
    }

    100% {

        transform:
            translate3d(
                var(--sway),
                110vh,
                0
            );
    }
}

/* ==========================================================
   ANTICIPATION OVERLAY
========================================================== */

#anticipationOverlay {

    position: fixed;

    inset: 0;

    z-index: 90;

    pointer-events: none;

    opacity: 0;

    visibility: hidden;

    background:
        radial-gradient(
            circle,
            rgba(255,40,0,.12),
            transparent 65%
        );

    transition:
        opacity .2s ease;
}

#anticipationOverlay.active {

    opacity: 1;

    visibility: visible;
}

#anticipationParticles {

    position: absolute;

    inset: 0;

    overflow: hidden;
}

.anticipation-particle {

    position: absolute;

    bottom: -20px;

    border-radius: 50%;

    background:
        #ff4b00;

    box-shadow:
        0 0 10px #ff0000;

    animation:
        anticipationRise
        var(--duration)
        linear
        infinite;
}

@keyframes anticipationRise {

    from {

        transform:
            translate3d(
                0,
                0,
                0
            );

        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    to {

        transform:
            translate3d(
                var(--drift),
                -110vh,
                0
            );

        opacity: 0;
    }
}

/* ==========================================================
   BUTTON
========================================================== */

#button,
.spin-button {

    position: relative;

    min-width: 220px;

    padding:
        16px
        35px;

    border:
        3px solid #ffd447;

    border-radius: 14px;

    background:
        linear-gradient(
            180deg,
            #ff4d00,
            #9d1200
        );

    color: #fff;

    font-size: 20px;

    font-weight: 900;

    letter-spacing: 2px;

    cursor: pointer;

    box-shadow:
        0 5px 0 #5b0c00,
        0 0 20px rgba(255,80,0,.5);

    transition:
        .15s ease;
}

#button:hover,
.spin-button:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 7px 0 #5b0c00,
        0 0 30px #ff4500;
}

#button:active,
.spin-button:active {

    transform:
        translateY(4px);

    box-shadow:
        0 2px 0 #5b0c00;
}

#button:disabled,
.spin-button:disabled {

    opacity: .45;

    cursor:
        not-allowed;

    transform:
        none;
}

/* ==========================================================
   MESSAGE
========================================================== */

#message {

    min-height: 35px;

    margin:
        12px 0;

    text-align: center;

    font-size: 22px;

    font-weight: 900;

    color: #ffd83d;

    text-shadow:
        0 0 10px #ff5a00;
}

/* ==========================================================
   PROGRESS
========================================================== */

#spinProgress,
#persistentBar {

    position: relative;

    width: 100%;

    height: 14px;

    overflow: hidden;

    border-radius: 20px;

    background:
        #111;

    border:
        2px solid #555;

    box-shadow:
        inset 0 2px 5px #000;
}

#spinProgressFill,
#persistentFill {

    height: 100%;

    width: 0%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #ff2400,
            #ffb300,
            #fff000
        );

    box-shadow:
        0 0 10px #ff5a00;

    transition:
        width .35s ease;
}

/* ==========================================================
   COUNTER
========================================================== */

#counterValue,
#persistentValue,
#roundStatus {

    text-align: center;

    font-weight: 900;

    color: #ffd34d;

    text-shadow:
        0 0 8px #ff6400;
}

/* ==========================================================
   JACKPOT LAMP
========================================================== */

#jackpotLamp {

    width: 22px;
    height: 22px;

    margin: 10px auto;

    border-radius: 50%;

    background:
        #330000;

    border:
        2px solid #8b4b00;

    box-shadow:
        inset 0 0 8px #000;
}

#jackpotLamp.on {

    background:
        #fff700;

    box-shadow:
        0 0 10px #fff000,
        0 0 25px #ff9000,
        0 0 50px #ff3000;

    animation:
        lampFlash
        .18s
        infinite alternate;
}

@keyframes lampFlash {

    from {
        opacity: .65;
    }

    to {
        opacity: 1;
    }
}

/* ==========================================================
   LEVER
========================================================== */

.real-lever {
    transform-origin:
        top center;
}

.pull-lever {

    animation:
        leverPull
        .35s
        ease-out;
}

@keyframes leverPull {

    0% {
        transform:
            rotate(0deg);
    }

    45% {
        transform:
            rotate(35deg);
    }

    100% {
        transform:
            rotate(0deg);
    }
}

/* ==========================================================
   JACKPOT FLASH
========================================================== */

.flash {

    animation:
        jackpotFlash
        .15s
        infinite alternate;
}

@keyframes jackpotFlash {

    from {

        filter:
            brightness(1);
    }

    to {

        filter:
            brightness(2.5)
            saturate(1.8);
    }
}

/* ==========================================================
   COINS
========================================================== */

.coin {

    position: fixed;

    top: -30px;

    width: 18px;
    height: 18px;

    z-index: 500;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            #fff19a,
            #ffd000 40%,
            #b56b00 80%
        );

    border:
        2px solid #fff2a0;

    box-shadow:
        0 0 10px #ffd000;

    animation:
        coinFall
        3.5s
        linear
        forwards;
}

@keyframes coinFall {

    to {

        transform:
            translateY(115vh)
            rotate(720deg);
    }
}

/* ==========================================================
   CONFETTI
========================================================== */

.confetti {

    position: fixed;

    top: -20px;

    width: 9px;
    height: 18px;

    z-index: 490;

    animation:
        confettiFall
        4s
        linear
        forwards;
}

@keyframes confettiFall {

    to {

        transform:
            translateY(115vh)
            rotate(720deg);
    }
}

/* ==========================================================
   MINI COINS
========================================================== */

.mini-coin {

    position: absolute;

    width: 8px;
    height: 8px;

    border-radius: 50%;

    background:
        #ffd700;

    box-shadow:
        0 0 7px #ffb300;

    animation:
        miniCoin
        1.2s
        ease-out
        forwards;
}

@keyframes miniCoin {

    from {

        transform:
            translateY(0)
            scale(.5);

        opacity: 1;
    }

    to {

        transform:
            translateY(-40px)
            scale(0);

        opacity: 0;
    }
}

/* ==========================================================
   ROUND COMPLETE
========================================================== */

#machine.round-complete {

    animation:
        roundComplete
        .25s
        infinite alternate;
}

@keyframes roundComplete {

    from {

        transform:
            scale(1);
    }

    to {

        transform:
            scale(1.015);
    }
}

/* ==========================================================
   MOBILE
========================================================== */

@media (max-width: 600px) {

    #game,
    .game-container,
    .amaze-game {

        padding:
            10px
            6px
            25px;
    }

    #machine {

        width: 98vw;

        padding:
            18px
            8px
            22px;

        border-width:
            4px;
    }

    .slots,
    .slot-machine,
    .reels {

        padding: 7px;

        border-width:
            3px;
    }

    .slot,
    .reel {

        height: 185px;

        border-width:
            2px;
    }

    #slot2,
    #slot3 {

        border-left-width:
            5px;
    }

    #slot2::before,
    #slot3::before {

        left: -5px;

        width: 5px;
    }

    #slot1,
    #slot2,
    #slot3 {

        font-size: 62px;
    }

    #button,
    .spin-button {

        width: 90%;

        min-width: 0;

        padding:
            14px
            20px;

        font-size: 18px;
    }

    #message {

        font-size: 18px;
    }
}

/* ==========================================================
   VERY SMALL PHONES
========================================================== */

@media (max-width: 380px) {

    .slot,
    .reel {

        height: 160px;
    }

    #slot1,
    #slot2,
    #slot3 {

        font-size: 52px;
    }

    #machine {

        padding:
            14px
            5px
            18px;
    }
}

/* ==========================================================
   ACCESSIBILITY
========================================================== */

button:focus-visible {

    outline:
        3px solid #fff;

    outline-offset:
        4px;
}

/* ==========================================================
   REDUCED MOTION
========================================================== */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {

        animation-duration:
            .01ms !important;

        animation-iteration-count:
            1 !important;

        scroll-behavior:
            auto !important;
    }
}
