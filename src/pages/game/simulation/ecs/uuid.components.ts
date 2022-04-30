import { v4 as uuid } from 'uuid';
import { ComponentType } from './component-type.enum';
import { Component } from './component.interface';

export class UuidComponent implements Component {
    public type: ComponentType.UUID = ComponentType.UUID;
    public uuid: string;

    public constructor(existingUuid?: string) {
        this.uuid = existingUuid || uuid();
    }
}