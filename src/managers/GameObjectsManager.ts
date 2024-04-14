import Box from "../gameobjects/Box/Box";
import Camera from "../gameobjects/Camera/Camera";
import Enemie from "../gameobjects/Enemies/Enemie";
import Grid from "../gameobjects/Grid";
import { Player } from "../gameobjects/Player/Player";
import { HeavyTankBody } from "../gameobjects/Player/Tanks/TankBody";
import { HeavyTankBodyNetwork } from "../gameobjects/Player/Tanks/TankBodyNetwork";
import { GameObject } from "../modules/GameObject";
import SIOManager from "./SIOManager";

interface CreateGameObjectsData {
    players: Array<{
        id: number,
        username: string,
        tankBody: {
            posX: number,
            posY: number,
            rotation: number,
        },
        gameRole: "heavy"|"engeenier"
    }>
};

interface SyncObjectsData {
    players: Array<{
        id: number,
        tankBody: {
            posX: number,
            posY: number,
            rotation: number,
            weapon: {
                rotation: number
            }
        },
        gameRole: "heavy"|"engeenier"
    }>
};

class GameObjectsManager {
    gameObjects: Array<GameObject>;
    camera: Camera;
    initedGame: boolean;
    deltaTime: number;
    players: Array<Player>;

    constructor () {
        this.initedGame = false;
        this.gameObjects = [];
        this.gameObjects.push(new Grid());
        // const player = new Player();
        // this.gameObjects.push(player);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if (i == 0 || j == 0 || j == 19 || i == 19) {

                    if (i == 5 && j ==0 || i == 6 && j == 0)
                        continue
                    const box1 = new Box();
                    box1.posX = 50 * i;
                    box1.posY = j * 50 + 300;
                    this.gameObjects.push(box1);
                }
            }
        }

        this.gameObjects.push(new Enemie());
        const en1 = new Enemie();
        en1.setY(800);
        en1.posX = 1000;
        this.gameObjects.push(en1);


        SIOManager.socket.on("sendSyncData", (data: SyncObjectsData) => {
            data.players.map(player => {
                // if (player.id == SIOManager.playerId)
                //     return;
                const playerObject = this.getObjectById(player.id) as HeavyTankBody;
                
                if (playerObject == null)
                    return;
            
                playerObject.targetX = player.tankBody.posX;
                playerObject.targetY = player.tankBody.posY;
                playerObject.rotation = player.tankBody.rotation;
                playerObject.weapon.rotation = player.tankBody.weapon.rotation;

            });
        });
    }

    getObjectById (id: number) {
        // this.gameObjects.forEach(go => {
        //     // console.log(go.id)
        // })
        return this.gameObjects.find(object => object.id == id);
    }

    init (data: CreateGameObjectsData) {
        data.players.forEach(player => {
            const isClientPlayer = player.id == SIOManager.playerId;
            const playerGameObject = new Player();
            switch (player.gameRole) {
                case "engeenier":

                break;

                case "heavy":
                    playerGameObject.tank = isClientPlayer? new HeavyTankBody(playerGameObject): new HeavyTankBodyNetwork(playerGameObject);
                break;  
            }

            playerGameObject.id = player.id;
            playerGameObject.username = player.username;
            playerGameObject.tank.id = player.id;
            playerGameObject.tank.posX = player.tankBody.posX;
            playerGameObject.tank.posY = player.tankBody.posY;
            playerGameObject.tank.rotation = player.tankBody.rotation;

            if (isClientPlayer) {
                this.camera = new Camera(playerGameObject.tank);
            } else {
                
            }
            this.gameObjects.push(playerGameObject.tank);
        });

        this.initedGame = true;
    }

    update (deltaTime: number) {
        this.deltaTime = deltaTime;
        if (this.initedGame == false)
            return;

        const updateObjects = this.gameObjects.map(gameObject => {
            return gameObject.update();
        });
        
        this.camera.update();
    }

    render () {
        if (this.initedGame == false)
            return;

        const renderObjects = this.gameObjects.map(gameObject => {
            return gameObject.render()
        });
    }

    errorLog (text: string) {
        console.log(text);
    }
}

export default new GameObjectsManager();