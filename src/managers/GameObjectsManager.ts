import Box from "../gameobjects/Box/Box";
import { BaseBuild, Build, GoldBuild } from "../gameobjects/Builds/Builds";
import Camera from "../gameobjects/Camera/Camera";
import Enemie from "../gameobjects/Enemies/Enemie";
import Grid from "../gameobjects/Grid";
import { Player } from "../gameobjects/Player/Player";
import SyncController from "../gameobjects/Player/Tanks/SyncController";
import {
    EngineerTankBody,
    HeavyTankBody,
} from "../gameobjects/Player/Tanks/TankBody";
import { Projectile } from "../gameobjects/Projectiles/Projectiles";
import { GoldText, HudElement, WaveInfo } from "../hud/HUD";
import { GameObject } from "../modules/GameObject";
import SIOManager from "./SIOManager";

interface CreateGameObjectsData {
    players: Array<{
        id: number;
        username: string;
        tankBody: {
            posX: number;
            posY: number;
            rotation: number;
        };
        gameRole: "heavy" | "engeenier";
    }>;

    gameObjects: {
        enemies: Array<{
            id: number;
            posX: number;
            posY: number;
            rotation: number;
        }>;
        projectiles: Array<{}>;
        tankBodies: Array<{
            id: number;
            posX: number;
            posY: number;
            rotation: number;
            playerId: number;
            _type: "heavy" | "engeenier";
            weapon: {
                rotation: number;
            };
        }>;
        builds: Array<{
            id: number;
            posX: number;
            posY: number;
            hp: number;
            maxHp: number;
            _type: "none" | "base" | "gold";
        }>;
    };
}

class GameObjectsManager {
    gold: number = 0;
    gameObjects: {
        tankBodies: Array<HeavyTankBody | EngineerTankBody>;
        projectiles: Array<GameObject>;
        enemies: Array<GameObject>;
        other: Array<GameObject>;
        builds: Array<Build>;
    };
    camera: Camera;
    initedGame: boolean;
    deltaTime: number;
    players: Array<Player>;
    syncController: SyncController;
    hudElements: Array<HudElement> = [];
    waveEnemies: number = 0;
    wave: number;
    generateWave: number;

    constructor() {
        this.initedGame = false;
        this.gameObjects = {
            tankBodies: [],
            projectiles: [],
            enemies: [],
            other: [new Grid()],
            builds: [],
        };
    }

    init(data: CreateGameObjectsData) {
        this.hudElements.push(new GoldText(), new WaveInfo());

        SIOManager.players = [];

        this.syncController = new SyncController();

        data.players.forEach((playerData) => {
            const isClientPlayer = playerData.id == SIOManager.playerId;
            const playerGameObject = new Player();
            const player = new Player();

            player.id = playerData.id;
            player.username = playerData.username;

            if (isClientPlayer) {
                SIOManager.ownPlayer = player;
                console.log(SIOManager.ownPlayer);
            } else {
                SIOManager.players.push(player);
            }
        });

        data.gameObjects.tankBodies.forEach((tankBodyData) => {
            let tankBody;
            let isOwnPlayer = SIOManager.playerId == tankBodyData.playerId;
            const player = isOwnPlayer
                ? SIOManager.ownPlayer
                : SIOManager.getPlayerById(tankBodyData.playerId);

            if (player == null) return;

            switch (tankBodyData._type) {
                case "heavy":
                    tankBody = new HeavyTankBody(player);
                    break;
            }
            tankBody.id = tankBodyData.id;
            tankBody.posX = tankBodyData.posX;
            tankBody.posY = tankBodyData.posY;
            tankBody.rotation = tankBodyData.rotation;
            tankBody.isOwn = isOwnPlayer;

            this.gameObjects.tankBodies.push(tankBody);

            if (isOwnPlayer) this.camera = new Camera(tankBody);
        });

        this.initedGame = true;
    }

    update(deltaTime: number) {
        this.deltaTime = deltaTime;
        if (this.initedGame == false) return;

        const gameObjects = [
            ...this.gameObjects.enemies,
            ...this.gameObjects.other,
            ...this.gameObjects.tankBodies,
            ...this.gameObjects.projectiles,
        ];

        const updateObjects = gameObjects.map((gameObject) => {
            return gameObject.update();
        });

        this.syncController.update();

        this.hudElements.forEach((element) => element.update());
        this.camera.update();
    }

    render() {
        if (this.initedGame == false) return;

        const gameObjects = [
            ...this.gameObjects.other,
            ...this.gameObjects.enemies,
            ...this.gameObjects.builds,
            ...this.gameObjects.tankBodies,
            ...this.gameObjects.projectiles,
        ];
        const renderObjects = gameObjects.forEach((gameObject) => {
            return gameObject.render();
        });

        this.hudElements.forEach((element) => {
            element.render();
        });
    }

    errorLog(text: string) {
        console.log(text);
    }
}

export default new GameObjectsManager();
