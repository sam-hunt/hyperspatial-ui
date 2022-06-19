import { ComponentType } from './component-type.enum';

export interface UniformOverrides {
    [name: string]: unknown;
}

export class RendererComponent {
    public type: ComponentType.RENDER2D = ComponentType.RENDER2D;

    public constructor(
        public material: string,
        public uniforms: UniformOverrides,
    ) {}
}
