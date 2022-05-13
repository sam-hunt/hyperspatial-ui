import EventEmitter from 'events';
import { AbstractEvent } from '../events/abstract-event';
import { CanvasIO } from './canvas-io';
import { EcsRegistry } from './ecs/ecs-registry';
import { SceneRenderer } from './renderer/scene-renderer';

export interface SimulationInternals {
    sceneRenderer: SceneRenderer | null;
    registry: EcsRegistry;
    canvasIo: CanvasIO | null;
    gameEvents: EventEmitter;
    sendEvent: (event: AbstractEvent) => void;
}
