import PlaceEntity from '../entities/PlaceEntity';

interface PlaceRepository {
    getPlaceById(id: string): Promise<PlaceEntity | null>;
    getPlacesByCategory(category: string): Promise<PlaceEntity[]>;
    getAllPlaces(): Promise<PlaceEntity[]>;
}

export default PlaceRepository;