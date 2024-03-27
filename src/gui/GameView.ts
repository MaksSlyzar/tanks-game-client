import { View } from "../modules/View";

class GameView extends View {
    constructor () {
        const elem = document.getElementById("GameView") as HTMLDivElement;
        console.log(elem)
        super("Game", elem);
    }
}

export default GameView;