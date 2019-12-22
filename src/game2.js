import * as PIXI from 'pixi.js'
import {keyboard} from './keyboard'
const app = new PIXI.Application({
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
})

var globalWidth = window.innerWidth;
var globalHeight = window.innerHeight;
var sprite;
var state;
const   Sprite = PIXI.Sprite,
        Loader = new PIXI.Loader;

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
function goToLeft(){
  sprite.vx = -3
}
function goToRight(){
  sprite.vx = 3
}
function stand(){
  sprite.vx = 0  
}
function draw(){
  sprite.x += sprite.vx
  sprite.y += sprite.vy
}

function render(){
    state()
    requestAnimationFrame(render)
}



function setup(){
    sprite = new Sprite(
        Loader.resources["img/saitama.png"].texture
    );

    sprite.anchor.set(0.5, 0.5)
    sprite.position.set(globalWidth/2, globalHeight/2)
    sprite.scale.set(0.5, 0.5)
    sprite.vy = 0;
    sprite.vx = 0;
    state = draw;
    setListenersEvents()
    // sprite.anchor.set(1, 1)
    app.stage.addChild(sprite)

}

function setListenersEvents(){
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");
  //left
  left.press = ()=>{
    sprite.vx = -5
    sprite.vy = 0
  }
  left.release = ()=>{
    if (!right.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  }

  //Up
  up.press = () => {
    sprite.vy = -5;
    sprite.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && sprite.vx === 0) {
      sprite.vy = 0;
    }
  };

  //Right
  right.press = () => {
    sprite.vx = 5;
    sprite.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  };

  //Down
  down.press = () => {
    sprite.vy = 5;
    sprite.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && sprite.vx === 0) {
      sprite.vy = 0;
    }
  };
}