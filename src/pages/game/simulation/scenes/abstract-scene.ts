import { mat4, vec4 } from 'gl-matrix';

// TODO: Refactor to interface probably

export class AbstractScene {
    public camera: mat4 = mat4.create();
    public clearColor: vec4 = vec4.create();

    public init(): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(deltaTime: number): void {}

    public destroy(): void {}
}
