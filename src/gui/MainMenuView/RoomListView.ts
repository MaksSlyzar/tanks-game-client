import SIOManager from "../../managers/SIOManager";
import { View } from "../../modules/View";
import MainGui from "../MainGui";

class RoomListView extends View {
    activeRoom: string;

    constructor () {
        const elem = document.getElementById("RoomListView") as HTMLDivElement;
        super("RoomList", elem);

        const listDiv = elem.getElementsByClassName("MainMenu__RoomListView-list")[0] as HTMLDivElement;
        const joinButton = elem.getElementsByClassName("joinRoomButton")[0] as HTMLButtonElement;
        const usernameLabel = elem.getElementsByClassName("MainMenu__RoomListView-join-form-username")[0] as HTMLDivElement;

        joinButton.onclick = () => {
            if (this.activeRoom == null)
                return;

            SIOManager.socket.emit("joinRoom", { lobbyCode: this.activeRoom });
        }

        SIOManager.socket.on("updateRoomList", data => {
            MainGui.changeView("MainMenu");
            usernameLabel.innerText = SIOManager.username;

            const { roomsData } = data;

            //listDiv.innerHTML = "";

            roomsData.map((room: { roomName: string, players: string[] }) => {
                const roomItem = document.createElement("div");
                
                roomItem.classList.add("MainMenu__RoomListView-item");
                roomItem.innerText = room.roomName;
                const _joinButton = document.createElement("div") as HTMLDivElement;

                _joinButton.innerText = "Join";

                roomItem.appendChild(_joinButton);

                roomItem.onclick = () => {
                    listDiv.childNodes.forEach((node) => {
                        const elem = node as HTMLDivElement;
                        
                        this.activeRoom = room.roomName;
                        
                        elem.classList.remove('active');
                    });

                    joinButton.classList.add("activated");
                    roomItem.classList.add("active");
                }

                listDiv.append(roomItem);
            });
        });
    }
}

export default RoomListView;
