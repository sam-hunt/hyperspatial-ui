export interface AbstractEvent {
    event: string;
    ts: string;
    [key: string]: unknown;
}