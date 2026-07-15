const img = document.getElementById("foto");
const canvas = document.getElementById("scratch");
const mensagem = document.getElementById("mensagem");
const musica = document.getElementById("musica");

let revelou = false;

img.onload = () => {

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#d4af37";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("RASPE AQUI", canvas.width/2, canvas.height/2);

    ctx.globalCompositeOperation = "destination-out";


    function apagar(x,y){

        ctx.beginPath();
        ctx.arc(x,y,25,0,Math.PI*2);
        ctx.fill();

        verificar();
    }


    let pressionado=false;


    canvas.addEventListener("pointerdown",()=>{

        pressionado=true;

        musica.play().catch(()=>{});

    });


    canvas.addEventListener("pointerup",()=>{

        pressionado=false;

    });


    canvas.addEventListener("pointermove",(e)=>{

        if(!pressionado)return;

        const rect=canvas.getBoundingClientRect();

        apagar(

        (e.clientX-rect.left)*(canvas.width/rect.width),

        (e.clientY-rect.top)*(canvas.height/rect.height)

        );

    });


    function verificar(){

        if(revelou)return;


        const pixels=ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        ).data;


        let apagados=0;


        for(let i=3;i<pixels.length;i+=4){

            if(pixels[i]===0){

                apagados++;

            }

        }


        let porcentagem = apagados/(pixels.length/4);


        if(porcentagem > 0.80){

            revelou=true;


            // Remove a raspadinha
            canvas.style.display="none";


            mensagem.style.display="block";


            confetti({

                particleCount:250,

                spread:180,

                origin:{
                    y:0.6
                }

            });


            ativarZoom();

        }

    }

};


// =========================
// ZOOM DA FOTO
// =========================

function ativarZoom(){

let escala=1;

let inicioDistancia=0;

let escalaInicial=1;

let posX=0;

let posY=0;

let inicioX=0;

let inicioY=0;

let movendo=false;

let ultimoToque=0;



function atualizar(){

img.style.transform =
`translate(${posX}px,${posY}px) scale(${escala})`;

}



img.addEventListener("touchstart",(e)=>{


const agora=Date.now();


if(agora-ultimoToque < 300){

escala = escala === 1 ? 2 : 1;

posX=0;
posY=0;

atualizar();

}


ultimoToque=agora;



if(e.touches.length===2){


let dx =
e.touches[0].clientX -
e.touches[1].clientX;


let dy =
e.touches[0].clientY -
e.touches[1].clientY;


inicioDistancia =
Math.sqrt(dx*dx+dy*dy);


escalaInicial=escala;


}


if(e.touches.length===1){

movendo=true;

inicioX=e.touches[0].clientX-posX;

inicioY=e.touches[0].clientY-posY;

}


});



img.addEventListener("touchmove",(e)=>{


e.preventDefault();



if(e.touches.length===2){


let dx =
e.touches[0].clientX -
e.touches[1].clientX;


let dy =
e.touches[0].clientY -
e.touches[1].clientY;


let distancia =
Math.sqrt(dx*dx+dy*dy);



escala =
escalaInicial *
(distancia/inicioDistancia);



if(escala<1)
escala=1;


if(escala>5)
escala=5;



atualizar();


}



else if(e.touches.length===1 && movendo){

posX = e.touches[0].clientX - inicioX;
posY = e.touches[0].clientY - inicioY;


// Limita o movimento da imagem
let limiteX = img.width * (escala - 1) / 2;
let limiteY = img.height * (escala - 1) / 2;


if(posX > limiteX) posX = limiteX;
if(posX < -limiteX) posX = -limiteX;


if(posY > limiteY) posY = limiteY;
if(posY < -limiteY) posY = -limiteY;


atualizar();


}



},{passive:false});



img.addEventListener("touchend",()=>{

movendo=false;

});

}
