import CanvasManager from "../../../managers/CanvasManager";
import GameObjectsManager from "../../../managers/GameObjectsManager";
import SIOManager from "../../../managers/SIOManager";

interface SendSyncData {
    // tankBody: {
    //     posX: number,
    //     posY: number,
    //     rotation: number,
    // }
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

        // this.dx =
        //     CanvasManager.mouse.x -
        //     this.tankBody.posX -
        //     45 +
        //     GameObjectsManager.camera.posX;

        // this.dy =
        //     CanvasManager.mouse.y -
        //     this.tankBody.posY -
        //     40 +
        //     GameObjectsManager.camera.posY;

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
