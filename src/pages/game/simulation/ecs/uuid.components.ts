import { v4 as uuid } from 'uuid';
import { ComponentType } from 'types/global/componentType.enum';

import type { Component } from 'types/global/component';

export class UuidComponent implements Component {
    public type: ComponentType.UUID = ComponentType.UUID;
    public uuid: string;

    public constructor(existingUuid?: string) {
        this.uuid = existingUuid || uuid();
    }
}
