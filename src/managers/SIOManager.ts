import { io, Socket } from "socket.io-client";
import { Player } from "../gameobjects/Player/Player";

class SIOManager {
    socket: Socket;
    username: string;
    playerId: number;
    players: Array<Player>;
    ownPlayer: Player;

    getPlayerById(id: number) {
        return this.players.find((player) => player.id == id);
    }

    constructor() {
        const serverUrls = {
            local: "http://localhost:3040",
            replit: "https://tanks.pagekite.me/",
            network: "http://192.168.0.102:3040",
            ngrok: "https://3c95-109-207-118-219.ngrok-free.app",
            tunnel: "https://terrain-colon-oil-hundreds.trycloudflare.com/",
        };

        //ngrok
        // fetch(serverUrls.ngrok, {
        //     method: "get",
        //     headers: new Headers({
        //         "ngrok-skip-browser-warning": "12332",
        //     }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => console.log(data))
        //     .catch((err) => console.log(err, "ERROR"));

        this.socket = io(serverUrls.tunnel, {});

        this.socket.on("connect", () => {
            console.log("Connection successfull");
        });

        this.socket.on("hello", (data) => {
            console.log(data);
        });
    }

    connect() {
        return true;
    }
}

export default new SIOManager();
