import PlaceEntity from '../entities/PlaceEntity';
import PlaceRepository from './PlaceRepository';
import places from '../db/places';

class LocalPlaceRepository implements PlaceRepository {
    private places: PlaceEntity[] = [];

    constructor() {
        this.places = places;
    }

    async getPlaceById(id: string): Promise<PlaceEntity | null> {
        return this.places.find(p => p.id === id) || null;
    }

    async getPlacesByCategory(category: string): Promise<PlaceEntity[]> {
        throw new Error('Method not implemented.');
    }
    async getAllPlaces(): Promise<PlaceEntity[]> {
        return this.places;
    }
}

export default LocalPlaceRepository;