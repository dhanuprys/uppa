import { useCallback, useEffect, useMemo, useState } from 'react';
import MapSidebar from '../layouts/MapSidebar';
import PlaceToast from '../layouts/PlaceToast';
import WorldMap from '../layouts/WorldMap';
import { BaseProps } from '../props';
import LocalPlaceRepository from '../../data/repositories/LocalPlaceRepository';
import PlaceEntity from '../../data/entities/PlaceEntity';
import Boot from '../layouts/Boot';

const SIDEBAR_OPEN_FLAG = 'sB1';
const SIDEBAR_CLOSE_FLAG = 'sB0';

function MainScreen({ className }: BaseProps) {
    const repository = useMemo(() => {
        return new LocalPlaceRepository();
    }, []);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [places, setPlaces] = useState<PlaceEntity[]>([]);
    const [activePlace, setActivePlace] = useState<PlaceEntity | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [isBootUpDone, setBootUpDone] = useState(false);
    const [previousHash, setPreviousHash] = useState<string | null>('#nav1');

    const toggleSidebar = useCallback((isEnabled: boolean) => {
        setSidebarOpen(isEnabled);
        window.location.hash = isEnabled 
                                ? SIDEBAR_OPEN_FLAG 
                                : SIDEBAR_CLOSE_FLAG;
    }, []);

    useEffect(() => {
        const hashChangeListener = () => {
            // const currentHash = window.location.hash;

            if (window.location.hash !== `#${SIDEBAR_OPEN_FLAG}`) {
                setSidebarOpen(false);
            }

            setPreviousHash(window.location.hash);
        };

        window.addEventListener('hashchange', hashChangeListener);

        return () => {
            window.removeEventListener('hashchange', hashChangeListener);
        }
    }, [previousHash]);

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
                onToggleClick={toggleSidebar} />
            <PlaceToast
                opened={toastOpen}
                activePlace={activePlace}
                onOpenClick={() => {
                    setToastOpen(true);
                    // console.log('setting hash');
                    // window.location.hash = '#nav2';
                }}
                onCancelClick={() => {
                    setToastOpen(false);
                    // window.location.hash = '#nav1';
                }}
                onDismissClick={() => {
                    setToastOpen(false);
                    setActivePlace(null);
                    // window.location.hash = '';
                }} />
        </div>
    );
}

export default MainScreen;