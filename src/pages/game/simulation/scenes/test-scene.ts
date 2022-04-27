import { mat4 } from 'gl-matrix';
import { SpriteComponent } from '../ecs/sprite.component';
import { TransformComponent } from '../ecs/transform.component';
import { AbstractScene } from './abstract-scene';

export class TestScene extends AbstractScene {
    public init() {
        // TODO: Move camera elsewhere. aspect needs to be recalculated on demand
        const rendererRef = this.simulation.sceneRenderer!;
        const { w, h } = rendererRef.canvasSize;
        const aspect = w / h;
        const zNear = 0.1;
        const zFar = 100.0;
        const clip = 25.0;
        mat4.ortho(this.camera, -clip, clip, -clip/aspect, clip/aspect, zNear, zFar);

        this.simulation.registry.entities.push({
            components: [
                new TransformComponent([-2.0, -2.0, -6.0]),
                new SpriteComponent([0,0,1,1]),
            ],
        },{
            components: [
                new TransformComponent([2.0, 2.0, -6.0]),
                new SpriteComponent([0,0,1,1]),
            ],
        },{
            components: [
                new TransformComponent([-2.0, 2.0, -6.0]),
                new SpriteComponent([0,0,1,1]),
            ],
        },{
            components: [
                new TransformComponent([2.0, -2.0, -6.0]),
                new SpriteComponent([0,0,1,1]),
            ],
        })
    }

    public destroy(): void {
        this.simulation.registry.entities = [];
    }
}