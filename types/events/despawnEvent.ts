import type { AbstractEvent } from './abstractEvent';

export interface DespawnEvent extends AbstractEvent {
    event: 'despawn';
    ts: string;
    uuid: string;
}
