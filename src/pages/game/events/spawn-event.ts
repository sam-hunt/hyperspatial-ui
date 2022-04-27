import { AbstractEvent } from './abstract-event';

export interface SpawnEvent extends AbstractEvent {
    event: 'spawn';
    ts: string;
}
