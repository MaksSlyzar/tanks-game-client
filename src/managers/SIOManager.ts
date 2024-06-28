import { io, Socket } from "socket.io-client";
import { Player } from "../gameobjects/Player/Player";
import MainGui from "../gui/MainGui";

class SIOManager {
    socket: Socket;
    username: string;
    playerId: number;
    players: Array<Player>;
    ownPlayer: Player;
    connectCallbacks: Array<() => void> = [];

    getPlayerById(id: number) {
        return this.players.find((player) => player.id == id);
    }

    constructor() {
        const serverUrls = {
            local: "http://localhost:3050",
            replit: "https://tanks.pagekite.me/",
            network: "http://192.168.0.102:3050",
            ngrok: "https://3c95-109-207-118-219.ngrok-free.app",
            tunnel: "https://terrain-colon-oil-hundreds.trycloudflare.com/",
            render: "https://tanks-game-server.onrender.com/",
        };

        this.socket = io(serverUrls.local, {});

        this.socket.on("connect", () => {
            console.log("Connection successfull");
            this.onConnect();
        });

        this.socket.on("hello", (data) => {
            console.log(data);
        });
    }

    run() {}

    addConnectCallback(cb: () => void) {
        console.log(cb);
        this.connectCallbacks.push(cb);
    }

    onConnect() {
        this.connectCallbacks.map((cb) => cb());
        return true;
    }
}

export default new SIOManager();
