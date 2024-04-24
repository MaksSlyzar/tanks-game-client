import AssetsManager from "../../managers/AssetsManager";
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
        this.posX += (this.targetX - this.posX) * 0.2;
        this.posY += (this.targetY - this.posY) * 0.2;

        return true;
    }

    render() {
        const ctx = CanvasManager.context;
        const sprite = AssetsManager.sprites["projectile"];

        if (!sprite) return;

        const doPosition = GameObjectsManager.camera.doPosition(
            this.posX,
            this.posY,
            1,
            1
        );
        ctx.save();

        // ctx.fillStyle = "red";
        ctx.translate(doPosition.x, doPosition.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite.image, -2, -4, 20, 6);
        // ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
        return true;
    }
}
