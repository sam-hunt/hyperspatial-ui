import type { vec3 } from 'gl-matrix';
import type { AbstractEvent } from './abstractEvent';

export interface MoveEvent extends AbstractEvent {
    event: 'move';
    ts: string;
    uuid: string;
    position: vec3;
    direction: number;
}
