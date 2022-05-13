import dayjs from 'dayjs';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { v4 as uuid } from 'uuid';

import { lavender, royal } from 'app/theme';
import { SpawnEvent } from 'pages/game/events/spawn-event';
import { DespawnEvent } from 'pages/game/events/despawn-event';
import { MoveEvent } from 'pages/game/events/move.event';
import { hexToGL } from 'utils/hex-to-gl';
import { Scene } from './scene';
import { TransformComponent } from '../ecs/transform.component';
import { ComponentType } from '../ecs/component-type.enum';
import { Component } from '../ecs/component.interface';
import { UuidComponent } from '../ecs/uuid.components';
import { NameComponent } from '../ecs/name.component';
import { SimulationInternals } from '../simulation-internals.interface';
import { RendererComponent } from '../ecs/renderer.component';

export class TestScene implements Scene {
    private playerId = uuid();
    private lastMovementSent = performance.now();

    public camera = mat4.create();
    public clearColor = vec4.create();

    public constructor(private simulation: SimulationInternals) {}

    public init() {
        // TODO: Move camera elsewhere. aspect should be recalculated on demand
        const rendererRef = this.simulation.sceneRenderer!;
        const { w, h } = rendererRef.canvasSize;
        const aspect = w / h;
        const zNear = 0.1;
        const zFar = 100;
        const clip = 25;
        mat4.ortho(this.camera, -clip, clip, -clip / aspect, clip / aspect, zNear, zFar);

        this.simulation.sceneRenderer!.loadMaterial('red');

        // Spawn bg tiles
        // TODO: Move to server
        for (let x = -16; x <= 16; x += 4) {
            for (let y = -16; y <= 16; y += 4) {
                this.simulation.registry.entities.push({
                    id: this.eid++,
                    components: [
                        new NameComponent(`${x}-${y}`),
                        new TransformComponent([x, y, -6]),
                        new RendererComponent('default', [{ name: 'uColor', value: hexToGL(royal.main) }]),
                    ],
                });
            }
        }

        // Request player spawn
        this.simulation.sendEvent({
            event: 'spawn',
            ts: dayjs().toISOString(),
            eid: this.playerId,
            components: [
                { type: ComponentType.UUID, uuid: this.playerId } as UuidComponent,
                { type: ComponentType.NAME, name: window.localStorage.getItem('playerName') } as NameComponent,
                { type: ComponentType.TRANSFORM, position: [0, 0, -6] } as TransformComponent,
                {
                    type: ComponentType.RENDER2D,
                    material: 'default',
                    uniforms: [{ name: 'uColor', value: hexToGL(lavender.main) }],
                } as RendererComponent,
            ],
        } as SpawnEvent);

        this.simulation.gameEvents.addListener('spawn', this.handleSpawnEvent);
        this.simulation.gameEvents.addListener('despawn', this.handleDespawnEvent);
        this.simulation.gameEvents.addListener('move', this.handleMoveEvent);
    }

    private parseComponent = (c: Component): Component | undefined => {
        switch (c.type) {
            case ComponentType.UUID:
                return new UuidComponent((c as UuidComponent).uuid);
            case ComponentType.NAME:
                return new NameComponent((c as NameComponent).name);
            case ComponentType.TRANSFORM:
                return new TransformComponent((c as TransformComponent).position);
            case ComponentType.RENDER2D: {
                const r = c as RendererComponent;
                return new RendererComponent(r.material, r.uniforms);
            }
            default:
                return undefined;
        }
    };

    private eid: number = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(deltaTime: number): void {
        // Canvas IO
        const io = this.simulation.canvasIo!;
        const now = performance.now();

        const playerEntity = this.simulation.registry.entities
            .find((e) => e.components.find((c) => c.type === ComponentType.UUID && (c as UuidComponent).uuid === this.playerId));
        const playerTransform = playerEntity?.components.find((c) => c.type === ComponentType.TRANSFORM) as TransformComponent;

        // TODO: Tie translation deltas to deltatime and eventually a velocity property depending on type of moving object
        const d = 0.25;
        const dx = d * +(io.keysDown.get('d') || 0) - d * +(io.keysDown.get('a') || 0);
        const dy = d * +(io.keysDown.get('w') || 0) - d * +(io.keysDown.get('s') || 0);

        // Send a movement request event, debounced to 60 per second
        // TODO: Implement velocity support and limit to server tick rate
        if ((dx || dy) && (now - this.lastMovementSent > 16)) {
            this.simulation.sendEvent({
                event: 'move',
                ts: dayjs().toISOString(),
                uuid: this.playerId,
                position: this.translateVec3(playerTransform.position, dx, dy, 0),
            });
            this.lastMovementSent = now;
        }
    }

    private translateVec3(vec: vec3, x: number, y: number, z: number) {
        const newVec = vec3.create();
        vec3.transformMat4(newVec, vec, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);
        return newVec;
    }

    public destroy(): void {
        this.simulation.gameEvents.addListener('spawn', this.handleSpawnEvent);
        this.simulation.gameEvents.addListener('despawn', this.handleDespawnEvent);
        this.simulation.gameEvents.addListener('move', this.handleMoveEvent);
        // TODO Refactor to actual ECS
        this.simulation.registry.entities = [];
    }

    private handleSpawnEvent = (spawnEvent: SpawnEvent) => {
        this.simulation.registry.entities.push({
            id: this.eid++,
            components: spawnEvent.components.map((c) => this.parseComponent(c)!),
        });
    };

    private handleDespawnEvent = (despawnEvent: DespawnEvent) => {
        const i = this.simulation.registry.entities
            .findIndex((e) => e.components
                .find((c) => c.type === ComponentType.UUID && (c as UuidComponent).uuid === despawnEvent.uuid));
        this.simulation.registry.entities.splice(i, 1);
    };

    private handleMoveEvent = (moveEvent: MoveEvent) => {
        let entity = this.simulation.registry.entities.find((e) => e.components
            .find((c) => c.type === ComponentType.UUID && (c as UuidComponent).uuid === moveEvent.uuid));
        // create if not found // TODO: server spawn only
        if (!entity) {
            entity = {
                id: this.eid++,
                components: [
                    { type: ComponentType.UUID, uuid: moveEvent.uuid } as UuidComponent,
                    { type: ComponentType.TRANSFORM, position: moveEvent.position } as TransformComponent,
                    {
                        type: ComponentType.RENDER2D,
                        material: 'default',
                        uniforms: [{ name: 'uColor', value: hexToGL(lavender.main) }],
                    } as RendererComponent,
                ],
            };
            this.simulation.registry.entities.push(entity);
        }
        const transform = entity.components.find((c) => c.type === ComponentType.TRANSFORM) as TransformComponent;
        transform.position = moveEvent.position;
    };
}
