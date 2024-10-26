import { IoChevronUpOutline } from "react-icons/io5";
import { BaseProps } from '../props';

function MapSidebar({
    className,
    onToggleClick,
    enabled 
}: BaseProps & {
    enabled: boolean,
    onToggleClick: (isEnabled: boolean) => void
}) {
    return (
        <div onClick={() => !enabled && onToggleClick(true)} className={`${className || ''} transition-all duration-[400ms] ease-out translate-y-[80%] md:translate-y-0 md:-translate-x-3/4 ${enabled ? '!translate-y-0 md:!translate-x-0' : 'group'} fixed bottom-0 left-0 w-screen h-[50%] md:w-[400px] lg:w-[420px] md:h-screen`}>
            <div className="h-full md:p-8">
                <div className="h-full bg-white shadow-2xl border rounded-t-3xl md:rounded-3xl relative">
                    <div className={`p-4 transition-opacity opacity-0 ${enabled ? 'opacity-100' : ''}`}>
                        HELLO BROKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                    </div>
                    <div className="absolute right-1/2 translate-x-1/2 -translate-y-1/2 md:translate-x-1/2 md:right-0 md:top-1/2">
                        <div className="absolute z-[-1] size-[35px] bg-orange-700 rounded-full"></div>
                        <button
                            onClick={() => onToggleClick(!enabled)}
                            className={`transition flex justify-center items-center md:rotate-90 ${enabled ? '!rotate-180 md:!-rotate-90' : ''} group-hover:bg-blue-500 group-hover:animate-pulse group-hover:text-white size-[35px] bg-slate-200 rounded-full`}
                            aria-label="Toggle Sidebar">
                            <IoChevronUpOutline />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapSidebar;