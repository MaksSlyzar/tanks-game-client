import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import { getElementByClass } from "./MainGui";

class ServerInfoView extends View {
    connectionDiv: HTMLDivElement;

    constructor() {
        const elem = document.getElementById(
            "ServerInfoView"
        ) as HTMLDivElement;
        super("ServerInfo", elem);

        this.connectionDiv = getElementByClass<HTMLDivElement>(
            "connection",
            elem
        );

        SIOManager.addConnectCallback(() => this.onConnect());
    }

    onConnect() {
        console.log("YES");
        this.connectionDiv.innerText = "Успішно з'єднано з сервером";
    }
}

export default ServerInfoView;
