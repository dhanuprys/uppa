import MapSidebar from '../layouts/MapSidebar';
import PlaceToast from '../layouts/PlaceToast';
import { BaseProps } from '../props';

function MainScreen({ className }: BaseProps) {
    return (
        <div className={`${className || ''} w-screen h-screen`}>
            <MapSidebar />
            <PlaceToast />
        </div>
    );
}

export default MainScreen;