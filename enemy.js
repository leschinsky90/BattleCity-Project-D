class Enemy extends Tank {
  constructor(x, y, index) {
    super(x, y);
    this.vector = 1;
    this.position = "down";
    this.index = index;
    this.flashing = this.index == 4 || this.index == 11 || this.index == 18;
    this.moveInterval;
    this.shotInterval;
    this.bullet = null;
    this.score = null;
    this.tank.classList.add("enemy");
    this.tank.style.backgroundImage = `url(sprites/tanks/enemies/${this.constructor.name}/down1.png`;
  }
  turn = () => {
    let url = `url(sprites/tanks/enemies/${this.constructor.name}/${this.position}`;
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
  destroy = (f = true) => {
    this.life = false;
    this.AITurnOff();
    let blast = document.createElement("div");
    blast.classList.add("blast", "effect");
    let top = parseInt(getComputedStyle(this.tank).top);
    let left = parseInt(getComputedStyle(this.tank).left);
    blast.style.top = top + px;
    blast.style.left = top + px;
    this.life = false;
    totalScore += this.score;
    if (this.flashing) new Bonus().create();
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
      }, 450);
      setTimeout(() => {
        let score = document.createElement("span");
        score.classList.add("score");
        score.textContent = this.score;
        gameSpace.prepend(score);
        setTimeout(() => score.remove(), 1000);
      }, 500);
    }
    levelEnemies[this.index - 1] = null;
  };
  AITurnOn = () => {
    this.moveInterval = setInterval(() => this.move(), 65);
    this.shotInterval = setInterval(() => {
      if (rand(0, 4) == 0) {
        this.shot();
      }
    }, 500);
  };
  AITurnOff = () => {
    clearInterval(this.moveInterval);
    clearInterval(this.shotInterval);
  };
  move = () => {
    switch (this.vector) {
      case 0:
        this.position = "up";
        this.turn();
        if (this.canMove("KeyW")) {
          this.tank.style.top =
            parseInt(getComputedStyle(this.tank).top) - this.speed + px;
        } else {
          this.vector = rand(0, 4);
        }
        break;
      case 1:
        this.position = "down";
        this.turn();
        if (this.canMove("KeyS")) {
          this.tank.style.top =
            parseInt(getComputedStyle(this.tank).top) + this.speed + px;
        } else {
          this.vector = rand(0, 4);
        }
        break;
      case 2:
        this.position = "left";
        this.turn();
        if (this.canMove("KeyA")) {
          this.tank.style.left =
            parseInt(getComputedStyle(this.tank).left) - this.speed + px;
        } else {
          this.vector = rand(0, 4);
        }
        break;
      case 3:
        this.position = "right";
        this.turn();
        if (this.canMove("KeyD")) {
          this.tank.style.left =
            parseInt(getComputedStyle(this.tank).left) + this.speed + px;
        } else {
          this.vector = rand(0, 4);
        }
        break;
    }
  };
  shot = () => {
    let f = false;
    if (this.bullet == null) {
      f = true;
    }
    if (f) {
      this.bullet = new Bullet(this);
      this.bullet.create();
      field.append(this.bullet.object);
      switch (this.position) {
        case "up":
          this.bulletinterval = setInterval(() => {
            this.bullet.object.style.top =
              parseInt(getComputedStyle(this.bullet.object).top) - 5 + "px";
            if (this.bullet.strike()) {
              this.deleteBullet();
              clearInterval(this.bulletinterval);
            }
          }, this.bullet.speed);
          break;

        case "down":
          this.bulletinterval = setInterval(() => {
            this.bullet.object.style.top =
              parseInt(getComputedStyle(this.bullet.object).top) + 5 + "px";
            if (this.bullet.strike()) {
              this.deleteBullet();
              clearInterval(this.bulletinterval);
            }
          }, this.bullet.speed);
          break;

        case "left":
          this.bulletinterval = setInterval(() => {
            this.bullet.object.style.left =
              parseInt(getComputedStyle(this.bullet.object).left) - 5 + "px";
            if (this.bullet.strike()) {
              this.deleteBullet();
              clearInterval(this.bulletinterval);
            }
          }, this.bullet.speed);
          break;
        case "right":
          this.bulletinterval = setInterval(() => {
            this.bullet.object.style.left =
              parseInt(getComputedStyle(this.bullet.object).left) + 5 + "px";
            if (this.bullet.strike()) {
              this.deleteBullet();
              clearInterval(this.bulletinterval);
            }
          }, this.bullet.speed);
          break;
      }
    }
  };
  deleteBullet = () => {
    this.bullet.delete();
    this.bullet = null;
    clearInterval(this.bulletinterval);
  };
}
class OrdinaryTank extends Enemy {
  constructor(x, y, index) {
    super(x, y, index);
    this.tank.classList.add("ordinaryTank");
    this.score = 100;
  }
}
class FastTank extends Enemy {
  constructor(x, y, index) {
    super(x, y, index);
    this.speed = 8;
    this.tank.classList.add("fastTank");
    this.score = 200;
  }
}
class RapidFireTank extends Enemy {
  constructor(x, y, index) {
    super(x, y, index);
    this.tank.classList.add("rapidFireTank");
    this.score = 300;
  }
}
class ArmoredTank extends Enemy {
  constructor(x, y, index) {
    super(x, y, index);
    this.hp = 3;
    this.tank.classList.add("armoredTank");
    this.score = 400;
  }
  destroy = (f = true) => {
    if (hp == 0) {
      this.life = false;
      this.AITurnOff();
      let blast = document.createElement("div");
      blast.classList.add("blast", "effect");
      let top = parseInt(getComputedStyle(this.tank).top);
      let left = parseInt(getComputedStyle(this.tank).left);
      blast.style.top = top + px;
      blast.style.left = top + px;
      this.life = false;
      totalScore += this.score;
      if (this.flashing) new Bonus().create();
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
        }, 450);
        setTimeout(() => {
          let score = document.createElement("span");
          score.classList.add("score");
          score.textContent = this.score;
          gameSpace.prepend(score);
          setTimeout(() => score.remove(), 1000);
        }, 500);
      }
      levelEnemies[this.index - 1] = null;
    } else if (hp > 0) hp--;
  };
}
