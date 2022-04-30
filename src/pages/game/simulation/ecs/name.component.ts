import { ComponentType } from './component-type.enum';

export class NameComponent {
    public type: ComponentType.NAME = ComponentType.NAME;

    public constructor (
        public name: string,
    ) {}
}