function insideRect(el1, el2) {
  let rect1 = el1.getBoundingClientRect();
  let rect2 = el2.getBoundingClientRect();
  for (let it in rect1) {
    rect1[it] = Math.floor(rect1[it]);
  }
  for (let it in rect2) {
    rect2[it] = Math.floor(rect2[it]);
  }
  return (
    (((rect1.top >= rect2.bottom && rect1.top <= rect2.top) ||
      (rect1.bottom <= rect2.bottom && rect1.bottom >= rect2.top)) &&
      ((rect1.left >= rect2.left && rect1.left < rect2.right) ||
        (rect1.right > rect2.left && rect1.right <= rect2.right))) ||
    (((rect1.left >= rect2.right && rect1.left <= rect2.left) ||
      (rect1.right <= rect2.right && rect1.right >= rect2.left)) &&
      ((rect1.top >= rect2.top && rect1.top < rect2.bottom) ||
        (rect1.bottom > rect2.top && rect1.bottom <= rect2.bottom)))
  );
}
function touchRect(el1, el2, code) {
  let rect1 = el1.getBoundingClientRect();
  let rect2 = el2.getBoundingClientRect();
  for (let it in rect1) {
    rect1[it] = Math.floor(rect1[it]);
  }
  for (let it in rect2) {
    rect2[it] = Math.floor(rect2[it]);
  }

  switch (code) {
    case "KeyW":
      return (
        rect1.top == rect2.bottom &&
        ((rect1.left >= rect2.left && rect1.left < rect2.right) ||
          (rect1.right > rect2.left && rect1.right <= rect2.right))
      );
      break;
    case "KeyS":
      return (
        rect1.bottom == rect2.top &&
        ((rect1.left >= rect2.left && rect1.left < rect2.right) ||
          (rect1.right > rect2.left && rect1.right <= rect2.right))
      );
      break;
    case "KeyA":
      return (
        rect1.left == rect2.right &&
        ((rect1.top >= rect2.top && rect1.top < rect2.bottom) ||
          (rect1.bottom > rect2.top + 1 && rect1.bottom <= rect2.bottom))
      );
      break;
    case "KeyD":
      return (
        rect1.right == rect2.left &&
        ((rect1.top >= rect2.top && rect1.top < rect2.bottom) ||
          (rect1.bottom > rect2.top + 1 && rect1.bottom <= rect2.bottom))
      );
      break;
  }
}
class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.position;
    this.speed = 4;
    this.tank = document.createElement("div");
    this.tank.classList.add("tank");
    this.tank.style.left = x + px;
    this.tank.style.top = y + px;
    this.life = true;
  }
  AITurnOn = () => {};
  AITurnOff = () => {};
  reborn = () => {};
  create = () => {
    let emergence = document.createElement("div");
    emergence.classList.add("emergence", "effect");
    emergence.style.top = this.y + px;
    emergence.style.left = this.x + px;
    field.append(emergence);
    let n = 1;
    let interval = setInterval(() => {
      emergence.style.backgroundImage = `url(sprites/effects/emergence${n}.png)`;
      n++;
      if (n == 4) {
        clearInterval(interval);
      }
    }, 500);
    setTimeout(() => {
      emergence.remove();
      field.append(this.tank);
      this.AITurnOn();
    }, 3000);
  };
  canMove = (code) => {
    let move = true;
    if (
      (getComputedStyle(this.tank).top == "0px" && code == "KeyW") ||
      (getComputedStyle(this.tank).bottom == "0px" && code == "KeyS") ||
      (getComputedStyle(this.tank).left == "0px" && code == "KeyA") ||
      (getComputedStyle(this.tank).right == "0px" && code == "KeyD")
    )
      move = false;

    /* */
    let arr = [];
    let obst = document.querySelectorAll(".obstacle");
    for (const el of obst) arr.push(el);
    let tanks = document.querySelectorAll(".tank");
    for (const el of tanks) arr.push(el);
    let em = document.querySelectorAll(".emergence");
    for (const el of em) arr.push(el);
    for (const el of arr) {
      if (touchRect(this.tank, el, code)) {
        move = false;
      }
    }
    let ice = document.querySelectorAll(".ice");
    for (let el of ice) {
      let onIce = false;
      if (insideRect(this.tank, el)) {
        this.speed *= 2;
        onIce = true;
      } else if (onIce) {
        this.speed /= 2;
        onIce = false;
      }
    }
    if (touchRect(this.tank, headquaters.head, code)) {
      move = false;
    }
    return move;
  };
  deleteBullet = () => {};
}
