/* ==========================================================
   AMAZE ESCAPE
   STYLE v7
   ----------------------------------------------------------
   3 REELS
   FINAL REEL FIRE
   ANTICIPATION
   ICE HOLD
   JACKPOT
   PROGRESS
   PERSISTENT REWARD
   MOBILE
========================================================== */


/* ==========================================================
   RESET
========================================================== */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}


html {
    width: 100%;
    min-height: 100%;
    background: #050008;
}


body {
    width: 100%;
    min-height: 100vh;

    overflow-x: hidden;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #ffffff;

    background:
        radial-gradient(
            circle at 50% 20%,
            #25002e 0%,
            #100018 35%,
            #050008 75%,
            #020003 100%
        );
}


/* ==========================================================
   CASINO BACKGROUND
========================================================== */

.casino-background {
    position: fixed;

    inset: 0;

    overflow: hidden;

    pointer-events: none;

    z-index: 0;

    background:
        radial-gradient(
            circle at 20% 30%,
            rgba(255, 0, 60, .08),
            transparent 25%
        ),
        radial-gradient(
            circle at 80% 20%,
            rgba(255, 180, 0, .08),
            transparent 25%
        ),
        radial-gradient(
            circle at 50% 80%,
            rgba(80, 0, 255, .08),
            transparent 30%
        );
}


.casino-particle {
    position: absolute;

    bottom: -20px;

    border-radius: 50%;

    background: #ffd700;

    opacity: var(--opacity);

    box-shadow:
        0 0 6px #ffd700,
        0 0 14px rgba(255, 120, 0, .6);

    animation:
        casinoFloat
        var(--duration)
        linear
        infinite;

    pointer-events: none;
}


@keyframes casinoFloat {

    0% {
        transform:
            translate3d(0, 0, 0)
            scale(.5);

        opacity: 0;
    }

    15% {
        opacity: var(--opacity);
    }

    85% {
        opacity: var(--opacity);
    }

    100% {
        transform:
            translate3d(var(--drift), -110vh, 0)
            scale(1.2);

        opacity: 0;
    }
}


/* ==========================================================
   SNOW
========================================================== */

.snow-container {
    position: fixed;

    inset: 0;

    overflow: hidden;

    pointer-events: none;

    z-index: 100;

    opacity: 0;

    visibility: hidden;

    transition:
        opacity .5s ease,
        visibility .5s ease;
}


.snow-container.active {
    opacity: 1;
    visibility: visible;
}


.snowflake {
    position: absolute;

    top: -20px;

    width: var(--size);
    height: var(--size);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            #ffffff 0%,
            #dff8ff 50%,
            rgba(150, 220, 255, .1) 100%
        );

    opacity: var(--opacity);

    filter:
        drop-shadow(
            0 0 5px #9eeaff
        );

    animation:
        snowfall
        var(--duration)
        linear
        infinite;
}


@keyframes snowfall {

    0% {
        transform:
            translate3d(0, -20px, 0)
            rotate(0deg);
    }

    50% {
        transform:
            translate3d(var(--sway), 50vh, 0)
            rotate(180deg);
    }

    100% {
        transform:
            translate3d(
                calc(var(--sway) * -1),
                110vh,
                0
            )
            rotate(360deg);
    }
}


/* ==========================================================
   GAME WRAPPER
========================================================== */

.game-wrapper {
    position: relative;

    z-index: 10;

    width: min(94vw, 680px);

    margin: 0 auto;

    padding:
        25px
        15px
        40px;
}


/* ==========================================================
   HEADER
========================================================== */

.game-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 15px;

    margin-bottom: 18px;
}


.brand {
    text-align: left;
}


.brand-small {
    color: #ffcf00;

    font-size: 11px;

    font-weight: 900;

    letter-spacing: 5px;

    text-shadow:
        0 0 8px #ffae00;
}


.brand h1 {
    color: #ffffff;

    font-size:
        clamp(28px, 8vw, 48px);

    font-weight: 1000;

    line-height: .9;

    letter-spacing: 2px;

    text-shadow:
        0 3px 0 #760000,
        0 0 10px #ff1800,
        0 0 25px rgba(255, 0, 0, .6);
}


.round-status {
    padding:
        9px
        13px;

    border:
        1px solid rgba(255, 200, 0, .65);

    border-radius: 10px;

    color: #ffd700;

    background:
        rgba(70, 20, 0, .65);

    font-size: 12px;

    font-weight: 900;

    letter-spacing: 1px;

    box-shadow:
        0 0 12px rgba(255, 160, 0, .25);
}


/* ==========================================================
   SLOT MACHINE
========================================================== */

.slot-machine {
    position: relative;

    width: 100%;

    padding:
        20px
        18px
        25px;

    border:
        3px solid #8e1300;

    border-radius: 28px;

    background:
        linear-gradient(
            145deg,
            #420006 0%,
            #180007 40%,
            #090006 100%
        );

    box-shadow:
        0 0 0 2px #ffae00,
        0 0 0 5px #300006,
        0 20px 70px rgba(0, 0, 0, .8),
        0 0 35px rgba(255, 30, 0, .25);

    transition:
        box-shadow .4s ease,
        filter .4s ease,
        transform .3s ease;
}


/* ==========================================================
   MACHINE PLAYING
========================================================== */

.slot-machine.playing {
    box-shadow:
        0 0 0 2px #ffb000,
        0 0 0 5px #430000,
        0 20px 70px rgba(0, 0, 0, .8),
        0 0 50px rgba(255, 40, 0, .55);
}


.slot-machine.playing .machine-title {
    animation:
        titlePulse
        .35s
        ease-in-out
        infinite alternate;
}


@keyframes titlePulse {

    from {
        text-shadow:
            0 0 6px #ff8c00;
    }

    to {
        text-shadow:
            0 0 8px #fff,
            0 0 20px #ff4500,
            0 0 35px #ff0000;
    }
}


/* ==========================================================
   MACHINE TOP
========================================================== */

.machine-top {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 12px;

    margin-bottom: 18px;
}


.machine-title {
    color: #ffd34e;

    font-size:
        clamp(13px, 3.5vw, 19px);

    font-weight: 1000;

    letter-spacing: 1px;

    text-shadow:
        0 0 8px #ff6500;
}


.jackpot-lamp {
    display: flex;

    align-items: center;

    gap: 6px;

    opacity: .45;

    transition:
        opacity .2s ease,
        transform .2s ease;
}


.jackpot-lamp.on {
    opacity: 1;

    animation:
        jackpotLamp
        .25s
        infinite alternate;
}


.lamp-light {
    width: 10px;
    height: 10px;

    border-radius: 50%;

    background: #4b0000;

    box-shadow:
        inset 0 0 3px #000;
}


.jackpot-lamp.on .lamp-light {
    background: #ffec00;

    box-shadow:
        0 0 5px #fff,
        0 0 12px #ffcf00,
        0 0 25px #ff3300;
}


.lamp-text {
    color: #ffcf00;

    font-size: 9px;

    font-weight: 1000;

    letter-spacing: 1px;
}


@keyframes jackpotLamp {

    from {
        transform: scale(1);
    }

    to {
        transform: scale(1.08);
    }
}


/* ==========================================================
   REELS FRAME
========================================================== */

.reels-frame {
    position: relative;

    display: grid;

    grid-template-columns:
        repeat(3, minmax(0, 1fr));

    gap: 10px;

    width: 100%;

    padding:
        13px;

    border:
        3px solid #d68b00;

    border-radius: 18px;

    background:
        linear-gradient(
            180deg,
            #130000,
            #020003
        );

    box-shadow:
        inset 0 0 25px #000,
        0 0 20px rgba(255, 150, 0, .2);
}


/* ==========================================================
   REEL SIDE LIGHTS
========================================================== */

.reel-side-light {
    position: absolute;

    top: 10px;
    bottom: 10px;

    width: 4px;

    border-radius: 10px;

    background:
        linear-gradient(
            180deg,
            transparent,
            #ffdc00,
            #ff1800,
            #ffdc00,
            transparent
        );

    box-shadow:
        0 0 10px #ff4500,
        0 0 20px #ff1800;

    opacity: .8;

    animation:
        sideLight
        1.2s
        ease-in-out
        infinite alternate;
}


.reel-side-light.left {
    left: 5px;
}


.reel-side-light.right {
    right: 5px;
}


@keyframes sideLight {

    from {
        opacity: .4;
    }

    to {
        opacity: 1;
    }
}


/* ==========================================================
   REELS
========================================================== */

.reel {
    position: relative;

    display: flex;

    align-items: center;
    justify-content: center;

    min-width: 0;

    height:
        clamp(120px, 28vw, 190px);

    overflow: hidden;

    border:
        3px solid #ffb000;

    border-radius: 15px;

    color: #ffffff;

    background:
        radial-gradient(
            circle at 50% 40%,
            #ffffff 0%,
            #e9e9e9 35%,
            #a9a9a9 65%,
            #555 100%
        );

    font-size:
        clamp(55px, 13vw, 100px);

    line-height: 1;

    text-align: center;

    text-shadow:
        0 3px 4px rgba(0, 0, 0, .5);

    box-shadow:
        inset 0 0 15px rgba(0, 0, 0, .65),
        0 0 12px rgba(255, 170, 0, .35);

    transform:
        translateZ(0);

    will-change:
        transform,
        filter,
        box-shadow;

    transition:
        border-color .2s ease,
        box-shadow .2s ease;
}


/* ==========================================================
   REEL INNER SHINE
========================================================== */

.reel::before {
    content: "";

    position: absolute;

    inset: 0;

    pointer-events: none;

    z-index: 2;

    background:
        linear-gradient(
            110deg,
            rgba(255,255,255,.35),
            transparent 20%,
            transparent 70%,
            rgba(255,255,255,.12)
        );

    mix-blend-mode: screen;
}


/* ==========================================================
   REEL SHADOW
========================================================== */

.reel::after {
    content: "";

    position: absolute;

    left: 0;
    right: 0;

    top: 50%;

    height: 2px;

    pointer-events: none;

    z-index: 3;

    background:
        rgba(255,255,255,.8);

    box-shadow:
        0 0 5px rgba(255,255,255,.8);

    opacity: .2;
}


/* ==========================================================
   FINAL REEL BASE
========================================================== */

#slot3 {
    border-color: #ffbd00;

    box-shadow:
        inset 0 0 18px rgba(0,0,0,.7),
        0 0 16px rgba(255,180,0,.5);

    z-index: 5;
}


/* ==========================================================
   REEL SPIN
========================================================== */

.reel-spin {
    animation:
        reelSpin
        .12s
        linear
        infinite;

    filter:
        blur(.5px)
        brightness(1.08);
}


@keyframes reelSpin {

    0% {
        transform:
            translateY(-8px)
            scaleY(.96);
    }

    50% {
        transform:
            translateY(8px)
            scaleY(1.04);
    }

    100% {
        transform:
            translateY(-8px)
            scaleY(.96);
    }
}


/* ==========================================================
   REEL STOP
========================================================== */

.reel-stop {
    animation:
        reelStop
        .28s
        cubic-bezier(.17,.67,.3,1.4);
}


@keyframes reelStop {

    0% {
        transform:
            translateY(-12px)
            scaleY(.94);
    }

    55% {
        transform:
            translateY(7px)
            scaleY(1.04);
    }

    100% {
        transform:
            translateY(0)
            scaleY(1);
    }
}


/* ==========================================================
   FINAL REEL ANTICIPATION
========================================================== */

#slot3.final-reel-anticipation {

    border-color: #ff1800 !important;

    background:
        radial-gradient(
            circle at 50% 50%,
            #fff4d0 0%,
            #ffbd00 25%,
            #ff6500 48%,
            #8e0000 75%,
            #160000 100%
        );

    box-shadow:
        0 0 10px #ff0000,
        0 0 25px #ff3b00,
        0 0 50px #ff0000,
        0 0 80px rgba(255,0,0,.65),
        inset 0 0 25px rgba(255,0,0,.7);

    animation:
        finalReelFireFrame
        .22s
        infinite alternate;

    z-index: 20;
}


/* ==========================================================
   ANTICIPATION MODE
========================================================== */

.slot-machine.anticipation-mode {

    border-color: #ff2400;

    box-shadow:
        0 0 0 2px #ffcf00,
        0 0 0 5px #ff1200,
        0 0 40px #ff1800,
        0 0 100px rgba(255,0,0,.7),
        inset 0 0 40px rgba(255,0,0,.15);

    animation:
        machineFire
        .3s
        infinite alternate;
}


@keyframes machineFire {

    from {
        filter:
            brightness(1);
    }

    to {
        filter:
            brightness(1.12);
    }
}


/* ==========================================================
   REEL STATUS
========================================================== */

.reel-status {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 9px;

    margin-top: 12px;

    color: #8e8e8e;

    font-size: 9px;

    font-weight: 900;

    letter-spacing: 3px;
}


.status-dot {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #ff4d00;

    box-shadow:
        0 0 7px #ff3000;
}


/* ==========================================================
   GAME MESSAGE
========================================================== */

.game-message {
    min-height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin-top: 12px;

    color: #ffffff;

    font-size:
        clamp(16px, 4vw, 23px);

    font-weight: 1000;

    letter-spacing: 1px;

    text-align: center;

    text-shadow:
        0 0 8px #ff4d00,
        0 0 20px rgba(255,0,0,.5);
}


/* ==========================================================
   LEVER
========================================================== */

.lever-area {
    position: absolute;

    right: -48px;

    top: 120px;

    width: 65px;

    height: 170px;
}


.lever-base {
    position: absolute;

    right: 0;

    top: 45px;

    width: 45px;
    height: 90px;

    border-radius:
        12px
        18px
        18px
        12px;

    background:
        linear-gradient(
            90deg,
            #310000,
            #a00000,
            #380000
        );

    border:
        2px solid #d58a00;

    box-shadow:
        0 0 15px rgba(255, 70, 0, .3);
}


.real-lever {
    position: absolute;

    left: 12px;

    top: -35px;

    width: 18px;

    height: 110px;

    transform-origin:
        50% 90%;

    transition:
        transform .15s ease;
}


.real-lever.pull-lever {
    animation:
        pullLever
        .5s
        cubic-bezier(.2,.8,.3,1);
}


@keyframes pullLever {

    0% {
        transform:
            rotate(0deg);
    }

    35% {
        transform:
            rotate(32deg);
    }

    65% {
        transform:
            rotate(25deg);
    }

    100% {
        transform:
            rotate(0deg);
    }
}


.lever-stick {
    position: absolute;

    left: 5px;
    bottom: 5px;

    width: 8px;
    height: 82px;

    border-radius: 10px;

    background:
        linear-gradient(
            90deg,
            #555,
            #eeeeee,
            #555
        );

    box-shadow:
        0 0 6px #fff;
}


.lever-ball {
    position: absolute;

    top: 0;
    left: 0;

    width: 22px;
    height: 22px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 30% 25%,
            #ffcf00,
            #ff3500 55%,
            #700000
        );

    box-shadow:
        0 0 8px #ff4500,
        0 0 20px rgba(255,0,0,.5);

    z-index: 2;
}


/* ==========================================================
   SPIN BUTTON
========================================================== */

.spin-button {
    position: relative;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 10px;

    width: min(100%, 330px);

    min-height: 62px;

    margin:
        15px auto
        20px;

    overflow: hidden;

    border:
        2px solid #ffd000;

    border-radius: 16px;

    color: #ffffff;

    background:
        linear-gradient(
            180deg,
            #ff3d00,
            #b40000 55%,
            #650000
        );

    font-size: 20px;

    font-weight: 1000;

    letter-spacing: 3px;

    cursor: pointer;

    box-shadow:
        0 5px 0 #400000,
        0 0 20px rgba(255, 50, 0, .45);

    transition:
        transform .1s ease,
        filter .15s ease,
        box-shadow .15s ease;
}


.spin-button:hover:not(:disabled) {
    filter: brightness(1.15);

    box-shadow:
        0 5px 0 #400000,
        0 0 30px rgba(255, 50, 0, .7);
}


.spin-button:active:not(:disabled) {
    transform:
        translateY(4px);

    box-shadow:
        0 1px 0 #400000,
        0 0 20px rgba(255, 50, 0, .5);
}


.spin-button:disabled {
    cursor: not-allowed;

    opacity: .45;

    filter:
        grayscale(.25);
}


.button-icon {
    position: relative;
    z-index: 2;

    font-size: 22px;
}


.button-text {
    position: relative;
    z-index: 2;
}


.button-glow {
    position: absolute;

    inset: -50%;

    background:
        linear-gradient(
            120deg,
            transparent 35%,
            rgba(255,255,255,.4) 50%,
            transparent 65%
        );

    transform:
        translateX(-70%);

    animation:
        buttonShine
        3s
        infinite;
}


@keyframes buttonShine {

    0%,
    60% {
        transform:
            translateX(-70%);
    }

    80%,
    100% {
        transform:
            translateX(70%);
    }
}


/* ==========================================================
   PROGRESS
========================================================== */

.progress-section {
    margin-top: 8px;
}


.progress-header,
.persistent-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 10px;

    margin-bottom: 7px;

    color: #9b9b9b;

    font-size: 10px;

    font-weight: 900;

    letter-spacing: 1px;
}


.progress-header strong {
    color: #ffd000;
}


.progress-bar,
.persistent-bar {
    position: relative;

    width: 100%;

    height: 12px;

    overflow: hidden;

    border:
        1px solid #5e2900;

    border-radius: 20px;

    background:
        #090909;

    box-shadow:
        inset 0 2px 5px rgba(0,0,0,.8);
}


.progress-fill {
    width: 0;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #ff1800,
            #ff9d00,
            #ffe600
        );

    box-shadow:
        0 0 10px #ff4d00,
        0 0 20px rgba(255,100,0,.5);

    transition:
        width .3s ease;
}


/* ==========================================================
   PERSISTENT REWARD
========================================================== */

.persistent-section {
    margin-top: 17px;

    padding-top: 13px;

    border-top:
        1px solid rgba(255,255,255,.08);
}


.persistent-header {
    color: #b68bff;
}


.persistent-icon {
    margin-right: -4px;
}


.persistent-header strong {
    margin-left: auto;

    color: #ffd700;
}


.persistent-fill {
    position: relative;

    width: 0;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #6b00ff,
            #bd30ff,
            #ffd000
        );

    box-shadow:
        0 0 10px #a000ff,
        0 0 20px rgba(150,0,255,.5);

    transition:
        width .35s ease;
}


.mini-coin {
    position: absolute;

    width: 8px;
    height: 8px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 30% 25%,
            #fff7a0,
            #ffd000 35%,
            #e18b00 70%,
            #8c4200
        );

    box-shadow:
        0 0 5px #ffd000;

    pointer-events: none;

    animation:
        miniCoin
        1.1s
        ease-out
        forwards;
}


@keyframes miniCoin {

    0% {
        transform:
            translateY(0)
            scale(.4);

        opacity: 0;
    }

    25% {
        opacity: 1;
    }

    100% {
        transform:
            translateY(-30px)
            scale(1.2);

        opacity: 0;
    }
}


/* ==========================================================
   ANTICIPATION OVERLAY
========================================================== */

.anticipation-overlay {
    position: fixed;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    overflow: hidden;

    pointer-events: none;

    opacity: 0;
    visibility: hidden;

    z-index: 500;

    background:
        radial-gradient(
            circle at center,
            rgba(255, 80, 0, .12),
            rgba(80, 0, 0, .25) 35%,
            rgba(0,0,0,.72) 100%
        );

    transition:
        opacity .2s ease,
        visibility .2s ease;
}


.anticipation-overlay.active {
    opacity: 1;
    visibility: visible;
}


.anticipation-glow {
    position: absolute;

    width: 55vw;
    height: 55vw;

    max-width: 550px;
    max-height: 550px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(255, 230, 0, .16),
            rgba(255, 40, 0, .13) 30%,
            transparent 70%
        );

    filter:
        blur(10px);

    animation:
        anticipationGlow
        .45s
        infinite alternate;
}


@keyframes anticipationGlow {

    from {
        transform:
            scale(.8);

        opacity: .5;
    }

    to {
        transform:
            scale(1.15);

        opacity: 1;
    }
}


.anticipation-content {
    position: relative;

    text-align: center;

    z-index: 3;

    animation:
        anticipationText
        .45s
        infinite alternate;
}


.anticipation-warning {
    font-size:
        clamp(40px, 13vw, 85px);

    filter:
        drop-shadow(0 0 15px #ff4500);
}


.anticipation-title {
    color: #fff;

    font-size:
        clamp(28px, 8vw, 58px);

    font-weight: 1000;

    letter-spacing: 3px;

    text-shadow:
        0 0 8px #fff,
        0 0 20px #ffcf00,
        0 0 40px #ff4500,
        0 0 70px #ff0000;
}


.anticipation-subtitle {
    margin-top: 5px;

    color: #ffd000;

    font-size:
        clamp(14px, 4vw, 24px);

    font-weight: 1000;

    letter-spacing: 8px;

    text-shadow:
        0 0 15px #ff3000;
}


@keyframes anticipationText {

    from {
        transform:
            scale(.97);

        filter:
            brightness(.9);
    }

    to {
        transform:
            scale(1.04);

        filter:
            brightness(1.25);
    }
}


/* ==========================================================
   ANTICIPATION PARTICLES
========================================================== */

.anticipation-particles {
    position: absolute;

    inset: 0;

    overflow: hidden;
}


.anticipation-particle {
    position: absolute;

    bottom: -20px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            #fff 0%,
            #ffd700 30%,
            #ff4500 65%,
            transparent 100%
        );

    box-shadow:
        0 0 8px #ff9d00,
        0 0 18px #ff1800;

    animation:
        anticipationParticle
        var(--duration)
        linear
        infinite;
}


@keyframes anticipationParticle {

    0% {
        transform:
            translate3d(0, 30px, 0)
            scale(.2);

        opacity: 0;
    }

    15% {
        opacity: 1;
    }

    100% {
        transform:
            translate3d(var(--drift), -110vh, 0)
            scale(0);

        opacity: 0;
    }
}


/* ==========================================================
   ICE MODE
========================================================== */

.slot-machine.ice-mode {

    border-color: #72eaff;

    box-shadow:
        0 0 0 2px #dffcff,
        0 0 0 5px #008cff,
        0 0 35px #00bfff,
        0 0 80px rgba(0,180,255,.5),
        inset 0 0 35px rgba(0,200,255,.15);

    filter:
        saturate(.7);
}


.slot-machine.ice-mode .reel {
    border-color: #79eaff;

    box-shadow:
        inset 0 0 18px rgba(0,100,255,.5),
        0 0 18px rgba(0,200,255,.5);

    filter:
        hue-rotate(20deg)
        saturate(.7);
}


.slot-machine.ice-mode .machine-title {
    color: #bdf8ff;

    text-shadow:
        0 0 10px #00d9ff;
}


/* ==========================================================
   HOLD OVERLAY
========================================================== */

.hold-overlay {
    position: fixed;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 20px;

    z-index: 1000;

    opacity: 0;
    visibility: hidden;

    pointer-events: none;

    transition:
        opacity .35s ease,
        visibility .35s ease;
}


.hold-overlay.active {
    opacity: 1;
    visibility: visible;

    pointer-events: auto;
}


.hold-backdrop {
    position: absolute;

    inset: 0;

    background:
        rgba(0, 15, 35, .82);

    backdrop-filter:
        blur(8px);
}


.hold-card {
    position: relative;

    width: min(90vw, 420px);

    padding:
        35px
        25px;

    border:
        2px solid #9defff;

    border-radius: 24px;

    text-align: center;

    background:
        linear-gradient(
            145deg,
            rgba(5, 60, 95, .95),
            rgba(0, 15, 35, .98)
        );

    box-shadow:
        0 0 20px #00bfff,
        0 0 60px rgba(0,150,255,.5),
        inset 0 0 30px rgba(0,220,255,.12);

    animation:
        iceCard
        1.2s
        ease-in-out
        infinite alternate;
}


@keyframes iceCard {

    from {
        transform:
            scale(.985);

        box-shadow:
            0 0 20px #00bfff,
            0 0 50px rgba(0,150,255,.35);
    }

    to {
        transform:
            scale(1.015);

        box-shadow:
            0 0 30px #8ff5ff,
            0 0 80px rgba(0,150,255,.6);
    }
}


.hold-icon {
    font-size: 55px;

    filter:
        drop-shadow(0 0 15px #00d9ff);
}


.hold-title {
    margin-top: 10px;

    color: #e8fdff;

    font-size: 28px;

    font-weight: 1000;

    letter-spacing: 4px;

    text-shadow:
        0 0 10px #00d9ff;
}


.hold-status {
    margin-top: 8px;

    color: #7feeff;

    font-size: 10px;

    font-weight: 900;

    letter-spacing: 2px;
}


.hold-countdown {
    margin-top: 12px;

    color: #ffffff;

    font-size:
        clamp(65px, 18vw, 100px);

    font-weight: 1000;

    line-height: 1;

    text-shadow:
        0 0 10px #fff,
        0 0 30px #00d9ff,
        0 0 60px #008cff;
}


.hold-seconds {
    color: #82eaff;

    font-size: 10px;

    font-weight: 900;

    letter-spacing: 4px;
}


.hold-progress {
    position: relative;

    width: 100%;

    height: 10px;

    margin-top: 20px;

    overflow: hidden;

    border-radius: 20px;

    background: #00111d;

    border:
        1px solid #126b8a;
}


.hold-progress-fill {
    width: 100%;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #00aaff,
            #a5f8ff
        );

    box-shadow:
        0 0 10px #00d9ff;

    transition:
        width .1s linear;
}


.hold-message {
    margin-top: 15px;

    color: #7896a3;

    font-size: 10px;

    line-height: 1.5;
}


/* ==========================================================
   ROUND COMPLETE
========================================================== */

.slot-machine.round-complete {

    border-color: #ffd700;

    animation:
        roundComplete
        .35s
        infinite alternate;

    box-shadow:
        0 0 0 2px #fff,
        0 0 0 5px #ffcf00,
        0 0 50px #ffcf00,
        0 0 100px rgba(255,150,0,.7);
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
   JACKPOT REEL FLASH
========================================================== */

.reel.flash {

    animation:
        jackpotFlash
        .22s
        infinite alternate;
}


@keyframes jackpotFlash {

    from {
        filter:
            brightness(1);
    }

    to {
        filter:
            brightness(1.8)
            saturate(1.5);

        box-shadow:
            inset 0 0 20px rgba(255,255,255,.8),
            0 0 35px #ffd000,
            0 0 70px #ff4500;
    }
}


/* ==========================================================
   COINS
========================================================== */

.coin {
    position: fixed;

    top: -30px;

    width: 16px;
    height: 16px;

    z-index: 2000;

    border-radius: 50%;

    border:
        2px solid #fff1a0;

    background:
        radial-gradient(
            circle at 30% 25%,
            #fff8a8,
            #ffd000 35%,
            #d68a00 70%,
            #7b4300
        );

    box-shadow:
        0 0 7px #ffd000;

    pointer-events: none;

    animation:
        coinFall
        3.5s
        cubic-bezier(.15,.65,.35,1)
        forwards;
}


@keyframes coinFall {

    0% {
        transform:
            translateY(-30px)
            rotate(0deg);

        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    100% {
        transform:
            translateY(115vh)
            rotate(900deg);

        opacity: 0;
    }
}


/* ==========================================================
   CONFETTI
========================================================== */

.confetti {
    position: fixed;

    top: -20px;

    width: 8px;
    height: 15px;

    z-index: 1999;

    pointer-events: none;

    animation:
        confettiFall
        4s
        cubic-bezier(.15,.65,.35,1)
        forwards;
}


@keyframes confettiFall {

    0% {
        transform:
            translateY(-20px)
            rotate(0deg);

        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    100% {
        transform:
            translateY(115vh)
            translateX(
                calc(
                    -100px +
                    200px * var(--random, .5)
                )
            )
            rotate(900deg);

        opacity: 0;
    }
}


/* ==========================================================
   FOOTER
========================================================== */

.game-footer {
    display: flex;

    justify-content: center;

    gap: 10px;

    margin-top: 20px;

    color: #4f4f58;

    font-size: 8px;

    font-weight: 900;

    letter-spacing: 2px;
}


/* ==========================================================
   ACCESSIBILITY
========================================================== */

button:focus-visible {
    outline:
        3px solid #ffffff;

    outline-offset:
        4px;
}


@media (
    prefers-reduced-motion: reduce
) {

    *,
    *::before,
    *::after {

        animation-duration:
            .001ms !important;

        animation-iteration-count:
            1 !important;

        scroll-behavior:
            auto !important;

    }

}


/* ==========================================================
   TABLET
========================================================== */

@media (max-width: 760px) {

    .game-wrapper {
        width: min(94vw, 620px);

        padding-top: 18px;
    }


    .lever-area {
        right: -38px;

        transform:
            scale(.85);

        transform-origin:
            center right;
    }

}


/* ==========================================================
   MOBILE
========================================================== */

@media (max-width: 600px) {

    .game-wrapper {
        width: 100%;

        padding:
            14px
            9px
            30px;
    }


    .game-header {
        margin-bottom: 12px;
    }


    .brand-small {
        font-size: 8px;

        letter-spacing: 3px;
    }


    .brand h1 {
        font-size: 30px;
    }


    .round-status {
        padding:
            7px
            9px;

        font-size: 9px;
    }


    .slot-machine {
        padding:
            14px
            10px
            18px;

        border-radius: 20px;
    }


    .machine-top {
        margin-bottom: 12px;
    }


    .machine-title {
        font-size: 12px;
    }


    .lamp-text {
        display: none;
    }


    .reels-frame {
        gap: 6px;

        padding: 8px;

        border-radius: 13px;
    }


    .reel {
        height:
            clamp(105px, 31vw, 145px);

        border-width: 2px;

        border-radius: 10px;

        font-size:
            clamp(45px, 14vw, 70px);
    }


    .reel-side-light {
        display: none;
    }


    .reel-status {
        margin-top: 8px;

        font-size: 7px;

        letter-spacing: 2px;
    }


    .game-message {
        min-height: 32px;

        font-size: 16px;
    }


    .lever-area {
        display: none;
    }


    .spin-button {
        min-height: 56px;

        margin-top: 10px;

        border-radius: 13px;

        font-size: 17px;
    }


    .progress-header,
    .persistent-header {
        font-size: 8px;
    }


    .progress-bar,
    .persistent-bar {
        height: 10px;
    }


    .hold-card {
        padding:
            28px
            18px;
    }


    .hold-title {
        font-size: 22px;
    }


    .anticipation-title {
        letter-spacing: 2px;
    }


    .anticipation-subtitle {
        letter-spacing: 5px;
    }

}


/* ==========================================================
   VERY SMALL PHONES
========================================================== */

@media (max-width: 380px) {

    .reel {
        height: 98px;

        font-size: 43px;
    }


    .reels-frame {
        padding: 6px;

        gap: 5px;
    }


    .slot-machine {
        padding-left: 8px;
        padding-right: 8px;
    }


    .machine-title {
        font-size: 10px;
    }


    .round-status {
        font-size: 8px;
    }

}


/* ==========================================================
   FINAL REEL EXTRA FIRE
========================================================== */

#slot3.final-reel-anticipation::before {

    background:
        linear-gradient(
            110deg,
            rgba(255,255,255,.55),
            transparent 20%,
            rgba(255,80,0,.25) 50%,
            transparent 75%
        );

    animation:
        reelFireShine
        .3s
        linear
        infinite;
}


@keyframes reelFireShine {

    from {
        transform:
            translateX(-100%);
    }

    to {
        transform:
            translateX(100%);
    }
}


/* ==========================================================
   END
========================================================== */
