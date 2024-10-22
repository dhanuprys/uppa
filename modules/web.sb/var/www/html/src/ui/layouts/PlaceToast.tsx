import { BaseProps } from '../props';

function PlaceToast({ className }: BaseProps) {
    return (
        <div className={`${className || ''} fixed top-0 right-0 w-screen min-w-screen min-h-[150px] md:w-[450px] md:min-w-[450px] lg:min-w-[480px]`}>
            <div className="h-full w-full p-4 md:p-8">
                <div className="h-full relative bg-white border shadow-sm md:shadow-xl rounded-2xl p-4 before:z-[-1] before:bg-slate-300 before:hidden md:before:block before:absolute before:top-0 before:left-0 before:size-full before:rounded-2xl before:-translate-x-2 before:-translate-y-2">
                    hello brok<br />
                </div>
            </div>
        </div>
    );
}

export default PlaceToast;