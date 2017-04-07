import RepulsionSystem from 'systems/RepulsionSystem';
import AttractionSystem from 'systems/AttractionSystem';
import MovementSystem from 'systems/MovementSystem';
import RenderSystem from 'systems/RenderSystem';
import BlackHoleSystem from 'systems/BlackHoleSystem';

import Device from 'entities/Device';

class EntityManager {
    constructor() {
		this.entities = {};
        this.systems = [];
    }

    load() {
        // system ordering is important!
        this.systems = [
            new AttractionSystem(), // update acceleration for linked nodes
            new RepulsionSystem(), // update acceleration to repulse nodes
            new BlackHoleSystem(), // update acceleration to stay centered
            new MovementSystem(), // update position
            new RenderSystem(), // update image
        ];
    }

    // update all systems
    update(dt) {
    	for (let i = 0, l = this.systems.length; i < l; i++) {
    		const system = this.systems[i];
    		system.update(dt);
    	}
    }

    addEntity(entity) {
    	this.entities[entity.id] = entity;

    	// register to relevant systems
    	for (let i = 0, l = this.systems.length; i < l; i++) {
    		const system = this.systems[i];
    		system.addEntity(entity);
    	}
    }

    removeEntity(id) {
    	const entity = this.entities[id];

		if (!entity) {
			return console.error(`entity with id: ${id} does not exist`);
		}

    	// remove from relevant systems
    	for (let i = 0, l = this.systems.length; i < l; i++) {
    		const system = this.systems[i];

    		system.removeEntity(entity);
    	}

    	delete this.entities[id];
    }

    addComponent(entity, component) {
        entity.addComponent(component);

        const systems = this.systems.filter(system => {
            // not already added, and system requires this component
            return !entity.systems[system.constructor.name] && system.hasComponent(component.constructor.name);
        });

        // register to relevant systems
        for (let i = 0, l = systems.length; i < l; i++) {
            const system = systems[i];
            system.addEntity(entity);
        }
    }

    create_blob(data) {
        const blob = new Device(data);
        this.addEntity(blob);
        return blob;
    }
}

export default new EntityManager();

// TODO: update entity (add/remove more components, inform relevant systems)?
// TODO: object pooling