import AssetsManager from "../../../managers/AssetsManager";
import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import { GameObject } from "../../../modules/GameObject";
import { HeavyTankBodyNetwork } from "./TankBodyNetwork";

export class HeavyWeaponNetwork extends GameObject {
    tankBody: HeavyTankBodyNetwork;
    rotation: number;
    dx: number;
    dy: number;

    constructor (tankBody: HeavyTankBodyNetwork) {
        super();
        this.rotation = 0.09;
        this.tankBody = tankBody;
    }

    render(): boolean {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["tank-weapon"];

        if (sprite == null)
            return false;
        
        const tankPosX = this.tankBody.posX;
        const tankPosY = this.tankBody.posY;

        ctx.save();

        ctx.fillStyle = "green";
        // ctx.translate((this.posX + 45), (this.posY + 20))
        
        const doPosition = GameObjectsManager.camera.doPosition(tankPosX + this.tankBody.width/2, tankPosY + this.tankBody.height/2, 1, 1);

        ctx.translate(doPosition.x, doPosition.y);

        // ctx.translate(tankPosX + 5, tankPosX + 45)
        ctx.rotate(this.rotation + this.tankBody.rotation);
        
        //90 / 2 * (-1), 40 / 2 * (-1), 90, 40
        // ctx.fillRect(90 / 2 * (-1) + 40, 40 / 2 * (-1) + 15, 90, 10);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1000, 0);
        ctx.lineWidth = 0.4;
        ctx.strokeStyle = "red";
        ctx.stroke();
        
        ctx.drawImage(sprite.image, this.tankBody.width / 2 * (-1) + this.tankBody.width / 2 - 20, this.tankBody.height / 2 * (-1) + this.tankBody.height / 2 - 25);
        
        ctx.restore();


        return true;
    }

    update(): boolean {
        return true;
    }
}
