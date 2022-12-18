import { GlowFilter } from "@pixi/filter-glow";
import { lerp } from "lerp";
import LightningFadeType from "LightningFadeType";
import { Container, Graphics, LINE_CAP, Point, Sprite, Texture } from "pixi.js";
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import smooth from 'array-smooth';

class Lightning2 extends Graphics {
  private holder: Graphics = new Graphics();

  private _steps = 40;
  private _color: number;
  private _smooth = 0.85;
  private _generation: number;
  private _noise: NoiseFunction2D;
  private _smoothNoise: NoiseFunction2D;
  private _increment = 0;
  private _smoothIncrement = 0;
  private _thicknessStart: number;
  private _thicknessEnd: number;
  private _amplitude = 0.02;
  private _speed: number = 1;
  private _smoothSpeed: number = 0.1;

  private _start = new Point(50, 200);
  private _end = new Point(900, 200);

  public alphaFadeType: LightningFadeType = LightningFadeType.GENERATION;


  constructor(color: number = 0xffffff, thicknessStart: number = 6, generation: number = 0) {
    super();
    this._color = color;
    this._noise = createNoise2D();
    this._smoothNoise = createNoise2D();
    this._thicknessStart = thicknessStart;
    this._thicknessEnd = thicknessStart;

    // this.alphaFadeType = LightningFadeType.GENERATION;
    // this.thicknessFadeType = LightningFadeType.NONE;
    this._generation = generation;
    if (generation == 0) {
      this.filters = [
        new GlowFilter({ distance: 15, outerStrength: 3 })
      ]
      this.init();
    }

  }

  private init() {
    // this.holder.lineTo(this.end.x, this.end.y);

    // this.holder.set = 'Lightning holder';
    this.addChild(this.holder);
    // this.update()
  }

  public update(): void {
    this._increment += this.speed / 20;
    this._smoothIncrement += this.smoothSpeed / 20;
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

    const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);

    let prevX = this.start.x;
    let prevY = this.start.y;

    const segmentLength = this.length / (this.steps - 1);

    this.moveTo(prevX, prevY)
    // console.log(`segmentLength`,s segmentLength);
    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;

    const color = this.color;
    let smoothNoise: number[] = [];

    if (this.smooth > 0) {
      const rough = [...Array(this.steps).keys()].map((_, i) => {
        return this._smoothNoise(i, this._smoothIncrement)
      })
      smoothNoise = smooth(rough, 3);
    }
    for (let i: number = 0; i < this.steps - 1; i++) {
      const noise = this._noise(i, this._increment);

      const currentPosition: number = 1 / this.steps * (this.steps - i);
      let alpha = this.alpha;
      const width = (this.thicknessStart - this.thicknessEnd) * ((this.steps - i) / this.steps) + this.thicknessEnd;

      if (this.alphaFadeType == LightningFadeType.TIP_TO_END) {
        // alpha = -this._minThickness * ((this.steps - i) / this.steps) + this._minThickness;
      }
      // console.log(i, alpha)
      // console.log(currentPosition, ((this.steps - i) / this.steps))
      this.lineStyle({
        width,
        color,
        alpha,
        cap: LINE_CAP.ROUND
      });


      const targetX = this.start.x + dx / (this.steps - 1) * (i + 1);
      const targetY = this.start.y + dy / (this.steps - 1) * (i + 1);
      let targetWithOffsetX = targetX;// * (1 - this.smooth);
      let targetWithOffsetY = targetY ; // * (1 - this.smooth);

      if (i < this.steps - 2) {
        const offset = noise * this.length * this.amplitude;
        const offsetX = Math.sin(angle) * offset
        const offsetY = Math.cos(angle) * offset

        let smoothX = 0;
        let smoothY = 0;

        if (this.smooth > 0) {
          const smoothOffset = smoothNoise[i] * this.length * (1 - this.smooth)
          smoothX = Math.sin(angle) * smoothOffset
          smoothY = Math.cos(angle) * smoothOffset
        }
// console.log(`smoothOffset`, smoothOffset);
        // targetWithOffsetX = targetX + offsetX;// * (1 - this.smooth);
        // targetWithOffsetY = targetY - offsetY; // * (1 - this.smooth);
        targetWithOffsetX = targetX + offsetX + smoothX;// * (1 - this.smooth);
        targetWithOffsetY = targetY - offsetY - smoothY; // * (1 - this.smooth);
      }
      this.lineTo(targetWithOffsetX, targetWithOffsetY);

      // const targetX = prevX + Math.cos(angle2) * segmentLength ;
      // const targetY = prevY + Math.sin(angle2) * segmentLength;
      // console.log(`from ${prevX}, ${prevY} to ${targetX}, ${targetY}`);
      // prevX = targetX;
      // prevY = targetY;
    }
    // this.lineTo(this.end.x, this.end.y);

// begin a green fill..
    /*this.holder.beginFill(0x00FF00);*/
    // this.lineStyle(5, 0xFF0000);
    // draw a triangle using lines
    // this.moveTo(200,200);
    // this.lineTo(50, 100);

  }

  private updateAlphaMap() {
    // const canvas = document.createElement('canvas');
    // canvas.width = this.length + this.start.x;
    // canvas.height = this.length + this.start.y;

    // const ctx = canvas.getContext('2d');

    // if (ctx) {

    // const gradient = ctx?.createRadialGradient(0, 0, 1, 0, 0, (this.length + this.start.x) * 2);
    // // var gradient = self.ctx.createRadialGradient(center.x, center.y, 1, center.x, center.y, 600);
    // gradient?.addColorStop(0, "white");
    // gradient?.addColorStop(1, "black");

    // ctx.fillStyle = gradient;
    // ctx.fillRect(0, 0, this.length, this.length);

    //   var texture = Texture.from(canvas)
    //   const sprite = Sprite.from(texture);
    //   this.mask = sprite
    // }
  }

  public get color(): number {
    return this._color;
  }

  public get start() {
    return this._start;
  }

  public set start(value: Point) {
    this._start = value;
    this.updateAlphaMap()
  }

  public get end() {
    return this._end;
  }

  public set end(value: Point) {
    this._end = value;
    this.updateAlphaMap()
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
    const dX = this.end.x - this.start.x;
    const dY = this.end.y - this.start.y;
    return Math.sqrt(dX * dX + dY * dY);
  }

  public set thicknessStart(arg: number) {
    if (arg < 0) arg = 0;
    this._thicknessStart = arg;
  }

  public get thicknessStart(): number {
    return this._thicknessStart;
  }

  public set thicknessEnd(arg: number) {
    if (arg < 0) arg = 0;
    this._thicknessEnd = arg;
  }

  public get thicknessEnd() {
    return this._thicknessEnd;
  }

  public set amplitude(arg: number) {
    this._amplitude = arg;
  }

  public get amplitude() {
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

  // Sets the speed of the smoothed wave
  public set smoothSpeed(arg: number) {
    this._smoothSpeed = arg;
    // this.childrenArray.forEach((o) => {
    //   o.instance.speed = arg;
    // })
  }

  public get smoothSpeed(): number {
    return this._smoothSpeed;
  }

  // Sets a value for smoothness. 1 = smooth, 0 is rough
  public set smooth(arg: number) {
    if (arg < 0) arg = 0;
    if (arg > 1) arg = 1;
    this._smooth = arg;
  }

  public get smooth() {
    return this._smooth;
  }
}

export default Lightning2
