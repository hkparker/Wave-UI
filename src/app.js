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
        await logManager.addTypingLog('Initializing...', 25, 250);

        await sceneManager.load();
        await gridManager.load();

        await logManager.addTypingLog('Loading Systems...', 25, 50);
        await entityManager.load();

        await logManager.addTypingLog('Steaing your wifi...', 25, 250);
        await feedManager.load();
        await dataManager.load();
    }

    start() {
        gridManager.addGrid();

        this.lastTick = window.performance.now();
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        const now = window.performance.now();

        // In case we were tabbed out
        this.dt += Math.min(1, (now - this.lastTick) / 1000);

        while (this.dt >= this.step) {
            gridManager.update();
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
        // doStuff();
    })();
});

function doStuff() {
    const { width, height } = sceneManager;

    const mainBlob = entityManager.create_blob({
        pos_x: Math.random() * width,
        pos_y: Math.random() * height,
        mass: 5,
        color: '0xFF0000',
        size: 10,
    });

    entityManager.addComponent(mainBlob, new Link());

    for (let i = 0, l = 3; i < l; i++) {
        const blob = entityManager.create_blob({
            pos_x: Math.random() * width,
            pos_y: Math.random() * height,
            vel_x: Math.random(),
            vel_y: Math.random(),
            color: i % 2 === 0 ? '0x6699FF' : '0xFF9966'
        });

        entityManager.addComponent(blob, new Link());
        blob.components.link.addLink(mainBlob);

        mainBlob.components.link.addLink(blob);
    }
}