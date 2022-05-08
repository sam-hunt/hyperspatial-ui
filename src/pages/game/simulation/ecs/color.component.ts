import { vec4 } from 'gl-matrix';
import { ComponentType } from './component-type.enum';

export class ColorComponent {
    public type: ComponentType.COLOR = ComponentType.COLOR;

    public constructor(
        public color: vec4,
    ) {}
}
