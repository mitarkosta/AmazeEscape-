/*
 REAL SLOT REEL ENGINE
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const reels=[

document.getElementById("slot1")
||
document.getElementById("one"),

document.getElementById("slot2")
||
document.getElementById("two"),

document.getElementById("slot3")
||
document.getElementById("three")

];



const button=
document.getElementById("button")
||
document.getElementById("spin");



const machine=
document.querySelector(".machine");



if(
!button ||
reels.includes(null)
)return;




let symbols=[

"🍒",
"🍋",
"⭐",
"💎",
"🔔",
"7️⃣"

];





function clickSound(){


let ctx=
new AudioContext();


let osc=
ctx.createOscillator();


let gain=
ctx.createGain();


osc.frequency.value=
120;


gain.gain.value=.04;


osc.connect(gain);

gain.connect(
ctx.destination
);


osc.start();


osc.stop(
ctx.currentTime+.05
);


}





function randomSymbol(){


return symbols[
Math.floor(
Math.random()*symbols.length
)
];


}





button.addEventListener(
"click",
()=>{


machine.classList.add(
"reel-shake"
);


setTimeout(()=>{

machine.classList.remove(
"reel-shake"
);

},200);




reels.forEach((reel,index)=>{


reel.classList.remove(
"reel-stop"
);


reel.classList.add(
"reel-spin"
);




let speed =
setInterval(()=>{


reel.innerHTML=
randomSymbol();


clickSound();


},80);




setTimeout(()=>{


clearInterval(speed);



reel.classList.remove(
"reel-spin"
);



reel.classList.add(
"reel-stop"
);



reel.innerHTML=
randomSymbol();



},1200+(index*700));



});



});



});
