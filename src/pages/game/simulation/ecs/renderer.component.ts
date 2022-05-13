import { ComponentType } from './component-type.enum';

interface UniformOverride {
    name: string;
    value: unknown;
}

export class RendererComponent {
    public type: ComponentType.RENDER2D = ComponentType.RENDER2D;

    public constructor(
        public material: string,
        public uniforms: UniformOverride[],
    ) {}
}
