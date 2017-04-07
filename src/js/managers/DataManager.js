import * as PIXI from 'pixi.js';
import sceneManager from 'managers/SceneManager';
import gridManager from 'managers/GridManager';

const selector = '.data';

class DataManager {
	constructor() {
		this.data = null;
		this.selectedEntity = null;
	}

	load() {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				this.data = this.data || document.body.querySelector(selector);

				if (!this.data) {
					reject();
				}

				sceneManager.container.addEventListener('click', this.onClick.bind(this));

				resolve();
			}, 100);
		})
		.catch(() => {
			return this.load();
		});
	}

	addData(html) {
		this.data.innerHTML = html;
	}

	prettyPrint(data, spaces) {
		const elem = this.data;
		elem.innerHTML = '';

		function print(depth, string) {
			const row = document.createElement('div');
			row.innerHTML = ' '.repeat(spaces * depth) + string + '\n';

			elem.appendChild(row);
		}

		function helper(obj, depth, prefix, suffix, print) {
			if (typeof(obj) === 'string') {
				print(depth, prefix + '"' + obj + '"' + suffix);
			}
			else if (typeof(obj) === 'number') {
				print(depth, prefix + obj + suffix);
			}
			else if (Array.isArray(obj)) {
				print(depth, prefix + '[');
				for (var i = 0, l = obj.length; i < l; i++) {
					helper(obj[i], depth + 1, '', i < l - 1 ? ',' : '', print);
				}
				print(depth, ']' + suffix);
			}
			else if (typeof(obj) === 'object') {
				print(depth, prefix + '{');
				var l = Object.keys(obj).length;

				for (var key in obj) {
					helper(obj[key], depth + 1, key + ': ', l-- > 1 ? ',' : '', print);
				}
				print(depth, '}' + suffix);
			}
		}

		helper(data, 0, '', '', print);
	}

	onClick(event) {
		let { clientX: x, clientY: y } = event;

		const targets = gridManager.getTargets(x, y, 1);

		// find the closest to the click spot
		let minDistance = null;
		let target = null;

		for (let i = 0, l = targets.length; i < l; i++) {
			const { position } = targets[i].components;
			const distance = position.distanceTo(x, y);

			if (!target || distance < minDistance) {
				target = targets[i];
				minDistance = distance;
			}
		}

		if (this.selectedEntity) {
			this.selectedEntity.components.display.sprite.removeChild(this.sprite);
		}

		if (target) {
			this.prettyPrint(target.data, 4)
			this.selectedEntity = target;

			if (!this.sprite) {
				this.sprite = new PIXI.Sprite(DataManager.selectedTexture);
				this.sprite.anchor.set(0.5, 0.5);
			}

			if (target.components.display) {
				target.components.display.sprite.addChild(this.sprite);
			}
		}
		else {
			this.addData('');
		}
	}

	// TODO: move all textures somewhere else
	static get selectedTexture() {
		if (this._selectedTexture) {
			return this._selectedTexture;
		}

		const graphic = new PIXI.Graphics();

		graphic.lineStyle(2, 0x77FF11);
		graphic.drawRect(0, 0, 25, 25);
		graphic.endFill();

		return this._selectedTexture = sceneManager.renderer.generateTexture(graphic);
	}
}

export default new DataManager();