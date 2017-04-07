export default class Acceleration {
	static get name() {
		return 'acceleration';
	}

	constructor(data) {
		this.x = data.x;
		this.y = data.y;
	}
};