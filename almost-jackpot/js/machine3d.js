/*
  3D MACHINE UPGRADE
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const machine=
document.querySelector(".machine");


if(!machine)return;



/*
 добавяне на корпусни елементи
*/


let lever=
document.createElement("div");


lever.className=
"slot-lever";


machine.appendChild(lever);




let maze=
document.createElement("div");


maze.className=
"maze-lines";


machine.appendChild(maze);





let lamp=
document.createElement("div");


lamp.className=
"win-light";


machine.appendChild(lamp);




/*
 намираме бутона
*/


const spinButton=
document.getElementById("button")
||
document.getElementById("spin");



if(!spinButton)return;





/*
 ефект ръчка
*/


spinButton.addEventListener(
"click",
()=>{


lever.classList.add("pull");



setTimeout(()=>{


lever.classList.remove("pull");


},900);



});






/*
 следене за печалба
*/


const message=
document.getElementById("message");



if(message){



const observer=
new MutationObserver(()=>{


let text=
message.innerText;



if(
text.includes("JACKPOT")
||
text.includes("🎉")
){


lamp.classList.add(
"active"
);


}

else{


lamp.classList.remove(
"active"
);


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
