export class View {
    name: string;
    mainDiv: HTMLDivElement;
    private visibility: boolean;

    constructor (name: string, elem: HTMLDivElement) {
        this.name = name;
        this.visibility = false;
        this.mainDiv = elem;

        this.hide();
    }

    hide () {
        this.mainDiv.classList.add("hidden");
    }

    show () {
        this.mainDiv.classList.remove("hidden");
    }

    getVisibility () {
        return this.visibility;
    }

    update () {
        
    }
}