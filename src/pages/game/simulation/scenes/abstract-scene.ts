import { mat4, vec4 } from 'gl-matrix';
import { SimulationImpl } from '../simulation';

export class AbstractScene {
    public camera: mat4 = mat4.create();
    public clearColor: vec4 = vec4.create();

    public constructor(protected simulation: SimulationImpl) {}

    public init(): void {}

    public update(deltaTime: number): void {}

    public destroy(): void {}
}
