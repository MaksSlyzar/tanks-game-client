import AssetsManager from "../managers/AssetsManager";
import CanvasManager from "../managers/CanvasManager";
import GameObjectsManager from "../managers/GameObjectsManager";
export class SpellPanel {}
export class HudElement {
    render() {}
    update() {}
}
export class GoldText extends HudElement {
    gold: number = 0;
    render() {
        const ctx = CanvasManager.context;
        const image = AssetsManager.sprites["gold"];
        if (!image) return;
        ctx.font = "20pt Consolas";
        ctx.fillStyle = "white";
        ctx.drawImage(image.image, 20, 20);
        ctx.fillText(String(this.gold), 50, 40);
    }
    update(): void {
        this.gold = GameObjectsManager.gold;
    }
}
export class WaveInfo extends HudElement {
    waveEnemies: number = 0;
    enemiesLive: number = 0;
    wave: number = 1;
    generateWave: number = -1;
    render(): void {
        const ctx = CanvasManager.context;
        ctx.font = "20pt Consolas";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        let text = `Wave ${this.wave}`;
        let textWidth = ctx.measureText(text).width;
        let centerX = (CanvasManager.canvas.width - textWidth) / 2;
        ctx.fillText(text, centerX, 40);
        ctx.font = "13pt Consolas";
        if (this.generateWave != -1)
            ctx.fillText(`Next wave ${this.generateWave}`, centerX + 110, 40);
        ctx.fillStyle = "black";
        const width = 350;
        const height = 5;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        centerX = (CanvasManager.canvas.width - width) / 2;
        ctx.rect(centerX, 50, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(
            centerX,
            50,
            (this.enemiesLive / this.waveEnemies) * 350,
            height
        );
        ctx.stroke();
    }
    update() {
        this.enemiesLive = GameObjectsManager.gameObjects.enemies.length;
        this.waveEnemies = GameObjectsManager.waveEnemies;
        this.generateWave = GameObjectsManager.generateWave;
        this.wave = GameObjectsManager.wave;
    }
}
