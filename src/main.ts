import {Application, DisplayObject, Graphics, Point, Sprite, Texture } from 'pixi.js';
import * as PIXI from 'pixi.js';

import Lightning from './Lightning';
import Lightning2 from 'Lightning2';
import LightningFadeType from 'LightningFadeType';
// import smooth from 'smooth';
import smooth from 'array-smooth';
const app = new Application({
  resizeTo: window,
});
document.body.appendChild(app.view);


const sprite = Sprite.from(Texture.WHITE);
sprite.tint = 0xFFFFFF * Math.random();

// app.stage.addChild(sprite);

const startPoint = new Graphics()
app.stage.addChild(startPoint);
startPoint.name = 'start11'

let dragTarget: DisplayObject | null = null
startPoint.interactive = true
startPoint.cursor = 'pointer'
startPoint.on('mousedown', (e) => {
  dragTarget = startPoint
})

const mouseUp = (e) => {
  // console.log('up')
  dragTarget = null
}

startPoint.on('mouseupoutside', mouseUp)
startPoint.on('mouseup', mouseUp)
app.stage.on('mousemove', (e) => {
  if (dragTarget === startPoint) {
    const pos = startPoint.parent.toLocal(e.global, undefined);
    lightning.start = new Point(pos.x, pos.y);
  }
  if (dragTarget === endPoint) {
    const pos = startPoint.parent.toLocal(e.global, undefined);
    lightning.end =  new Point(pos.x, pos.y);
  }
})

const endPoint = new Graphics()
endPoint.name = 'end'
app.stage.addChild(endPoint);
endPoint.interactive = true
endPoint.cursor = 'pointer'
endPoint.on('mousedown', (e) => {
  dragTarget = endPoint
})

endPoint.on('mouseupoutside', mouseUp)
endPoint.on('mouseup', mouseUp)


const lightning = new Lightning2()
// lightning.thicknessEnd = 0.5
// lightning.thicknessFadeType = LightningFadeType.TIP_TO_END
// lightning.alphaFadeType = LightningFadeType.GENERATION





app.stage.addChild(lightning);



const direction = [1, 1];
const speed = 10;

app.ticker.add(delta => {
  startPoint.clear();
  startPoint.beginFill(0xff0000);
  startPoint.drawCircle(lightning.start.x, lightning.start.y, 15)
  startPoint.endFill();

  endPoint.clear();
  endPoint.beginFill(0x00ff00);
  endPoint.drawCircle(lightning.end.x, lightning.end.y, 15)
  endPoint.endFill();




  sprite.x += direction[0] * speed * delta;
  sprite.y += direction[1] * speed * delta;
  if (sprite.x < 0 || sprite.x > app.screen.width - sprite.width) {
    sprite.tint = 0xFFFFFF * Math.random();
    direction[0] *= -1;
  }
  if (sprite.y < 0 || sprite.y > app.screen.height - sprite.height) {
      sprite.tint = 0xFFFFFF * Math.random();
      direction[1] *= -1;
    }

    if (checkboxUpdate.checked) {
      lightning.update();
    }

    // startPoint.x = lightning.startX;
    // startPoint.y = lightning.startY;
  });
  // lightning.update();




  const checkboxUpdate = document.createElement('input')
  checkboxUpdate.setAttribute('type', 'checkbox')
  checkboxUpdate.checked = true;
  checkboxUpdate.classList.add('form-slider-update');
  document.body.appendChild(checkboxUpdate);


  const sliderAmplitude = document.createElement('input');
  sliderAmplitude.setAttribute('type', 'range')
  sliderAmplitude.setAttribute('min', '0')
  sliderAmplitude.setAttribute('max', '1')
  sliderAmplitude.setAttribute('step', '0.01')
  sliderAmplitude.value = `${lightning.amplitude}`;
  sliderAmplitude.classList.add('form-slider-amplitude');
  sliderAmplitude.addEventListener('input', () => {
    console.log(sliderAmplitude.value)

    lightning.amplitude = Number(sliderAmplitude.value);
  })
  document.body.appendChild(sliderAmplitude);

  const sliderThickness = document.createElement('input');
  sliderThickness.setAttribute('type', 'range')
  sliderThickness.setAttribute('min', '1')
  sliderThickness.setAttribute('max', '10')
  sliderThickness.setAttribute('step', '0.01')
  sliderThickness.value = `${lightning.thicknessStart}`;
  sliderThickness.classList.add('form-slider-thickness');
  sliderThickness.addEventListener('input', () => {
    // console.log(sliderThickness.value)

    lightning.thicknessStart = Number(sliderThickness.value);
  })
  document.body.appendChild(sliderThickness);

  const sliderSpeed = document.createElement('input');
  sliderSpeed.setAttribute('type', 'range')
  sliderSpeed.setAttribute('min', '0')
  sliderSpeed.setAttribute('max', '10')
  sliderSpeed.setAttribute('step', '0.01')
  sliderSpeed.value = `${lightning.speed}`;
  sliderSpeed.classList.add('form-slider-speed');
  sliderSpeed.addEventListener('input', () => {
    // console.log(sliderThickness.value)

    lightning.speed = Number(sliderSpeed.value);
  })
  document.body.appendChild(sliderSpeed);



//   const array = [10, 13, 7, 11, 12, 9, 6, 5];
// console.log(array)

// console.log(smooth(array, 2));

// For devtools!!
window.PIXI = PIXI
const PIXI_EXTRA = {
  'Lightning': Lightning, // which extends PIXI.DisplayObject
  'Lightning2': Lightning2, // which extends PIXI.DisplayObject
}
window.PIXI = new Proxy({}, {
  get(target, p) {
    // See: https://github.com/bfanger/pixi-inspector/blob/master/src/services/Inspector.js#L28
    if (p in PIXI) return PIXI[p];
    if (p in PIXI_EXTRA) return PIXI_EXTRA[p];
    return undefined;
  },
  has(target, p) {
    return Reflect.has(PIXI, p) || Reflect.has(PIXI_EXTRA, p);
  },
  ownKeys() {
    return [...Reflect.ownKeys(PIXI), ...Reflect.ownKeys(PIXI_EXTRA)];
  },
  getOwnPropertyDescriptor(target, p) {
    const result = Reflect.getOwnPropertyDescriptor(PIXI, p)
        || Reflect.getOwnPropertyDescriptor(PIXI_EXTRA, p);

    if (!result) return undefined;
    return {
        ...result,
        configurable: true,
    };
  },
});
