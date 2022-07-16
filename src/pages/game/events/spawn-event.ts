import type { Component } from '../simulation/ecs/component.interface';
import type { AbstractEvent } from './abstract-event';

export interface SpawnEvent extends AbstractEvent {
    event: 'spawn';
    ts: string;
    components: Component[];
}
