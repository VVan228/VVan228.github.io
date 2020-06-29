let name;
let points = 100;
let lvl = 1;
let canv;
let rend;
let onDo;
let objects = [];
const DODGE_POINTS = 50;
const COIN_POINTS = 70;
const ENEMY_POINTS = -100;
const LEVEL_POINTS = 1000;
const ENEMY_SIZE = 90;
const COIN_SIZE = 85;
const HERO_SIZE = 80;
window.onload = function (){
    name = localStorage.getItem("name");
    $(".continue").on("click",function(){
        onDo = setInterval(onDraw,10);
        $("#pausescreen").dialog("close");
    });
    $(".toMenu").on("click",function(){
        window.location.replace("index.html")
    });
    $(".save").on("click",function(){
        let obj = {
            objects:objects,
            lvl:lvl,
            points:points,
            name:name
        }
        sessionStorage.setItem("save",JSON.stringify(obj))
    })

    canv = $("#canvas");
    rend = canv[0].getContext("2d");
    onDo = setInterval(onDraw,10);
    $("body").keydown(onKey);
    canv.attr("width",$(window).width());
    canv.attr("height",$(window).height());
    objects[0] = {
        x:0,
        y:0,
        angle:0,
        velA:4,
        velX:0,
        velY:5,
        h:HERO_SIZE,
        w:HERO_SIZE,
        col:"red",
        type:"hero",
    };
    for(let i = 1; i<=4; i++){
        objects[i] = {
            x:canv[0].width + Math.random() * canv[0].width,
            y:Math.random()*(canv[0].height-ENEMY_SIZE),
            angle:0,
            velA:-5,
            velX:-5,
            velY:0,
            h:ENEMY_SIZE,
            w:ENEMY_SIZE,
            type:"enemy",
        };
    }
    for (let i = 5; i <= 6; i++) {
        objects[i] = {
            x:canv[0].width + Math.random() * canv[0].width,
            y:Math.random()*(canv[0].height-100),
            angle:0,
            velA:0,
            velX:-2,
            velY:0,
            h:COIN_SIZE,
            w:COIN_SIZE,
            type:"coin",
        };
    }

    if(sessionStorage.getItem("toStartFromSave")==="true"&&sessionStorage.getItem("save")!=null){
        let obj = JSON.parse(sessionStorage.getItem("save"));
        objects = obj.objects;
        points = obj.points;
        name = obj.name;
        goToLvl(obj.lvl);
    }
};
function onDraw(){
    rend.clearRect(0,0,canv[0].width,canv[0].height);
    rend.font = "50px Marker Felt, fantasy";
    rend.fillStyle = "maroon";
    rend.textAlign = "end";
    rend.fillText("name:"+name+"  lvl:"+lvl+"  points:"+points%LEVEL_POINTS,canv[0].width-10,60);
    for(let i = 0; i<objects.length; i++){
        rend.beginPath();
        let img = new Image();
        switch (objects[i].type) {
            case("hero"):
                img.src = "gg.svg";
                break;
            case("enemy"):
                img.src = "enemy.svg";
                break;
            case("coin"):
                img.src = "coin.svg";
                break;
        }
        objects[i].x+=objects[i].velX;
        objects[i].y+=objects[i].velY;
        objects[i].angle+=objects[i].velA;

        if(objects[i].type==="hero") {
            if (objects[i].y > canv[0].height - objects[i].h || objects[i].y < 0) {
                objects[i].velY = -objects[i].velY;
                objects[i].velA = -objects[i].velA;
            }
        }else {
            if (objects[i].x < -objects[i].w) {
                if(objects[i].type==="enemy"){
                    points+=DODGE_POINTS;
                }
                teleport(i);
            }
            collision(i);
        }

        rend.save();
        rend.translate(objects[i].x+objects[i].w/2,objects[i].y+objects[i].h/2);
        rend.rotate(objects[i].angle*Math.PI/180);
        rend.translate(-objects[i].x-objects[i].w/2,-objects[i].y-objects[i].h/2);
        rend.drawImage(img,objects[i].x,objects[i].y,objects[i].w,objects[i].h);
        rend.restore();

        rend.closePath();

        if(points>=lvl*LEVEL_POINTS){
            lvlup();
        }else if(points<(lvl-1)*LEVEL_POINTS){
            onGameOver();
        }
    }
}
function onKey(event){
    if(event.key === " "){
        objects[0].velY = -objects[0].velY;
        objects[0].velA = -objects[0].velA;
    }else if(event.keyCode===27){
        onPause();
    }
}
function teleport(i){
    objects[i].x = canv[0].width + Math.random() * canv[0].width;
    objects[i].y = Math.random()*(canv[0].height-objects[i].h);
}
function collision(i){
    if(objects[i].x<=objects[0].w){
        if((objects[i].y>objects[0].y&&objects[i].y<objects[0].y+HERO_SIZE)||(objects[i].y+objects[i].h>objects[0].y&&objects[i].y+objects[i].h<objects[0].y+HERO_SIZE)){
            teleport(i);
            if(objects[i].type==="coin"){
                points+=COIN_POINTS;
            }else if(objects[i].type==="enemy"){
                points+=ENEMY_POINTS;
            }
            //console.debug(points);
        }
    }
}
function lvlup(){
    lvl++;
    if(objects[0].velY>0){
        objects[0].velY++;
    }else{
        objects[0].velY--;
    }

    for(let i = 1; i<=4; i++){
        objects[i].velX--;
    }
    console.debug(lvl);
}
function goToLvl(toLvl){
    lvl = toLvl;
    if(objects[0].velY>0){
        objects[0].velY+=toLvl-1;
    }else{
        objects[0].velY+=toLvl-1;
    }
    for(let i = 1; i<=4; i++){
        objects[i].velX-=toLvl-1;
    }
}
function onGameOver(){
    clearInterval(onDo);
    $("#gameoverscreen").dialog({closeOnEscape: false});
    if(sessionStorage.getItem("record")!=null){
        let obj = JSON.parse(sessionStorage.getItem("record"));
        if(obj.points<points){
            let obj2 = {
                name:name,
                points:points
            }
            sessionStorage.setItem("record",JSON.stringify(obj2));
        }
    }else{
        let obj2 = {
            name:name,
            points:points
        }
        sessionStorage.setItem("record",JSON.stringify(obj2));
    }
}
function onPause(){
    clearInterval(onDo);
    $("#pausescreen").dialog({closeOnEscape: false});
}