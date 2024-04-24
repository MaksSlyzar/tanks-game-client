import Box from "../gameobjects/Box/Box";
import Camera from "../gameobjects/Camera/Camera";
import Enemie from "../gameobjects/Enemies/Enemie";
import Grid from "../gameobjects/Grid";
import { Player } from "../gameobjects/Player/Player";
import SyncController from "../gameobjects/Player/Tanks/SyncController";
import {
    EngineerTankBody,
    HeavyTankBody,
} from "../gameobjects/Player/Tanks/TankBody";
import { HeavyTankBodyNetwork } from "../gameobjects/Player/Tanks/TankBodyNetwork";
import { Projectile } from "../gameobjects/Projectiles/Projectiles";
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
        enemies: Array<{}>;
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
    };
}

interface SyncObjectsData {
    players: Array<{
        id: number;
        tankBody: {
            id: number;
            posX: number;
            posY: number;
            rotation: number;
            weapon: {
                rotation: number;
            };
        };
        gameRole: "heavy" | "engeenier";
    }>;

    gameObjects: {
        enemies: Array<{}>;
        projectiles: Array<{
            posX: number;
            posY: number;
            id: number;
            rotation: number;
            tankBodyId: number;
        }>;
        tankBodies: Array<{
            id: number;
            posX: number;
            posY: number;
            rotation: number;
            playerId: number;
            _type: "heavy" | "engeenier";
            collision: boolean;
            weapon: {
                rotation: number;
            };
            hp: number;
            maxHp: number;
        }>;
    };
}

class GameObjectsManager {
    gameObjects: {
        tankBodies: Array<HeavyTankBody | EngineerTankBody>;
        projectiles: Array<GameObject>;
        enemies: Array<GameObject>;
        other: Array<GameObject>;
    };
    camera: Camera;
    initedGame: boolean;
    deltaTime: number;
    players: Array<Player>;
    syncController: SyncController;

    constructor() {
        this.initedGame = false;
        this.gameObjects = {
            tankBodies: [],
            projectiles: [],
            enemies: [],
            other: [new Grid()],
        };
        // const player = new Player();
        // this.gameObjects.push(player);

        // for (let i = 0; i < 20; i++) {
        //     for (let j = 0; j < 20; j++) {
        //         if (i == 0 || j == 0 || j == 19 || i == 19) {
        //             if ((i == 5 && j == 0) || (i == 6 && j == 0)) continue;
        //             const box1 = new Box();
        //             box1.posX = 50 * i;
        //             box1.posY = j * 50 + 300;
        //             this.gameObjects.other.push(box1);
        //         }
        //     }
        // }

        // this.gameObjects.push(new Enemie());
        // const en1 = new Enemie();
        // en1.setY(800);
        // en1.posX = 1000;
        // this.gameObjects.push(en1);

        SIOManager.socket.on("sendSyncData", (data: SyncObjectsData) => {
            const destroyProjectiles = this.gameObjects.projectiles.map(
                (_projectile, index) => {
                    return { id: _projectile.id, index: index };
                }
            );
            // console.log(data.gameObjects.projectiles);

            data.gameObjects.projectiles.map((projectileData) => {
                let projectile = this.gameObjects.projectiles.find(
                    (_projectile) => _projectile.id == projectileData.id
                ) as Projectile;

                if (projectile == null) {
                    projectile = new Projectile();
                    projectile.id = projectileData.id;

                    const tankBody = this.gameObjects.tankBodies.find(
                        (_tankBody) => _tankBody.id == projectileData.tankBodyId
                    ) as HeavyTankBody;

                    let spawnX =
                        Math.cos(tankBody.weapon.rotation + tankBody.rotation) *
                        90;
                    let spawnY =
                        Math.sin(tankBody.weapon.rotation + tankBody.rotation) *
                        90;

                    projectile.posX =
                        spawnX + tankBody.posX + tankBody.width / 2;
                    projectile.posY =
                        spawnY + tankBody.posY + tankBody.height / 2;

                    this.gameObjects.projectiles.push(projectile);
                }

                const destroy = destroyProjectiles.findIndex(
                    (_projectile) => _projectile.id == projectileData.id
                );

                if (destroy != null) {
                    destroyProjectiles.splice(destroy, 1);
                }

                projectile.targetX = projectileData.posX;
                projectile.targetY = projectileData.posY;
            });

            // console.log(destroyProjectiles);
            destroyProjectiles.forEach((destroyProjectile) => {
                const projectileIndex = this.gameObjects.projectiles.findIndex(
                    (_projectile, index) =>
                        destroyProjectile.id == destroyProjectile.id
                );

                if (projectileIndex == null) return;
                // console.log(projectileIndex);
                this.gameObjects.projectiles.splice(projectileIndex, 1);
            });

            data.gameObjects.tankBodies.map((tankBodyData) => {
                const tankBody = this.gameObjects.tankBodies.find(
                    (_tankBody) => _tankBody.id == tankBodyData.id
                ) as HeavyTankBody;

                // console.log(tankBodyData);

                if (tankBody == null) return; // create new tankBody

                tankBody.hp = tankBodyData.hp;
                tankBody.maxHp = tankBodyData.maxHp;

                tankBody.targetX = tankBodyData.posX;
                tankBody.targetY = tankBodyData.posY;
                tankBody.rotation = tankBodyData.rotation;
                tankBody.weapon.rotation = tankBodyData.weapon.rotation;
                tankBody.collison = tankBodyData.collision;
            });
        });
    }

    // getObjectById(id: number) {
    //     // this.gameObjects.forEach(go => {
    //     //     // console.log(go.id)
    //     // })
    //     return this.gameObjects.find((object) => object.id == id);
    // }

    init(data: CreateGameObjectsData) {
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
            } else {
                SIOManager.players.push(player);
            }

            // let tankBody;

            // switch (playerData.gameRole) {
            //     case "engeenier":
            //         break;

            //     case "heavy":
            //         tankBody = new HeavyTankBody(player);
            //         break;
            // }

            // playerGameObject.id = playerData.id;
            // playerGameObject.username = playerData.username;
            // playerGameObject.tank.id = playerData.id;
            // playerGameObject.tank.posX = playerData.tankBody.posX;
            // playerGameObject.tank.posY = playerData.tankBody.posY;
            // playerGameObject.tank.rotation = playerData.tankBody.rotation;

            // if (isClientPlayer) {
            //     this.camera = new Camera(playerGameObject.tank);
            // } else {
            // }
            // this.gameObjects.push(playerGameObject.tank);
        });

        console.log(data);

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

                //TODO:engeenier
            }
            tankBody.id = tankBodyData.id;
            tankBody.posX = tankBodyData.posX;
            tankBody.posY = tankBodyData.posY;
            tankBody.rotation = tankBodyData.rotation;

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

        this.camera.update();
    }

    render() {
        if (this.initedGame == false) return;

        const gameObjects = [
            ...this.gameObjects.enemies,
            ...this.gameObjects.other,
            ...this.gameObjects.tankBodies,
            ...this.gameObjects.projectiles,
        ];
        const renderObjects = gameObjects.map((gameObject) => {
            return gameObject.render();
        });
    }

    errorLog(text: string) {
        console.log(text);
    }
}

export default new GameObjectsManager();
