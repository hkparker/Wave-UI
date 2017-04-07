import Socket from 'lib/Socket';

import entityManager from 'managers/EntityManager';
import sceneManager from 'managers/SceneManager';
import logManager from 'managers/LogManager';

import Link from 'components/Link';

import Device from 'entities/Device';

class FeedManager {
	constructor() {
		this.socket = null;
		this.loadStep = null;
		this.isProcessing = false;
		this.processDelay = 50;
		this.queue = [];

		// TODO: Maybe move somewhere else
		this.devices = {};

		window.devices = this.devices;
	}

	load() {
		this.socket = new Socket('ws://hkparker.com:8080/streams/visualizer');
		this.socket.on('msg', this.processMessage.bind(this));
	}

	processMessage(msg) {
		if (this.isProcessing) {
			return this.queue.push(msg);
		}

		msg = msg || this.queue.shift();

		this.isProcessing = true;

		setTimeout(async () => {
			switch(msg.type) {
			case 'NewDevice':
				if (this.loadStep !== 'CacheCleared' && this.loadStep !== 'NewDevice') {
					await logManager.addTypingLog('Scanning for devices...', 20, 500);
					this.loadStep = msg.type;
				}

				this.handleNewDevice(msg);
				break;
			case 'UpdateAccessPoint':
				if (this.loadStep !== 'CacheCleared' && this.loadStep !== 'UpdateAccessPoint') {
					await logManager.addTypingLog('Verifying Access Points...', 20, 500);
					this.loadStep = msg.type;
				}

				this.updateAccessPoint(msg);
				break;
			case 'NewAssociation':
				if (this.loadStep !== 'CacheCleared' && this.loadStep !== 'NewAssociation') {
					await logManager.addTypingLog('Linking Devices...', 20, 500);
					this.loadStep = msg.type;
				}

				this.newAssociation(msg);
				break;
			case 'CacheCleared':
				await logManager.addTypingLog('Collecting...', 20, 500);
				this.loadStep = msg.type;
				break;
			// Real time events only
			case 'ProbeRequest':
				this.probeRequest(msg);
				break;
			case 'NullProbeRequest':
				this.nullProbeRequest(msg);
				break;
			case 'AnimateDeauth':
				this.animateDeauth(msg);
				break;
			default:
				console.log(`No event for type: ${msg.type}`);
			}

			this.isProcessing = false;

			if (this.queue.length) {
				this.processMessage();
			}
		}, this.queue.length > 50 ? 0 : this.processDelay)
	}

	handleNewDevice(msg) {
		const { width, height } = sceneManager;

		if (this.devices[msg.MAC]) {
			console.log('WE ALREADY HAVE THIS DEVICE:', msg.MAC);
		}

		const device = new Device({
			pos_x: Math.random() * width,
			pos_y: Math.random() * height,
			vel_x: Math.random() > 0.5 ? Math.random() : -Math.random(),
			vel_y: Math.random() > 0.5 ? Math.random() : -Math.random(),
		});

		device.data = msg;

		this.devices[msg.MAC] = device;
		entityManager.addEntity(device);

		// start with opacity
		device.components.display.sprite.alpha = 0.3;

		logManager.addLog(`New Device: ${msg.MAC}`);
	}

	updateAccessPoint(msg) {
		const { MAC } = msg;
		const entity = this.devices[MAC];

		if (!entity) {
			return console.log('WE DIDNT HAVE THIS DEVICE!!!');
		}

		logManager.addLog(`Access Point: ${MAC}`);

		entity.updateAccessPoint(msg);
	}

	newAssociation(msg) {
		const { MAC1, MAC2 } = msg;

		const entity1 = this.devices[MAC1];
		const entity2 = this.devices[MAC2];

		if (MAC1 === MAC2) {
			return console.log('SAME MAC');
		}

		if (!entity1 || !entity2) {
			console.log('Association couldnt be made', MAC1, MAC2);
		}
		else {
			let link = entity1.components.link;
			if (!link) {
				link = new Link();
				entityManager.addComponent(entity1, link);
			}

			let link2 = entity2.components.link;
			if (!link2) {
				link2 = new Link();
				entityManager.addComponent(entity2, link2);
			}

			link.addLink(entity2);
			link2.addLink(entity1);

			// only show now
			entity1.components.display.sprite.alpha = 1;
			entity2.components.display.sprite.alpha = 1;

			if (entity1.data.isAP) {
				entity1.components.display.sprite.tint = 0xFF0000;
			}
			if (entity2.data.isAP) {
				entity2.components.display.sprite.tint = 0xFF0000;
			}

			logManager.addLog(`Association: ${MAC1} to ${MAC2}`);
		}
	}

	probeRequest(msg) {
		const { MAC } = msg;
		const entity = this.devices[MAC];

		if (!entity) {
			return console.log('DEVICE DOESNT EXIST');
		}

		//entity.ProbedFor = entity.ProbedFor + msg.SSID

		logManager.addLog(`Probing: ${MAC}`);
		entity.probeRequest(msg);
	}

	nullProbeRequest(msg) {
		const { MAC } = msg;
		const entity = this.devices[MAC];

		if (!entity) {
			return console.log('DEVICE DOESNT EXIST');
		}

		logManager.addLog(`Probing: ${MAC}`);
		entity.nullProbeRequest(msg);
	}

	animateDeauth(msg) {
		const { Source: source, Target: target } = msg;

		const entitySource = this.devices[source];
		const entityTarget = this.devices[target];

		if (!entitySource) {
			return console.log('WE DONT HAVE THE SOURCE DEVICE', source, msg);
		}

		if (!entityTarget) {
			if (target == "ff:ff:ff:ff:ff:ff") {
				entitySource.broadcastDeauth();
				return
			} else {
				return console.log('WE DONT HAVE THE TARGET DEVICE', target, msg);
			}
		}

		let link = entitySource.components.link;
		if (!link) {
			link = new Link();
			entityManager.addComponent(entitySource, link);
		}

		let link2 = entityTarget.components.link;
		if (!link2) {
			link2 = new Link();
			entityManager.addComponent(entityTarget, link2);
		}

		link.addLink(entityTarget);
		link2.addLink(entitySource);

		logManager.addLog(`Deauth: ${source} to ${target}`);

		// might break something
		setTimeout(() => {
			link.removeLink(entityTarget);
			link2.removeLink(entitySource);
		}, 100);
	}
}

export default new FeedManager();
