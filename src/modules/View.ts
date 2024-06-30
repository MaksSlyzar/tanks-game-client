export class View {
    name: string;
    mainDiv: HTMLDivElement;
    flexVisibility: boolean;
    private visibility: boolean;

    constructor(name: string, elem: HTMLDivElement) {
        this.name = name;
        this.visibility = false;
        this.mainDiv = elem;
        this.hide();
        this.flexVisibility = true;
    }
    hide() {
        this.mainDiv.classList.add("hidden");
    }

    show() {
        this.mainDiv.classList.remove("hidden");
    }

    onShow() {}

    getVisibility() {
        return this.visibility;
    }
    update() {}
}
