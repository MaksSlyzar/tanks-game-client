import {getElementById, getElementByClass} from "./MainGui";
import { View } from "../modules/View";

class OpenFullScreen extends View {
  constructor () {
    const elem = getElementByClass<HTMLDivElement>("OpenFullScreenButton");
    super("OpenFullScreen", elem);
    this.flexVisibility = false;
    const button = getElementById<HTMLButtonElement>("OpenFullScreenButton");
    this.show();

    button.onclick = () => {
      const game = getElementById<HTMLDivElement>("game");

      game.requestFullscreen()
    }
  }
}

export default OpenFullScreen;
