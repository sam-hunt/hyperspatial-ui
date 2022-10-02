import type { Component } from 'types/global/component';
import type { AbstractEvent } from './abstractEvent';

export interface SpawnEvent extends AbstractEvent {
    event: 'spawn';
    ts: string;
    components: Component[];
}
