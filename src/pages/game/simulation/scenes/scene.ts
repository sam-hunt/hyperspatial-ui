import type { mat4, vec4 } from 'gl-matrix';

// TODO: Refactor to interface probably

export interface Scene {
    camera: mat4
    clearColor: vec4;

    init(): void;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(deltaTime: number): void;

    destroy(): void;
}
