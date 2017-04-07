import * as PIXI from 'pixi.js';

import sceneManager from 'managers/SceneManager';
import entityManager from 'managers/EntityManager';

// Handles grid management
class GridManager {
	constructor() {
		this.cells = [];
		this.cellSize = 25;
		this.columns = 0;
		this.rows = 0;

		this._debug = false;

		this.sprites = {};

		sceneManager.on('resize', () => {
			if (this._debug) {
				this.reset();
				this.addGrid();
			}
		})
	}

	load() {
		this.reset();

		// remove eventually?
		const graphic = new PIXI.Graphics();

		graphic.lineStyle(1, 0xFF3300, 1);
		graphic.beginFill(0x000000);
		graphic.drawRect(0, 0, this.cellSize, this.cellSize);
		graphic.endFill();

		this.cellTexture = sceneManager.renderer.generateTexture(graphic);

		this.hoverSprite = null;
		sceneManager.container.addEventListener('mousemove', event => {
			let { clientX: x, clientY: y } = event;

			x = Math.floor(x / this.cellSize);
			y = Math.floor(y / this.cellSize);

			if (this.hoverSprite) {
				this.hoverSprite.alpha = 0.15;
			}

			this.hoverSprite = this.sprites[`x:${x},y:${y}`];

			if (this.hoverSprite) {
				this.hoverSprite.alpha = 1;
			}
		});
	}

	// todo: could this be better as a system instead???
	update() {
		// empty grid
		this.reset();

		// add entities to grid
		const { entities } = entityManager;
		const keys = Object.keys(entities);

		// optimize by having EntityManager add/remove objects with Pos?
		for (let i = 0; i < keys.length; i++) {
			const entity = entities[keys[i]];
			const { position } = entity.components;

			if (!position) {
				continue;
			}

			const x = Math.floor(position.x / this.cellSize);
			const y = Math.floor(position.y / this.cellSize);

			// entity is off screen
			if (!this.cells[x]) {
				continue;
			}

			if (!this.cells[x][y]) {
				this.cells[x][y] = [];
			}

			this.cells[x][y].push(entity);
		}
	}

	reset() {
		const { width, height } = sceneManager;

		this.rows = Math.ceil(height / this.cellSize);
		this.columns = Math.ceil(width / this.cellSize);

		for (let i = 0; i < this.columns; i++) {
			this.cells[i] = [];
		}

		// TODO: this needs to be implemented for resize
		if (this.cells.length > this.columns) {

		}
	}

	getTargets(x, y, spread) {
		const column = Math.floor(x / this.cellSize);
		const row = Math.floor(y / this.cellSize);

		if (!spread) {
			spread = 0;
		}

		let targets = [];

		for (let i = -spread, l = spread + 1; i < l; i++) {
			for (let j = -spread, jl = spread + 1; j < jl; j++) {
				const _col = column + i;
				const _row = row + j;

				// only inside screen
				if (_col < 0 || _row < 0 || _col >= this.columns || _row >= this.rows) {
					continue;
				}

				try {
					const entities = this.cells[_col][_row];

					if (entities) {
						targets = targets.concat(entities);
					}
				}
				catch (e) {
					console.log('BUT HOW?!?')
				}
			}
		}

		return targets;
	}

	// debugging!
	addGrid() {
		const { renderer, stage } = sceneManager;

		this._debug = true;

		for (let i = 0, l = this.columns; i < l; i++) {
			for (let j = 0, jl = this.rows; j < jl; j++) {
				if (this.sprites[`x:${i},y:${j}`]) {
					// already exists
					continue;
				}

				const cell = new PIXI.Sprite(this.cellTexture);

				cell.alpha = 0.15;
				cell.x = i * this.cellSize;
				cell.y = j * this.cellSize;

				stage.addChildAt(cell, 0);

				this.sprites[`x:${i},y:${j}`] = cell;
			}
		}
	}
}

export default new GridManager();