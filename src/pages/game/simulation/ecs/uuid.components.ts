import { v4 as uuid } from 'uuid';
import { ComponentType } from './component-type.enum';

export class TilemapComponent {
    public type: ComponentType.UUID = ComponentType.UUID;
    public uuid: string;

    public constructor(existingUuid?: string) {
        this.uuid = existingUuid || uuid();
    }

    destroy() {}
}