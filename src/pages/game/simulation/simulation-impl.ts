import EventEmitter from 'events';
import { vec4 } from 'gl-matrix';
import { AbstractEvent } from '../events/abstract-event';
import { CanvasIO } from './canvas-io';
import { EcsRegistry } from './ecs/ecs-registry';
import { SceneRenderer } from './renderer/scene-renderer';
import { Scene } from './scenes/scene';
import { TestScene } from './scenes/test-scene';
import { Simulation } from './simulation.interface';
import { SimulationInternals } from './simulation-internals.interface';

export class SimulationImpl implements Simulation, SimulationInternals {
    private prevTimestamp = 0;
    private isInit = false;
    public registry = new EcsRegistry();
    public sceneRenderer: SceneRenderer | null = null;
    public currentScene: Scene = new TestScene(this);
    public canvasIo: CanvasIO | null = null;
    public gameEvents: EventEmitter = new EventEmitter();
    public sendEvent: (event: AbstractEvent) => void = () => {};

    public async run(canvasEl: HTMLCanvasElement, bgColor: vec4) {
        this.sceneRenderer = new SceneRenderer(this.registry, canvasEl);
        this.sceneRenderer.setClearColor(bgColor);
        this.canvasIo = new CanvasIO(canvasEl);

        this.currentScene.init();
        this.isInit = true;

        const frameRequestCallback = (currTimestampMs: DOMHighResTimeStamp) => {
            const currTimestamp = currTimestampMs * 0.001;
            const deltaTime = currTimestamp - this.prevTimestamp;
            this.prevTimestamp = currTimestamp;

            this.currentScene.update(deltaTime);
            this.sceneRenderer!.drawScene(this.currentScene);

            requestAnimationFrame(frameRequestCallback);
        };
        requestAnimationFrame(frameRequestCallback);
    }

    public queueEvent(event: AbstractEvent) { this.gameEvents.emit(event.event, event); }
    public set eventCallback(cb: (event: AbstractEvent) => void) { this.sendEvent = cb; }

    public release() {
        this.currentScene.destroy();
    }

    public get isRunning(): boolean {
        return this.isInit;
    }
}
