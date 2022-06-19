import { mat4, vec4 } from 'gl-matrix';

import { Scene } from './scene';
import { TransformComponent } from '../ecs/transform.component';
import { NameComponent } from '../ecs/name.component';
import { SimulationInternals } from '../simulation-internals.interface';
import { RendererComponent } from '../ecs/renderer.component';

export class GalaxyScene implements Scene {
    public camera = mat4.create();
    public clearColor = vec4.create();
    private eid: number = 0;

    public constructor(private simulation: SimulationInternals) {}

    public init() {
        const rendererRef = this.simulation.sceneRenderer!;
        const { w, h } = rendererRef.canvasSize;
        const aspect = w / h;
        const zNear = 0.1;
        const zFar = 100;
        const clip = 25;
        mat4.ortho(this.camera, -clip, clip, -clip / aspect, clip / aspect, zNear, zFar);

        this.simulation.sceneRenderer!.loadMaterial('galaxy');

        // plane to render galaxy on
        this.simulation.registry.entities.push({
            id: this.eid++,
            components: [
                new NameComponent('galaxy'),
                new TransformComponent([0, 0, -6], [13, 13, 1]),
                new RendererComponent('galaxy', {

                }),
            ],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(deltaTime: number): void {
    }

    public destroy(): void {
        // TODO Refactor to actual ECS
        this.simulation.registry.entities = [];
    }
}
