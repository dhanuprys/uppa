import { IoIosArrowRoundBack } from 'react-icons/io';//
import useBaseLayoutStore from '../stores/baseLayoutStore';
import PlaceEntity from '../../data/entities/PlaceEntity';
import { useEffect } from 'react';

function PlaceDetailSBLayout({ backToMap, place }: { backToMap: () => void, place: PlaceEntity | null }) {
    useEffect(() => {
        if (!place) {
            backToMap();
        }
    }, [place]);

    if (!place) {
        return <div></div>;
    }

    return (
        <div className="min-w-[400px] p-4 z-50">
            <div className="mb-7">
                <div onClick={backToMap} className="flex gap-3 font-semibold text-blue-600 hover:text-blue-400 items-center hover:cursor-pointer group">
                    <IoIosArrowRoundBack className="text-3xl" />
                    <span className="transition-all group-hover:ml-2">KEMBALI</span>
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-2xl">{place.name}</h1>
                <p className="font-light">{place.description}</p>
            </div>
        </div>
    );
}

export default PlaceDetailSBLayout;