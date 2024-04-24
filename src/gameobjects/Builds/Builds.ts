import AssetsManager from "../../managers/AssetsManager";
import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";

export class Build extends GameObject {
    hp: number;
    maxHp: number;

    renderHPBar() {
        const ctx = CanvasManager.context;

        const width = 100;
        const height = 10;

        ctx.fillStyle = "black";

        ctx.strokeStyle = "white";
        ctx.rect(0, -30, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, -30, (this.hp / this.maxHp) * 100, height);

        ctx.stroke();
    }

    constructor() {
        super();
    }
}

export class BaseBuild extends Build {
    constructor() {
        super();
        this.maxHp = 1;
        this.hp = 1;
    }

    render() {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["base-build"];

        if (sprite == null) return false;

        ctx.save();
        const doPosition = GameObjectsManager.camera.doPosition(
            this.posX,
            this.posY,
            1,
            1
        );

        ctx.translate(doPosition.x, doPosition.y);
        ctx.drawImage(sprite.image, 0, 0);

        this.renderHPBar();
        ctx.restore();
        return false;
    }

    update(): boolean {
        return false;
    }
}
