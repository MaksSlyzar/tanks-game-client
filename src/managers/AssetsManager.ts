// import stoneOre from "./../assets/stone_ore.png";
// import base from "./../assets/base.png"
// console

interface Sprite {
    [key: string]: {
        image: CanvasImageSource;
        _type: string;
    };
}

class AssetsManager {
    sprites: Sprite = {};
    loaded = false;

    constructor() {}

    loadImages() {
        const spriteNames = [
            {
                src: "heavy-tank-body.png",
                name: "tank-body",
                loaded: false,
            },
            {
                src: "heavy-tank-weapon.png",
                name: "tank-weapon",
                loaded: false,
            },
            {
                src: "box.png",
                name: "box",
                loaded: false,
            },
            {
                src: "grass-sheet.png",
                name: "grass-sheet",
                loaded: false,
            },
            {
                src: "engineer.png",
                name: "engineer",
                loaded: false,
            },
            {
                src: "base-build.png",
                name: "base-build",
                loaded: false,
            },
            {
                src: "projectile.png",
                name: "projectile",
                loaded: false,
            },
        ].map((spriteName) => {
            return { ...spriteName, loaded: false };
        });

        spriteNames.forEach((sprite) => {
            try {
                const image = new Image();
                image.src = require("./../assets/" + sprite.src).default;

                image.onload = () => {
                    this.sprites[sprite.name] = {
                        image: image,
                        _type: "image",
                    };

                    sprite.loaded = true;

                    let allLoaded = true;

                    spriteNames.forEach((_sprite) => {
                        if (_sprite.loaded == false) allLoaded = false;
                    });

                    if (allLoaded) this.allSpriteLoaded();
                };
            } catch (error) {
                console.log("Sprite loading problem", sprite);
                console.log(error);
            }
        });
    }

    allSpriteLoaded() {
        this.loaded = true;
        console.log("All sprites loaded!");
    }
}

export default new AssetsManager();
