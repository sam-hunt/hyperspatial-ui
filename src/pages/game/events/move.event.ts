import { vec3 } from 'gl-matrix';
import { AbstractEvent } from './abstract-event';

export interface MoveEvent extends AbstractEvent {
    event: 'move';
    ts: string;
    uuid: string;
    position: vec3;
}
