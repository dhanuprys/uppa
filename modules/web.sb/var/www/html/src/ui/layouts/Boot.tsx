import { useEffect, useState } from 'react';
import UndikshaLogo from '../../assets/images/undiksha.png';
import UppaLogo from '../../assets/images/uppa.png';
import { BaseProps } from '../props';

function Boot({
    onBootUpDone,
    className
}: BaseProps & {
    onBootUpDone: () => void
}) {
    const [currentWidth, setCurrentWidth] = useState(0);
    const [isActiveGap, setActiveGap] = useState(false);
    const [isDoubleLogo, setDoubleLogo] = useState(false);
    const [isFinish, setFinish] = useState(false);

    const [bootstart, setBootstart] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setBootstart(true);
        }, 10_000);
    });

    useEffect(() => {
        if (!bootstart) return;
        let i = 0;

        const intervalId = setInterval(() => {
            setCurrentWidth(i++);

            if (i === 100) {
                clearInterval(intervalId);
                setFinish(true);

                setTimeout(() => {
                    onBootUpDone();
                }, 1200);
            } else if (i >= 55) {
                setDoubleLogo(true);
            } else if (i >= 30) {
                setActiveGap(true);
            }
        }, 100);

        return () => { clearInterval(intervalId) }
    }, [bootstart]);

    return (
        <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center">
            <div className={`fixed top-0 left-0 w-screen h-screen bg-black delay-500 opacity-0 transition-opacity ${isFinish ? 'opacity-100' : ''}`}></div>
            <div className={`relative flex justify-center min-w-[200px] md:min-w-[400px] min-h-[100px] md:min-h-[150px] transition-transform duration-[300ms] ${isActiveGap ? '-translate-y-2' : ''}`}>
                <img className={`absolute top-0 left-1/2 -translate-x-1/2 object-contain w-[100px] h-[100px] md:w-[150px] md:h-[150px] transition-all duration-700 opacity-0 ${isDoubleLogo && !isFinish ? 'opacity-100 translate-x-1/4' : ''}`} src={UppaLogo} />
                <img className={`absolute top-0 left-1/2 -translate-x-1/2 object-contain w-[100px] h-[100px] md:w-[150px] md:h-[150px] transition-transform duration-700 ${isDoubleLogo && !isFinish ? '-translate-x-full' : ''}`} src={UndikshaLogo} />
            </div>
            <div className={`w-[100px] transition-all duration-600 ${isDoubleLogo ? '!w-[200px] md:!w-[370px]' : ''} ${isFinish ? '!opacity-0' : ''} h-[7px] relative bg-slate-200 rounded-full ${isActiveGap ? 'translate-y-2' : ''}`}>
                <div style={{ width: `${currentWidth}%` }} className="h-[7px] animate-pulse bg-gradient-to-r from-blue-500 to-blue-950 rounded-full"></div>
            </div>
        </div>
    );
}

export default Boot;