import { AbstractEvent } from './abstract-event';

export interface ChatEvent extends AbstractEvent {
    event: 'chat';
    ts: string;
    author: string;
    text: string;
}
