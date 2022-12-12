import { Container, Graphics } from "pixi.js";

class Lightning2 extends Graphics {
  private holder: Graphics = new Graphics();

  private _color: number;
  private _generation: number;


  constructor(color: number = 0xffffff, pthickness: number = 2, generation: number = 0) {
    super();
    // this.mouseEnabled=false;
    this._color = color;
    // this._thickness = pthickness;

    // this.alphaFadeType = LightningFadeType.GENERATION;
    // this.thicknessFadeType = LightningFadeType.NONE;
    this.holder.tint = 0xFFFFFF * Math.random();

    this._generation = generation;
    if (generation == 0) {
      this.init();
    }
  }

  private init() {
    this.holder.lineStyle(5, 0xFF0000);
    // draw a triangle using lines
    this.holder.moveTo(200,200);
    this.holder.lineTo(50, 100);
    // this.holder.set = 'Lightning holder';
    this.addChild(this.holder);
    // this.update()
  }

  public update(): void {
    this.draw();
    // this.draw()
  }

  public draw(): void {
    this.lineStyle(2, 0xff0000, 1);

// begin a green fill..
    /*this.holder.beginFill(0x00FF00);*/
    this.lineStyle(5, 0xFF0000);
    // draw a triangle using lines
    this.moveTo(200,200);
    this.lineTo(50, 100);

  }
}

export default Lightning2
