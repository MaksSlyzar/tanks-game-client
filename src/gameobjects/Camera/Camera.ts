import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";
class Camera extends GameObject {
    posX: number = -500;
    posY: number = -500;
    speed: number = 10;
    defaultSize: number = 1;
    gameObject: GameObject;
    constructor(gameObject: GameObject) {
        super();
        this.gameObject = gameObject;
    }
    doPosition(x: number, y: number, width: number, height: number) {
        return {
            x: x - this.posX,
            y: y - this.posY,
            width: width / this.defaultSize,
            height: height / this.defaultSize,
        };
    }
    update() {
        this.posX +=
            (this.gameObject.posX -
                CanvasManager.canvas.width / 2 -
                16 -
                this.posX) *
            0.9;
        this.posY +=
            (this.gameObject.posY -
                CanvasManager.canvas.height / 2 -
                16 -
                this.posY) *
            0.9;
        return true;
    }
}
export default Camera;
