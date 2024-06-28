import GameObjectsManager from "./GameObjectsManager";
class CanvasEvents {
    public leftClickCallbacks: Array<(event: Event) => void> = [];
    public rightClickCallbacks: Array<(event: Event) => void> = [];
    public keyUpCallbacks: Array<(keyCode: number) => void> = [];
    keyEventsOn: boolean = true;
    canvas: HTMLCanvasElement;
    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.start();
    }
    start = () => {
        window.onclick = (event) => {
            this.leftClickCallbacks.map(cb => {
                cb(event);
            });
        };
        this.canvas.oncontextmenu = (event) => {
            this.rightClickCallbacks.map(cb => {
                cb(event);
            });

            return false;
        };
        window.onresize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    setLeftOnClick (callback: (event: Event) => void) {
        this.leftClickCallbacks.push(callback);
    }
    setRightOnClick (callback: (event: Event) => void) {
        this.rightClickCallbacks.push(callback);
    }
    setOnKeyUp (callback: (keyCode: number) => void) {
        this.keyUpCallbacks.push(callback);
    }
}
export default CanvasEvents;