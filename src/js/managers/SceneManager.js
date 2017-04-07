import * as PIXI from 'pixi.js';
import EventEmitter from 'events';

const containerSelector = '.canvas-container';

// Handles window sizing
class SceneManager extends EventEmitter {
	constructor() {
		super();
		this.width = 0;
		this.height = 0;
		this.container = null;
		this.renderer = null;
		this.stage = null;

		window.addEventListener('resize', async () => {
			await this.load();

			if (this.renderer) {
				this.renderer.resize(this.width, this.height);
			}

			this.emit('resize');
		});
	}

	load() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.container = this.container || document.body.querySelector(containerSelector);

				if (!this.container) {
					reject();
				}

				if (this.container.firstChild) {
					this.container.firstChild.style.display = 'none';

					this.width = this.container.clientWidth;
					this.height = this.container.clientHeight;

					this.container.firstChild.style.display = 'block';
				}
				else {
					this.width = this.container.clientWidth;
					this.height = this.container.clientHeight;
				}

				if (!this.width || !this.height) {
					reject();
				}

				// first load
				if (!this.renderer) {
					this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
					this.container.appendChild(this.renderer.view);
					this.stage = new PIXI.Container();
				}

				resolve();
			}, 100);
		})
		.catch(() => {
			return this.load();
		});
	}
}

export default new SceneManager();