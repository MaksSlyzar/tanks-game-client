import CanvasManager from "./managers/CanvasManager";
import GameObjectsManager from "./managers/GameObjectsManager";
class Game {
    currentTime: Date;
    diff: number;
    deltaTime: number;
    lastDate: Date;
    fps: number;
    constructor () {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const gameElement = document.getElementById("game") as HTMLDivElement;
        //gameElement.requestFullscreen();
        //canvas.requestFullscreen();
        this.lastDate = new Date();
        this.start();
    }
    start () {
        this.update();
    }
    update () {
        this.currentTime = new Date();
        this.diff = this.currentTime.getTime() / 1000 - this.lastDate.getTime() / 1000;
        this.deltaTime = this.diff / 1;
        this.lastDate = this.currentTime;
        this.fps = 1 / this.deltaTime;
        CanvasManager.context.clearRect(0, 0, CanvasManager.canvas.width, CanvasManager.canvas.height);
        GameObjectsManager.update(this.deltaTime);
        GameObjectsManager.render();
        requestAnimationFrame(this.update.bind(this));
    }
}
export default Game;
