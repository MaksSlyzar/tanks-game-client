import { io, Socket } from 'socket.io-client'

class SIOManager {
    socket: Socket;
    
    constructor () {
        const serverUrls = {
            local: "127.0.0.1:3000"
        };

        this.socket = io(serverUrls.local);

        this.socket.on("hello", data => {
            console.log(data);
        })
    }

    subscribeUpdatePlayerList (cb: (data: any) => void) {
        this.socket.on("updatePlayerList", cb);
    }

    connect () {
        return true;
    }
}

export default new SIOManager();