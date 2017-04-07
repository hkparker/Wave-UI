export default class System {
    constructor(components) {
        this.entities = [];
    }

    update() {
    	throw new Error('System must have update method!!!');
    }

    static get components() {
    	throw new Error('System must have components defined');
    }

    hasComponent(name) {
        return !!this.constructor.components.find(component => name);
    }

    addEntity(entity) {
        if (!entity) {
            throw new Error('no entity to add');
        }

    	const components = this.constructor.components;

    	// make sure entity has the required components
    	for (let i = 0, l = components.length; i < l; i++) {
    		if (!entity.hasComponent(components[i].name)) {
    			return;
    		}
    	}

        // MAYBE REMOVE THIS?
        entity.systems[this.constructor.name] = this;

    	this.entities.push(entity);
        return true;
    }

    // todo: faster than O(n)
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            return true;
        }
    }
}