import { AbstractEvent } from '../events/abstract-event';
import { CanvasIO } from './canvas-io';
import { EcsRegistry } from './ecs/ecs-registry';
import { SceneRenderer } from './scene-renderer';

export interface SimulationInternals {
    sceneRenderer: SceneRenderer | null;
    registry: EcsRegistry;
    canvasIo: CanvasIO | null;
    eventQueue: AbstractEvent[];
    sendEvent: (event: AbstractEvent) => void;
}
