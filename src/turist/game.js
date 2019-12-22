import * as PIXI from 'pixi.js'
import Controls from './controls'
import {contain, randomInt, hitTestRectangle} from './utils'

let App = PIXI.Application,
    Container = PIXI.Container,
    loader = new PIXI.Loader,
    resources = loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

export class Game{
  constructor(){    
    //Создаем приложение
    this.app = new App({ 
      width: 1024, 
      height: 512,                       
      antialiasing: true, 
      transparent: false, 
      resolution: 1
      }
    );
    //Создание прослушивателя событий
    this.controls = {
      left: new Controls(37),
      right: new Controls(39),
      up: new Controls(38),
      down: new Controls(40)
    }
    
    this.state;//Состояние игры(play, end)
    this.turist;//Главный герой
    this.wood;//Дрова
    this.wolfs;//Волки
    this.forest;//Лес, главный фон
    this.fire;//Костёр
    this.healthBar;//Жизни (Контейнер)
    this.message;//Сообщение в конце игры
    this.gameScene;//Игровая сцена (Контейнер)
    this.gameOverScene;//Конечная сцена (Контейнер)
    this.id;//Картинка со спрайтами
    
  } 

  async run(){
    document.body.appendChild(this.app.view)

    await new Promise((resolve)=>{
      loader.add('img/turist/allData.json').load(resolve)
    })
    //loader.add('img/turist/allData.json').load(()=>{this.setup()})
    this.handlerPress()
    this.handlerRelease()
    this.setup()
  }

  setup(){
    this.gameScene = new Container()
    this.app.stage.addChild(this.gameScene)

    this.id = resources['img/turist/allData.json'].textures
    //Карта
    this.forest = new Sprite(this.id["map.png"])
    this.gameScene.addChild(this.forest)

    //Костёр
    this.fire = new Sprite(this.id['fire1.png'])
    this.fire.x = this.fire.width
    this.fire.y = this.gameScene.height/2
    this.gameScene.addChild(this.fire)

    //Чувак
    this.turist = new Sprite(this.id['man-down.png'])
    this.turist.x = 120
    this.turist.y = this.gameScene.height*3/4 - this.turist.height*2
    this.turist.vx = 0
    this.turist.vy = 0
    this.gameScene.addChild(this.turist)    

    //Дрова
    this.wood = new Sprite(this.id['wood1.png'])
    this.wood.x = this.gameScene.width - this.wood.width*2-15
    this.wood.y = this.gameScene.height/2 + this.wood.height/2
    this.gameScene.addChild(this.wood)

    //Волки
    let numberOfBlobs = 10,//Кол-во волков
      spacing = 60,//расстояние между волками
      xOffset = 300,//отступ всех волков по х
      speed = 2,//скорость передвижения
      direction = 1;//направление (1-вниз, -1-верх)
    this.wolfs = []

    for(let i=0; i<numberOfBlobs;i++){
      let textureName = direction>0 ? 'wolfsheet1down.png' : 'wolfsheet1up.png'
      let wolf = new Sprite(this.id[textureName])
      wolf.x = i*spacing + xOffset
      wolf.y = randomInt(this.gameScene.height/2+1, this.gameScene.height-wolf.height-1)
      wolf.vy = speed*direction
      direction *= -1

      this.wolfs.push(wolf)
      this.gameScene.addChild(wolf)
    }

    //Жизьки
    this.healthBar = new Container();
    this.healthBar.position.set(this.gameScene.width/2-64, 4)
    this.gameScene.addChild(this.healthBar)

    let inner = new Graphics()
    inner.beginFill(0x000000)
    inner.drawRect(0, 0, 128, 16)
    inner.endFill()
    this.healthBar.addChild(inner)

    let outer = new Graphics()
    outer.beginFill(0xff3300)
    outer.drawRect(0, 0, 128, 16)
    outer.endFill()
    this.healthBar.addChild(outer)
    this.healthBar.outer = outer

    let styleMark = new TextStyle({
      fontFamily: "Futura",
      fontSize: 16,
      fill: "black"
    });
    let mark = new Text("Жизьки", styleMark);
    mark.x = this.gameScene.width/2-70 - mark.width;
    mark.y = 4;
    this.gameScene.addChild(mark);

    //Сцена Game Over    
    this.gameOverScene = new Container();
    this.app.stage.addChild(this.gameOverScene);    
    this.gameOverScene.visible = false;
  
    let style = new TextStyle({
      fontFamily: "Futura",
      fontSize: 64,
      fill: "white"
    });
    this.message = new Text("Конец!", style);
    this.message.x = this.app.stage.width / 2 - 180;
    this.message.y = this.app.stage.height / 2 - 32;
    this.gameOverScene.addChild(this.message);

    this.state = this.play

    this.app.ticker.add(delta=>{
      this.gameLoop(delta)
    })
  }

  gameLoop(delta){
    this.state(delta)
  }

  play(delta){
    //Чувак ходит
    this.turist.x += this.turist.vx
    this.turist.y += this.turist.vy

    //проверяем чтоб чувак не вышел за пределы
    contain(this.turist, {
      x:0, 
      y:this.gameScene.height/2, 
      width:this.gameScene.width-20, 
      height:this.gameScene.height-5
    })

    //Работаем с волками
    let turistHit = false;    
    this.wolfs.forEach((wolf) => {
      
      wolf.y += wolf.vy;
      
      let wolfHitsWall = contain(wolf, {
        x:0, 
        y:this.gameScene.height/2, 
        width:this.gameScene.width-5, 
        height:this.gameScene.height-5
      });
      
      if (wolfHitsWall === "top" || wolfHitsWall === "bottom") {
        wolf.vy *= -1;
        if(wolfHitsWall === "top")
          this.changeTextureWolf(wolf, 'wolfsheet1down.png')
        else if(wolfHitsWall === "bottom")
          this.changeTextureWolf(wolf, 'wolfsheet1up.png')
      }
      
      if(hitTestRectangle(this.turist, wolf)) {
        turistHit = true;
      }
    });
    //Если не дай бог наш чувак задел волка
    if(turistHit){
      this.healthBar.outer.width -= 1
      this.turist.alpha = 0.5
    }else{
      this.turist.alpha = 1
    }
    //Взяли дрова
    if(hitTestRectangle(this.turist, this.wood)){
      this.wood.x = this.turist.x+8
      this.wood.y = this.turist.y+8
      contain(this.wood, {
        x:0, 
        y:this.gameScene.height/2, 
        width:this.gameScene.width-25, 
        height:this.gameScene.height-5
      })
    }
    //Если жизьки кончились
    if (this.healthBar.outer.width < 0) {
      this.state = this.end;
      this.message.text = "Ты проиграл!";
    }
    //Принесли дрова к костру
    if (hitTestRectangle(this.wood, this.fire)) {
      this.state = this.end;
      this.message.text = "Ты выиграл!";
    } 
  }

  end(delta){
    this.gameScene.visible = false;
    this.gameOverScene.visible = true;
  }

  handlerPress(){
    this.controls.left.press = () => {
      this.turist.vx = -5;
      this.turist.vy = 0;
      this.checkTexture('left')      
    };
    this.controls.right.press = () => {
      this.turist.vx = 5;
      this.turist.vy = 0;
      this.checkTexture('right')      
    };
    this.controls.up.press = () => {
      this.turist.vy = -5;
      this.turist.vx = 0;
      this.checkTexture('up')      
    };
    this.controls.down.press = () => {
      this.turist.vx = 0;
      this.turist.vy = 5;
      this.checkTexture('down')      
    };
  }
  handlerRelease(){
    this.controls.left.release = () => {
      if (!this.controls.right.isDown && this.turist.vy === 0) {
        this.turist.vx = 0;
      }
    };
    this.controls.right.release = () => {
      if (!this.controls.left.isDown && this.turist.vy === 0) {
        this.turist.vx = 0;
      }
    };
    this.controls.up.release = () => {
      if (!this.controls.down.isDown && this.turist.vx === 0) {
        this.turist.vy = 0;
      }
    };
    this.controls.down.release = () => {
      if (!this.controls.up.isDown && this.turist.vx === 0) {
        this.turist.vy = 0;
      }
    };
  }

  checkTexture(direction='down'){
    if(
      this.turist.texture && 
      this.turist.texture.textureCacheIds.length && 
      this.turist.texture.textureCacheIds[0]===`man-${direction}.png`){
        return;
      }
    this.turist.texture = this.id[`man-${direction}.png`]
  }

  changeTextureWolf(wolf, textureName){
    wolf.texture = this.id[textureName]
  }
}