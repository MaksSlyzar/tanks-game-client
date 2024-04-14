import CanvasManager from "../../managers/CanvasManager";
import GameObjectsManager from "../../managers/GameObjectsManager";
import { GameObject } from "../../modules/GameObject";
import { quadColliderMesh, satCollide, updateShape } from "../../modules/SAT";

class Enemie extends GameObject {
    movement: boolean;
    width: number;
    height: number;
    collidingObject: boolean;
    fillColor: string;

    constructor () {
        super();
        this.posY = 700;
        this.posX = 700;
        this.movement = true;
        this.collidingObject = true;
        this.width = 20;
        this.height = 20;
        this.fillColor = "red";
        this.shape = quadColliderMesh(this.width, this.height);
    }

    setY (y: number) {
        this.posY = y;
    }

    update(): boolean {
        // this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);

        // for (let go of GameObjectsManager.gameObjects) {
        //     if (go.collidingObject == true && go.tag == "bullet") {
        //         let collide = satCollide(this.activeShape, go.activeShape);
        //         if (collide) {
        //             this.fillColor = "yellow"
        //             console.log("YE")
        //             setTimeout(() => {this.fillColor = "red"}, 500)
        //             break;
        //         }
        //     }
        // }
        // if (this.movement)
        //     this.posX += 7;
        // else 
        //     this.posX -= 7;

        // if (this.posX > 2000) {
        //     this.movement = false;
        // }
        // if (this.posX < 100) {
        //     this.movement = true;
        // }
        return true;
    }

    render(): boolean {
        const ctx = CanvasManager.context;
        ctx.fillStyle = this.fillColor;

        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);

        ctx.fillRect(doPosition.x, doPosition.y, this.width, this.height);

        return true;
    }
}

export default Enemie;