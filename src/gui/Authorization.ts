import { View } from "../modules/View";
import MainGui from "./MainGui";

class AuthorizationView extends View {
  constructor() {
    const elem = document.getElementsByClassName(
      "Authorization"
    )[0] as HTMLDivElement;
    // const loginDiv = elem.getElementsByClassName("login")[0] as HTMLDivElement;
    // const registerDiv = elem.getElementsByClassName("register")[0] as HTMLDivElement;

    // const switchRegisterButton = document.getElementById("switchRegister") as HTMLButtonElement;
    // const switchLoginButton = document.getElementById("switchLogin") as HTMLButtonElement;
    const registerButton = document.getElementById(
      "registerButton"
    ) as HTMLButtonElement;
    const usernameInput = elem.getElementsByClassName(
      "usernameInput"
    )[0] as HTMLInputElement;

    super("Authorization", elem);

    registerButton.onclick = () => {
      const value = usernameInput.value;

      if (value.length >= 6) {
        MainGui.changeView("MainMenu");
      }
    };

    this.show();
  }
}

export default AuthorizationView;
