import Box from "../gameobjects/Box/Box";
import Camera from "../gameobjects/Camera/Camera";
import Enemie from "../gameobjects/Enemies/Enemie";
import Grid from "../gameobjects/Grid";
import { Player } from "../gameobjects/Player/Player";
import { HeavyTankBody } from "../gameobjects/Player/Tanks/TankBody";
import { GameObject } from "../modules/GameObject";
import SIOManager from "./SIOManager";

class GameObjectsManager {
    gameObjects: Array<GameObject>;
    camera: Camera;
    initedGame: boolean;

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
    }

    init (data: any) {
        const players = data.players as Array<{
            targetX: number,
            targetY: number,
            targetRotation: number,
            _type: "engeenier"|"heavy"
            id: number
        }>;

        players.map(player => {
            if (player.id == SIOManager.playerId) {

                const playerGameObject = new Player();
                switch (player._type) {
                    case "engeenier":

                    break;

                    case "heavy":
                        playerGameObject.tank = new HeavyTankBody();
                    break;  
                }

                this.camera = new Camera(playerGameObject.tank);
                this.gameObjects.push(playerGameObject);
            }
        });

        this.initedGame = true;
    }

    update () {
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