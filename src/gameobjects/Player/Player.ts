import CanvasManager from "../../managers/CanvasManager";
import { GameObject } from "../../modules/GameObject";
import { EngineerTankBody, HeavyTankBody } from "./Tanks/TankBody";

interface PlayerNetworkData {
  targetX: number;
  targetY: number;
}

export class Player extends GameObject {
  id: number;
  tank: EngineerTankBody | HeavyTankBody;

  targetX: number;
  targetY: number;

  constructor() {
    super();

    this.posX = 100;
    this.posY = 300;
  }

  update() {
    if (this.tank)
      this.tank.update();
    return true;
  }

  render() {
    const ctx = CanvasManager.context;

    // ctx.font = "18px Arial";

    // ctx.fillText("Player", this.posX, this.posY - 90)

    // ctx.fillRect(this.posX, this.posY)

    this.tank.render();

    return true;
  }

  network(data: PlayerNetworkData): void {}
}
