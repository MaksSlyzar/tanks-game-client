import MainGui from "./MainGui";
import MainMenuView from "./MainMenuView/MainMenuView";
import { View } from "../modules/View";
const settingsIcon = require("../assets/settings-icon.svg");
console.log(settingsIcon.default, "SETTINGS ICON")

class SettingsView extends View {
    constructor () {
        const elem = document.getElementById("Settings") as HTMLDivElement;
        super("Settings", elem);

        const button = document.getElementById("showSettingsButton") as HTMLButtonElement;
        const image = document.createElement("img");
        
        image.src = settingsIcon.default;
        image.width = 50;
        image.height = 50;
        
        button.appendChild(image);
        button.onclick = () => {
            MainGui.changeView("Settings");
        }
    }
}

export default SettingsView;