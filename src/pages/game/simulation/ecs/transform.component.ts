import { ComponentType } from './component-type.enum';

import type { vec3 } from 'gl-matrix';
import type { Component } from './component.interface';

export class TransformComponent implements Component {
    public type: ComponentType.TRANSFORM = ComponentType.TRANSFORM;

    public constructor(
        public position: vec3 = [0, 0, 0],
        public scale: vec3 = [1, 1, 1],
        // TODO: rotation
        // public rotation: vec3, // TODO: Check type
    ) {}

    destroy() {}
}
