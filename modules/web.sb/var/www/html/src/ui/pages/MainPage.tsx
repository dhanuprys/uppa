import { useEffect, useMemo, useRef, useState } from 'react';
import PlaceEntity from '../../data/entities/PlaceEntity';
import LocalPlaceRepository from '../../data/repositories/LocalPlaceRepository';
import MapViewerLayout from '../layouts/MapViewerLayout';
import PanoramaViewerLayout from '../layouts/PanoramaViewerLayout';
import PlaceListSBLayout from '../layouts/PlaceListSBLayout';
import useBaseLayoutStore from '../stores/baseLayoutStore';

function MainPage() {
    const {
        viewMode,
        viewPayload,
        sidebarMode,
        sidebarOpen,
        sidebarPayload,
        setSidebar,
        setView,
        activePlace,
        setActivePlace
    } = useBaseLayoutStore();

    const [isBlur, setBlur] = useState(false);

    const placeRepository = useMemo(() => {
        return new LocalPlaceRepository();
    }, []);

    const [places, setPlaces] = useState<PlaceEntity[]>([]);
    const [placeDetail, setPlaceDetail] = useState<PlaceEntity | null>(null);

    useEffect(() => {
        placeRepository.getAllPlaces().then(setPlaces);
    }, [placeRepository]);

    const openLocationDetail = (place: PlaceEntity) => {
        setSidebar('place_detail', { id: place.id });
        setView('panorama', { id: place.id });

        setPlaceDetail(place);
    };

    const backToMap = () => {
        setActivePlace(null);
        setSidebar('place_list', {});
        setView('map', null);
    };

    return (
        <div className="flex overflow-hidden min-h-screen">
            {/* <OfflineCheck /> */}

            <div onMouseEnter={() => setBlur(true)} onMouseOver={() => setBlur(true)} onMouseOut={() => setBlur(false)} onMouseLeave={() => setBlur(false)} className={`overflow-x-hidden bg-white shadow transition-all max-w-[400px] hover:max-w-[500px] ${sidebarOpen && sidebarPayload ? '' : '!max-w-[0]'}`}>
               {sidebarMode === 'place_list' && <PlaceListSBLayout places={places} openLocationDetail={openLocationDetail} />}
               {/* {sidebarMode === 'place_detail' && <PlaceDetailSBLayout place={placeDetail} backToMap={backToMap} />} */}

               <div className="absolute right-0 top-0"></div>
            </div>
            <div className="relative flex-1">
                {/* <div className={`absolute z-[53] size-full top-0 left-0 bg-black pointer-events-none opacity-0 transition-all delay-[500ms] duration-[600ms] flex justify-center items-center flex-col gap-y-5 ${isBlur ? 'opacity-80' : ''}`}>
                    <img src="/uppa-white.svg" />
                    <h1 className="text-white text-4xl">Undiksha MAPPA</h1>
                    <ul className="text-white text-xl [&>*]:text-center">
                        <li>Ayu Nyoman Resti Amadhea</li>
                        <li>Gede Dhanu Purnayasa</li>
                        <li>Gede Dira Agastya</li>
                        <li>Ni Made Dwijothamy Oka</li>
                    </ul>
                </div> */}
                <div className={`absolute top-0 left-0 size-full transition-all duration-700 ${viewMode === 'panorama' ? '' : '-translate-y-[100vh]'}`}>
                    <PanoramaViewerLayout _3dVistaIndex={10} place={placeDetail} backToMap={backToMap} />
                    <div className={`absolute top-0 left-0 size-full bg-black opacity-0 pointer-events-none delay-[100ms] transition-[600ms] ${viewMode !== 'panorama' ? 'opacity-90': '!delay-[200ms]'}`}></div>
                </div>
                <div className={`absolute top-0 left-0 size-full transition-all duration-700 ${viewMode === 'map' ? '' : 'translate-y-[100vh]'}`}>
                    <MapViewerLayout places={places} activePlace={activePlace} openLocationDetail={openLocationDetail} />
                </div>
            </div>
        </div>
    );
}

export default MainPage;