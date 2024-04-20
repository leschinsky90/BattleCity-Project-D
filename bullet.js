class Bullet {
  constructor(tank) {
    this.object = document.createElement("div");
    this.tank = tank;
    if (this.tank.tank.classList.contains("player")) this.type = "player";
    if (this.tank.tank.classList.contains("enemy")) this.type = "enemy";
    if (this.type == "player") {
      if (this.tank.level < 1) this.speed = 45;
      else this.speed = 25;
    }
    if (this.type == "enemy") {
      if (this.tank.tank.classList.contains("rapidFireTank")) this.speed = 45;
      else this.speed = 25;
    }
  }
  create = () => {
    this.object.classList.add("bullet");
    this.object.style.left =
      parseInt(getComputedStyle(this.tank.tank).left) +
      parseInt(getComputedStyle(this.tank.tank).width) / 2 -
      2 +
      px;
    this.object.style.top =
      parseInt(getComputedStyle(this.tank.tank).top) +
      parseInt(getComputedStyle(this.tank.tank).height) / 2 -
      2 +
      px;
  };
  delete = () => {
    let blast = document.createElement("div");
    blast.classList.add("blast", "effect");
    blast.style.top = parseInt(getComputedStyle(this.object).top) - 16 + px;
    blast.style.left = parseInt(getComputedStyle(this.object).left) - 16 + px;
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
    }, 250);
    setTimeout(() => {
      this.object.remove();
    }, 50);
  };
  strike = () => {
    let strike = false;
    if (
      parseInt(getComputedStyle(this.object).top) < 0 ||
      parseInt(getComputedStyle(this.object).left) < 0 ||
      parseInt(getComputedStyle(this.object).right) < 0 ||
      parseInt(getComputedStyle(this.object).bottom) < 0
    )
      strike = true;

    let walls = [];
    for (const obj of obstaclesLocation) {
      if (obj.classList.contains("wall")) walls.push(obj);
    }
    for (let el of walls) {
      if (insideRect(this.object, el)) {
        strike = true;
        if (
          el.classList.contains("brick") ||
          (playerlvl == 3 && el.classList.contains("concrete"))
        ) {
          el.classList.remove("obstacle");
          el.classList.remove("wall");
          el.classList.remove("brick");
          el.classList.remove("concrete");
          el.classList.add("air");
        }
      }
    }

    let tanks = [];
    for (const tank of levelEnemies) if (tank != null) tanks.push(tank);
    tanks.push(playerTank);
    for (let tank of tanks) {
      if (insideRect(this.object, tank.tank) && tank.tank != this.tank.tank) {
        strike = true;
        this.tankIsEnemy(tank);
      }
    }
    let bullets = [];
    for (const tank of tanks) {
      if (tank.bullet != undefined) bullets.push(tank.bullet);
      if (tank.bullets != undefined)
        for (const bullet of tank.bullets) bullets.push(bullet);
    }
    for (let el of bullets) {
      if (insideRect(this.object, el.object) && el.object != this.object) {
        el.tank.deleteBullet();
        strike = true;
      }
    }
    if (insideRect(this.object, headquaters.head)) {
      if (headquaters.state) {
        headquaters.destroy();
      }
      strike = true;
    }
    return strike;
  };
  tankIsEnemy = (tank) => {
    if (this.type == "player") {
      if (tank.tank.classList.contains("enemy")) {
        tank.destroy();
      }
    }
    if (this.type == "enemy") {
      if (tank.tank.classList.contains("player")) {
        tank.destroy();
      }
    }
  };
}
