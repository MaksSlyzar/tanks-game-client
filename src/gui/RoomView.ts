import GameObjectsManager from "../managers/GameObjectsManager";
import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import MainGui, { getElementByClass, getElementById } from "./MainGui";
const leaderIconSvg = require("./../assets/leader-icon.svg");
const readyIconSvg = require("./../assets/ready-icon.svg");

function getImageSvg (svg: any, width: number, height: number) {
    const image = document.createElement("img") as HTMLImageElement;
    image.src = svg;
    image.width = width;
    image.height = height;
    return image;
}

class RoomView extends View {
    clientReady: boolean;
    selectedRole: string;
    roomReadyButton: HTMLButtonElement;
    startGameButton: HTMLButtonElement;
    canStartGame: boolean;
    exitRoomButton: HTMLButtonElement;

    constructor () {
        const elem =  getElementById<HTMLDivElement>("RoomView");
        super("Room", elem);

        this.clientReady = false;
        this.canStartGame = false;
        this.startGameButton = getElementById<HTMLButtonElement>("StartGameButton");
        this.roomReadyButton = getElementById<HTMLButtonElement>("RoomReadyButton");
        this.exitRoomButton = getElementById<HTMLButtonElement>("exitRoomButton");

        this.roomReadyButton.onclick = () => this.ready(!this.clientReady);
        this.startGameButton.onclick = () => this.startGame();
        this.exitRoomButton.onclick = () => this.exit();

        SIOManager.socket.on("updateRoomViewData", (roomData) => this.updateRoomViewData(roomData));

        SIOManager.socket.on("createGameObjects", (data) => {
            MainGui.changeView("Game");
            GameObjectsManager.init(data);
        });
    }

    exit () {
        SIOManager.socket.emit("exitRoom", {});
    }

    updateRoomViewData = (roomData: any) => {
        const gameNameDiv = getElementByClass<HTMLDivElement>("RoomView__game-name", this.mainDiv);
        const rolesDiv = getElementByClass<HTMLDivElement>("RoomView__SelectRole-list", this.mainDiv);
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

        this.roomReadyButton.classList.toggle("activated", this.clientReady);
        this.roomReadyButton.innerText = this.clientReady ? "Готовий" : "Не готовий";


        SIOManager.socket.emit("switchRoomReady", { ready: this.clientReady, role: this.selectedRole });
    }

    updatePlayerList (players: any) {
        const playersDiv = getElementByClass<HTMLDivElement>("RoomView__Players-list", this.mainDiv);
        const isRoomLeader = players.find((pl: any) => pl.id == SIOManager.playerId).isRoomLeader;
        
        playersDiv.innerHTML = "";

        let playersReady = true;
        const leaderIconImage = getImageSvg(leaderIconSvg.default, 20, 20);
        const readyIconImage = getImageSvg(readyIconSvg.default, 20, 20);
        
    
        players.map((pl: { username: string, isOnline: boolean, roomReady: boolean, isRoomLeader: boolean }) => {
            if (pl.roomReady == false)
                playersReady = false;
            const elem = document.createElement("div");
            
            
            elem.innerHTML = `${pl.username} - ${pl.isOnline?"Онлайн":"Офлайн"} `;

            if (pl.roomReady)
                elem.appendChild(readyIconImage)
            if (pl.isRoomLeader)
                elem.appendChild(leaderIconImage)

            elem.classList.add("RoomView__Players-item");

            playersDiv.append(elem);
        });

        if (isRoomLeader) {
            this.startGameButton.classList.toggle("hidden", false);
            this.canStartGame = playersReady;
            this.startGameButton.classList.toggle("activated", playersReady);
        } else {
            this.startGameButton.classList.toggle("hidden", true);
        }
        
    }

    updateData (data: any) {
        return;
    }
}

export default RoomView;