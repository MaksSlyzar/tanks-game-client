import CanvasManager from "../../managers/CanvasManager";
import { GameObject } from "../../modules/GameObject";
import { EngineerTankBody, HeavyTankBody } from "./Tanks/TankBody";

interface PlayerNetworkData {
    targetX: number;
    targetY: number;
}

export class Player {
    id: number;
    tank: EngineerTankBody | HeavyTankBody;
    username: string;

    targetX: number;
    targetY: number;

    constructor() {}

    network(data: PlayerNetworkData): void {}
}
