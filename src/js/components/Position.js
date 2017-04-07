// This might use up WAY too much memory
// const _distanceCache = {};

export default class Position {
	static get name() {
		return 'position';
	}

	constructor(data) {
		this.x = data.x;
		this.y = data.y;
		this.size = data.size || 1;
		this.mass = data.mass || 1;

		// not sure this is even worth it, we'll see
		this._distanceCache = {};
	}

	distanceTo(x, y) {
		// const cache_key = `x:${Math.floor(this.x)},y:${Math.floor(this.y)}-x:${Math.floor(x)},y:${Math.floor(y)}`;

		// if (_distanceCache[cache_key]) {
		// 	return _distanceCache[cache_key];
		// }

		const deltaX = this.x - x;
		const deltaY = this.y - y;

		// return _distanceCache[cache_key] = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}
};