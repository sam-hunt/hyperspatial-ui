import type { AbstractEvent } from './abstractEvent';

export interface ChatEvent extends AbstractEvent {
    event: 'chat';
    ts: string;
    author: string;
    text: string;
}
