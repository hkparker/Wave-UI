let _id = 0;

export default class Entity {
    constructor() {
        this.id = _id++;
        this.components = {};

        // SHOULD WE? keep track of what systems this entity belongs to?
        this.systems = {};
    }

    addComponent(component) {
        // let systems know?
        this.components[component.constructor.name] = component;
        return this;
    }

    removeComponent(name) {
        const component = this.components[name];

        if (component) {
            // let systems know?
            delete this.components[name];
        }
    }

    hasComponent(name) {
        return !!this.components[name];
    }
}