import AssetsManager from "../managers/AssetsManager";
import CanvasManager from "../managers/CanvasManager";
import GameObjectsManager from "../managers/GameObjectsManager";
import { GameObject } from "../modules/GameObject";
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function calculatePercentage(part: number, whole: number) {
    return (part / whole) * 100;
}
function getRandomWithPercentage(
    table: Array<{
        value: any;
        percentage: number;
    }>
) {
    let lastItemPercentage = 0;
    let newTable: number[] = table.map((item, index) => {
        const chance = item.percentage + lastItemPercentage;

        lastItemPercentage = item.percentage + lastItemPercentage;

        return chance;
    });

    const rand = getRandomInt(0, lastItemPercentage);

    let trueOutput = 0;
    let output = 0;
    const calc = newTable.map((item, index) => {
        if (rand <= item && rand >= output) {
            trueOutput = index;
        }

        output = item;
    });

    return table[trueOutput].value;
}

class Grid extends GameObject {
    landMap: number[][] = [];

    constructor() {
        super();
        this.generateMap();
    }

    generateMap() {
        const table = [
            {
                value: 0,
                percentage: 50,
            },
            {
                value: 1,
                percentage: 48,
            },
            {
                value: 2,
                percentage: 2,
            },
        ];
        let percentage = 0;

        for (let y = 0; y < 10 * 100; y++) {
            if (calculatePercentage(y, 100 * 100) != percentage) {
                percentage = calculatePercentage(y, 100 * 100);
            }
            this.landMap.push([]);
            for (let x = 0; x < 10 * 100; x++) {
                if (y == 0 || x == 0) this.landMap[y].push(3);
                else this.landMap[y].push(getRandomWithPercentage(table));
            }
        }
    }
    render() {
        const ctx = CanvasManager.context;
        ctx.strokeStyle = "red";
        const camera = GameObjectsManager.camera;
        const cameraX = Math.floor(GameObjectsManager.camera.posX);
        const cameraY = Math.floor(GameObjectsManager.camera.posY);
        const browseWidth = Math.round(CanvasManager.canvas.width / 32);
        const browseHeight = Math.round(CanvasManager.canvas.height / 32);
        const browseX = Math.floor(GameObjectsManager.camera.posX / 32);
        const browseY = Math.floor(GameObjectsManager.camera.posY / 32);
        for (let y = browseY; y < browseHeight + browseY + 2; y++) {
            for (let x = browseX; x < browseWidth + browseX + 1; x++) {
                if (y < 0) continue;
                if (x < 0) continue;
                const drawImagePosition = this.landMap[y][x];
                const drawPosition = GameObjectsManager.camera.doPosition(
                    x * 32,
                    y * 32,
                    32,
                    32
                );
                ctx.drawImage(
                    AssetsManager.sprites["grass-sheet"].image,
                    drawImagePosition * 32,
                    0,
                    32,
                    32,
                    Math.floor(drawPosition.x),
                    Math.floor(drawPosition.y),
                    32,
                    32
                );
            }
        }
        return false;
    }
}
export default Grid;
