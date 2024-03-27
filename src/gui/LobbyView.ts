import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";

class LobbyView extends View {
    lobbyCode: string;
    playerListDiv: HTMLDivElement;

    constructor () {
        const elem = document.getElementById("LobbyView") as HTMLDivElement;
        super("Lobby", elem);

        const playerListDiv = this.mainDiv.getElementsByClassName("player-list")[0] as HTMLDivElement;
        const headerList = playerListDiv.getElementsByClassName("header")[0] as HTMLDivElement;
        const playerList = playerListDiv.getElementsByClassName("list")[0] as HTMLDivElement;

        headerList.innerText = "Список підключених гравців";

        SIOManager.subscribeUpdatePlayerList((data: { players: [{ username: string }] }) => {
            console.log(data);
            playerList.innerHTML = "";

            data.players.map(p => {
                const div = document.createElement("div") as HTMLDivElement;

                div.innerText = p.username;
                console.log(p.username)

                playerList.append(div);
            })
        })
    }

    enterLobby (lobbyCode: string) {
        
    }

    
}

export default LobbyView;