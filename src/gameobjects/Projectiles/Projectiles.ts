import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";

export class Projectile extends GameObject {
    targetX: number;
    targetY: number;

    constructor() {
        super();

        console.log("Projectile");
    }

    update() {
        this.posX += (this.targetX - this.posX) * 0.1;
        this.posY += (this.targetY - this.posY) * 0.1;

        return true;
    }

    render() {
        const ctx = CanvasManager.context;

        const doPosition = GameObjectsManager.camera.doPosition(
            this.posX,
            this.posY,
            1,
            1
        );
        ctx.save();

        ctx.fillStyle = "red";
        ctx.translate(doPosition.x, doPosition.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
        return true;
    }
}
