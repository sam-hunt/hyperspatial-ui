import { vec4 } from 'gl-matrix';
import { AbstractEvent } from '../events/abstract-event';
import { EcsRegistry } from './ecs/ecs-registry';
import { SceneRenderer } from './scene-renderer';
import { AbstractScene } from './scenes/abstract-scene';
import { TestScene } from './scenes/test-scene';

export interface Simulation {
    run(canvasEl: HTMLCanvasElement, bgColor: vec4): Promise<void>;
    queueEvent(event: AbstractEvent): void;
    set eventCallback(cb: (event: AbstractEvent) => void);
    release(): void;
    isRunning: boolean;
}

export class SimulationImpl implements Simulation {
    private prevTimestamp = 0;
    private isInit = false;
    public registry = new EcsRegistry();
    public eventQueue: AbstractEvent[] = [];
    public sendEvent: (event: AbstractEvent) => void = () => {};
    public sceneRenderer: SceneRenderer | null = null;
    public currentScene: AbstractScene = new TestScene(this);

    public async run(canvasEl: HTMLCanvasElement, bgColor: vec4) {
        this.sceneRenderer = new SceneRenderer(this.registry, canvasEl, bgColor);
        
        this.currentScene.init();
        this.isInit = true;

        const frameRequestCallback = (currTimestamp: DOMHighResTimeStamp) => {
            currTimestamp *= 0.001;
            const deltaTime = currTimestamp - this.prevTimestamp;
            this.prevTimestamp = currTimestamp;
    
            this.currentScene.update(deltaTime);
            this.sceneRenderer!.drawScene(this.currentScene);
    
            requestAnimationFrame(frameRequestCallback);
        }

        requestAnimationFrame(frameRequestCallback);
    }

    public queueEvent(event: AbstractEvent) {
        this.eventQueue.push(event);
    }

    public set eventCallback(cb: (event: AbstractEvent) => void) {
        this.sendEvent = cb;
    }

    public release() {
        console.log('release')
        this.currentScene.destroy();
    }

    public get isRunning(): boolean {
        return this.isInit;
    }
}