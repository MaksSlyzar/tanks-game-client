import AssetsManager from "../../../managers/AssetsManager";
import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import { GameObject } from "../../../modules/GameObject";
import Bullet from "./Bullet";
import { HeavyTankBody } from "./TankBody";

export class Weapon extends GameObject {
    
}

export class HeavyWeapon extends GameObject {
    tankBody: HeavyTankBody;
    rotation: number;

    constructor (tankBody: HeavyTankBody) {
        super();
        this.rotation = 0.01;
        this.tankBody = tankBody;

        CanvasManager.events.setOnKeyUp((code) => this.shoot(code));
        CanvasManager.events.setLeftOnClick(event => this.shoot(32));
    }

    render(): boolean {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["tank-weapon"];

        if (sprite == null)
            return false;
        
        const tankPosX = this.tankBody.posX;
        const tankPosY = this.tankBody.posY;

        ctx.save();

        ctx.fillStyle = "green";
        // ctx.translate((this.posX + 45), (this.posY + 20))
        
        const doPosition = GameObjectsManager.camera.doPosition(tankPosX + this.tankBody.width/2, tankPosY + this.tankBody.height/2, 1, 1);

        ctx.translate(doPosition.x, doPosition.y);

        // ctx.translate(tankPosX + 5, tankPosX + 45)
        ctx.rotate(this.rotation + this.tankBody.rotation);
        
        //90 / 2 * (-1), 40 / 2 * (-1), 90, 40
        // ctx.fillRect(90 / 2 * (-1) + 40, 40 / 2 * (-1) + 15, 90, 10);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1000, 0);
        ctx.strokeStyle = "rgba(0, 128, 0, 0.5)";
        ctx.stroke();
        
        ctx.drawImage(sprite.image, this.tankBody.width / 2 * (-1) + this.tankBody.width / 2 - 20, this.tankBody.height / 2 * (-1) + this.tankBody.height / 2 - 25);
        
        ctx.restore();


        return true;
    }

    shoot = (code: number) => {
        if (code != 32)
            return;
        let spawnX = Math.cos(this.rotation + this.tankBody.rotation) * 90;
        let spawnY = Math.sin(this.rotation + this.tankBody.rotation) * 90;

        // console.log("shoot", spawnX, spawnY)
        const bullet = new Bullet();
        bullet.posX = spawnX + this.tankBody.posX + this.tankBody.width / 2;
        bullet.posY = spawnY + this.tankBody.posY + this.tankBody.height / 2;

        bullet.rotation = this.rotation + this.tankBody.rotation;

        GameObjectsManager.gameObjects.push(bullet);
    }

    update(): boolean {
        if (CanvasManager.keyDown("e")) {
            this.rotation -= 0.02;
        }

        if (CanvasManager.keyDown("r")) {
            this.rotation += 0.02;
        }

        const dx = CanvasManager.mouse.x - this.tankBody.posX -45;
        const dy = CanvasManager.mouse.y - this.tankBody.posY -40;

        const addRotation = -Math.atan2(dx + GameObjectsManager.camera.posX, dy + GameObjectsManager.camera.posY) + (90 * Math.PI / 180);

        if (Math.abs(addRotation - this.rotation -this.tankBody.rotation) <=0.01) {
            this.rotation = addRotation - this.tankBody.rotation;
            return true;
        }
        
        if (addRotation > this.rotation + this.tankBody.rotation) {
            if (360 - toDeg(addRotation) + toDeg(this.rotation + this.tankBody.rotation) < toDeg(addRotation) - toDeg(this.rotation + this.tankBody.rotation)) {
                this.rotation -= 0.015;
            } else {
                this.rotation += 0.015;
            }
        } else {
            if (360 - toDeg(this.rotation + this.tankBody.rotation) + toDeg(addRotation) < toDeg(this.rotation + this.tankBody.rotation) - toDeg(addRotation)) {
                this.rotation += 0.015;
            } else {
                this.rotation -= 0.015;
            }
        }

        if (this.rotation + this.tankBody.rotation < -1.57) {
            this.rotation = 6.28 - 1.57 - this.tankBody.rotation;
        } else if (this.rotation + this.tankBody.rotation > 6.28 - 1.57) {
            this.rotation = -1.57 - this.tankBody.rotation;
        }
        
        return true;
    }
}

function toDeg (num: number) {
    return num * 180 / Math.PI + 90;
}

function toRad (num: number) {
    return (num - 90) * Math.PI / 180;
}