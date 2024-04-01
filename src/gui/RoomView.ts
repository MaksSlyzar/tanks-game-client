import GameObjectsManager from "../managers/GameObjectsManager";
import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import MainGui from "./MainGui";

class RoomView extends View {
    clientReady: boolean;
    selectedRole: string;
    roomReadyButton: HTMLButtonElement;
    startGameButton: HTMLButtonElement;
    canStartGame: boolean;

    constructor () {
        const elem = document.getElementById("RoomView") as HTMLDivElement;
        super("Room", elem);

        this.clientReady = false;
        this.canStartGame = false;
        this.startGameButton = document.getElementById("StartGameButton") as HTMLButtonElement;

        this.roomReadyButton = document.getElementById("RoomReadyButton") as HTMLButtonElement;

        this.roomReadyButton.onclick = () => this.ready(!this.clientReady);
        this.startGameButton.onclick = () => this.startGame();

        SIOManager.socket.on("updateRoomViewData", (roomData) => this.updateRoomViewData(roomData));

        SIOManager.socket.on("createGameObjects", (data) => {
            MainGui.changeView("Game");
            GameObjectsManager.init(data);
        });
            
    }

    updateRoomViewData = (roomData: any) => {
        const gameNameDiv = this.mainDiv.getElementsByClassName("RoomView__game-name")[0] as HTMLDivElement;
        const rolesDiv = this.mainDiv.getElementsByClassName("RoomView__SelectRole-list")[0] as HTMLDivElement;
        MainGui.changeView("Room");
            
        this.updatePlayerList(roomData.players);

        rolesDiv.innerHTML = "";
        const roles = [
            { _type: "heavy", label: "Heavy tank" },
            { _type: "engeenier", label: "Engeenier tank" }
        ];

        roles.map(role => {
            const { label, _type } = role;

            const roleDiv = document.createElement("div");
            roleDiv.innerText = label;
            
            if (this.selectedRole == role._type)
                roleDiv.classList.add("activated");

            roleDiv.classList.add("RoomView__SelectRole-item");

            roleDiv.onclick = () => {
                this.selectedRole = role._type;
                this.ready(false);
                
                rolesDiv.childNodes.forEach((_roleDiv) => {
                    const elem = _roleDiv as HTMLDivElement;
                    elem.classList.remove("activated");
                });

                roleDiv.classList.add("activated");
            }
            rolesDiv.append(roleDiv);
        });

        gameNameDiv.innerText = `Game: ${roomData.roomName}`;
    }
    
    startGame = () => {
        if (this.canStartGame == true)
            SIOManager.socket.emit("startRoomGame", {})
    }

    ready = (_ready: boolean) => {
        this.clientReady = _ready;

        if (this.selectedRole == null)
            return;

        if (this.clientReady) {
            this.roomReadyButton.classList.add("activated");
            this.roomReadyButton.innerText = "Готовий";
        } else {
            this.roomReadyButton.classList.remove("activated");
            this.roomReadyButton.innerText = "Не готовий";
        }

        SIOManager.socket.emit("switchRoomReady", { ready: this.clientReady, role: this.selectedRole });
    }

    updatePlayerList (players: any) {
        const playersDiv = this.mainDiv.getElementsByClassName("RoomView__Players-list")[0] as HTMLDivElement;
        const isRoomLeader = players.find((pl: any) => pl.id == SIOManager.playerId).isRoomLeader;
        
        playersDiv.innerHTML = "";

        let playersReady = true;
    
        players.map((pl: { username: string, isOnline: boolean, roomReady: boolean, isRoomLeader: boolean }) => {
            if (pl.roomReady == false)
                playersReady = false;
            const elem = document.createElement("div");
            
            elem.innerText = `${pl.username} - ${pl.isOnline?"Онлайн":"Офлайн"} - ${pl.roomReady?"Готовий":"Не готовий"} - ${pl.isRoomLeader?"Лідер":""}`;
            elem.classList.add("RoomView__Players-item");

            playersDiv.append(elem);
        });

        if (isRoomLeader) {
            this.startGameButton.classList.remove("hidden");

            if (playersReady) {
                this.startGameButton.classList.add("activated");
                this.canStartGame = true;
            } else {
                this.canStartGame = false;
                this.startGameButton.classList.remove("activated");
            }
        } else {
            this.startGameButton.classList.add("hidden");
        }
    }

    updateData (data: any) {
        return;
    }
}

export default RoomView;