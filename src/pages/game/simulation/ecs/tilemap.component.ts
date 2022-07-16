import { ComponentType } from 'types/global/componentType.enum';

import type { Component } from 'types/global/component';

export class TilemapComponent implements Component {
    public type: ComponentType.TILEMAP = ComponentType.TILEMAP;

    // TODO: Tiled params
}
