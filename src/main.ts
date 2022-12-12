import {Application, Sprite, Texture } from 'pixi.js';
import * as PIXI from 'pixi.js';

import Lightning from './Lightning';
import Lightning2 from 'Lightning2';

const app = new Application({
  resizeTo: window,
});
document.body.appendChild(app.view);


const sprite = Sprite.from(Texture.WHITE);
sprite.tint = 0xFFFFFF * Math.random();

// app.stage.addChild(sprite);

const lightning = new Lightning()
// lightning.tint
app.stage.addChild(lightning);

const direction = [1, 1];
const speed = 10;

app.ticker.add(delta => {
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

    lightning.update();
});




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
