/**
 * Lightning Class
 * AS3 Class to mimic a real lightning or electric discharge
 *
 * @author		Pierluigi Pesenti
 * @version		0.5
 *
 */

import { Container, Graphics } from "pixi.js";
import LightningFadeType from "./LightningFadeType";

// https://ronvalstar.nl/perlin-noise-versus-simplex-noise-in-javascript-final-comparison
// https://test.ronvalstar.nl/perlinAndSimplex/

/*
Licensed under the MIT License

Copyright (c) 2008 Pierluigi Pesenti

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

http://blog.oaxoa.com/
*/
//https://github.com/vpmedia/lightning-effect-as3-optimized

	// import flash.display.Sprite;
	// import flash.display.Bitmap;
	// import flash.display.BitmapData;
	// import flash.geom.Point;
	// import flash.filters.GlowFilter;
	// import flash.display.BlendMode;
	// import flash.geom.Matrix;
	// import flash.utils.Timer;
	// import flash.events.TimerEvent;
	// import flash.display.BlendMode;

	// import com.oaxoa.fx.LightningFadeType;

type LightningChild = {
  instance: Lightning
  childAngle: number
  startStep: number
  endStep: number
  detachedEnd: boolean
}

class Lightning extends Container {

  // private const SMOOTH_COLOR: number = 0x808080;

  private holder: Graphics;
  // private sbd: BitmapData;
  // private bbd: BitmapData;
  // private sOffsets:[];
  // private bOffsets:[];
  // private glow:GlowFilter;

  public lifeSpan: number;
  private lifeTimer: NodeJS.Timeout;

  public startX = 50;
  public startY = 200;
  public endX = 50;
  public endY = 600;

  public multi: number;
  public multi2: number;

  public _steps: number;
  public stepEvery: number;
  private seed1: number;
  private seed2: number;

  public smooth: Graphics;
  public childrenSmooth: Graphics;
  public childrenArray: LightningChild[] = [];

  public _smoothPercentage: number = 50;
  public _childrenSmoothPercentage: number;
  public _color: number;

  private generation: number;
  private _childrenMaxGenerations: number = 3;
  private _childrenProbability: number = 0.025;
  private _childrenProbabilityDecay: number = 0;
  private _childrenMaxCount: number = 4;
  private _childrenMaxCountDecay: number = .5;
  private _childrenLengthDecay: number = 0;
  private _childrenAngleVariation: number = 60;
  private _childrenLifeSpanMin: number = 0;
  private _childrenLifeSpanMax: number = 0;
  private _childrenDetachedEnd:  boolean = false;

  private _maxLength: number = 0;
  private _maxLengthVary: number = 0;
  public _isVisible:  boolean = true;
  public _alphaFade:  boolean = true;
  public parentInstance: Lightning;
  private _thickness: number;
  private _thicknessDecay: number;
  private initialized:  boolean = false;

  private _wavelength: number = .3;
  private _amplitude: number = 22.5;
  private _speed: number = 1;

  private calculatedWavelength: number;
  private calculatedSpeed: number;

  public alphaFadeType: LightningFadeType;
  public thicknessFadeType: LightningFadeType;

  private positionL: number = 0; // todo: `position` was already taken
  private absolutePosition: number = 1;

  private dx: number;
  private dy: number;

  private sOffsets: number;
  private sOffsetsx: number;
  private sOffsetsy: number;
  private bOffsets: number;
  private bOffsetsx: number;
  private bOffsetsy: number;

  constructor(pcolor: number = 0xffffff, pthickness: number = 2, generation: number = 0) {
    super();
    // this.mouseEnabled=false;
    this._color = pcolor;
    this._thickness = pthickness;

    this.alphaFadeType = LightningFadeType.GENERATION;
    this.thicknessFadeType = LightningFadeType.NONE;

    this.generation = generation;
    if (generation == 0) {
      this.init();
    }
  }

  private init(): void {
    this.randomizeSeeds();
    if (this.lifeSpan > 0) {
      this.startLifeTimer();
    }

    this.multi2 = .03;

    this.holder = new Graphics();
    //this.holder.mouseEnabled=false;


    this.stepEvery = 4;
    this._steps = 50;

    // this.sbd = new BitmapData(this._steps, 1, false);
    // this.bbd = new BitmapData(this._steps, 1, false);
    // this.sOffsets=[new Point(0, 0), new Point(0, 0)];
    // this.bOffsets=[new Point(0, 0), new Point(0, 0)];

    if (this.generation == 0) {
      this.smooth = new Graphics();
      this.childrenSmooth = new Graphics();
      this.smoothPercentage = 50;
      this.childrenSmoothPercentage=50;
    } else {
      this.smooth = this.childrenSmooth = this.parentInstance.childrenSmooth;
    }

    this.steps = 100;
    this.childrenLengthDecay = .5;

    this.addChild(this.holder);
    this.initialized = true;
  }

  private randomizeSeeds(): void {
    this.seed1 = Math.random()*100;
    this.seed2 = Math.random()*100;
  }

  public set steps(arg: number) {
    if (arg < 2) arg = 2;
    if (arg > 2880) arg = 2880;
    this._steps = arg;
    // this.sbd=new BitmapData(this._steps, 1, false);
    // this.bbd=new BitmapData(this._steps, 1, false);
    if (this.generation == 0) this.smoothPercentage = this.smoothPercentage;
  }

  public get steps(): number {
    return this._steps;
  }

  public startLifeTimer():void {
    this.lifeTimer = setTimeout(() => {
      this.kill();

    }, this.lifeSpan * 1000);
  }

  public kill(): void {
    this.killAllChildren();

    if (this.lifeTimer) {
      clearTimeout(this.lifeTimer);
    }

    if (this.parentInstance != null) {
      let count: number = 0;
      const par: Lightning = this.parent as unknown as Lightning;
      // for(var obj:Object in par.childrenArray) {
      //   if (obj.instance == this) {
      //     par.childrenArray.splice(count, 1);
      //   }
      //   count++;
      // }
    }
    this.parent.removeChild(this);
    // delete this;
  }

  public killAllChildren():void {
    while(this.childrenArray.length > 0) {
      const child = this.childrenArray[0];
      child.instance.kill();
    }
  }

  public generateChild(n: number = 1, recursive:  boolean = false):void {
    if (this.generation < this.childrenMaxGenerations && this.childrenArray.length < this.childrenMaxCount) {
      const targetChildSteps: number = this.steps * this.childrenLengthDecay;
      if (targetChildSteps >= 2) {
        for(let i: number = 0; i<n; i++) {
          const startStep: number = Math.random() * this.steps;
          let endStep: number = Math.random() * this.steps;
          while( endStep == startStep) endStep = Math.random() * this.steps;
          const childAngle: number = Math.random() * this.childrenAngleVariation - this.childrenAngleVariation / 2;

          const child: Lightning = new Lightning(this.color, this.thickness, this.generation + 1);

          child.parentInstance = this;
          child.lifeSpan = Math.random()* (this.childrenLifeSpanMax - this.childrenLifeSpanMin) + this.childrenLifeSpanMin;
          child.positionL = 1 - startStep / this.steps;
          child.absolutePosition = this.absolutePosition * child.positionL;
          child.alphaFadeType = this.alphaFadeType;
          child.thicknessFadeType = this.thicknessFadeType;

          if (this.alphaFadeType == LightningFadeType.GENERATION) child.alpha=1-(1/(this.childrenMaxGenerations+1)) * child.generation;
          if (this.thicknessFadeType == LightningFadeType.GENERATION) child.thickness = this.thickness - (this.thickness/(this.childrenMaxGenerations+1)) * child.generation;
          child.childrenMaxGenerations = this.childrenMaxGenerations;
          child.childrenMaxCount = this.childrenMaxCount * (1 - this.childrenMaxCountDecay);
          child.childrenProbability = this.childrenProbability * (1 - this.childrenProbabilityDecay);
          child.childrenProbabilityDecay = this.childrenProbabilityDecay;
          child.childrenLengthDecay = this.childrenLengthDecay;
          child.childrenDetachedEnd = this.childrenDetachedEnd;

          child.wavelength = this.wavelength;
          child.amplitude = this.amplitude;
          child.speed = this.speed;

          child.init();

          this.childrenArray.push({
            instance: child,
            startStep,
            endStep,
            detachedEnd: this.childrenDetachedEnd,
            childAngle
          });
          this.addChild(child);

          child.steps = this.steps*(1 - this.childrenLengthDecay);
          if (recursive) child.generateChild(n, true);
        }
      }
    }
  }

  public update(): void {
    if (this.initialized) {
      this.dx = this.endX - this.startX;
      this.dy = this.endY - this.startY;

      // this.sOffsets[0].x+=(this.steps/100) * speed;
      // this.sOffsets[0].y+=(this.steps/100) * speed;
      // this.sbd.perlinNoise(this.steps/20, this.steps/20, 1, this.seed1, false, true, 7, true, this.sOffsets);



      // baseX (Number): Determines the x (size) value of patterns created.
      // baseY (Number): Determines the y (size) value of the patterns created.
      // numOctaves (uint): Number of octaves or individual noise functions to combine to create this noise. Larger numbers of octaves create images with greater detail but also require more processing time.
      // randomSeed (int): The random seed number works exactly the same way as it does in the noise() function. To get a true random result, use the Math.random() method to pass a random number for this parameter.
      // stitch (Boolean): If set to true , this method attempts to stitch (or smooth) the transition edges of the image to create seamless textures for tiling as a bitmap fill.
      // fractalNoise (Boolean): This parameter relates to the edges of the gradients being generated by the method. If set to true , the method generates fractal noise that smooths the edges of the effect. If set to false , it generates turbulence. An image with turbulence has visible discontinuities in the gradient that can make it better approximate sharper visual effects, like flames and ocean waves.
      // channelOptions (uint): The channelOptions parameter works exactly the same way as it does in the noise() method. It specifies to which color channel (of the bitmap) the noise pattern is applied. The number can be a combination of any of the four color channel ARGB values. The default value is 7.
      // grayScale (Boolean): The grayScale parameter works exactly the same way as it does in the noise() method. If set to true , it applies the randomSeed value to the bitmap pixels, effectively washing all color out of the image. The default value is false .
      // offsets (Array): An array of points that correspond to x and y offsets for each octave. By manipulating the offset values, you can smoothly scroll the layers of the image. Each point in the offset array affects a specific octave noise function. The default value is null.



      this.calculatedWavelength = this.steps * this.wavelength;
      this.calculatedSpeed = (this.calculatedWavelength * .1) * this.speed;
      // this.bOffsets[0].x- = this.calculatedSpeed;
      // this.bOffsets[0].y+ = this.calculatedSpeed;
      // this.bbd.perlinNoise(this.calculatedWavelength, this.calculatedWavelength, 1, this.seed2, false, true, 7, true, this.bOffsets);

      if (this.smoothPercentage > 0) {
        // var drawMatrix: Matrix = new Matrix();
        // drawMatrix.scale(this.steps/this.smooth.width,1);
        // this.bbd.draw(this.smooth, drawMatrix);
      }

      if (this.parentInstance != null) {
        this.isVisible = this.parentInstance.isVisible;
      } else {
        if (this.maxLength == 0) {
          this.isVisible = true;
        } else {
          var isVisibleProbability: number;

          if (this.len <= this.maxLength) {
            isVisibleProbability = 1;
          } else if (this.len > this.maxLength + this.maxLengthVary) {
            isVisibleProbability = 0;
          } else {
            isVisibleProbability= 1 - (this.len - this.maxLength) / this.maxLengthVary;
          }

          this.isVisible = Math.random() < isVisibleProbability ? true : false;
        }
      }

      const generateChildRandom: number = Math.random();
      if (generateChildRandom < this.childrenProbability) {
        this.generateChild();
      }


      if (this.isVisible) {
        this.draw();
      }

      this.childrenArray.forEach((c) => c.instance.update());
    }
  }

  public draw(): void {
    this.holder.clear();
    this.holder.lineStyle(this.thickness, this.color);

    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    // var childObject:Object;
    // const stepsNoise = perlin.generatePerlinNoise(this.steps, 1, {
    //   octaveCount: 1,
    //   // amplitude - defaults to 0.1
    //   // persistence - defaults to 0.2
    // });


    for (let i: number = 0; i < this.steps; i++) {
      var currentPosition: number = 1/this.steps*(this.steps-i)
      var relAlpha: number = 1;
      var relThickness: number = this.thickness;

      if (this.alphaFadeType == LightningFadeType.TIP_TO_END) {
        relAlpha = this.absolutePosition*currentPosition;
      }
      if (this.thicknessFadeType == LightningFadeType.TIP_TO_END) {
        relThickness = this.thickness * (this.absolutePosition*currentPosition);
      }

      if (this.alphaFadeType == LightningFadeType.TIP_TO_END || this.thicknessFadeType == LightningFadeType.TIP_TO_END) {
        this.holder.lineStyle(relThickness, this._color, relAlpha);
      }

      this.sOffsets = Perlin.perlin2(i / 10, 1) * this.len * this.amplitude;
      console.log(`this.sOffsets`, this.sOffsets);
      // this.sOffsets=(this.sbd.getPixel(i, 0)-0x808080)/0xffffff*this.len*this.multi2;
      this.sOffsetsx = Math.sin(angle) * this.sOffsets;
      this.sOffsetsy = Math.cos(angle) * this.sOffsets;

      // this.bOffsets=(this.bbd.getPixel(i, 0)-0x808080)/0xffffff*this.len*amplitude;
      // this.bOffsetsx=Math.sin(angle)*this.bOffsets;
      // this.bOffsetsy=Math.cos(angle)*this.bOffsets;

      let targetX = this.startX + this.dx / (this.steps - 1) * i + this.sOffsetsx + this.bOffsetsx;
      let targetY = this.startY + this.dy / (this.steps - 1) * i - this.sOffsetsy - this.bOffsetsy;

      // targetX = this.startX + Math.random() * 50
      // targetY = this.startY + Math.random() * 50

      if (i == 0) {
        this.holder.moveTo(targetX, targetY);
      }
      this.holder.lineTo(targetX, targetY);

      this.childrenArray.forEach((childObject) => {
        if (childObject.startStep == i) {
          childObject.instance.startX = targetX;
          childObject.instance.startY = targetY;
        }
        if (childObject.detachedEnd) {
          const arad: number = angle + childObject.childAngle / 180 * Math.PI;

          const childLength: number = this.len * this.childrenLengthDecay;
          childObject.instance.endX = childObject.instance.startX+Math.cos(arad) * childLength;
          childObject.instance.endY = childObject.instance.startY+Math.sin(arad) * childLength;
        } else {
          if (childObject.endStep == i) {
            childObject.instance.endX = targetX;
            childObject.instance.endY = targetY;
          }
        }
      })
    }
  }

  public killSurplus():void {
    while(this.childrenArray.length > this.childrenMaxCount) {
      const child: Lightning = this.childrenArray[this.childrenArray.length-1].instance;
      child.kill();
    }
  }

  public set smoothPercentage(arg: number) {
    // if (smooth) {
    //   _smoothPercentage=arg;

    //   const smoothmatrix:Matrix = new Matrix();
    //   smoothmatrix.createGradientBox(steps, 1);
    //   const ratioOffset: number = _smoothPercentage/100*128;

    //   smooth.clear();
    //   smooth.beginGradientFill("linear", [SMOOTH_COLOR, SMOOTH_COLOR, SMOOTH_COLOR, SMOOTH_COLOR], [1,0,0,1], [0,ratioOffset,255-ratioOffset,255], smoothmatrix);
    //   smooth.drawRect(0, 0, steps, 1);
    //   smooth.endFill();
    // }
  }
  public set childrenSmoothPercentage(arg: number) {
    // _childrenSmoothPercentage=arg;

    // var smoothmatrix:Matrix=new Matrix();
    // smoothmatrix.createGradientBox(steps, 1);
    // var ratioOffset: number = _childrenSmoothPercentage/100*128;

    // childrenSmooth.clear();
    // childrenSmooth.beginGradientFill("linear", [SMOOTH_COLOR, SMOOTH_COLOR, SMOOTH_COLOR, SMOOTH_COLOR], [1,0,0,1], [0,ratioOffset,255-ratioOffset,255], smoothmatrix);
    // childrenSmooth.drawRect(0, 0, steps, 1);
    // childrenSmooth.endFill();
  }

  public get smoothPercentage(): number {
    return this._smoothPercentage;
  }

  public get childrenSmoothPercentage(): number {
    return this._childrenSmoothPercentage;
  }

  public set color(arg: number) {
    this._color=arg;
    // glow.color=arg;
    // this.holder.filters=[glow];
    // for each(var child:Object in childrenArray) child.instance.color=arg;
  }

  public get color(): number {
    return this._color;
  }

  public set childrenProbability(arg: number) {
    if (arg > 1) {
      arg=1
    } else if (arg<0) {
      arg=0;
    }
    this._childrenProbability = arg;
  }

  public get childrenProbability(): number {
    return this._childrenProbability;
  }

  public set childrenProbabilityDecay(arg: number) {
    if (arg>1) { arg=1 } else if (arg<0) arg=0;
    this._childrenProbabilityDecay = arg;
  }
  public get childrenProbabilityDecay(): number {
    return this._childrenProbabilityDecay;
  }

  public set maxLength(arg: number) {
    this._maxLength = arg;
  }

  public get maxLength(): number {
    return this._maxLength;
  }

  public set maxLengthVary(arg: number) {
    this._maxLengthVary = arg;
  }

  public get maxLengthVary(): number {
    return this._maxLengthVary;
  }

  public set thickness(arg: number) {
    if (arg<0) arg=0;
    this._thickness = arg;
  }

  public get thickness(): number {
    return this._thickness;
  }

  public set thicknessDecay(arg: number) {
    if (arg>1) { arg=1 } else if (arg<0) arg=0;
    this._thicknessDecay = arg;
  }
  public get thicknessDecay(): number {
    return this._thicknessDecay;
  }

  public set childrenLengthDecay(arg: number) {
    if (arg>1) { arg=1 } else if (arg<0) arg=0;
    this._childrenLengthDecay = arg;
  }

  public get childrenLengthDecay(): number {
    return this._childrenLengthDecay;
  }

  public set childrenMaxGenerations(arg: number) {
    this._childrenMaxGenerations = arg;
    this.killSurplus();
  }

  public get childrenMaxGenerations(): number {
    return this._childrenMaxGenerations;
  }

  public set childrenMaxCount(arg: number) {
    this._childrenMaxCount = arg;
    this.killSurplus();
  }

  public get childrenMaxCount(): number {
    return this._childrenMaxCount;
  }

  public set childrenMaxCountDecay(arg: number) {
    if (arg>1) { arg=1 } else if (arg<0) arg=0;
    this._childrenMaxCountDecay = arg;
  }

  public get childrenMaxCountDecay(): number {
    return this._childrenMaxCountDecay;
  }

  public set childrenAngleVariation(arg: number) {
    this._childrenAngleVariation = arg;
    this.childrenArray.forEach((o) => {
      o.childAngle = Math.random() * arg - arg/2;
      o.instance.childrenAngleVariation = arg;
    })
  }

  public get childrenAngleVariation(): number {
    return this._childrenAngleVariation;
  }

  public set childrenLifeSpanMin(arg: number) {
    this._childrenLifeSpanMin = arg;
  }

  public get childrenLifeSpanMin(): number {
    return this._childrenLifeSpanMin;
  }

  public set childrenLifeSpanMax(arg: number) {
    this._childrenLifeSpanMax = arg;
  }

  public get childrenLifeSpanMax(): number {
    return this._childrenLifeSpanMax;
  }

  public set childrenDetachedEnd(arg: boolean) {
    this._childrenDetachedEnd = arg;
  }

  public get childrenDetachedEnd(): boolean {
    return this._childrenDetachedEnd;
  }

  public set wavelength(arg: number) {
    this._wavelength = arg;
    this.childrenArray.forEach((o) => {
      o.instance.wavelength = arg;
    });
  }
  public get wavelength(): number {
    return this._wavelength;
  }

  public set amplitude(arg: number) {
    this._amplitude = arg;
    this.childrenArray.forEach((o) => {
      o.instance.amplitude = arg;
    })
  }

  public get amplitude(): number {
    return this._amplitude;
  }

  public set speed(arg: number) {
    this._speed = arg;
    this.childrenArray.forEach((o) => {
      o.instance.speed = arg;
    })
  }

  public get speed(): number {
    return this._speed;
  }
  public set isVisible(arg: boolean) {
    this._isVisible = this.visible = arg;
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }

  public get len(): number {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy)
  }
}

export default Lightning

