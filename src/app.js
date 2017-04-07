import styles from './styles/main.scss';

import entityManager from 'managers/EntityManager';
import logManager from 'managers/LogManager';
import sceneManager from 'managers/SceneManager';
import gridManager from 'managers/GridManager';
import feedManager from 'managers/FeedManager';
import dataManager from 'managers/DataManager';

import Link from 'components/Link';

class Engine {
    constructor() {
        this.dt = 0;
        this.lastTick = 0;
        this.step = 1 / 5;
        this.animationFrame = null;
    }

    async load() {
        await logManager.load();
        await logManager.addTypingLog('Initializing...', 25, 500);

        await sceneManager.load();
        await gridManager.load();
        await entityManager.load();

        await logManager.addTypingLog('Fetching parrot...', 25, 500);
        await dataManager.load();

        await logManager.addTypingLog('Steaing your wifi...', 25, 1000);

        await feedManager.load();

        gridManager.addGrid();
    }

    start() {
        this.lastTick = window.performance.now();
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        const now = window.performance.now();

        // In case we were tabbed out
        this.dt += Math.min(1, (now - this.lastTick) / 1000);

        while (this.dt >= this.step) {
            gridManager.update();
            dataManager.update(this.dt);
            entityManager.update(this.dt);

            this.dt -= this.step;
        }

        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    (async function load() {
        const engine = new Engine();
        await engine.load();

        engine.start();
    })();
});
