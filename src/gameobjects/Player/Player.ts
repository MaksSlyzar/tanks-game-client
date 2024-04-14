import CanvasManager from "../../managers/CanvasManager";
import { GameObject } from "../../modules/GameObject";
import { EngineerTankBody, HeavyTankBody } from "./Tanks/TankBody";
import { HeavyTankBodyNetwork } from "./Tanks/TankBodyNetwork";

interface PlayerNetworkData {
  targetX: number;
  targetY: number;
}

export class Player {
  id: number;
  tank: EngineerTankBody | HeavyTankBody | HeavyTankBodyNetwork;
  username: string;

  targetX: number;
  targetY: number;

  constructor() {
  }

  network(data: PlayerNetworkData): void {}
}
