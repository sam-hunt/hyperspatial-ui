import type { vec4 } from 'gl-matrix';
import type { AbstractEvent } from 'types/events';

export interface Simulation {
    run(canvasEl: HTMLCanvasElement, bgColor: vec4): Promise<void>;
    queueEvent(event: AbstractEvent): void;
    set eventCallback(cb: (event: AbstractEvent) => void);
    release(): void;
    isRunning: boolean;
}
