import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import { GameObject } from "../../../modules/GameObject";
import { quadColliderMesh, satCollide, updateShape } from "../../../modules/SAT";

class Bullet extends GameObject {
    rotation: number;
    speed: number;
    tag: string;

    constructor () {
        super();
        this.tag = "bullet";

        this.speed = 10;
        this.collidingObject = true;
        this.shape = quadColliderMesh(4, 4);
    }

    update () {
        this.posX += Math.cos(this.rotation) * this.speed;
        this.posY += Math.sin(this.rotation) * this.speed;
    
        this.activeShape = updateShape(this.posX, this.posY, this.rotation, this.shape);

        // for (let go of GameObjectsManager.gameObjects) {
        //     if (go.collidingObject == true) {
        //         let collide = satCollide(this.activeShape, go.activeShape);
        //         if (collide) {
        //             go.posX = -1;
        //             go.posY = -1;
        //             break;
        //         }
        //     }
        // }

        return true;
    }

    render () {
        const ctx = CanvasManager.context;

        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);
        ctx.save();
        
        ctx.fillStyle = "red";
        ctx.translate(doPosition.x, doPosition.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-2, -2, 4, 4);
        
        ctx.restore();
        return true;
    }
}

export default Bullet;