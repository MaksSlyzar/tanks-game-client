import Box from "../gameobjects/Box/Box";
import Camera from "../gameobjects/Camera/Camera";
import Enemie from "../gameobjects/Enemies/Enemie";
import Grid from "../gameobjects/Grid";
import { Player } from "../gameobjects/Player/Player";
import { GameObject } from "../modules/GameObject";

class GameObjectsManager {
    gameObjects: Array<GameObject>;
    camera: Camera;

    constructor () {
        this.gameObjects = [];
        this.gameObjects.push(new Grid());
        const player = new Player();
        this.gameObjects.push(player);

        this.camera = new Camera(player.tank);

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

    update () {
        const updateObjects = this.gameObjects.map(gameObject => {
            return gameObject.update();
        });

        this.camera.update();
    }

    render () {
        const renderObjects = this.gameObjects.map(gameObject => {
            return gameObject.render()
        });
    }

    errorLog (text: string) {
        console.log(text);
    }
}

export default new GameObjectsManager();