import * as PIXI from 'pixi.js';

import System from 'systems/System';

import Position from 'components/Position';
import Display from 'components/Display';

import sceneManager from 'managers/SceneManager';
import gridManager from 'managers/GridManager';

// updates sprite position
export default class RenderSystem extends System {
	static get components() {
		return [Position, Display];
	}

    constructor() {
        super();
    }

    update(dt) {
        const { renderer, stage } = sceneManager;

        for (let i = 0, l = this.entities.length; i < l; i++) {
            const entity = this.entities[i];
            const { position, display, link } = entity.components;

            display.sprite.x = position.x;
            display.sprite.y = position.y;

            // Probes
            if (entity.probeSprites && entity.probeSprites.length) {
                let destroyed = 0;

                for (let j = 0, jl = entity.probeSprites.length; j < jl; j++) {
                    const sprite = entity.probeSprites[j];

                    sprite.scale.x += dt * 0.01;
                    sprite.scale.y += dt * 0.01;

                    if (sprite.scale.x > 1) {
                        destroyed += 1;
                        sprite.destroy();
                    }
                }

                if (destroyed) {
                    entity.probeSprites.splice(0, destroyed);
                }

                if (!entity.probeSprites.length) {
                    entity.resetAlpha();
                }
            }
        }

        renderer.render(stage);
    }

    addEntity(entity) {
        const { stage } = sceneManager;

    	if (super.addEntity(entity)) {
            const { display } = entity.components;

    		stage.addChild(display.sprite);
    	}
    }

    removeEntity(entity) {
        if (super.removeEntity(entity)) {
            // this.stage.removeChild(entity.sprite);
            entity.sprite.visible = false;
        }
    }
}
