import { GlowFilter } from "@pixi/filter-glow";
import { Container, Graphics, LINE_CAP } from "pixi.js";
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';

class Lightning2 extends Graphics {
  private holder: Graphics = new Graphics();

  private _steps = 142;
  private _color: number;
  private _generation: number;
  private _noise: NoiseFunction2D;
  private _increment = 0;
  private _thickness: number;
  private _amplitude = 0.02;
  private _speed: number = 1;

  public startX = 50;
  public startY = 200;
  public endX = 900;
  public endY = 200;

  constructor(color: number = 0xffffff, pthickness: number = 6, generation: number = 0) {
    super();
    this._color = color;
    this._noise = createNoise2D();
    this._thickness = pthickness;

    // this.alphaFadeType = LightningFadeType.GENERATION;
    // this.thicknessFadeType = LightningFadeType.NONE;
    // this.holder.tint = 0xFFFFFF * Math.random();
    // console.log(noise(10, 10));
    this._generation = generation;
    if (generation == 0) {
      this.init();
    }

    this.filters = [
      new GlowFilter({ distance: 15, outerStrength: 2 })
    ]
  }

  private init() {
    // this.holder.lineTo(this.endX, this.endY);

    // this.holder.set = 'Lightning holder';
    this.addChild(this.holder);
    // this.update()
  }

  public update(): void {
    this._increment += this.speed / 20;
    // console.log(`increment`, this._increment);
    this.draw();
    // this.draw()
  }

  // * @param {number} [options.alpha=1] - alpha of the line to draw, will update the objects stored style
  // * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
  // *        WebGL only.
  // * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
  // * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style


  public draw(): void {
    this.clear();
    this.beginFill(0xff0000);
    this.drawCircle(this.endX, this.endY, 15)
    this.endFill();

    this.lineStyle({
      width: this.thickness,
      color: this.color,
      cap: LINE_CAP.ROUND
    });
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    let prevX = this.startX;
    let prevY = this.startY;

    const segmentLength = this.length / (this.steps - 1);

    this.moveTo(prevX, prevY)
    // console.log(`segmentLength`,s segmentLength);
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    for (let i: number = 0; i < this.steps - 1; i++) {
      const noise = this._noise(i, this._increment);
      // const angle2 = angle + noise * (Math.PI / 2)

      const targetX = this.startX + dx / (this.steps - 1) * (i + 1);
      const targetY = this.startY + dy / (this.steps - 1) * (i + 1);
      let targetWithOffsetX = targetX;// * (1 - this.smooth);
      let targetWithOffsetY = targetY ; // * (1 - this.smooth);

      if (i < this.steps - 2) {
        const offset = noise * this.length * this.amplitude;
        const offsetX = Math.sin(angle) * offset
        const offsetY = Math.cos(angle) * offset

        targetWithOffsetX = targetX + offsetX;// * (1 - this.smooth);
        targetWithOffsetY = targetY - offsetY; // * (1 - this.smooth);
      }
      this.lineTo(targetWithOffsetX, targetWithOffsetY);

      // const targetX = prevX + Math.cos(angle2) * segmentLength ;
      // const targetY = prevY + Math.sin(angle2) * segmentLength;
      // console.log(`from ${prevX}, ${prevY} to ${targetX}, ${targetY}`);
      // prevX = targetX;
      // prevY = targetY;
    }
    // this.lineTo(this.endX, this.endY);

// begin a green fill..
    /*this.holder.beginFill(0x00FF00);*/
    // this.lineStyle(5, 0xFF0000);
    // draw a triangle using lines
    // this.moveTo(200,200);
    // this.lineTo(50, 100);

  }

  public get color(): number {
    return this._color;
  }

  public set steps(arg: number) {
    if (arg < 2) arg = 2;
    if (arg > 2880) arg = 2880;

    this._steps = arg;
    // if (this.generation == 0) this.smoothPercentage = this.smoothPercentage;
  }

  public get steps(): number {
    return this._steps;
  }

  public get length(): number {
    const dX = this.endX - this.startX;
    const dY = this.endY - this.startY;
    return Math.sqrt(dX * dX + dY * dY);
  }

  public set thickness(arg: number) {
    if (arg < 0) arg = 0;
    this._thickness = arg;
  }

  public get thickness(): number {
    return this._thickness;
  }

  public set amplitude(arg: number) {
    this._amplitude = arg;
  }

  public get amplitude(): number {
    return this._amplitude;
  }

  public set speed(arg: number) {
    this._speed = arg;
    // this.childrenArray.forEach((o) => {
    //   o.instance.speed = arg;
    // })
  }

  public get speed(): number {
    return this._speed;
  }

  // // Sets a value for smoothness. 1 = smooth, 0 is rough
  // public set smooth(arg: number) {
  //   if (arg < 0) arg = 0;
  //   if (arg > 1) arg = 1;
  //   this._smooth = arg;
  // }
}

export default Lightning2
