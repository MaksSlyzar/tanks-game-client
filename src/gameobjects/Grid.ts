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

function getRandomWithPercentage (table: Array<{
                                            value: any,
                                            percentage: number}>) {
    
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
    
    constructor () {
        super();
        this.generateMap();
    }

    generateMap () {
        const table = [{
            value: 0,
            percentage: 50,
        }, {
            value: 1,
            percentage: 48},
        {
            value: 2,
            percentage: 2
        }];

        let percentage = 0;

        for (let y = 0; y < 10 * 100; y++) {
            
            if (calculatePercentage(y, 100 * 100) != percentage) {
                percentage = calculatePercentage(y, 100 * 100);
                // console.log(percentage);
            }
            this.landMap.push([]);
            for (let x = 0; x < 10 * 100; x++) {
                this.landMap[y].push(getRandomWithPercentage(table));
            }
        }

    }

    render() {
        const ctx = CanvasManager.context;

        ctx.strokeStyle = "red";
        
        const camera = GameObjectsManager.camera;

        const cameraX = Math.floor(GameObjectsManager.camera.posX);
        const cameraY = Math.floor(GameObjectsManager.camera.posY);

        // for (let y = -2; y < Math.floor(CanvasManager.canvas.height / 16 + 3); y++) {
        //     for (let x = -2; x < Math.floor(CanvasManager.canvas.width / 16 + 3); x++) {
        //         let landX;
        //         let landY;
        //         try {
        //             landY = Math.floor(y + camera.posY - (camera.posX % 16) / 16);
        //             landX = Math.floor(x + camera.posX - (camera.posY % 16) / 16);

        //             if (landY < 0) 
        //                 continue;
        //             if (landX < 0)
        //                 continue;

        //             const drawPos = this.landMap[landY][landX];
        //             ctx.drawImage(AssetsManager.sprites["grass-sheet"].image, drawPos * 16, 0, 16, 16, x * 16 - cameraX % 16, y * 16 - cameraY % 16, 16, 16);
        //         } catch {
        //             console.log(landX, landX, "yes")

        //             break;
        //         }

        //         // 
        //     }
        // }

        const browseWidth = Math.round(CanvasManager.canvas.width / 32);
        const browseHeight = Math.round(CanvasManager.canvas.height / 32);
        const browseX = Math.floor(GameObjectsManager.camera.posX / 32);
        const browseY = Math.floor(GameObjectsManager.camera.posY / 32);

        for (let y = browseY; y < browseHeight + browseY + 2; y++) {
            for (let x = browseX; x < browseWidth + browseX + 1; x++) {
                if (y < 0)
                    continue;
                if (x < 0)
                    continue;

                const drawImagePosition = this.landMap[y][x];
                
                const drawPosition = GameObjectsManager.camera.doPosition(x * 32, y * 32, 32, 32);

                ctx.drawImage(AssetsManager.sprites["grass-sheet"].image, drawImagePosition * 32, 0, 32, 32, Math.floor(drawPosition.x), Math.floor(drawPosition.y), 32, 32);
            }
        }

        // for (let y = 0; y < 100; y++) {
        //     for (let x = 0; x < 100)
        //     ctx.drawImage(AssetsManager.sprites["grass-sheet"].image, 0, 0, 16, 16, 16 * 16, y * 16, 16, 16);
        // }

        // ctx.globalAlpha = 0.2;

        // for (let y = 0; y < CanvasManager.canvas.height / 32; y++) {
        //     for (let x = 0; x < CanvasManager.canvas.width / 32; x++) {
        //         ctx.rect(x * 32 - camera.posX % 32, y * 32 - camera.posY % 32, 32, 32);
        //     }
        // }

        // ctx.stroke();

        // ctx.globalAlpha = 1;

        return false;
    }
}

export default Grid;