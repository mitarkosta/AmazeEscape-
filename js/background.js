/*
 Казино лабиринт анимация
 отделен модул
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const bg =
document.createElement("div");


bg.className=
"casino-background";


document.body.appendChild(bg);




/*
 движещи се светлини
*/


for(let i=0;i<15;i++){


let light =
document.createElement("div");


light.className=
"maze-light";


light.style.left =
Math.random()*100+"vw";


light.style.animationDelay =
Math.random()*5+"s";


light.style.height =
(50+Math.random()*150)+"px";



bg.appendChild(light);


}





/*
 мигащи лампи
*/


for(let i=0;i<40;i++){


let dot =
document.createElement("div");


dot.className=
"casino-dot";


dot.style.left =
Math.random()*100+"vw";


dot.style.top =
Math.random()*100+"vh";


dot.style.animationDelay =
Math.random()*3+"s";


bg.appendChild(dot);


}




});
