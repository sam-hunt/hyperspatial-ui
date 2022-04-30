import { Component } from '../simulation/ecs/component.interface';
import { AbstractEvent } from './abstract-event';

export interface SpawnEvent extends AbstractEvent {
    event: 'spawn';
    ts: string;
    components: Component[];
}
