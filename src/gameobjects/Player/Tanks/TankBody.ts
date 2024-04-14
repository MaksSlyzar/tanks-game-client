import CanvasManager from "../../../managers/CanvasManager";
import { GameObject } from "../../../modules/GameObject";
import { HeavyWeapon } from "./Weapons";
import AssetsManager from "../../../managers/AssetsManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import SAT from "sat";
import { Vector2d, quadColliderMesh, satCollide, updateShape } from "../../../modules/SAT";
import SIOManager from "../../../managers/SIOManager";
import { Player } from "../Player";
// export class TankBody extends GameObject {
//     weapon: Weapon;

//     constructor () {
//         super();
//         this.weapon = new Weapon();
//     }

//     update () {
//         return true;
//     }

//     render() {
//         return true;
//     }
// }

interface SendSyncData {
    // tankBody: {
    //     posX: number,
    //     posY: number,
    //     rotation: number,
    // }
    rotate: "LEFT"|"RIGHT"|"NONE",
    movement: "UP"|"DOWN"|"NONE",
    weapon: {
        dx: number,
        dy: number
    }
};

export class HeavyTankBody extends GameObject {
    weapon: HeavyWeapon;

    posX: number;
    posY: number;
    rotation: number;
    rotationSpeed: number;
    maxSpeed: number;
    minSpeed: number;
    speed: number;
    engine: "UP"|"DOWN"|"OFF";
    width: number = 116;
    height: number = 75;
    pushSpeed: number = 0.02;
    standartPushSpeed: number = 10;
    targetX: number = 0;
    targetY: number = 0;
    player: Player;

    constructor (playerGameObject: Player) {
        super();
        this.player = playerGameObject;
        this.speed = 0;
        this.maxSpeed = 4;
        this.rotationSpeed = 0.02;
        this.posX = 1110;
        this.posY = 1000;
        this.rotation = 0.03;
        this.minSpeed = -1;
        this.engine = "OFF";
        this.weapon = new HeavyWeapon(this);
        this.activeShape = [];
        this.shape = quadColliderMesh(this.width, this.height);
    }

    update () {
        if (GameObjectsManager.deltaTime > 1)
            return;
        this.pushSpeed = this.standartPushSpeed * GameObjectsManager.deltaTime;

        // if (GameObjectsManager.deltaTime > 1) 
        //     console.log(GameObjectsManager.deltaTime)
        const tempPosX = this.posX;
        const tempPosY = this.posY;
        const tempRotation = this.rotation;


        const sendData: SendSyncData = {
            // tankBody: {
            //     posX: this.posX,
            //     posY: this.posY,
            //     rotation: this.rotation
            // }
            rotate: "NONE",
            movement: "NONE",
            weapon: this.weapon.networkSend()
        };

        // console.log(sendData)

        if (CanvasManager.keyDown("a")) {
            sendData.rotate = "LEFT";
        }

        if (CanvasManager.keyDown("d")) {
            sendData.rotate = "RIGHT";
        }

        if (CanvasManager.keyDown("w")) {
            sendData.movement = "UP";
        }

        if (CanvasManager.keyDown("s")) {
            sendData.movement = "DOWN";
        }

        // console.log(sendData)
        SIOManager.socket.emit("sendMoveData", sendData);

        this.posX += (this.targetX - this.posX) * 0.10;
        this.posY += (this.targetY - this.posY) * 0.10;
        let rotationCollision = false;

        // this.posX += Math.cos(this.rotation) * this.speed;
        // this.posY += Math.sin(this.rotation) * this.speed;

        // this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);
        
        // for (let go of GameObjectsManager.gameObjects) {
        //     if (go.collidingObject == true) {
        //         // console.log(this.activeShape, go.activeShape)
        //         let collide = satCollide(this.activeShape, go.activeShape);
        //         if (collide) {
        //             this.posX = tempPosX;
        //             this.posY = tempPosY;
        //             this.speed = 0;
        //             break;
        //         }
        //     }
        // }

        // this.engine = "OFF";
        // if (CanvasManager.keyDown("w")) {
        //     if (this.maxSpeed > this.speed) {
        //         this.speed += this.pushSpeed;
        //         this.engine = "UP";
        //     }

        //     if (CanvasManager.keyDown("a")) {
        //         this.rotation -= this.rotationSpeed;
        //     }
        //     if (CanvasManager.keyDown("d")) {
        //         this.rotation += this.rotationSpeed;
        //     }
        // }

        // else if (CanvasManager.keyDown("s")) {
        //     if (this.minSpeed < this.speed) {
        //         this.speed -= this.pushSpeed;
        //         this.engine = "DOWN";
        //     }

        //     if (CanvasManager.keyDown("a")) {
        //         this.rotation += this.rotationSpeed;
        //     }
        //     if (CanvasManager.keyDown("d")) {
        //         this.rotation -= this.rotationSpeed;
        //     }
        // } else {
        //     if (CanvasManager.keyDown("a")) {
        //         this.rotation -= this.rotationSpeed;
        //     }
        //     if (CanvasManager.keyDown("d")) {
        //         this.rotation += this.rotationSpeed;
        //     }
        // }

        // if (CanvasManager.keyDown("p")) {
        //     this.posX = 0;
        //     this.posY = 0;
        // }

        // this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);

        // for (let go of GameObjectsManager.gameObjects) {
        //     if (go.collidingObject == true) {
        //         let collide = satCollide(this.activeShape, go.activeShape);
        //         if (collide) {
        //             this.rotation = tempRotation;
        //             break;
        //         }
        //     }
        // }

        // if (this.engine == "OFF") {
        //     if (this.speed > 0) {
        //         this.speed -= this.pushSpeed;
        //     } else if (this.speed < 0) {
        //         this.speed += this.pushSpeed;
        //     }
        // }

        this.weapon.update();
        
        return true;
    }

    network(data: any): void {
       
    }

    render() {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["tank-body"];

        if (sprite == null)
            return false;

        ctx.fillStyle = "black";
        ctx.save();
        ctx.fillStyle = "white";
        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);
        ctx.translate(doPosition.x + this.width / 2, doPosition.y + this.height / 2);

        ctx.font = "15px Consolas";
        ctx.strokeStyle = "white";
        ctx.strokeText(this.player.username, -50, -80);
        
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(sprite.image, 0, 0, this.width, this.height);
        
        ctx.rotate(-this.rotation);
        

        ctx.restore();
        
        this.weapon.render();

        return true;
    }
}

export class EngineerTankBody extends GameObject {
    engine: "UP"|"DOWN"|"OFF";
    rotation: number;
    rotationSpeed: number;
    maxSpeed: number;
    minSpeed: number;
    speed: number;

    constructor () {
        super();
        this.width = 115;
        this.speed = 0;
        this.maxSpeed = 4;
        this.rotationSpeed = 0.02;
        this.posX = 1110;
        this.posY = 1000;
        this.rotation = 0.03;
        this.minSpeed = -4;
        this.engine = "OFF";
        this.activeShape = [];
        this.shape = quadColliderMesh(this.width, this.height);
        this.height = 67;
    }

    render(): boolean {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["engineer"];

        if (sprite == null)
            return false;

        ctx.fillStyle = "black";
        ctx.save();

        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);
        ctx.translate(doPosition.x + this.width / 2, doPosition.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(sprite.image, 0, 0, this.width, this.height);
        ctx.restore();

        return true;
    }

    update(): boolean {
        const tempPosX = this.posX;
        const tempPosY = this.posY;
        const tempRotation = this.rotation;
        let rotationCollision = false;

        this.posX += Math.cos(this.rotation) * this.speed;
        this.posY += Math.sin(this.rotation) * this.speed;

        this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);
        
        this.rotationSpeed = this.speed * 0.005;
        
        for (let go of GameObjectsManager.gameObjects) {
            if (go.collidingObject == true) {
                let collide = satCollide(this.activeShape, go.activeShape);
                if (collide) {
                    this.posX = tempPosX;
                    this.posY = tempPosY;
                    this.speed = 0;
                    break;
                }
            }
        }

        this.engine = "OFF";
        if (CanvasManager.keyDown("w")) {
            if (this.maxSpeed > this.speed) {
                this.speed += 0.02;
                this.engine = "UP";
            }

            if (CanvasManager.keyDown("a")) {
                this.rotation -= this.rotationSpeed;
            }
            if (CanvasManager.keyDown("d")) {
                this.rotation += this.rotationSpeed;
            }
        }

        else if (CanvasManager.keyDown("s")) {
            if (this.minSpeed < this.speed) {
                this.speed -= 0.02;
                this.engine = "DOWN";
            }

            if (CanvasManager.keyDown("a")) {
                this.rotation += this.rotationSpeed;
            }
            if (CanvasManager.keyDown("d")) {
                this.rotation -= this.rotationSpeed;
            }
        } else {
            if (CanvasManager.keyDown("a")) {
                this.rotation -= this.rotationSpeed;
            }
            if (CanvasManager.keyDown("d")) {
                this.rotation += this.rotationSpeed;
            }
        }

        this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);

        for (let go of GameObjectsManager.gameObjects) {
            if (go.collidingObject == true) {
                let collide = satCollide(this.activeShape, go.activeShape);
                if (collide) {
                    this.rotation = tempRotation;
                    break;
                }
            }
        }

        if (this.engine == "OFF") {
            if (this.speed > 0) {
                this.speed -= 0.02;
            } else if (this.speed < 0) {
                this.speed += 0.02;
            }
        }

        return true;
    }
}