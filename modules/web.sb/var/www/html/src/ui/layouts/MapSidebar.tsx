import { IoChevronUpOutline, IoSearch } from "react-icons/io5";
import { BaseProps } from '../props';
import PlaceEntity from '../../data/entities/PlaceEntity';
import { useEffect, useRef, useState } from 'react';

function MapSidebar({
    placeList,
    activePlace,
    onToggleClick,
    onPlaceClick,
    enabled,
    className
}: BaseProps & {
    placeList: PlaceEntity[],
    enabled: boolean,
    activePlace: PlaceEntity | null,
    onPlaceClick: (place: PlaceEntity) => void,
    onToggleClick: (isEnabled: boolean) => void
}) {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredPlaces, setFilteredPlaces] = useState<PlaceEntity[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!searchInput || searchInput === '') {
            setFilteredPlaces(placeList);
            return;
        }

        setFilteredPlaces(
            placeList.filter(place => {
                return place.name.toLowerCase().includes(searchInput.toLowerCase())
            })
        );
    }, [searchInput]);

    useEffect(() => {
        if (!enabled) {
            setSearchInput('');
            searchInputRef.current!.value = '';
        }
    }, [enabled]);

    return (
        <div onClick={() => !enabled && onToggleClick(true)} className={`${className || ''} transition-all duration-[400ms] ease-out translate-y-[85%] z-10 md:z-auto md:translate-y-0 md:-translate-x-3/4 ${enabled ? '!translate-y-0 md:!translate-x-0' : 'group'} fixed bottom-0 left-0 w-screen h-[85%] md:w-[400px] lg:w-[420px] md:h-screen`}>
            <div className="h-full md:p-8">
                <div className="h-full bg-white shadow-2xl border rounded-t-3xl md:rounded-3xl relative">
                    <div className="absolute right-1/2 translate-x-1/2 -translate-y-1/2 md:translate-x-1/2 md:right-0 md:top-1/2">
                        <div className="absolute z-[-1] size-[35px] bg-orange-700 rounded-full"></div>
                        <button
                            onClick={() => onToggleClick(!enabled)}
                            className={`transition flex justify-center items-center md:rotate-90 ${enabled ? '!rotate-180 md:!-rotate-90' : ''} group-hover:bg-blue-500 group-hover:animate-pulse group-hover:text-white size-[35px] bg-slate-200 rounded-full`}
                            aria-label="Toggle Sidebar">
                            <IoChevronUpOutline />
                        </button>
                    </div>
                    <div className={`pt-8 md:pt-0 transition-opacity opacity-0 flex flex-col h-full ${enabled ? 'opacity-100' : ''}`}>
                        {/** SEARCH BAR */}
                        <div className="p-4">
                            <div className="flex gap-2 px-4 py-2 items-center bg-slate-50 border rounded-2xl">
                                <IoSearch className="box-content size-5" />
                                <input ref={searchInputRef} onChange={(e) => setSearchInput(e.target.value.trim())} className="box-content w-full outline-none bg-transparent" placeholder="Cari tempat" />
                            </div>
                        </div>
                        {searchInput && searchInput !== '' && <span className="py-1 px-4">Hasil pencarian dari "{searchInput}"</span>}
                        {/** PLACE LIST */}
                        <div className="px-4 pb-4 flex-1 max-h-full overflow-auto">
                            <div className="py-2 px-1 space-y-2">
                                {filteredPlaces.map((place) => {
                                    const isActive = place === activePlace;
                                    return (
                                        <div onClick={() => onPlaceClick(place)} className={`flex hover:bg-slate-100 hover:cursor-pointer ${isActive ? 'ring-1 ring-blue-300 !bg-blue-50' : ''} p-2 rounded-2xl gap-3 items-center`}>
                                            <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full flex justify-center items-center">
                                                <img src={place.iconUrl} width="24" height="24" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold">{place.name}</h3>
                                                <p className="text-xs text-slate-500">#{place.vistaIndex} {place.category}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapSidebar;