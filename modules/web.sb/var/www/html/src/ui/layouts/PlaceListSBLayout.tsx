import { useEffect } from 'react';
import PlaceEntity from '../../data/entities/PlaceEntity';
import PlaceRepository from '../../data/repositories/PlaceRepository';
import ItemButton from '../components/ItemButton';
import useBaseLayoutStore from '../stores/baseLayoutStore';

function PlaceListSBLayout({ openLocationDetail, places }: { openLocationDetail: (place: PlaceEntity) => void, places: PlaceEntity[] }) {
    const {
        setActivePlace,
        activePlace
    } = useBaseLayoutStore();

    useEffect(() => {
        const changePlace = (event: KeyboardEvent) => {
            event.preventDefault();

            let currentPlaceIndex = places.findIndex((v) => { return v == activePlace });
            const pressedKey = event.key.toLowerCase();
            let nextIndex = 0;

            switch (pressedKey) {
                case 'escape':
                    setActivePlace(null);
                    return;
                case 'arrowup':
                    if (currentPlaceIndex - 1 < 0) {
                        nextIndex = places.length-1;
                    } else {
                        nextIndex = currentPlaceIndex - 1;
                    }
                break;
                case 'arrowdown':
                    if (currentPlaceIndex + 1 > places.length-1) {
                        nextIndex = 0;
                    } else {
                        nextIndex = currentPlaceIndex + 1;
                    }
                break;
            }

            setActivePlace(places[nextIndex]);
        };

        document.addEventListener('keyup', changePlace);

        return () => {
            document.removeEventListener('keyup', changePlace);
        }
    }, [activePlace]);

    return (
        <div className="min-w-[400px] overflow-auto max-h-screen p-4 z-50">
            <h1 className="text-2xl font-bold mb-7 p-4 text-center">DAFTAR TEMPAT</h1>

            <div className="space-y-2">
                {
                    places.map((place) => {
                        return (
                            <ItemButton key={place.id} onClick={() => setActivePlace(place)} active={activePlace === place}>
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