import AssetsManager from "../../managers/AssetsManager";
import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";


import SAT from "sat";
import { Player } from "../Player/Player";
import { quadColliderMesh, updateShape } from "../../modules/SAT";

class Box extends GameObject {
    constructor () {
        super();
        this.shape = quadColliderMesh(50, 50);
        this.collidingObject = true;
    }

    update () {
        const Player = GameObjectsManager.gameObjects[0] as Player;
        const tankBody = Player.tank;
        this.activeShape = updateShape(this.posX + 25, this.posY + 25, this.rotation, this.shape);
        return true;
    }

    render(): boolean {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["box"];
        if (sprite == null)
            return false;

        ctx.save();
        
        
        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);
        ctx.translate(doPosition.x + 25, doPosition.y + 25);
        ctx.translate(- 25, -25);
        ctx.drawImage(sprite.image, 0, 0);
        ctx.restore();

        

        // this.drawShapes(GameObjectsManager.camera.posX, GameObjectsManager.camera.posY);
        return true;
    }
}

export default Box;