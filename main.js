const AM = new AssetManager();

class Animation {
  constructor(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration,
    frames, loop) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
  }

  drawFrame(tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
      if (this.loop) {
        this.elapsedTime -= this.totalTime;
      }
    }
    let frame = this.currentFrame();
    let xindex = 0;
    let yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
                  xindex * this.frameWidth, yindex * this.frameHeight,
                  this.frameWidth, this.frameHeight,
                  x, y,
                  this.frameWidth, this.frameHeight);
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }

  isDone() {
    return (this.elapsedTime >= this.totalTime);
  }
}

class MushroomDude {
  constructor(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14) {
      this.x += this.game.clockTick * this.speed;
    }
    if (this.x > 800) {
      this.x = -230;
    }
  }
}

class Tile {
  constructor(spritesheet, sx, sy, sw, sh, x, y, w, h) {
    this.spritesheet = spritesheet;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {
    // Intentionally blank
  }

  draw(ctx) {
    ctx.drawImage(this.spritesheet,
                  this.sx, this.sy,
                  this.sw, this.sh,
                  this.x, this.y,
                  this.w, this.h);
  }
}

class Dirt extends Tile {
  constructor(spritesheet, x, y, w, h) {
    super(spritesheet, 0, 0, 16, 16, x, y, w, h);
  }
}

class Wall extends Tile {
  constructor(spritesheet, sx, sy, sw, sh, x, y, w, h) {
    super(spritesheet, sx, sy, sw, sh, x, y, w, h);
    this.collision = true;
  }
}

AM.queueDownload('./img/tilesheet.png');

AM.downloadAll(function () {
  const canvas = document.getElementById('gameWorld');
  const ctx = canvas.getContext('2d');

  const gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();

//  gameEngine.addEntity(new MushroomDude(gameEngine,
//    AM.getAsset('./img/mushroomdude.png')));

  const level = new Level();
  // Attach entities to the Level data
  let tiles = [];
  const SIZE = 32;
  for (let i = 0; i < level.tiles[0].length; i++) {
    for (let j = 0; j < level.tiles.length; j++) {
      switch (level.tiles[j][i]) {
        case 'W': tiles.push(new Wall(AM.getAsset('./img/tilesheet.png'), 16, 0,
          16, 16, i * SIZE, j * SIZE, SIZE, SIZE)); break;
        case 'D': tiles.push(new Dirt(AM.getAsset('./img/tilesheet.png'),
          i * SIZE, j * SIZE, SIZE, SIZE)); break;
      }
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    gameEngine.addEntity(tiles[i]);
  }

  console.log(level.tiles);

  console.log('Finished downloading assets');
});
