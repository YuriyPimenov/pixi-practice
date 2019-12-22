import * as PIXI from 'pixi.js'
import {keyboard} from './keyboard'
const app = new PIXI.Application({
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
})

var globalWidth = window.innerWidth;
var globalHeight = window.innerHeight;
var state;
var Graphics = PIXI.Graphics
var line = new Graphics();
var point = new Graphics();
var points = [
  {x:100, y:100, vx:0, vy:0},
  {x:500, y:100, vx:0, vy:0},
  {x:500, y:500, vx:0, vy:0},
  {x:100, y:500, vx:0, vy:0}
]

var mainPoint = points[0]
var room = new Graphics();

export const run = () => {
    app.renderer.backgroundColor = 0xf6f8fa
    app.renderer.autoResize = true
    app.renderer.resize(globalWidth, globalHeight)
    document.body.appendChild(app.view)

    setup()
    //render()

}

function update(){
  let i=0
  while(i<app.stage.children.length) { 
    app.stage.children[i].clear()
    //app.stage.removeChild(app.stage.children[0]); 
    i++
  }

  mainPoint.x += mainPoint.vx
  mainPoint.y += mainPoint.vy 
  updatePolygon()
  updateLines()
  updatePoints()
}
function updatePolygon(){
  
    room.beginFill(0x0000ff)
    let pointsPolygon = []
    for(let i=0, count=points.length;i<count;i++){
      pointsPolygon.push(points[i].x)
      pointsPolygon.push(points[i].y)
    }
    room.drawPolygon(pointsPolygon)
    room.endFill()
    app.stage.addChild(room)
}
function updatePoints(){
  point.beginFill(0x00ff00);
  for(let i=0, count=points.length;i<count;i++){
    point.drawCircle(points[i].x, points[i].y, 16);
  
  }
  point.endFill();
  // point.x = 64;
  // point.y = 130;
  app.stage.addChild(point);
}
function updateLines(){
  
  line.lineStyle(10, 0xFF0000, 1);
  line.moveTo(points[0].x, points[0].y);
  for(let i=1, count=points.length;i<count;i++){
    line.lineTo(points[i].x, points[i].y);
  }
  line.lineTo(points[0].x, points[0].y);
  
  app.stage.addChild(line);
}

// function render(){
//     state()
//     requestAnimationFrame(render)
// }



function setup(){
      
  state = update;    
  state()
  setListenersEvents()
}

function setListenersEvents(){
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");
  //left
  left.press = ()=>{
    mainPoint.vx = -5
    mainPoint.vy = 0
    state()
  }
  left.release = ()=>{
    if (!right.isDown && mainPoint.vy === 0) {
      mainPoint.vx = 0;
    }
  }

  //Up
  up.press = () => {
    mainPoint.vy = -5;
    mainPoint.vx = 0;
    state()
  };
  up.release = () => {
    if (!down.isDown && mainPoint.vx === 0) {
      mainPoint.vy = 0;
    }
  };

  //Right
  right.press = () => {
    mainPoint.vx = 5;
    mainPoint.vy = 0;
    state()
  };
  right.release = () => {
    if (!left.isDown && mainPoint.vy === 0) {
      mainPoint.vx = 0;
    }
  };

  //Down
  down.press = () => {
    mainPoint.vy = 5;
    mainPoint.vx = 0;
    state()
  };
  down.release = () => {
    if (!up.isDown && mainPoint.vx === 0) {
      mainPoint.vy = 0;
    }
  };
}