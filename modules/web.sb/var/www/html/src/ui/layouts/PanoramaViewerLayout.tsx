import { useEffect } from 'react';
import Button from '../components/Button';
import useBaseLayoutStore from '../stores/baseLayoutStore';
import RestiImage from '../../assets/images/resti.jpg';
import PlaceEntity from '../../data/entities/PlaceEntity';
import { IoMdMap } from 'react-icons/io';
import VistaIframe from '../components/VistaIframe';

function PanoramaSelectItem() {
    return (
        <div className="w-[90px] h-[90px] rounded bg-blue-700">
            <img src={RestiImage} className="object-cover size-full rounded" />
        </div>
    );
}

function PanoramaViewerLayout({ _3dVistaIndex, backToMap, place }: { _3dVistaIndex: number, backToMap: () => void, place: PlaceEntity | null }) {
    useEffect(() => {
        if (!place) {
            backToMap();
        }
    }, [place]);

    if (!place) {
        return <div></div>
    }

    return (
        <div>
            <div className="absolute top-0 left-0 size-full">
                <VistaIframe index={place.vistaIndex} />
            </div>
            <div className="absolute top-0 right-0">
                <div className="p-3 space-y-3">
                    {
                        place.images.map((image) => {
                            return <PanoramaSelectItem />
                        })
                    }
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
                <Button icon={<IoMdMap />} label="KEMBALI KE PETA" onClick={backToMap} />
            </div>
        </div>
    );
}

export default PanoramaViewerLayout;