import System from 'systems/System';

import Position from 'components/Position';
import Acceleration from 'components/Acceleration';
import Link from 'components/Link';

const ATTRACTION_CONSTANT = 0.001;

// updates acceleration of all entities using Hooke’s Law; F(m*a) = −kx, F = ma;
export default class AttractionSystem extends System {
	static get components() {
		return [Position, Acceleration, Link];
	}

    constructor() {
        super();
    }

    update(dt) {
        for (let i = 0, l = this.entities.length; i < l; i++) {
            const entity = this.entities[i];
            const { position, acceleration, link } = entity.components;

            for (let j = 0, jl = link.nodes.length; j < jl; j++) {
            	const { entity: target, strength, sprite } = link.nodes[j];
            	const { position: pos, acceleration: acc } = target.components;

                const distance = Math.max(position.distanceTo(pos.x, pos.y), 1);
                const force = ATTRACTION_CONSTANT * (strength - distance);

                const deltaX = position.x - pos.x;
                const deltaY = position.y - pos.y;

                // TODO, is this right? POSSIBLY DELETE
                if (sprite) {
                    sprite.rotation = Math.atan2(deltaY, deltaX);
                }

                const forceX = (deltaX / distance) * force;
                const forceY = (deltaY / distance) * force;

                acceleration.x += forceX / position.mass;
                acceleration.y += forceY / position.mass;

                // // Links are currently only 1-way, maybe change?
                // if (acc) {
                //     acc.x -= forceX / pos.mass;
                //     acc.y -= forceY / pos.mass;
                // }
            }
        }
    }
}