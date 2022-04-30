import { AbstractEvent } from './abstract-event';

export interface DespawnEvent extends AbstractEvent {
    event: 'despawn';
    ts: string;
    uuid: string;
}
