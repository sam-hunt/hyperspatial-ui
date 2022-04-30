import { ComponentType } from './component-type.enum';
import { Component } from './component.interface';

export class TilemapComponent implements Component{
    public type: ComponentType.TILEMAP = ComponentType.TILEMAP;

    // TODO: Tiled params
}