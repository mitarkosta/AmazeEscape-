/*
 CASINO CABINET EFFECTS
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const machine=
document.querySelector(".machine");


if(!machine)return;



/* LED рамка */


let leds=
document.createElement("div");


leds.className=
"led-border";


machine.appendChild(leds);




/* лампа */


let lamp=
document.createElement("div");


lamp.className=
"jackpot-lamp";


machine.appendChild(lamp);




/* ръчка */


let lever=
document.createElement("div");


lever.className=
"real-lever";


let ball=
document.createElement("div");


ball.className="ball";


lever.appendChild(ball);


machine.appendChild(lever);






/* звук */


function metalSound(){


let ctx=
new AudioContext();


let osc=
ctx.createOscillator();


let gain=
ctx.createGain();


osc.type="square";


osc.frequency.value=90;


gain.gain.value=.08;


osc.connect(gain);

gain.connect(
ctx.destination
);


osc.start();


osc.stop(
ctx.currentTime+.25
);


}





const button=
document.getElementById("button")
||
document.getElementById("spin");



if(button){


button.addEventListener(
"click",
()=>{


lever.classList.remove(
"pull-lever"
);


void lever.offsetWidth;


lever.classList.add(
"pull-lever"
);


metalSound();



setTimeout(()=>{


checkJackpot();


},2000);



});

}





function checkJackpot(){


let msg=
document.getElementById("message");


if(!msg)return;


if(
msg.innerText.includes("JACKPOT")
||
msg.innerText.includes("🎉")
){


lamp.classList.add("on");


coins();


}

else{


lamp.classList.remove("on");


}



}





function coins(){


for(let i=0;i<80;i++){


let c=
document.createElement("div");


c.className="coin";


c.style.left=
Math.random()*100+"vw";


c.style.animationDelay=
Math.random()*2+"s";


document.body.appendChild(c);



setTimeout(()=>{

c.remove();

},4000);



}


}




});
