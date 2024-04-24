import Box from "../gameobjects/Box/Box";
import { BaseBuild, Build } from "../gameobjects/Builds/Builds";
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
            _type: "none" | "base";
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
        enemies: Array<{
            id: number;
            posX: number;
            posY: number;
            rotation: number;
            _type: "test" | "none";
        }>;
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

        builds: Array<{
            id: number;
            posX: number;
            posY: number;
            hp: number;
            maxHp: number;
            _type: "none" | "base";
        }>;
    };
}

class GameObjectsManager {
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

    constructor() {
        this.initedGame = false;
        this.gameObjects = {
            tankBodies: [],
            projectiles: [],
            enemies: [],
            other: [new Grid()],
            builds: [],
        };

        SIOManager.socket.on("sendSyncData", (data: SyncObjectsData) => {
            const destroyProjectiles = this.gameObjects.projectiles.map(
                (_projectile, index) => {
                    return { id: _projectile.id, index: index };
                }
            );

            data.gameObjects.enemies.map((enemyData) => {
                const { id, _type, posX, posY, rotation } = enemyData;

                let enemy = this.gameObjects.enemies.find(
                    (_enemy) => _enemy.id == id
                ) as Enemie;

                if (enemy == null) {
                    switch (_type) {
                        case "test":
                            enemy = new Enemie();
                            break;

                        default:
                            return;
                    }

                    enemy.id = id;
                    enemy.posX = posX;
                    enemy.posY = posY;
                    this.gameObjects.enemies.push(enemy);
                }

                enemy.targetX = posX;
                enemy.targetY = posY;
            });

            data.gameObjects.builds.map((buildData) => {
                const { id, _type, posX, posY, hp, maxHp } = buildData;

                let build = this.gameObjects.builds.find(
                    (_build) => _build.id == id
                );

                if (build == null) {
                    switch (_type) {
                        case "base":
                            build = new BaseBuild();
                            break;

                        case "none":
                            return;
                            break;
                    }

                    build.id = id;

                    this.gameObjects.builds.push(build);
                }

                build.hp = hp;
                build.maxHp = maxHp;
                build.posX = posX;
                build.posY = posY;
            });

            data.gameObjects.projectiles.map((projectileData) => {
                let projectile = this.gameObjects.projectiles.find(
                    (_projectile) => _projectile.id == projectileData.id
                ) as Projectile;

                if (projectile == null) {
                    projectile = new Projectile();
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
                    projectile.rotation = projectileData.rotation;

                    projectile.id = projectileData.id;

                    this.gameObjects.projectiles.push(projectile);
                }

                const destroy = destroyProjectiles.findIndex(
                    (_projectile) => _projectile.id == projectileData.id
                );

                if (destroy != null) {
                    destroyProjectiles.splice(destroy, 1);
                }

                projectile.rotation = projectileData.rotation;
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

                tankBody.targetHp = tankBodyData.hp;
                tankBody.maxHp = tankBodyData.maxHp;

                tankBody.targetX = tankBodyData.posX;
                tankBody.targetY = tankBodyData.posY;
                tankBody.rotation = tankBodyData.rotation;
                tankBody.weapon.targetRotation = tankBodyData.weapon.rotation;
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
            ...this.gameObjects.other,
            ...this.gameObjects.enemies,
            ...this.gameObjects.tankBodies,
            ...this.gameObjects.projectiles,
            ...this.gameObjects.builds,
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
