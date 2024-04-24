import SIOManager from "../managers/SIOManager";
import { View } from "../modules/View";
import MainGui, { getElementByClass, getElementById } from "./MainGui";
import ServerInfoView from "./ServerInfo";

class AuthorizationView extends View {
  constructor() {
    const elem = document.getElementsByClassName(
      "Authorization"
    )[0] as HTMLDivElement;

    const registerButton = document.getElementById(
      "registerButton"
    ) as HTMLButtonElement;
    const usernameInput = elem.getElementsByClassName(
      "usernameInput"
    )[0] as HTMLInputElement;

    super("Authorization", elem);

        registerButton.onclick = () => {
            const value = usernameInput.value;

            if (value.length >= 4) {
                SIOManager.socket.emit("register", { username: value });
            }
        };

    SIOManager.socket.on("authSuccessfully", playerNetwork => {
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

        // case ""
      }
      //   MainGui.changeView("MainMenu");
      // else
      //   MainGui.changeView("Game")
    });

    SIOManager.socket.on("authFailed", error => {
      // this.show();
      console.log(error)
    });

        const token = localStorage.getItem("token");
        console.log(token);

        if (token != null) {
            SIOManager.socket.emit("authByToken", token);
        }

        this.show();
    }
}

export default AuthorizationView;
