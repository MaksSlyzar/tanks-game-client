import SIOManager from "../../managers/SIOManager";
import { View } from "../../modules/View";

class CreateGameView extends View {
    constructor () {
        const elem = document.getElementById("CreateGameView") as HTMLDivElement;
        super("CreateGame", elem);

        const createButton = elem.getElementsByTagName("button")[0] as HTMLButtonElement;
        const roomNameInput = elem.getElementsByTagName("input")[0] as HTMLInputElement;

        createButton.onclick = () => {
            if (roomNameInput.value.length < 5)
                return;

            SIOManager.socket.emit("createRoom", { roomName: roomNameInput.value });
        }
    }
}

export default CreateGameView;