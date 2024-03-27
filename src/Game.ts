import CanvasManager from "./managers/CanvasManager";
import GameObjectsManager from "./managers/GameObjectsManager";


class Game {
    constructor () {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
         
        this.start();
    }

    start () {
        this.update();
    }

    update () {
        CanvasManager.context.clearRect(0, 0, CanvasManager.canvas.width, CanvasManager.canvas.height);
        GameObjectsManager.update();
        GameObjectsManager.render();

        requestAnimationFrame(this.update.bind(this));
    }
}

export default Game;