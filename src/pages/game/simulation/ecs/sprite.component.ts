import { vec4 } from 'gl-matrix';
import { ComponentType } from './component-type.enum';

export class SpriteComponent {
    public type: ComponentType.SPRITE = ComponentType.SPRITE;

    public constructor (
        public color: vec4,
    ) {}

    destroy() {

    }
}