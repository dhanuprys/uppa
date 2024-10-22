import { useEffect, useState } from 'react';
import useIsAppOffline from '../hooks/useIsAppOffline';
import { useNavigate } from 'react-router-dom';

function OfflineCheck() {
    const isOffline = useIsAppOffline();
    const navigate = useNavigate();
    const [isInitialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (isInitialLoading) {
            setInitialLoading(false);
        }

        if (!isInitialLoading && !isOffline) {
            navigate('/', {
                replace: true
            });
        }
    }, [isOffline]);

    if (!isOffline) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white z-[55]">
            HELLO BRO
        </div>
    );
}

export default OfflineCheck;