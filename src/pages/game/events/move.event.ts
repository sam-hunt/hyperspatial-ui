import { AbstractEvent } from './abstract-event';

export interface MoveEvent extends AbstractEvent {
    event: 'move';
    ts: string;
}
