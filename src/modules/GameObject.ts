import CanvasManager from "../managers/CanvasManager";
import { Vector2d } from "./SAT";
export class GameObject {
    id: number;
    posX: number;
    posY: number;
    rotation: number;
    shape: Array<Vector2d>;
    activeShape: Array<Vector2d>;
    collidingObject: boolean;
    tag: string;
    width: number;
    height: number;
    hp: number = 0;
    maxHp: number = 0;
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.rotation = 0;
        this.collidingObject = false;
    }
    update(): boolean {
        return true;
    }
    render(): boolean {
        return true;
    }
    drawShapes(x: number, y: number) {
        const ctx = CanvasManager.context;
        const polygon = this.activeShape;
        ctx.beginPath();
        ctx.strokeStyle = "red";
        for (let i = 0; i < polygon.length; i++) {
            if (i == 0) {
                ctx.moveTo(polygon[i].x - x, polygon[i].y - y);
                continue;
            }
            ctx.lineTo(polygon[i].x - x, polygon[i].y - y);
        }
        ctx.lineTo(polygon[0].x - x, polygon[0].y - y);
        ctx.stroke();
    }
    renderHPBar() {
        if (this.maxHp == 0) return;
        const ctx = CanvasManager.context;
        const width = 100;
        const height = 5;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.rect(-width / 2, -60, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(-width / 2, -60, (this.hp / this.maxHp) * 100, height);
        ctx.stroke();
    }
    network(data: any) {}
}
