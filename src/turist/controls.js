export default class Controls{
  constructor(keyCode=0){
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;
    this.press = undefined;
    this.release = undefined;

    window.addEventListener("keydown", (event)=>{this.downHandler(event);}, false);
    window.addEventListener("keyup", (event)=>{this.upHandler(event);}, false);    
  }

  downHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isUp && this.press) this.press();
      this.isDown = true;
      this.isUp = false;
    }
    event.preventDefault();
  }
  upHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isDown && this.release) this.release();
      this.isDown = false;
      this.isUp = true;
    }
    event.preventDefault();
  }
}