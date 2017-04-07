import * as PIXI from 'pixi.js';

import sceneManager from 'managers/SceneManager';

const SPRING_LENGTH = 64;

export default class Link {
	static get name() {
		return 'link';
	}

	constructor() {
		this.nodes = [];
	}

	addLink(entity, strength) {
		// don't link to self
		if (entity === this) {
			return;
		}

		const hasNode = this.nodes.find(node => { return node.entity === entity});
		if (hasNode) {
			return;
		}

		strength = strength || SPRING_LENGTH;

		const node = { entity, strength };
		node.sprite = new PIXI.Sprite(Link.linkTexture);
		node.sprite.alpha = 0.5;
		node.sprite.scale.y = 0.25;
		node.sprite.anchor.set(0, 0.5);

		const { stage } = sceneManager;

		// NO NO NO
		if (entity.components.display) {
			entity.components.display.sprite.addChild(node.sprite);
		}

		this.nodes.push(node);
	}

	// TODO: move all textures somewhere else
	static get linkTexture() {
		if (this._linkTexture) {
			return this._linkTexture;
		}

		const graphic = new PIXI.Graphics();

		graphic.lineStyle(4, 0xFFFFFF, 1);
		graphic.moveTo(0, 0);
		graphic.lineTo(32, 0);

		return this._linkTexture = sceneManager.renderer.generateTexture(graphic);
	}

	removeLink(entity) {
		const index = this.nodes.findIndex(node => {
			return node.entity === entity;
		});

		const node = this.nodes[index];
		if (node) {
			node.sprite.tint = 0xFF7722;
			node.sprite.alpha = 1;
			node.sprite.scale.y = 1;

			setTimeout(() => {
				node.sprite.destroy();

				const { link, display } = node.entity.components;

				if (link && !link.nodes.length) {
					node.entity.setAlpha(0.3);
				}
			}, 3000);

			this.nodes.splice(index, 1);
		}
	}
};