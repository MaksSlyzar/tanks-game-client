import "./styles/main.scss";
import MainGui from "./gui/MainGui";
import SIOManager from "./managers/SIOManager";
import Game from "./Game";
import AssetsManager from "./managers/AssetsManager";

AssetsManager.loadImages();

SIOManager.run();

window.onload = () => {
    console.log(MainGui);
    const game = new Game();
};
