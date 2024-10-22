import { BaseProps } from '../props';

function MapSidebar({ className }: BaseProps) {
    return (
        <div className={`${className || ''} fixed bottom-0 left-0 w-screen h-[50%] md:w-[400px] lg:w-[420px] md:h-screen`}>
            <div className="h-full md:p-8">
                <div className="h-full bg-white shadow-2xl border rounded-t-2xl md:rounded-2xl relative">
                    <div className="absolute right-1/2 translate-x-1/2 -translate-y-1/2 md:translate-x-1/2 md:right-0 md:top-1/2">
                        <div className="size-[45px] bg-blue-500 rounded-full"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MapSidebar;