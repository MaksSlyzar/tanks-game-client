import { io, Socket } from 'socket.io-client'

class SIOManager {
    socket: Socket;
    username: string;
    playerId: number;
    
    constructor () {
        const serverUrls = {
            local: "http://localhost:3040",
            replit: "https://404f4b78-37ae-46af-a273-9804366e5caf-00-yhg6bhk5l9g9.picard.replit.dev:3001/"
        };

        this.socket = io(serverUrls.local, {
        });

        this.socket.on("connect", () => {
            console.log("Connection successfull");
        })

        this.socket.on("hello", data => {
            console.log(data);
        });
    }

    connect () {
        return true;
    }
}

export default new SIOManager();