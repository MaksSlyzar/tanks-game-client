import GameView from "./GameView";
import LobbyView from "./LobbyView";
import MainMenuView from "./MainMenuView";
import SettingsView from "./SettingsView";
import { View } from "../modules/View";
import AuthorizationView from "./Authorization";

class MainGui {
  views: Array<View> = [];

  constructor() {
    this.appendView(new MainMenuView());
    this.appendView(new SettingsView());
    this.appendView(new GameView());
    this.appendView(new AuthorizationView());

    this.changeView("Authorization");
    // this.gameViewDebugMode();
  }

  gameViewDebugMode() {
    this.views.map((view) => {
      view.hide();

      if (view.name == "Game") view.show();
    });
  }

  appendView(view: View) {
    this.views.push(view);
  }

  changeView(viewName: string) {
    console.log(viewName);
    for (const view of this.views) {
      if (view.name != viewName) view.hide();
      else view.show();
    }
  }
}

export default new MainGui();
