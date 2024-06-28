import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";
import { quadColliderMesh, satCollide, updateShape } from "../../modules/SAT";

class Enemie extends GameObject {
    movement: boolean;
    width: number;
    height: number;
    targetX: number;
    targetY: number;
    collidingObject: boolean;
    fillColor: string;
    targetHp: number = 0;

    constructor() {
        super();
        this.posY = 700;
        this.posX = 700;
        this.targetX = 0;
        this.targetY = 0;
        this.movement = true;
        this.collidingObject = true;
        this.width = 30;
        this.height = 30;
        this.fillColor = "red";
        this.shape = quadColliderMesh(this.width, this.height);
    }

    setY(y: number) {
        this.posY = y;
    }

    update(): boolean {
        this.hp += (this.targetHp - this.hp) * 0.3;

        this.posX += (this.targetX - this.posX) * 0.2;
        this.posY += (this.targetY - this.posY) * 0.2;

        return true;
    }

    render(): boolean {
        const ctx = CanvasManager.context;
        ctx.fillStyle = this.fillColor;

        const doPosition = GameObjectsManager.camera.doPosition(
            this.posX,
            this.posY,
            1,
            1
        );

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(
            doPosition.x + this.width / 2,
            doPosition.y + this.height / 2
        );

        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.rotate(-this.rotation);

        ctx.translate(this.width / 2, this.height / 2);

        ctx.restore();

        ctx.save();
        ctx.translate(
            doPosition.x + this.width / 2,
            doPosition.y + this.height / 2
        );

        this.renderHPBar();

        ctx.restore();

        return true;
    }
}

export default Enemie;
