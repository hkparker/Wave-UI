export default class Velocity {
	static get name() {
		return 'velocity';
	}

	constructor(data) {
		this.x = data.x;
		this.y = data.y;
	}
};