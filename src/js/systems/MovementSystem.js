import System from 'systems/System';

import Position from 'components/Position';
import Velocity from 'components/Velocity';

import sceneManager from 'managers/SceneManager';

const FRICTION_CONSTANT = 0.999;
// max speed ;)
const SPEED_OF_LIGHT = 1;

// updates position given a velocity and/or acceleration
export default class MovementSystem extends System {
	static get components() {
		return [Position, Velocity];
	}

    constructor() {
        super();
    }

    update(dt) {
        const { width, height } = sceneManager;

        for (let i = 0, l = this.entities.length; i < l; i++) {
            const entity = this.entities[i];
            const { position, velocity, acceleration } = entity.components;

            // accelerate
            if (acceleration) {
                velocity.x += acceleration.x * dt;
                velocity.y += acceleration.y * dt;

                acceleration.x = 0;
                acceleration.y = 0;

                // friction
                velocity.x = velocity.x * FRICTION_CONSTANT;
                velocity.y = velocity.y * FRICTION_CONSTANT;
            }

            // max speed
            if (velocity.x * velocity.x + velocity.y * velocity.y > SPEED_OF_LIGHT * SPEED_OF_LIGHT) {
                const angle = Math.atan2(velocity.y, velocity.x);

                velocity.x = Math.cos(angle) * SPEED_OF_LIGHT;
                velocity.y = Math.sin(angle) * SPEED_OF_LIGHT;
            }

            position.x += velocity.x * dt;
            position.y += velocity.y * dt;
        }
    }
}
