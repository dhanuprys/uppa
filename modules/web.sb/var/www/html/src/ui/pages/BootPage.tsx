import { useEffect, useState } from 'react';
import UndikshaLogo from '../../assets/images/undiksha.png';
import UppaLogo from '../../assets/images/uppa.png';
import { useNavigate } from 'react-router-dom';

function BootPage() {
    const [currentWidth, setCurrentWidth] = useState(0);
    const navigate = useNavigate();
    const [isActiveGap, setActiveGap] = useState(false);
    const [isDoubleLogo, setDoubleLogo] = useState(false);
    const [isFinish, setFinish] = useState(false);

    useEffect(() => {
        let i = 0;

        const intervalId = setInterval(() => {
            setCurrentWidth(i++);

            if (i >= 30) {
                setActiveGap(true);
            }

            if (i >= 55) {
                setDoubleLogo(true);
            }

            if (i === 100) {
                clearInterval(intervalId);
                setFinish(true);

                setTimeout(() => {
                    navigate(
                        '/main',
                        {
                            replace: true
                        }
                    );
                }, 1000);
            }
        }, 100);

        return () => { clearInterval(intervalId) }
    }, [navigate]);

    return (
        <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center">
            <div className={`fixed top-0 left-0 w-screen h-screen bg-black delay-500 opacity-0 transition-opacity ${isFinish ? 'opacity-100' : ''}`}></div>
            <div className={`relative flex justify-center min-w-[400px] min-h-[170px] transition-transform duration-[300ms] ${isActiveGap ? '-translate-y-2' : ''}`}>
                <img className={`absolute top-0 left-1/2 -translate-x-1/2 object-contain w-[170px] h-[170px] transition-all duration-700 opacity-0 ${isDoubleLogo && !isFinish ? 'opacity-100 translate-x-1/4' : ''}`} src={UppaLogo} />
                <img className={`absolute top-0 left-1/2 -translate-x-1/2 object-contain w-[170px] h-[170px] transition-transform duration-700 ${isDoubleLogo && !isFinish ? '-translate-x-full' : ''}`} src={UndikshaLogo} />
            </div>
            <div className={`w-[170px] transition-all duration-600 ${isDoubleLogo ? '!w-[370px]' : ''} ${isFinish ? '!opacity-0' : ''} h-[7px] relative bg-slate-200 rounded-full ${isActiveGap ? 'translate-y-2' : ''}`}>
                <div style={{ width: `${currentWidth}%` }} className="h-[7px] animate-pulse bg-gradient-to-r from-blue-500 to-blue-950 rounded-full"></div>
            </div>
        </div>
    );
}

export default BootPage;