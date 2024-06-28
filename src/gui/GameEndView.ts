import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import MainGui, { getElementByClass } from "./MainGui";
class GameEndView extends View {
    constructor() {
        const elem = document.getElementById("GameEnd") as HTMLDivElement;
        super("GameEnd", elem);

        const killedEnemiesStats =
            getElementByClass<HTMLSpanElement>("killedEnemiesStats");

        SIOManager.socket.on(
            "gameEnd",
            (data: { enemiesKilled: number; topOne: string }) => {
                MainGui.changeView("GameEnd");
                killedEnemiesStats.innerText = String(data.enemiesKilled);
            }
        );
    }
}
export default GameEndView;
