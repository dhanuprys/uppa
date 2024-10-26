import { TbView360Number } from 'react-icons/tb';
import { BaseProps } from '../props';
import RouteImage from '../../assets/route.png';
import PlaceEntity from '../../data/entities/PlaceEntity';
import VistaIframe from '../components/VistaIframe';
import { useState } from 'react';
import { IoChevronBack, IoMapOutline } from 'react-icons/io5';

function PlaceToast({
    activePlace,
    opened,
    onOpenClick,
    onCancelClick,
    onDismissClick,
    className
}: BaseProps & {
    activePlace: PlaceEntity | null,
    opened: boolean,
    onOpenClick: (place: PlaceEntity) => void,
    onCancelClick: () => void,
    onDismissClick: () => void
}) {
    const [is360View, set360View] = useState(false);

    const backToMap = () => {
        set360View(false);
        onCancelClick();
    }

    return (
        <div className={`${className || ''} transition-all md:duration-300 ${opened ? 'duration-0 md:duration-500 delay-100 !w-screen !h-screen top-0 z-20' : ''} -translate-y-full md:translate-y-0 md:translate-x-full ${activePlace ? '!translate-y-0 md:!translate-x-0' : ''} fixed top-0 right-0 w-screen min-w-screen min-h-[150px] md:w-[450px] md:min-w-[500px] lg:min-w-[560px]`}>
            <div className={`transition-all md:duration-500 h-full w-full p-4 md:p-8 ${opened ? 'duration-0 md:delay-100 !p-0 md:!p-0' : ''}`}>
                <div className={`h-full relative grid grid-cols-3 gap-4 md:items-center bg-white border shadow-sm md:shadow-xl rounded-3xl px-4 py-4 md:py-2 md:!p-4 ${opened ? 'delay-[850ms] !p-0 !rounded-none before:!hidden' : ''} before:z-[-1] before:bg-gradient-to-r before:from-blue-600 before:hidden md:before:block before:absolute before:top-0 before:left-0 before:size-full before:rounded-3xl before:-translate-x-2 before:-translate-y-2`}>

                    {/** DETAIL  */}
                    {!is360View && <div className={`flex gap-2 order-1 md:order-none ${opened ? 'col-span-3 md:col-span-1 flex-col items-center p-8' : 'col-span-3'}`}>
                        <div className={`shrink-0 ${opened ? '' : 'hidden md:block'}`}>
                            <img alt="route-vector" className={`${opened ? 'w-[200px]' : 'w-[90px]'}`} src={RouteImage} />
                        </div>
                        <div className={`${opened ? 'text-center space-y-6' : ''}`}>
                            <h2 className={`text-lg md:text-xl ${opened ? 'font-semibold' : ''}`}>{activePlace?.name || 'Kampus Jineng Dalem'}</h2>
                            <p className={`text-slate-500 leading-4 md:leading-normal ${opened ? 'text-sm md:text-lg' : 'text-xs md:text-sm'}`}>{activePlace?.description.slice(0, 100) + '...' || 'Dolor velit dolore fugiat reprehenderit eu non. Sint ut est incididunt occaecat incididunt qui'}</p>
                            <div className={`mt-2 flex gap-x-2 ${opened ? 'justify-center' : 'justify-end md:justify-start'}`}>
                                {
                                    opened
                                        ? <button onClick={onCancelClick} className="text-blue-500 text-sm md:text-base px-6 py-1 rounded-full">Kembali ke Peta</button>
                                        : <>
                                            <button onClick={() => activePlace && onOpenClick(activePlace)} className="bg-blue-600 font-semibold hover:bg-blue-400 text-sm md:text-base text-white px-6 py-1 rounded-full">BUKA</button>
                                            <button onClick={onDismissClick} className="text-blue-500 text-sm md:text-base px-6 py-1 rounded-full">Batal</button>
                                        </>

                                }
                            </div>
                        </div>
                    </div>}

                    {/** PREVIEW 3D VISTA */}
                    {opened && <div className={`${is360View ? 'absolute w-screen' : 'relative'} col-span-3 md:col-span-2 bg-white h-full`}>
                        <VistaIframe iframeClassName={is360View ? '' : 'md:rounded-2xl'} className={`size-full ${is360View ? '' : 'rounded-2xl'}`} index={activePlace?.vistaIndex} />
                        {
                            is360View
                                ? <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-auto flex flex-row gap-2">
                                    <button onClick={() => set360View(false)} className="md:text-xl bg-[rgba(255,255,255,0.9)] px-6 py-3 rounded-full mb-4 font-semibold flex justify-center gap-2 items-center flex-1">
                                        <IoChevronBack />
                                        Kembali
                                    </button>
                                    <button onClick={backToMap} className="md:text-xl border-2 border-blue-50 bg-[rgba(255,255,255,0.8)] px-6 py-3 rounded-full mb-4 font-semibold flex justify-center gap-2 items-center hover:animate-pulse">
                                        <IoMapOutline />
                                        <span className="hidden md:block">Kembali ke peta</span>
                                    </button>
                                </div>
                                : <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-[rgba(0,0,0,0.6)] md:rounded-2xl">
                                    <button onClick={() => set360View(true)} className="md:text-xl highlight-button px-6 py-3 rounded-full font-semibold flex gap-2 items-center hover:animate-pulse">
                                        <TbView360Number />
                                        Buka di WorldView
                                    </button>
                                </div>}
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default PlaceToast;