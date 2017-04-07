import System from 'systems/System';

import Position from 'components/Position';
import Acceleration from 'components/Acceleration';

import sceneManager from 'managers/SceneManager';

const ATTRACTION_CONSTANT = 0.0001;

// updates acceleration of all entities towards the center of the screen
export default class BlackHoleSystem extends System {
	static get components() {
		return [Position, Acceleration];
	}

    constructor() {
        super();
    }

    update(dt) {
        const { width, height } = sceneManager;
        const midX = width / 2;
        const midY = height / 2;

        for (let i = 0, l = this.entities.length; i < l; i++) {
            const entity = this.entities[i];
            const { position, acceleration } = entity.components;

            const deltaX = midX - position.x;
            const deltaY = midY - position.y;

            const force = ATTRACTION_CONSTANT;
            const distance = position.distanceTo(midX, midY);

            const forceX = deltaX / distance * force;
            const forceY = deltaY / distance * force;

            acceleration.x += forceX / position.mass;
            acceleration.y += forceY / position.mass;
        }
    }
}