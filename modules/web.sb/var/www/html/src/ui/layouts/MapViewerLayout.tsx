import { IoMdMap } from 'react-icons/io';
import { TbRouteAltRight } from 'react-icons/tb';
import Button from '../components/Button';
import WorldMap from '../components/WorldMap';
import useBaseLayoutStore from '../stores/baseLayoutStore';
import PlaceEntity from '../../data/entities/PlaceEntity';
import { useEffect, useState } from 'react';
import VistaIframe from '../components/VistaIframe';
import { TbView360Number } from "react-icons/tb";


function MapViewerLayout({ places, activePlace, openLocationDetail }: { openLocationDetail: (place: PlaceEntity) => void, places: PlaceEntity[], activePlace: PlaceEntity | null }) {
    const {
        sidebarOpen,
        setSidebarOpen,
        setActivePlace
    } = useBaseLayoutStore();

    const [isOpen, setOpen] = useState(false);
    const [isRestart, setRestart] = useState(false);

    useEffect(() => {
        if (isRestart) {
            setTimeout(() => {setRestart(false)}, 800);
        }
    }, [isRestart]);

    return (
        <div className="relative h-screen">
            {
                isOpen &&
                <div className="fixed z-[56] top-0 left-0 w-screen h-screen bg-black">
                    <div>
                        {/* <img src="/map.jpg" className="absolute size-full object-cover" /> */}
                        <VistaIframe className="absolute size-full animate-scale-up" index={activePlace!.vistaIndex} />
                        <div className="absolute size-full bg-black animate-fade-in"></div>
                        <div className="absolute size-full bottom-inner-shadow"></div>
                    </div>
                    <div className="absolute size-full flex items-end">
                        <div className="p-8 lg:p-16 max-w-[75%] md:max-w-[70%] lg:max-w-[65%] space-y-8">
                            <div className="px-8 py-2 bg-[rgba(226,232,240,0.4)] font-semibold text-white inline rounded-full text-xl">{activePlace!.category}</div>
                            <h1 className="text-5xl font-bold text-white">{activePlace!.name}</h1>
                            <p className="text-white font-light lg:text-lg">
                                {activePlace!.description}
                            </p>
                            <div className="flex gap-4">
                                <button className="text-xl bg-white px-6 py-3 rounded-full font-semibold flex gap-2 items-center hover:animate-pulse" onClick={() => { openLocationDetail(activePlace!); setOpen(false) }}>
                                    <TbView360Number />
                                    Buka di WorldView
                                </button>
                                <button className="text-xl text-white border-2 border-white px-6 py-3 rounded-full font-semibold" onClick={() => setOpen(false)}>Kembali ke peta</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <WorldMap places={places} activePlace={activePlace} onPlaceClick={(place) => { setActivePlace(place) }} requestRestart={() => { setRestart(true) }} />
            {/* Block gesture when restart */}
            {isRestart && <div className="absolute z-[58] top-0 left-0 size-full"></div>}
            <div className="absolute z-[55] top-0 right-0">
                <div className="p-4">
                    <div className={`translate-x-full transition-all duration-[500ms] opacity-0 ${activePlace ? '!translate-x-0 opacity-100 shadow-2xl' : ''}`}>
                        <div className={`p-4 rounded-xl bg-white shadow-2xl border-l-4 border-l-blue-700 min-w-[400px] max-w-[450px] transition-all duration-[700ms] ${isOpen ? 'min-w-[800px] max-w-[850px]' : ''} flex gap-4`}>
                            <div>
                                <TbRouteAltRight className={`text-5xl transition-all ${isOpen ? 'hidden' : ''} mt-3`} />
                            </div>
                            <div className="space-y-2">
                                <h2 className={`text-lg lg:text-xl transition-all`}>{activePlace?.name}</h2>
                                <div className="h-auto">
                                    {activePlace && <p className="font-light text-xs lg:text-sm text-slate-700">{activePlace?.description.slice(0, 120) + '...'}</p>}
                                </div>
                                <div className="space-x-2">
                                    <button className="px-5 py-1 bg-blue-700 text-white rounded text-sm" onClick={() => setOpen(true)}>buka</button>
                                    <button className="px-2 py-1 text-blue-500 text-sm" onClick={() => setActivePlace(null)}>kembali</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} icon={<IoMdMap />} label="DAFTAR TEMPAT" />
            </div>
        </div>
    );
}

export default MapViewerLayout;