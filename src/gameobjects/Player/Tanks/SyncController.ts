import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import SIOManager from "../../../managers/SIOManager";
import { BaseBuild, GoldBuild } from "../../Builds/Builds";
import Enemie from "../../Enemies/Enemie";
import { Projectile } from "../../Projectiles/Projectiles";
import { HeavyTankBody } from "./TankBody";

interface SyncObjectsData {
    wave: number;
    generateWave: number;
    waveEnemies: number;

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
            maxHp: number;
            hp: number;
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
            gold: number;
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

interface SendSyncData {
    rotate: "LEFT" | "RIGHT" | "NONE";
    movement: "UP" | "DOWN" | "NONE";
    weapon: {
        dx: number;
        dy: number;
    };
}

class SyncController {
    constructor() {
        CanvasManager.events.setLeftOnClick((event) => this.shoot());

        this.initSyncData();
    }

    initSyncData() {
        SIOManager.socket.on("sendSyncData", (data: SyncObjectsData) => {
            GameObjectsManager.wave = data.wave;
            GameObjectsManager.generateWave = data.generateWave;
            GameObjectsManager.waveEnemies = data.waveEnemies;

            const destroyProjectiles =
                GameObjectsManager.gameObjects.projectiles.map(
                    (_projectile, index) => {
                        return { id: _projectile.id, index: index };
                    }
                );
            const destroyEnemies = GameObjectsManager.gameObjects.enemies.map(
                (_enemy, index) => {
                    return { id: _enemy.id, index: index };
                }
            );
            const destroyBuilds = GameObjectsManager.gameObjects.builds.map(
                (_build, index) => {
                    return { id: _build.id, index: index };
                }
            );

            if (GameObjectsManager.waveEnemies == 0)
                GameObjectsManager.waveEnemies =
                    data.gameObjects.enemies.length;

            data.gameObjects.enemies.map((enemyData) => {
                const { id, _type, posX, posY, rotation, hp, maxHp } =
                    enemyData;

                let enemy = GameObjectsManager.gameObjects.enemies.find(
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
                    enemy.rotation = rotation;
                    enemy.hp = hp;
                    enemy.maxHp = maxHp;
                    GameObjectsManager.gameObjects.enemies.push(enemy);
                }

                const destroy = destroyEnemies.findIndex(
                    (_enemy) => _enemy.id == id
                );

                if (destroy != null) {
                    destroyEnemies.splice(destroy, 1);
                }

                enemy.targetHp = hp;
                enemy.maxHp = maxHp;

                enemy.targetX = posX;
                enemy.targetY = posY;
                enemy.rotation = rotation;
            });

            destroyEnemies.forEach((destroyEnemy) => {
                const enemyIndex =
                    GameObjectsManager.gameObjects.enemies.findIndex(
                        (_enemy, index) => destroyEnemy.id == _enemy.id
                    );

                if (enemyIndex == null) return;
                GameObjectsManager.gameObjects.enemies.splice(enemyIndex, 1);
            });

            data.gameObjects.builds.map((buildData) => {
                const { id, _type, posX, posY, hp, maxHp } = buildData;

                let build = GameObjectsManager.gameObjects.builds.find(
                    (_build) => _build.id == id
                );

                if (build == null) {
                    switch (_type) {
                        case "base":
                            build = new BaseBuild();
                            break;

                        case "gold":
                            build = new GoldBuild();
                            break;

                        case "none":
                            return;
                            break;
                    }

                    build.id = id;

                    GameObjectsManager.gameObjects.builds.push(build);
                }

                const destroy = destroyBuilds.findIndex(
                    (_build) => _build.id == id
                );

                if (destroy != null) {
                    destroyBuilds.splice(destroy, 1);
                }

                build.hp = hp;
                build.maxHp = maxHp;
                build.posX = posX;
                build.posY = posY;
            });

            destroyBuilds.forEach((destroyBuild) => {
                const buildIndex =
                    GameObjectsManager.gameObjects.builds.findIndex(
                        (_build, index) => _build.id == destroyBuild.id
                    );

                if (buildIndex == null) return;
                GameObjectsManager.gameObjects.builds.splice(buildIndex, 1);
            });

            data.gameObjects.projectiles.map((projectileData) => {
                let projectile =
                    GameObjectsManager.gameObjects.projectiles.find(
                        (_projectile) => _projectile.id == projectileData.id
                    ) as Projectile;

                if (projectile == null) {
                    projectile = new Projectile();
                    const tankBody =
                        GameObjectsManager.gameObjects.tankBodies.find(
                            (_tankBody) =>
                                _tankBody.id == projectileData.tankBodyId
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

                    GameObjectsManager.gameObjects.projectiles.push(projectile);
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

            destroyProjectiles.forEach((destroyProjectile) => {
                const projectileIndex =
                    GameObjectsManager.gameObjects.projectiles.findIndex(
                        (_projectile, index) =>
                            destroyProjectile.id == _projectile.id
                    );

                if (projectileIndex == null) return;
                GameObjectsManager.gameObjects.projectiles.splice(
                    projectileIndex,
                    1
                );
            });

            data.gameObjects.tankBodies.map((tankBodyData) => {
                const tankBody = GameObjectsManager.gameObjects.tankBodies.find(
                    (_tankBody) => _tankBody.id == tankBodyData.id
                ) as HeavyTankBody;

                if (tankBody == null) return;

                if (tankBody.player.id == SIOManager.playerId) {
                    GameObjectsManager.gold = tankBodyData.gold;
                }
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

    shoot() {
        SIOManager.socket.emit("useSpell", { spellType: "shoot" });
    }

    update() {
        const sendData: SendSyncData = {
            rotate: "NONE",
            movement: "NONE",
            weapon: {
                dx: CanvasManager.mouse.x - 45 + GameObjectsManager.camera.posX,
                dy: CanvasManager.mouse.y - 40 + GameObjectsManager.camera.posY,
            },
        };

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
        SIOManager.socket.emit("sendMoveData", sendData);
    }
}

export default SyncController;
