const img=document.getElementById("foto");
const canvas=document.getElementById("scratch");
const mensagem=document.getElementById("mensagem");
const musica=document.getElementById("musica");

let revelou=false;

img.onload=()=>{

canvas.width=img.width;
canvas.height=img.height;

const ctx=canvas.getContext("2d");

ctx.fillStyle="#d4af37";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
ctx.font="bold 30px Arial";
ctx.textAlign="center";
ctx.fillText("RASPE AQUI",canvas.width/2,canvas.height/2);

ctx.globalCompositeOperation="destination-out";

function apagar(x,y){

ctx.beginPath();

ctx.arc(x,y,30,0,Math.PI*2);

ctx.fill();

verificar();

}

let pressionado=false;

canvas.onpointerdown=()=>{

pressionado=true;

musica.play().catch(()=>{});

};

canvas.onpointerup=()=>{

pressionado=false;

};

canvas.onpointermove=(e)=>{

if(!pressionado)return;

const r=canvas.getBoundingClientRect();

apagar(

(e.clientX-r.left)*(canvas.width/r.width),

(e.clientY-r.top)*(canvas.height/r.height)

);

};

function verificar(){

if(revelou)return;

const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;

let apagados=0;

for(let i=3;i<pixels.length;i+=4){

if(pixels[i]==0)apagados++;

}

const porcentagem=apagados/(pixels.length/4);

if(porcentagem>0.60){

revelou=true;

mensagem.style.display="block";

confetti({

particleCount:250,

spread:180,

origin:{y:0.6}

});

}

}

}
