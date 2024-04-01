import { io, Socket } from 'socket.io-client'

class SIOManager {
    socket: Socket;
    username: string;
    playerId: number;
    
    constructor () {
        const serverUrls = {
            local: "http://127.0.0.1:3030"
        };

        this.socket = io(serverUrls.local);

        this.socket.on("hello", data => {
            console.log(data);
        });
    }

    connect () {
        return true;
    }
}

export default new SIOManager();