import type EventEmitter from 'events';
import type { AbstractEvent } from 'types/events';
import type { CanvasIO } from './canvas-io';
import type { EcsRegistry } from './ecs/ecs-registry';
import type { SceneRenderer } from './renderer/scene-renderer';

export interface SimulationInternals {
    sceneRenderer: SceneRenderer | null;
    registry: EcsRegistry;
    canvasIo: CanvasIO | null;
    gameEvents: EventEmitter;
    sendEvent: (event: AbstractEvent) => void;
}
