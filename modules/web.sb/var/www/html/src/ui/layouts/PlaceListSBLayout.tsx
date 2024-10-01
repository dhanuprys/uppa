import PlaceEntity from '../../data/entities/PlaceEntity';
import PlaceRepository from '../../data/repositories/PlaceRepository';
import ItemButton from '../components/ItemButton';
import useBaseLayoutStore from '../stores/baseLayoutStore';

function PlaceListSBLayout({ openLocationDetail, places }: { openLocationDetail: (place: PlaceEntity) => void, places: PlaceEntity[] }) {
    const {
        setActivePlace,
        activePlace
    } = useBaseLayoutStore();

    return (
        <div className="min-w-[400px] overflow-auto max-h-screen p-4 z-50">
            <h1 className="text-2xl font-bold mb-7 p-4 text-center">DAFTAR TEMPAT</h1>

            <div className="space-y-2">
                {
                    places.map((place) => {
                        return (
                            <ItemButton onClick={() => setActivePlace(place)} active={activePlace === place}>
                                {place.name}
                            </ItemButton>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default PlaceListSBLayout;