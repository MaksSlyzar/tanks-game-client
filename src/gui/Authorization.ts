import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import MainGui, { getElementByClass, getElementById } from "./MainGui";
import ServerInfoView from "./ServerInfo";

class AuthorizationView extends View {
  serverInfoView: ServerInfoView;

  constructor() {
    const elem = getElementByClass<HTMLDivElement>("Authorization");
    const registerButton = getElementById<HTMLButtonElement>("registerButton");
    const usernameInput = getElementByClass<HTMLInputElement>("usernameInput");

    super("Authorization", elem);

    this.serverInfoView = new ServerInfoView();

    this.serverInfoView.show();

    registerButton.onclick = () => {
      const value = usernameInput.value;

      if (value.length >= 6) {
        SIOManager.socket.emit("register", { username: value });
      }
    };

    SIOManager.socket.on("authSuccessfully", playerNetwork => {
      this.serverInfoView.hide();
      const { token, gameSession, id } = playerNetwork;

      SIOManager.playerId = id;

      SIOManager.username = playerNetwork.username;

      localStorage.setItem("token", token);

      switch (gameSession) {
        case "room":
          MainGui.changeView("Room");
        break;

        case "menu":
          MainGui.changeView("MainMenu");
        break;
      }
    });

    SIOManager.socket.on("authFailed", error => {
      console.log(error)
    });

    const token = localStorage.getItem("token");
    console.log(token)
    
    if (token != null) {
      SIOManager.socket.emit("authByToken", token);
    }

    this.show();
  }
}

export default AuthorizationView;
