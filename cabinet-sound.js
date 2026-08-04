/*
    CABINET SOUND ENGINE
    Almost Jackpot
*/


let cabinetAudio = null;



function getAudio(){

    if(!cabinetAudio){

        cabinetAudio =
        new AudioContext();

    }


    return cabinetAudio;

}





function tone(
frequency,
duration,
type="sine",
volume=.05
){

    let ctx=getAudio();


    let osc =
    ctx.createOscillator();


    let gain =
    ctx.createGain();


    osc.type=type;


    osc.frequency.value=
    frequency;


    gain.gain.value=
    volume;


    osc.connect(gain);

    gain.connect(
    ctx.destination
    );


    osc.start();


    osc.stop(
    ctx.currentTime+
    duration
    );

}





/*
 старт на механиката
*/


function machineStartSound(){


    tone(
        80,
        .5,
        "sawtooth",
        .08
    );


    setTimeout(()=>{

        tone(
            160,
            .2,
            "square",
            .04
        );

    },200);


}





/*
 щракване на барабан
*/


function reelClickSound(){


    tone(
        900,
        .03,
        "square",
        .025
    );

}





/*
 метална ръчка
*/


function leverMetalSound(){


    tone(
        120,
        .15,
        "square",
        .08
    );


    setTimeout(()=>{

        tone(
            60,
            .2,
            "triangle",
            .05
        );


    },150);


}





/*
 монети
*/


function coinSound(){


for(let i=0;i<8;i++){


setTimeout(()=>{


tone(

1200+
Math.random()*400,

.08,

"sine",

.04

);


},i*80);


}


}





/*
 JACKPOT аларма
*/


function jackpotSound(){



let notes=[

700,
900,
1100,
1400

];



notes.forEach(
(note,index)=>{


setTimeout(()=>{


tone(

note,

.25,

"square",

.08

);


},index*180);



});



}




/*
 автоматично закачане
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const button =
document.getElementById("button")
||
document.getElementById("spin");



if(!button)return;



button.addEventListener(
"click",
()=>{


machineStartSound();


setTimeout(()=>{

reelClickSound();

},400);



});





const message =
document.getElementById("message");



if(message){


const observer =
new MutationObserver(()=>{


let text =
message.innerText;



if(
text.includes("JACKPOT") ||
text.includes("🎉")
){


jackpotSound();


coinSound();


}


});



observer.observe(
message,
{
childList:true,
subtree:true
}
);



}



});
