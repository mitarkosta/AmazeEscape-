/*
    ALMOST JACKPOT
    MAIN GAME ENGINE

    Това е основната логика
*/


// =======================
// СИМВОЛИ
// =======================


const SYMBOLS = [

    "🍒",
    "🍋",
    "⭐",
    "💎",
    "🔔",
    "7️⃣"

];




// =======================
// ПРОМЕНЛИВИ
// =======================


let attempts = 0;

let playing = false;



// =======================
// ЕЛЕМЕНТИ
// =======================


const slot1 =
document.getElementById("slot1")



const slot2 =
document.getElementById("slot2")



const slot3 =
document.getElementById("slot3")



const button =
document.getElementById("button")
||
document.getElementById("spin");


const message =
document.getElementById("message");


const counter =
document.getElementById("counter");



const slots = [

slot1,
slot2,
slot3

];





// =======================
// СЛУЧАЕН СИМВОЛ
// =======================


function randomSymbol(){

    return SYMBOLS[
        Math.floor(
            Math.random()
            *
            SYMBOLS.length
        )
    ];

}





// =======================
// SPIN
// =======================


function spin(){


if(playing)
return;



playing=true;


attempts++;


if(counter){

counter.innerHTML=
"Attempts: "
+
attempts;

}



button.disabled=true;



startAnimation();



}




// =======================
// ВЪРТЕНЕ
// =======================


function startAnimation(){


let ticks=0;


let timer=setInterval(()=>{


slots.forEach(slot=>{


slot.innerHTML=
randomSymbol();


});



ticks++;



if(ticks>=25){


clearInterval(timer);


stopReels();


}



},100);



}






// =======================
// СПИРАНЕ НА БАРАБАНИТЕ
// =======================


function stopReels(){



let result=[];



slots.forEach(
(slot,index)=>{


setTimeout(()=>{


slot.innerHTML=
randomSymbol();



result[index]=
slot.innerHTML;



if(index===2){


checkResult(
result
);


}


},

index*500);



});



}





// =======================
// ПРОВЕРКА
// =======================


function checkResult(result){



playing=false;


button.disabled=false;



let a=result[0];

let b=result[1];

let c=result[2];





if(
a===b &&
b===c
){


message.innerHTML=
"🎉 JACKPOT 🎉";


return;


}




if(
a===b ||
b===c ||
a===c
){


message.innerHTML=
"🔥 ALMOST WIN";


return;


}



message.innerHTML=
"❌ TRY AGAIN";



}





// =======================
// СТАРТ
// =======================


if(button){


button.addEventListener(
"click",
spin
);


}
