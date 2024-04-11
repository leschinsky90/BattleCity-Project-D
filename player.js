var lifes = 3;
var playerlvl = 0;
class Player extends Tank {
  constructor(x, y) {
    super(x, y);
    this.position = "up";
    this.bullets = [];
    this.shield = false;
    this.tank.classList.add("player");
    this.tank.style.backgroundImage = `url(sprites/tanks/player/lvl${playerlvl}/up1.png)`;
  }
  destroy = (f = true) => {
    if (this.shield) return;
    let blast = document.createElement("div");
    blast.classList.add("blast", "effect");
    let top = parseInt(getComputedStyle(this.tank).top);
    let left = parseInt(getComputedStyle(this.tank).left);
    blast.style.top = top + px;
    blast.style.left = top + px;
    this.life = false;
    setTimeout(() => this.tank.remove(), 100);
    if (f) {
      field.append(blast);
      setTimeout(() => {
        blast.style.backgroundImage = `url(sprites/effects/blast1.png)`;
      }, 50);
      setTimeout(() => {
        blast.style.backgroundImage = `url(sprites/effects/blast2.png)`;
      }, 100);
      setTimeout(() => {
        blast.style.backgroundImage = `url(sprites/effects/blast3.png)`;
      }, 150);
      setTimeout(() => {
        blast.remove();
        blast.style.width = "64px";
        blast.style.height = "64px";
        blast.style.backgroundSize = "64px";
        blast.style.top = top - 8 + px;
        blast.style.left = left - 8 + px;
        blast.style.backgroundImage = `url(sprites/effects/bigblast1.png)`;
        field.append(blast);
      }, 250);
      setTimeout(() => {
        blast.style.backgroundImage = `url(sprites/effects/bigblast2.png)`;
      }, 275);
      setTimeout(() => {
        blast.remove();
      }, 475);
    }
    this.life = false;
    lifes--;
    lifesCount.textContent = lifes;
    if ((lifes == 0) & f) setTimeout(gameOver, 1500);
    else if (f) {
      setTimeout(() => this.reborn(), 3000);
    }
  };
  turn = () => {
    let url = `url(sprites/tanks/player/lvl${playerlvl}/${this.position}`;
    if (
      getComputedStyle(this.tank).backgroundImage[
        getComputedStyle(this.tank).backgroundImage.length - 7
      ] == 1
    ) {
      url += "2.png)";
    } else {
      url += "1.png)";
    }
    this.tank.style.backgroundImage = url;
  };
  reborn = () => {
    this.tank.remove();
    this.life = true;
    this.tank.style.left = this.x + px;
    this.tank.style.top = this.y + px;
    this.position = "up";
    playerlvl = 0;
    this.tank.style.backgroundImage = "url(sprites/tanks/player/lvl0/up1.png)";
    this.create();
  };
  recognizeBonus = () => {
    let interval;
    switch (bonus.type) {
      case "clock":
        interval = setInterval(() => {
          if (levelEnemies.length != 0) {
            for (let enemy of levelEnemies) {
              if (enemy != null) enemy.AITurnOff();
            }
          }
        }, 1000);
        setTimeout(() => {
          for (let enemy of levelEnemies) if (enemy != null) enemy.AITurnOn();
          bonus = null;
          clearInterval(interval);
        }, 90000);
        break;
      case "grenade":
        for (let enemy of levelEnemies) {
          if (enemy != null) enemy.destroy();
        }
        bonus = null;
        break;
      case "gun":
        playerlvl = 3;
        bonus = null;
        break;
      case "shield":
        this.shield = true;
        let imgNumber = 1;
        let shield = document.createElement("div");
        shield.classList.add("shield");
        interval = setInterval(() => {
          shield.remove();
          shield.style.top = getComputedStyle(playerTank.tank).top;
          shield.style.left = getComputedStyle(playerTank.tank).left;
          shield.style.backgroundImage = `url(sprites/Effects/shield${imgNumber}.png)`;
          field.append(shield);
          if (imgNumber == 1) imgNumber++;
          else imgNumber = 1;
        }, 100);
        setTimeout(() => {
          shield.remove();
          this.shield = false;
          bonus = null;
          clearInterval(interval);
        }, 60000);
        break;
      case "shovel":
        headquaters.reinforceHead();
        setTimeout(() => {
          headquaters.reinforceHead();
          bonus = null;
        }, 120000);
        break;
      case "star":
        if (playerlvl < 3) playerlvl++;
        bonus = null;
        break;
      case "tank":
        lifes++;
        lifesCount.textContent = lifes;
        bonus = null;
        break;
    }
  };
  catchBonus = () => {
    if (bonus != null)
      if (insideRect(this.tank, bonus.object)) {
        bonus.object.remove();
        this.recognizeBonus();
        totalScore += 500;
      }
  };
  press = (event) => {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        if (this.canMove(event.code)) {
          this.tank.style.top =
            parseInt(getComputedStyle(this.tank).top) - this.speed + px;
        }
        this.position = "up";
        this.turn();
        break;
      case "KeyS":
      case "ArrowDown":
        if (this.canMove(event.code)) {
          this.tank.style.top =
            parseInt(getComputedStyle(this.tank).top) + this.speed + px;
        }
        this.position = "down";
        this.turn();
        break;
      case "KeyA":
      case "ArrowLeft":
        if (this.canMove(event.code)) {
          this.tank.style.left =
            parseInt(getComputedStyle(this.tank).left) - this.speed + px;
        }
        this.position = "left";
        this.turn();
        break;
      case "KeyD":
      case "ArrowRight":
        if (this.canMove(event.code)) {
          this.tank.style.left =
            parseInt(getComputedStyle(this.tank).left) + this.speed + px;
        }
        this.position = "right";
        this.turn();
        break;
      case "Space":
        this.shot();
    }
    this.catchBonus();
  };
  shot = () => {
    let f = false;
    if (playerlvl < 2) {
      if (this.bullets.length == 0) {
        f = true;
      }
    } else {
      if (this.bullets.length < 2) {
        f = true;
      }
    }
    if (f) {
      this.createBullet();
      let bullet = this.bullets[this.bullets.length - 1];
      let bulletinterval;
      switch (this.position) {
        case "up":
          bulletinterval = setInterval(() => {
            bullet.object.style.top =
              parseInt(getComputedStyle(bullet.object).top) - 5 + px;
            if (bullet.strike()) {
              this.deleteBullet(bullet);
              clearInterval(bulletinterval);
            }
          }, bullet.speed);
          break;

        case "down":
          bulletinterval = setInterval(() => {
            bullet.object.style.top =
              parseInt(getComputedStyle(bullet.object).top) + 5 + px;
            if (bullet.strike()) {
              this.deleteBullet(bullet);
              clearInterval(bulletinterval);
            }
          }, bullet.speed);
          break;

        case "left":
          bulletinterval = setInterval(() => {
            bullet.object.style.left =
              parseInt(getComputedStyle(bullet.object).left) - 5 + px;
            if (bullet.strike()) {
              this.deleteBullet(bullet);
              clearInterval(bulletinterval);
            }
          }, bullet.speed);
          break;
        case "right":
          bulletinterval = setInterval(() => {
            bullet.object.style.left =
              parseInt(getComputedStyle(bullet.object).left) + 5 + px;
            if (bullet.strike()) {
              this.deleteBullet(bullet);
              clearInterval(bulletinterval);
            }
          }, bullet.speed);
          break;
      }
    }
  };
  createBullet = () => {
    let bullet = new Bullet(this);
    bullet.create();
    if (playerlvl < 2) {
      if (this.bullets.length == 0) {
        this.bullets.push(bullet);
        field.append(bullet.object);
      }
    } else {
      if (this.bullets.length < 2) {
        this.bullets.push(bullet);
        field.append(bullet.object);
      }
    }
  };
  deleteBullet = (bullet) => {
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
    bullet.delete();
  };
  stun = () => {};
}
