import dayjs from 'dayjs';
import { mat4, vec3 } from 'gl-matrix';
import { SpawnEvent } from 'pages/game/events/spawn-event';
import { TransformComponent } from '../ecs/transform.component';
import { AbstractScene } from './abstract-scene';
import { v4 as uuid } from 'uuid';
import { ComponentType } from '../ecs/component-type.enum';
import { Component } from '../ecs/component.interface';
import { UuidComponent } from '../ecs/uuid.components';
import { ColorComponent } from '../ecs/color.component';
import { NameComponent } from '../ecs/name.component';
import { DespawnEvent } from 'pages/game/events/despawn-event';
import { hexToGL, lavender, royal } from 'app/theme';
import { MoveEvent } from 'pages/game/events/move.event';

export class TestScene extends AbstractScene {
    private playerId = uuid();
    private lastMovementSent = performance.now();

    public init() {
        // TODO: Move camera elsewhere. aspect needs to be recalculated on demand
        const rendererRef = this.simulation.sceneRenderer!;
        const { w, h } = rendererRef.canvasSize;
        const aspect = w / h;
        const zNear = 0.1;
        const zFar = 100;
        const clip = 25;
        mat4.ortho(this.camera, -clip, clip, -clip / aspect, clip / aspect, zNear, zFar);

        // spawn bg tiles
        for (let x = -16; x <= 16; x += 4) {
            for (let y = -16; y <= 16; y += 4) {
                this.simulation.registry.entities.push({
                    id: this.eid++,
                    components: [
                        new NameComponent(`${x}-${y}`),
                        new TransformComponent([x, y, -6]),
                        new ColorComponent(hexToGL(royal.main)),
                    ],
                });
            }
        }

        // spawn player
        this.simulation.sendEvent({
            event: 'spawn',
            ts: dayjs().toISOString(),
            eid: this.playerId,
            components: [
                { type: ComponentType.UUID, uuid: this.playerId } as UuidComponent,
                { type: ComponentType.NAME, name: window.localStorage.getItem('playerName') } as NameComponent,
                { type: ComponentType.TRANSFORM, position: [0, 0, -6] } as TransformComponent,
                { type: ComponentType.COLOR, color: hexToGL(lavender.main) } as ColorComponent,
            ],
        } as SpawnEvent);
    }

    private parseComponent = (c: Component): Component | undefined => {
        switch (c.type) {
            case ComponentType.UUID:
                return new UuidComponent((c as UuidComponent).uuid);
            case ComponentType.NAME:
                return new NameComponent((c as NameComponent).name);
            case ComponentType.TRANSFORM:
                return new TransformComponent((c as TransformComponent).position);
            case ComponentType.COLOR:
                return new ColorComponent((c as ColorComponent).color);
        };
    }

    private eid: number = 0

    public update(deltaTime: number): void {
        // Handle events
        for (const event of this.simulation.eventQueue) {

            if (event.event === 'spawn') {
                const se = event as SpawnEvent;
                this.simulation.registry.entities.push({
                    id: this.eid++,
                    components: se.components.map(c => this.parseComponent(c)!)
                });
            }
            if (event.event === 'despawn') {
                const se = event as DespawnEvent;
                const i = this.simulation.registry.entities
                    .findIndex(e => e.components
                        .find(c => c.type === ComponentType.UUID && (c as UuidComponent).uuid === se.uuid));
                this.simulation.registry.entities.splice(i, 1);
            }
            if (event.event === 'move') {
                const me = event as MoveEvent;
                let entity = this.simulation.registry.entities.find(e => e.components
                    .find(c => c.type === ComponentType.UUID && (c as UuidComponent).uuid === me.uuid));
                // create if not found // TODO: server spawn only
                if (!entity) {
                    entity = {
                        id: this.eid++,
                        components: [
                            { type: ComponentType.UUID, uuid: me.uuid } as UuidComponent,
                            { type: ComponentType.TRANSFORM, position: me.position } as TransformComponent,
                            { type: ComponentType.COLOR, color: hexToGL(lavender.main) } as ColorComponent,
                        ],
                    };
                    this.simulation.registry.entities.push(entity);
                }
                const transform = entity.components.find(c => c.type === ComponentType.TRANSFORM) as TransformComponent;
                transform.position = me.position;
            }
        }
        this.simulation.eventQueue = [];

        // Canvas IO
        const io = this.simulation.canvasIo!;
        const now = performance.now();

        const playerEntity = this.simulation.registry.entities
            .find(e => e.components.find(c => c.type === ComponentType.UUID && (c as UuidComponent).uuid === this.playerId));
        const playerTransform = playerEntity?.components.find(c => c.type === ComponentType.TRANSFORM) as TransformComponent;

        // TODO: Tie translation deltas to deltatime and eventually a velocity property depending on type of moving object
        const d = 0.25;
        const dx = d * +(io.keysDown.get('d') || 0) - d * +(io.keysDown.get('a') || 0);
        const dy = d * +(io.keysDown.get('w') || 0) - d * +(io.keysDown.get('s') || 0);

        // Send a movement request event, debounced to 20 per second
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
        this.simulation.registry.entities = [];
    }
}