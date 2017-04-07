import * as PIXI from 'pixi.js';
import sceneManager from 'managers/SceneManager';
import gridManager from 'managers/GridManager';

import parrotFrames from 'lib/parrotFrames';

const selector = '.data';

class DataManager {
	constructor() {
		this.data = null;
		this.selected = null;
		this.frame = 0;
		this.dt = 0;
		this.frameThreshold = 20;
	}

	load() {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				this.data = this.data || document.body.querySelector(selector);

				if (!this.data) {
					reject();
				}

				sceneManager.container.addEventListener('click', this.onClick.bind(this));

				this.data.appendChild(parrotFrames[0]);

				resolve();
			}, 100);
		})
		.catch(() => {
			return this.load();
		});
	}

	// updates parrot for the lulz
	update(dt) {
		this.dt += dt;

		if (this.selected || this.dt < this.frameThreshold) {
			return;
		}

		this.dt = 0;
		this.frame += 1;

		if (this.frame >= parrotFrames.length) {
			this.frame -= parrotFrames.length;
		}

		this.data.innerHTML = '';
		const html = parrotFrames[this.frame];

		if (window.location.search === '?hype') {
			html.style.color = "#"+((1<<24)*Math.random()|0).toString(16);
		}

		return this.data.appendChild(html);
	}

	addData(html) {
		this.data.innerHTML = '';
		this.data.innerHTML = html;
	}

	prettyPrint(data, spaces) {
		const elem = this.data;

		elem.innerHTML = '';

		const title = document.createElement('div');
		title.innerHTML = 'Device Details';
		title.classList.add('data-title')
		elem.appendChild(title);

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

		if (this.selected) {
			this.selected.components.display.sprite.removeChild(this.sprite);
		}

		if (target) {
			this.selected = target;

			this.prettyPrint(target.data, 4)
			this.selected = target;

			if (!this.sprite) {
				this.sprite = new PIXI.Sprite(DataManager.selectedTexture);
				this.sprite.anchor.set(0.5, 0.5);
			}

			if (target.components.display) {
				target.components.display.sprite.addChild(this.sprite);
			}
		}
		else {
			this.selected = null;
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