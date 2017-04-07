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

            if (display.probeSprite) {
                display.probeSprite.scale.x += dt * 0.01;
                display.probeSprite.scale.y += dt * 0.01;

                if (display.probeSprite.scale.x > 1) {
                    display.probeSprite.destroy();
                    display.probeSprite = null;
                }
            }


            // if (link) {
            //     for (let j = 0, jl = link.nodes.length; j < jl; j++) {
            //         const { entity: target, strength, sprite } = link.nodes[j];
            //         const { position: pos } = target.components;

            //         const deltaX = position.x - pos.x;
            //         const deltaY = position.y - pos.y;

            //         if (sprite) {
            //             sprite.rotation = Math.atan2(deltaY - 0.5, deltaX - 0.5);
            //         }
            //     }
            // }
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
