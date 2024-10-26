import { useEffect, useMemo, useState } from 'react';
import MapSidebar from '../layouts/MapSidebar';
import PlaceToast from '../layouts/PlaceToast';
import WorldMap from '../layouts/WorldMap';
import { BaseProps } from '../props';
import LocalPlaceRepository from '../../data/repositories/LocalPlaceRepository';
import PlaceEntity from '../../data/entities/PlaceEntity';
import Boot from '../layouts/Boot';

function MainScreen({ className }: BaseProps) {
    const repository = useMemo(() => {
        return new LocalPlaceRepository();
    }, []);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [places, setPlaces] = useState<PlaceEntity[]>([]);
    const [activePlace, setActivePlace] = useState<PlaceEntity | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [isBootUpDone, setBootUpDone] = useState(false);

    // Menyiapkan repository untuk menampung daftar tempat
    useEffect(() => {
        if (!repository) return;

        repository
            .getAllPlaces()
            .then(placeList => {
                setPlaces(placeList);
            });
    }, [repository]);

    useEffect(() => {
        if (sidebarOpen && window.innerWidth < 768) {
            setToastOpen(false);
            setActivePlace(null);
        }
    }, [sidebarOpen]);

    // Jika booting belum selesai maka tampilkan mode booting
    if (!isBootUpDone) {
        return <Boot onBootUpDone={() => setBootUpDone(true)} />
    }

    return (
        <div className={`${className || ''} w-screen h-screen`}>
            <WorldMap
                places={places}
                activePlace={activePlace}
                onPlaceClick={place => setActivePlace(activePlace === place ? null : place)} />
            <MapSidebar
                placeList={places}
                activePlace={activePlace}
                enabled={sidebarOpen}
                onPlaceClick={place => {
                    const isSamePlace = activePlace === place;
                    setActivePlace(isSamePlace ? null : place);
                    if (!isSamePlace && window.innerWidth < 768) {
                        setSidebarOpen(false);
                    }
                }}
                onToggleClick={(isEnabled) => setSidebarOpen(isEnabled)} />
            <PlaceToast
                opened={toastOpen}
                activePlace={activePlace}
                onOpenClick={() => setToastOpen(true)}
                onCancelClick={() => {setToastOpen(false)}}
                onDismissClick={() => {
                    setToastOpen(false);
                    setActivePlace(null);
                }} />
        </div>
    );
}

export default MainScreen;