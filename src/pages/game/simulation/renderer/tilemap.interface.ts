export interface Tileset {
    name: string;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: 0;
    spacing: 0;
    tilecount: number;
    tilewidth: number;
    tileheight: number;
    firstgid: number,
    columns: number;
    transparentcolor: string;
}

export interface TilemapLayer {
    id: number;
    name: string;
    opacity: number;
    type: 'tilelayer' | 'objectlayer';
    visible: boolean;
    width: number;
    x: number;
    y: number;
    data: number[];
}

export interface Tilemap {
    width: number;    
    height: number;
    infinite: boolean;
    layers: TilemapLayer[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: 'orthogonal' | 'isometric';
    renderOrder: string;
    tiledversion: string;
    tilesets: Tileset[];
    tilewidth: number;
    tileheight: number;
    type: 'map',
    version: number;
    compressionLevel: number;
}
