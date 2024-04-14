import AssetsManager from "../../../managers/AssetsManager";
import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import { GameObject } from "../../../modules/GameObject";
import { quadColliderMesh, updateShape } from "../../../modules/SAT";
import { Player } from "../Player";
import { HeavyWeapon } from "./Weapons";
import { HeavyWeaponNetwork } from "./WeaponsNetwork";

export class HeavyTankBodyNetwork extends GameObject {
    weapon: HeavyWeaponNetwork;
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
    targetX: number = -1;
    targetY: number = -1;
    pushSpeed: number = 0.02;
    standartPushSpeed: number = 10;
    player: Player;
    constructor (playerGameObject: Player) {
        super();
        this.player = playerGameObject;
        this.speed = 0;
        this.maxSpeed = 4;
        this.rotationSpeed = 0.02;
        this.posX = 0;
        this.posY = 0;
        this.rotation = 0;
        this.minSpeed = -1;
        this.engine = "OFF";
        this.weapon = new HeavyWeaponNetwork(this);
        this.activeShape = [];
        this.collidingObject = true;
        this.shape = quadColliderMesh(this.width, this.height);
    }

    update () {
        this.posX += (this.targetX - this.posX) * 0.10;
        this.posY += (this.targetY - this.posY) * 0.10;
        this.activeShape = updateShape(this.posX + this.width / 2, this.posY + this.height / 2, this.rotation, this.shape);
        return true;
    }

    render() {
        const ctx = CanvasManager.context;

        const sprite = AssetsManager.sprites["tank-body"];

        if (sprite == null)
            return false;

        ctx.fillStyle = "black";
        ctx.save();

        const doPosition = GameObjectsManager.camera.doPosition(this.posX, this.posY, 1, 1);

        ctx.translate(doPosition.x + this.width / 2, doPosition.y + this.height / 2);
        ctx.font = "15px Consolas";
        ctx.strokeStyle = "white";
        ctx.strokeText(this.player.username, -50, -80);
        
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(sprite.image, 0, 0, this.width, this.height);
        
        ctx.restore();
        
        this.weapon.render();

        this.drawShapes(GameObjectsManager.camera.posX, GameObjectsManager.camera.posY);
        return true;
    }
}