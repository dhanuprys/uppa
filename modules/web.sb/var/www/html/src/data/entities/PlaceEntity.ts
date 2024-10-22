import { LatLngExpression } from 'leaflet';

interface PlaceImage {
    url: string;
    isPanorama?: boolean;
    title?: string;
    description?: string;
}

class PlaceEntity {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public location: string,
        public category: string,
        public coordinate: LatLngExpression,
        public images: PlaceImage[] = [],
        public vistaIndex: number,
        public iconUrl: string
    ) {}
}

export default PlaceEntity;