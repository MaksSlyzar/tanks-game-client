import GameView from "./GameView";
import MainMenuView from "./MainMenuView/MainMenuView";
import SettingsView from "./SettingsView";
import { View } from "../modules/View";
import AuthorizationView from "./Authorization";
import CreateGameView from "./MainMenuView/CreateGameView";
import RoomView from "./RoomView";

class MainGui {
  views: Array<View> = [];

  constructor() {
    this.appendView(new MainMenuView());
    this.appendView(new SettingsView());
    this.appendView(new GameView());
    this.appendView(new AuthorizationView());
    this.appendView(new RoomView());

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
    for (const view of this.views) {
      if (view.name != viewName) view.hide();
      else view.show();
    }
  }
}

export default new MainGui();
