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
  private _glow: GlowFilter;
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
  private _childrenProbability: number = 0.025;
  private _childrenProbabilityDecay: number = 0;
  private _childrenMaxCount: number = 4;
  private _childrenMaxCountDecay: number = .5;
  private _childrenMaxGenerations = 1;
  private _childrenLengthDecay: number = 0.5;
  private _childrenAngleVariation: number = 60;
  private _start = new Point(50, 200);
  private _end = new Point(900, 200);

  public startStep: number;
  public endStep: number;
  public parentInstance: Lightning2;
  public childAngle = 0;
  public alphaFadeType: LightningFadeType = LightningFadeType.GENERATION;
  public waveLength = 0.5;
  public waveLengthDecay = 0.75; // decay rate of wavelength. the closer to end the smaller the wavelength
                                // 1 = full wavelength decay, 0 = no decay

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
      this._glow = new GlowFilter({ distance: 15, outerStrength: 3, color })
      this.filters = [
        this._glow
      ]
      this.init();
    }

  }

  private init() {
    this.addChild(this.holder);
    // this.update()
  }

  public update() {
    this._increment += this.speed / 40;
    // this._smoothIncrement += this.smoothSpeed / 40;
    // console.log(`increment`, this._increment);

    const generateChildRandom = Math.random();
    if (generateChildRandom < this._childrenProbability) {
      this.generateChild();
    }

    this.draw();
  }

  public draw() {
    this.clear();
    const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);

    let prevX = this.start.x;
    let prevY = this.start.y;

    this.moveTo(prevX, prevY)
    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;

    const color = this.color;
    let smoothNoise: number[] = [];

    const rough = [...Array(this.steps).keys()].map((_, i) => {
      return this._smoothNoise(i, this._increment)
    })
    smoothNoise = smooth(rough, 3);

    for (let i: number = 0; i < this.steps - 1; i++) {
      const noise = this._noise(i, this._increment);

      const currentPosition: number = 1 / this.steps * (this.steps - i);
      let alpha = this.alpha;
      const width = (this.thicknessStart - this.thicknessEnd) * ((this.steps - i) / this.steps) + this.thicknessEnd;

      if (this.alphaFadeType == LightningFadeType.TIP_TO_END) {
        // alpha = -this._minThickness * ((this.steps - i) / this.steps) + this._minThickness;
      }
      this.lineStyle({
        width,
        color,
        alpha,
        cap: LINE_CAP.ROUND,
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
        const decayModifier = i / this.steps * (this.waveLengthDecay) * (this.length * this.waveLength)
        const smoothOffset = smoothNoise[i] * ((this.length * this.waveLength) -decayModifier ) * (1 - this.smooth)
        smoothX = Math.sin(angle) * smoothOffset
        smoothY = Math.cos(angle) * smoothOffset
        // targetWithOffsetX = targetX + offsetX;// * (1 - this.smooth);
        // targetWithOffsetY = targetY - offsetY; // * (1 - this.smooth);
        targetWithOffsetX = targetX + offsetX + smoothX;// * (1 - this.smooth);
        targetWithOffsetY = targetY - offsetY - smoothY; // * (1 - this.smooth);
      }
      this.lineTo(targetWithOffsetX, targetWithOffsetY);
    }
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

  private generateChild(n: number = 1, recursive:  boolean = false): void {
    // if (generation < _childrenMaxGenerations && this.numChildren < this._childrenMaxCount) {
      if (this._generation < this.childrenMaxGenerations && this.numChildren < this.childrenMaxCount) {
        const targetChildSteps = this.steps * this._childrenLengthDecay;
        if (targetChildSteps >= 2) {
        console.log('generate', targetChildSteps)
        for(let i: number = 0; i < n; i++) {
          const startStep: number = Math.random() * this.steps;
          let endStep: number = Math.random() * this.steps;
          while( endStep == startStep) endStep = Math.random() * this.steps;
          const childAngle: number = Math.random() * this._childrenAngleVariation - this._childrenAngleVariation / 2;

          const child: Lightning2 = new Lightning2(this.color, this.thicknessStart, this._generation + 1);

          child.parentInstance = this;
          // child.lifeSpan = Math.random()* (this.childrenLifeSpanMax - this.childrenLifeSpanMin) + this.childrenLifeSpanMin;
          // child.positionL = 1 - startStep / this.steps;
          // child.absolutePosition = this.absolutePosition * child.positionL;
          child.alphaFadeType = this.alphaFadeType;
          // child.thicknessFadeType = this.thicknessFadeType;

          if (this.alphaFadeType == LightningFadeType.GENERATION) {
            child.alpha = 1 - (1 / (this.childrenMaxGenerations + 1)) * child.generation;
          }
          // if (this.thicknessFadeType == LightningFadeType.GENERATION) child.thickness = this.thickness - (this.thickness/(this.childrenMaxGenerations+1)) * child.generation;
          child.childrenMaxGenerations = this.childrenMaxGenerations;
          child.childrenMaxCount = this.childrenMaxCount * (1 - this.childrenMaxCountDecay);
          child.childrenProbability = this.childrenProbability * (1 - this.childrenProbabilityDecay);
          child.childrenProbabilityDecay = this.childrenProbabilityDecay;
          child.childrenLengthDecay = this.childrenLengthDecay;
          // child.childrenDetachedEnd = this.childrenDetachedEnd;

          child.waveLength = this.waveLength;
          child.amplitude = this.amplitude;
          child.speed = this.speed;

          child.init();

          child.endStep = endStep;
          child.startStep = startStep;
          child.childAngle = childAngle;
          child.steps = this.steps * (1 - this.childrenLengthDecay);

          this.addChild(child);

          if (recursive) {
            child.generateChild(n, true);
          }
        }
      }
    }
  }

  public set color(value: number) {
    this._color = value;
    this._glow.color = value
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

  public get length() {
    const dX = this.end.x - this.start.x;
    const dY = this.end.y - this.start.y;
    return Math.sqrt(dX * dX + dY * dY);
  }

  public set thicknessStart(arg: number) {
    if (arg < 0) arg = 0;
    this._thicknessStart = arg;
  }

  public get thicknessStart() {
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

  public get speed() {
    return this._speed;
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

  public set childrenProbability(arg: number) {
    if (arg > 1) {
      arg = 1
    } else if (arg < 0) {
      arg = 0;
    }
    this._childrenProbability = arg;
  }

  public get childrenProbability() {
    return this._childrenProbability;
  }

  public set childrenProbabilityDecay(arg: number) {
    if (arg > 1) {
      arg = 1
    }
    else if (arg<0) {
      arg = 0;
    }
    this._childrenProbabilityDecay = arg;
  }

  public get childrenProbabilityDecay() {
    return this._childrenProbabilityDecay;
  }

  /**
 * Getter/Setter for the 'childrenMaxGenerations' property
 */
  public set childrenMaxGenerations(value: number) {
    this._childrenMaxGenerations = value;
    // validateChildren();
  }

  public get childrenMaxGenerations() {
    return this._childrenMaxGenerations;
  }

  public set childrenLengthDecay(arg: number) {
    if (arg > 1 ) { 
      arg = 1;
    } else if (arg < 0) {
      arg = 0;
    } 
    this._childrenLengthDecay = arg;
  }

  public get childrenLengthDecay() {
    return this._childrenLengthDecay;
  }
  
  public set childrenMaxCount(arg: number) {
    this._childrenMaxCount = arg;
    // this.killSurplus();
  }

  public get childrenMaxCount(): number {
    return this._childrenMaxCount;
  }

  public set childrenMaxCountDecay(arg: number) {
    if (arg > 1) { 
      arg = 1;
     } else if (arg <0 ) {
      arg = 0;
     }
    this._childrenMaxCountDecay = arg;
  }

  public get childrenMaxCountDecay() {
    return this._childrenMaxCountDecay;
  }

  public set childrenAngleVariation(arg: number) {
    this._childrenAngleVariation = arg;
    this.childLightnings.forEach((l) => {
      l.childAngle = Math.random() * arg - arg / 2;
      l.childrenAngleVariation = arg;
    })
  }

  public get childrenAngleVariation() {
    return this._childrenAngleVariation;
  }

  public get generation() {
    return this._generation;
  }

  private get numChildren() {
    return this.children.length
  }

  private get childLightnings() {
    return this.children as Lightning2[]
  }
}

export default Lightning2
