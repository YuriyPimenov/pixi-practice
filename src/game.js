import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
})

var globalWidth = window.innerWidth;
var globalHeight = window.innerHeight;
var sprite;
var direction = '';
const   Sprite = PIXI.Sprite,
        TextureCache = PIXI.utils.TextureCache,
        Loader = new PIXI.Loader;

addEventListener("keydown",(e)=>{

    if(e.keyCode==87){
        direction='up';
    }
    if(e.keyCode==83){
        direction='down';
    }
    if(e.keyCode==65){
        direction='left';
    }
    if(e.keyCode==68){
        direction='right';
    }
})
addEventListener("keyup",(e)=>{
    direction='';
})
export const run = async () => {
    app.renderer.backgroundColor = 0xf6f8fa
    app.renderer.autoResize = true
    app.renderer.resize(globalWidth, globalHeight)
    document.body.appendChild(app.view)

    await new Promise((resolve)=>{
        Loader.add('img/saitama.png').load(()=>{
            setup()
            resolve()
        })

    })

    render()

}

function render(){
    if(direction == 'right'){
        if(sprite.position.x > globalWidth - sprite.width/2 - 10) {

        }else{
            sprite.x += sprite.vx
        }

    }else if(direction == 'left'){
        if(sprite.position.x < 0 + sprite.width/2 + 10){

        }else{
            sprite.x -= sprite.vx
        }

    }else if(direction == 'up'){
        if(sprite.position.y < 0 + sprite.height/2 + 10){

        }else{
            sprite.y -= sprite.vy
        }

    }else if(direction == 'down'){
        if(sprite.position.y > globalHeight - sprite.height/2 - 10){

        }else{
            sprite.y += sprite.vy
            
        }
    }

    requestAnimationFrame(render)
}



function setup(){
    sprite = new Sprite(
        Loader.resources["img/saitama.png"].texture
    );

    sprite.anchor.set(0.5, 0.5)
    sprite.position.set(globalWidth/2, globalHeight/2)
    sprite.vy = 5;
    sprite.vx = 8;
    // sprite.anchor.set(1, 1)
    app.stage.addChild(sprite)
}