import * as PIXI from 'pixi.js';

import Entity from 'entities/Entity';

import Position from 'components/Position';
import Velocity from 'components/Velocity';
import Acceleration from 'components/Acceleration';
import Display from 'components/Display';

import sceneManager from 'managers/SceneManager';

export default class Device extends Entity {
	constructor(data) {
		super();

		if (!data) {
			data = {};
		}

		this.probeSprites = [];

		const position = new Position({
			x: data.pos_x || 0,
			y: data.pos_y || 0,
			size: data.size || 4,
			mass: data.mass || 1,
		});

		const velocity = new Velocity({
			x: data.vel_x || 0,
			y: data.vel_y || 0,
		});

		const acceleration = new Acceleration({
			x: data.acc_x || 0,
			y: data.acc_y || 0,
		});

		const sprite = new PIXI.Sprite(Device.deviceTexture);
		sprite.anchor.set(0.5, 0.5);
		const display = new Display({ sprite });

		this.addComponent(position)
			.addComponent(display)
			.addComponent(acceleration)
			.addComponent(velocity)
	}

	// TODO: move all textures somewhere else
	static get deviceTexture() {
		if (this._deviceTexture) {
			return this._deviceTexture;
		}

		const graphic = new PIXI.Graphics();

		graphic.beginFill(0xFFFFFF);
		graphic.drawCircle(0, 0, 4);
		graphic.endFill();

		return this._deviceTexture = sceneManager.renderer.generateTexture(graphic);
	}

	updateAccessPoint(msg) {
		const { position, display } = this.components;

		position.size = 8;
		position.mass = 2;

		this.data.isAP = true;

		if (!display.sprite) {
			return console.log('DEVICE SPRITE NOT ADDED YET');
		}

		display.sprite.texture = Device.accessPointTexture;
		display.sprite.tint = 0x8833DD;
		display.sprite.alpha = 1;

		// We want to add a child sprite above with text
		const style = new PIXI.TextStyle({
			fontFamily: 'monospace',
			fontSize: 12,
			fill: '#ffffff',
		});
		const text = new PIXI.Text(msg.SSID, style);
		text.anchor.set(0.5, 0.5);
		text.position.set(0, 10);
		display.sprite.addChild(text);
	}

	// TODO: move all textures somewhere else
	static get accessPointTexture() {
		if (this._accessPointTexture) {
			return this._accessPointTexture;
		}

		const graphic = new PIXI.Graphics();

		graphic.beginFill(0xFFFFFF);
		graphic.drawCircle(0, 0, 8);
		graphic.endFill();

		return this._accessPointTexture = sceneManager.renderer.generateTexture(graphic);
	}

	probeRequest(msg) {
		const { display } = this.components;

		if (!display.sprite) {
			return console.log('DEVICE SPRITE NOT ADDED YET');
		}

		display.sprite.alpha = 1
		const probeSprite = new PIXI.Sprite(Device.probeTexture);

		this.probeSprites.push(probeSprite);

		probeSprite.tint = 0x88F3F3;
		probeSprite.scale.x = 0.1;
		probeSprite.scale.y = 0.1;
		probeSprite.anchor.set(0.5, 0.5);

		display.sprite.addChildAt(probeSprite);
	}

	// TODO: move all textures somewhere else
	static get probeTexture() {
		if (this._probeTexture) {
			return this._probeTexture;
		}

		const graphic = new PIXI.Graphics();

		graphic.lineStyle(2, 0xFFFFFF);
		graphic.drawCircle(0, 0, 30);
		graphic.endFill();

		return this._probeTexture = sceneManager.renderer.generateTexture(graphic);
	}

	nullProbeRequest(msg) {
		const { display } = this.components;

		if (!display.sprite) {
			return console.log('DEVICE SPRITE NOT ADDED YET');
		}

		display.sprite.alpha = 1
		const probeSprite = new PIXI.Sprite(Device.probeTexture);

		this.probeSprites.push(probeSprite);

		probeSprite.tint = 0xFFB413;
		probeSprite.scale.x = 0.1;
		probeSprite.scale.y = 0.1;
		probeSprite.anchor.set(0.5, 0.5);

		display.sprite.addChildAt(probeSprite);
	}

	broadcastDeauth(msg) {
		const { display } = this.components;

		if (!display.sprite) {
			return console.log('DEVICE SPRITE NOT ADDED YET');
		}

		display.sprite.alpha = 1
		const probeSprite = new PIXI.Sprite(Device.probeTexture);

		this.probeSprites.push(probeSprite);

		probeSprite.tint = 0xff3000;
		probeSprite.scale.x = 0.1;
		probeSprite.scale.y = 0.1;
		probeSprite.anchor.set(0.5, 0.5);

		display.sprite.addChildAt(probeSprite);
	}

	setAlpha(alpha) {
		this.components.display.sprite.alpha = alpha;
		this._alpha = alpha;
	}

	resetAlpha() {
		this.components.display.sprite.alpha = this._alpha
	}
}
