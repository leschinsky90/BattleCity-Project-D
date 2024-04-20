let body = document.querySelector("body");
var gameSpace = document.querySelector("#gameSpace");
var field = document.querySelector("#field");
let fieldWidth = parseInt(getComputedStyle(field).width);
let fieldHeight = parseInt(getComputedStyle(field).height);
var infoPanel = document.querySelector("#infoPanel");
let enemiesCount = document.querySelector("#enemiesCount");
let lifesCount = document.querySelector("#lifesCount");
let stageNumber = document.querySelector("#stageNumber");
let bonus = null;
class Obstacle {
  constructor() {
    this.object;
  }
  create = (container = field) => {
    this.object.classList.add("obstacle");
    container.append(this.object);
  };
}
class Wall extends Obstacle {
  constructor() {
    super();
  }
  create = (container = field) => {
    this.object.classList.add("obstacle");
    this.object.classList.add("wall");
    container.append(this.object);
  };
  destroy = () => {
    this.object.remove();
  };
}
class Water extends Obstacle {
  constructor() {
    super();
    this.object = document.createElement("div");
  }
  create = (container = field) => {
    this.object.classList.add("obstacle");
    this.object.classList.add("water");
    this.object.style.backgroundImage = `url(sprites/Objects/water1.png)`;
    let animationNumber = 2;
    setInterval(() => {
      this.object.style.backgroundImage = `url(sprites/Objects/water${animationNumber}.png)`;
      if (animationNumber < 2) animationNumber++;
      else animationNumber = 1;
    }, 500);
    container.append(this.object);
  };
}
class Brick extends Wall {
  constructor() {
    super();
    this.object = document.createElement("div");
    this.object.classList.add("brick");
  }
}
class Concrete extends Wall {
  constructor() {
    super();
    this.object = document.createElement("div");
    this.object.classList.add("concrete");
  }
}
/* class Ice {
  constructor() {
    this.object = document.createElement("div");
    this.object.classList.add("ice");
  }
  create = (container = field) => {
    container.append(this.object);
  };
} */
class Bush {
  constructor() {
    this.object = document.createElement("div");
    this.object.classList.add("bush");
  }
  create = (container = field) => {
    container.append(this.object);
  };
}

class Bonus {
  constructor() {
    this.object = document.createElement("div");
    this.object.classList.add("bonus");
    bonus = this;
    const bonusValues = [
      "clock",
      "clock",
      "clock",
      "grenade",
      "grenade",
      "grenade",
      "gun",
      "shield",
      "shield",
      "shovel",
      "shovel",
      "star",
      "star",
      "tank",
      "tank",
    ];
    this.type = bonusValues[rand(0, bonusValues.length)];
    this.object.style.backgroundImage = `url(sprites/bonuses/${this.type}.png)`;
    this.object.style.top =
      rand(5, parseInt(getComputedStyle(field).height) - 21) + px;
    this.object.style.left =
      rand(5, parseInt(getComputedStyle(field).width) - 21) + px;
  }
  create = (container = field) => {
    container.append(this.object);
    console.log(this);
  };
}
class Headquarters {
  constructor() {
    this.object = document.createElement("div");
    this.object.classList.add("headquatersContainer");
    this.head = document.createElement("div");
    this.head.classList.add("headquaters");
    this.state = true;
    this.object.style.left =
      parseInt(getComputedStyle(field).width) / 2 - 32 + "px";
    this.fillContainer();
    field.append(this.object);
  }
  destroy = () => {
    let blast = document.createElement("div");
    blast.classList.add("blast", "effect");
    blast.style.width = "64px";
    blast.style.height = "64px";
    blast.style.backgroundSize = "64px";
    this.object.append(blast);
    setTimeout(() => {
      blast.style.backgroundImage = `url(sprites/effects/bigblast2.png)`;
    }, 25);
    setTimeout(() => {
      blast.style.backgroundImage = `url(sprites/effects/bigblast1.png)`;
    }, 100);
    setTimeout(() => {
      blast.remove();
      blast.style.width = "32px";
      blast.style.height = "32px";
      blast.style.backgroundSize = "32px";
      blast.style.backgroundImage = `url(sprites/effects/blast3.png)`;
      this.head.append(blast);
    }, 175);
    setTimeout(() => {
      blast.style.backgroundImage = `url(sprites/effects/blast2.png)`;
    }, 250);
    setTimeout(() => {
      blast.remove();
    }, 300);
    this.head.style.backgroundImage =
      "url(sprites/objects/headquaters/destroyed.png)";
    this.state = false;
    setTimeout(gameOver, 1500);
  };
  fillContainer = () => {
    this.object.textContent = "";
    for (let i = 0; i < 4; i++) new Brick().create(this.object);
    for (let i = 0; i < 2; i++) {
      new Brick().create(this.object);
      for (let j = 0; j < 2; j++) {
        let air = document.createElement("div");
        air.classList.add("air");
        this.object.append(air);
      }
      new Brick().create(this.object);
    }
    this.object.append(this.head);
  };
  reinforceHead = () => {
    this.object.textContent = "";
    for (let i = 0; i < 4; i++) new Concrete().create(this.object);
    for (let i = 0; i < 2; i++) {
      new Concrete().create(this.object);
      for (let j = 0; j < 2; j++) {
        let air = document.createElement("div");
        air.classList.add("air");
        this.object.append(air);
      }
      new Concrete().create(this.object);
    }
    this.object.append(this.head);
  };
}
