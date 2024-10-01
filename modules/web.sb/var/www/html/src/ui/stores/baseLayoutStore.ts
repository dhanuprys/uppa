import { create } from 'zustand';
import PlaceEntity from '../../data/entities/PlaceEntity';

type ViewMode = 'map' | 'panorama';
type SidebarMode = 'place_list' | 'place_detail';

type Store = {
    viewMode: ViewMode,
    viewPayload: any,
    setView: (viewMode: ViewMode, viewPayload: any) => void,

    sidebarMode: SidebarMode | null,
    sidebarOpen: boolean,
    sidebarPayload: any,
    setSidebar: (sidebarMode: SidebarMode, sidebarPayload: any, sidebarOpen?: boolean) => void,
    setSidebarOpen: (sidebarOpen: boolean) => void,

    activePlace: PlaceEntity | null,
    setActivePlace: (place: PlaceEntity | null) => void
};

const useBaseLayoutStore = create<Store>((set) => ({
    viewMode: 'map',
    viewPayload: null,
    setView: (viewMode: ViewMode, viewPayload: any) => 
        set(() => ({ viewMode, viewPayload })),

    sidebarMode: 'place_list',
    sidebarOpen: true,
    sidebarPayload: {},
    setSidebar: (sidebarMode: SidebarMode, sidebarPayload: any, sidebarOpen: boolean = true) => 
        set(() => ({ sidebarMode, sidebarPayload, sidebarOpen })),
    setSidebarOpen: (sidebarOpen: boolean) => set(() => ({ sidebarOpen })),

    activePlace: null,
    setActivePlace: (place: PlaceEntity | null) => set((state) => ({ activePlace: state.activePlace === place ? null : place }))
}));

export default useBaseLayoutStore;