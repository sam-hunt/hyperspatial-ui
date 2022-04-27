import { vec3 } from 'gl-matrix';
import { ComponentType } from './component-type.enum';
import { Component } from './component.interface';

export class TransformComponent implements Component {
    public type: ComponentType.TRANSFORM = ComponentType.TRANSFORM;

    public constructor(
        public position: vec3,
    ) {}

    destroy() {}
}