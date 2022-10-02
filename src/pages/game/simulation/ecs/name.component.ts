import { ComponentType } from 'types/global/componentType.enum';

export class NameComponent {
    public type: ComponentType.NAME = ComponentType.NAME;

    public constructor(
        public name: string,
    ) {}
}
