/* =====================================
   ALMOST JACKPOT
   METAL MAZE SLOT MACHINE
   ===================================== */


.machine {
    position: relative;
    width: 360px;
    height: 520px;
    border-radius: 45px;

    /* метален корпус */
    background:
        linear-gradient(
            145deg,
            #e5e8eb 0%,
            #899198 25%,
            #454b52 60%,
            #1d2126 100%
        );

    border: 8px solid #111;

    box-shadow:
        inset 0 0 30px rgba(255,255,255,.25),
        inset -20px -20px 40px rgba(0,0,0,.5),
        0 25px 50px rgba(0,0,0,.7);

    overflow: visible;
}


/* =====================================
   MAZE / PAC-MAN ПАТЕРН
   ===================================== */

.machine::before {

    content:"";

    position:absolute;

    inset:20px;

    border-radius:35px;

    background-image:
    linear-gradient(
        90deg,
        transparent 48%,
        rgba(0,200,255,.25) 50%,
        transparent 52%
    ),
    linear-gradient(
        0deg,
        transparent 48%,
        rgba(0,200,255,.25) 50%,
        transparent 52%
    );

    background-size:
        55px 55px;

    opacity:.35;

    pointer-events:none;

}


/* допълнителни лабиринт линии */

.machine::after {

    content:"";

    position:absolute;

    inset:35px;

    border-radius:25px;

    background:
    repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 40px,
        rgba(0,210,255,.18) 42px
    ),
    repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 40px,
        rgba(0,210,255,.18) 42px
    );

    opacity:.25;

}


/* =====================================
   ЕКРАН / ГОРЕН ПАНЕЛ
   ===================================== */


.machine-title {

    position:absolute;

    top:35px;
    left:50%;

    transform:translateX(-50%);

    color:#ffd700;

    font-size:28px;

    font-weight:bold;

    letter-spacing:4px;

    text-shadow:
        0 0 10px #ffd700;

}


/* =====================================
   БАРАБАНИ
   ===================================== */


.reels {

    position:absolute;

    top:140px;

    left:50%;

    transform:translateX(-50%);

    width:260px;
    height:130px;

    display:flex;

    gap:12px;

    padding:15px;

    background:
    linear-gradient(
        #101010,
        #303030
    );

    border-radius:20px;

    border:5px solid #777;

    box-shadow:
        inset 0 0 20px black;

}


.reel {

    flex:1;

    background:white;

    border-radius:12px;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:42px;

    box-shadow:
        inset 0 0 10px #555;

}


/* =====================================
   ЗЛАТЕН SPIN БУТОН
   ===================================== */


#spin,
#button {


    position:absolute;

    bottom:55px;

    left:50%;

    transform:translateX(-50%);


    width:105px;

    height:105px;

    border-radius:50%;


    border:

    8px solid #ffe87a;


    background:

    radial-gradient(
        circle at 35% 30%,
        #fff7a8,
        #ffd700 35%,
        #b47700 80%
    );


    color:#222;


    font-size:24px;

    font-weight:900;


    cursor:pointer;


    box-shadow:

    0 10px 0 #704600,

    0 15px 30px rgba(0,0,0,.8),

    0 0 25px #ffd700;


    transition:.15s;

}



#spin:hover,
#button:hover {

    box-shadow:

    0 10px 0 #704600,

    0 0 45px #ffd700;


}



#spin:active,
#button:active {

    transform:
    translateX(-50%)
    translateY(8px);


    box-shadow:

    0 2px 0 #704600,

    0 0 20px #ffd700;

}


/* =====================================
   РЪЧКА ВДЯСНО
   ===================================== */


.lever {


    position:absolute;


    right:-85px;

    top:170px;


    width:110px;

    height:25px;


    background:

    linear-gradient(
        90deg,
        #333,
        #ddd,
        #555
    );


    border-radius:15px;


    transform:rotate(-25deg);


    box-shadow:

    0 10px 15px black;

}



.lever::after {


    content:"";


    position:absolute;


    right:-25px;

    top:-25px;


    width:55px;

    height:55px;


    border-radius:50%;


    background:

    radial-gradient(
        circle at 30% 30%,
        #fff5a0,
        #ffd700,
        #8a5a00
    );


    border:5px solid #fff0a0;


    box-shadow:

    0 5px 15px black;

}



/* =====================================
   LED ЛАМПИ
   ===================================== */


.led {

    width:12px;
    height:12px;

    border-radius:50%;

    background:#00eaff;

    box-shadow:

    0 0 15px #00eaff;

}
