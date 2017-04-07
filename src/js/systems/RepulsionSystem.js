import System from 'systems/System';

import gridManager from 'managers/GridManager';

import Position from 'components/Position';
import Acceleration from 'components/Acceleration';

// remove this yo
import Display from 'components/Display';

const REPULSION_CONSTANT = 0.5;
const MAX_REPULSION = 0.001;
const RELPUSION_SPREAD = 2;

// updates velocity of all entities using Coulomb’s Law; F = k(Q1Q2/r2), F = ma;
export default class ReplusionSystem extends System {
	static get components() {
		return [Position, Acceleration, Display];
	}

    constructor() {
        super();
    }

    update(dt) {
        for (let i = 0, l = this.entities.length; i < l; i++) {
            const entity = this.entities[i];
            const { position, acceleration } = entity.components;
            const targets = gridManager.getTargets(position.x, position.y, RELPUSION_SPREAD);

            for (let j = 0; j < targets.length; j++) {
                const target = targets[j];
                const { position: pos } = target.components;

                // same node
                if (entity === target) {
                    continue;
                }

                const distance = Math.max(position.distanceTo(pos.x, pos.y), 1);
                const force = Math.min(MAX_REPULSION, (REPULSION_CONSTANT / (distance * distance)));

                const deltaX = position.x - pos.x;
                const deltaY = position.y - pos.y;

                const forceX = (deltaX / distance) * force;
                const forceY = (deltaY / distance) * force;

                acceleration.x += forceX / position.mass;
                acceleration.y += forceY / position.mass;
            }
        }
    }
}