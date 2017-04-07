const logSelector = '.logs';
const logo = [
	'',
	' _       __',
	'| |     / /___ __   _____',
	'| | /| / / __ `/ | / / _ \\',
	'| |/ |/ / /_/ /| |/ /  __/',
	'|__/|__/\\__,_/ |___/\\___/',
	'',
];

class LogManager {
	constructor() {
		this.logs = null;
		this.maxLogs = 250;

		setInterval(() => {
			const logs = this.logs;

			if (!logs) {
				return;
			}

			if (logs.childElementCount > this.maxLogs) {
				const children = logs.children;

				for (let i = 0, l = children.length - 100; i < l; i++) {
					logs.removeChild(logs.firstChild);
				}
			}
		}, 5000);
	}

	load() {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				this.logs = this.logs || document.body.querySelector(logSelector);
				this.blinker = document.body.querySelector('.blink');

				if (!this.logs) {
					reject();
				}

				await this.addLogo();
				resolve();
			}, 100);
		})
		.catch(() => {
			return this.load();
		});
	}

	addLog(string, delay) {
		return new Promise((resolve, reject) => {
			const log = document.createElement('div');
			log.innerHTML = string + '\n';

			this.logs.appendChild(log);

			// this might kill performance
			this.logs.scrollTop = this.logs.scrollHeight;

			setTimeout(() => {
				resolve();
			}, delay || 0);
		});
	}

	addTypingLog(string, typeDelay, delay) {
		return new Promise((resolve, reject) => {
			const log = document.createElement('div');
			this.logs.appendChild(log);

			// this might kill performance
			this.logs.scrollTop = this.logs.scrollHeight;

			(async function() {
				let temp = '';

				for (let i = 0, l = string.length; i < l; i++) {
					temp += string[i];
					log.innerHTML = temp;

					await new Promise((resolve) => {
						let tempDelay = Math.random() * (typeDelay || 5);
						setTimeout(() => {
							resolve();
						}, tempDelay);
					});
				}

				setTimeout(() => {
					resolve();
				}, delay || 0);
			})();
		});
	}

	addLogo() {
		return new Promise(async (resolve, reject) => {
			for (let i = 0, l = logo.length; i < l; i++) {
				await this.addLog(logo[i], 50);
			}

			resolve();
		});
	}
}

export default new LogManager();