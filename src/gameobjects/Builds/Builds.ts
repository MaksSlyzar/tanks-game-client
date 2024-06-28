import AssetsManager from "../../managers/AssetsManager";
import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import SIOManager from "../../managers/SIOManager";
import { GameObject } from "../../modules/GameObject";
import { quadColliderMesh, satCollide, updateShape } from "../../modules/SAT";
export class Build extends GameObject {
    hp: number;
    maxHp: number;
    constructor() {
        super();
    }
}
export class BaseBuild extends Build {
    constructor() {
        super();
        this.maxHp = 1;
        this.hp = 1;
        this.rotation = 0;
        this.width = 400;
        this.height = 200;
        this.shape = quadColliderMesh(this.width, this.height);
    }
    renderHPBar() {
        if (this.maxHp == 0) return;
        const ctx = CanvasManager.context;
        this.activeShape = updateShape(
            this.posX + this.width / 2,
            this.posY + this.height / 2,
            this.rotation,
            this.shape
        );
        const width = 350;
        const height = 12;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        let centerX = -width / 2;
        ctx.lineWidth = 2;
        ctx.rect(centerX, -120, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(centerX, -120, (this.hp / this.maxHp) * width, height);
        const text = `${Math.round(this.hp)}/${this.maxHp}`;
        let textWidth = ctx.measureText(text).width;
        centerX = (textWidth / 2 + centerX / 2) / 2;
        ctx.fillStyle = "white";
        ctx.font = "12pt Consolas";
        ctx.fillText(text, centerX, -109);
        ctx.stroke();
    }

    render() {
        const ctx = CanvasManager.context;
        const sprite = AssetsManager.sprites["base-build"];
        const spriteInside = AssetsManager.sprites["base-build-inside"];
        if (sprite == null) return false;
        if (spriteInside == null) return false;
        const tank = GameObjectsManager.gameObjects.tankBodies.find(
            (tank) => tank.isOwn
        );
        const isCollide = satCollide(this.activeShape, tank.activeShape);
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
        if (isCollide) ctx.drawImage(spriteInside.image, 0, 0);
        else ctx.drawImage(sprite.image, 0, 0);
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
        return false;
    }
    update(): boolean {
        return false;
    }
    inTank() {
        return false;
    }
}
export class GoldBuild extends Build {
    constructor() {
        super();
        this.rotation = 0;
        this.width = 24;
        this.height = 24;
    }
    render() {
        const ctx = CanvasManager.context;
        const sprite = AssetsManager.sprites["gold"];
        if (sprite == null) return false;
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
        ctx.drawImage(sprite.image, 0, 0);
        ctx.rotate(-this.rotation);
        ctx.translate(this.width / 2, this.height / 2);
        ctx.restore();
        ctx.save();
        ctx.translate(
            doPosition.x + this.width / 2,
            doPosition.y + this.height / 2
        );
        ctx.restore();
        return false;
    }
    update(): boolean {
        return false;
    }
}
