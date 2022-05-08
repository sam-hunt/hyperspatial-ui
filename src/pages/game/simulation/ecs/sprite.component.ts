import { ComponentType } from './component-type.enum';

export class SpriteComponent {
    public type: ComponentType.SPRITE = ComponentType.SPRITE;

    public constructor(
        public textureId: number,
    ) {}
}
