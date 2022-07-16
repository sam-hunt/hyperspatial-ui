import type { Component } from './component.interface';

export interface Entity {
    id: number;
    components: Component[];
}

export class EcsRegistry {
    public entities: Entity[] = [];

    //     private entities: Set<number> = new Set();
    //     private entitiesByName: Map<string, number> = new Map();
    //     private components: Map<ComponentType, Component> = new Map();

    //     private materializedViews: Map<MatViewKey, Component[]>;

    //     private getMatViewKey(ComponentType[]) {

    //     }

    //     public materializeView(componentTypes: ComponentType[]): void {

    //     }

    //     public createEntity(name?: string): number {
    //         let id;
    //         do id = Math.random()*101|0; while (!this.entities.has(id));
    //         this.entities.add(id);

    //         return 1;
    //     }

    //     public destroyEntity(id: number): void {

//     }
}
