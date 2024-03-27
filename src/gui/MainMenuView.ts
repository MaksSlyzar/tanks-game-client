import LobbyView from "./LobbyView";
import MainGui from "./MainGui";
import { View } from "../modules/View";
import SIOManager from "../managers/SIOManager";

class MainMenuView extends View {
    lobbyView: LobbyView;

    constructor () {
        const elem = document.getElementById("MainMenu") as HTMLDivElement;
        super("MainMenu", elem);

        this.lobbyView = new LobbyView();
        const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;
        const createGameButton = document.getElementById("createLobbyButton") as HTMLButtonElement;
        const lobbyCode = document.getElementById("lobbyCode") as HTMLInputElement;
        const username = document.getElementById("playerName") as HTMLInputElement;

        joinGameButton.onclick = () => {
            // MainGui.changeView("Game");
            if (lobbyCode.value.length < 4) {
                alert("Error length lobbyCode")
            } else if (username.value.length < 8) {
                alert("Error length username <8 symbols")
            } else {
                SIOManager.socket.emit("joinRoom", { username: username.value, lobbyCode: lobbyCode.value });
            }
        };

        createGameButton.onclick = () => {
            if (lobbyCode.value.length < 4) {
                alert("Error length lobbyCode")
            } else if (username.value.length < 8) {
                alert("Error length username <8 symbols")
            } else {
                SIOManager.socket.emit("createRoom", {
                    username: username.value,
                    lobbyCode: lobbyCode.value 
                });
            }
        }

        // this.show();
        // this.lobbyView.show();
    }
}

export default MainMenuView;