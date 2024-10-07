import L, { LatLngExpression } from 'leaflet';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import PlaceEntity from '../../data/entities/PlaceEntity';
import { useEffect, useState } from 'react';
import calculateDistance from '../../utils/calculateDistance';
import useBaseLayoutStore from '../stores/baseLayoutStore';

function WorldMap({ places, activePlace, onPlaceClick, requestRestart }: { activePlace: PlaceEntity | null, places: PlaceEntity[], onPlaceClick: (place: PlaceEntity) => void, requestRestart: () => void }) {
    const position = [-8.1329829, 115.1321591];
    const coord = useState<[number, number][]>([]);
    let mapInstance: L.Map | null = null;
    const nativeCenter = [-8.133695693575845, 115.13305995435007] as [number, number];

    const {
        sidebarOpen,
    } = useBaseLayoutStore();

    useEffect(() => {
        mapInstance?.flyTo(nativeCenter);
    }, [sidebarOpen]);

    useEffect(() => {
        mapInstance?.flyTo(activePlace?.coordinate ?? nativeCenter, 18, {
            duration: 0.35
        });
    }, [activePlace]);

    const MapClickHandler = () => {
        mapInstance = useMap();

        // useEffect(() => {
        //     console.log('changed');
        // }, []);

        useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                coord[1]([...coord[0], [lat as number, lng as number]])
                console.log(JSON.stringify(coord[0]));
            },
            dragend: (event) => {
                const map = event.target;
                const center = (a => [a.lat, a.lng])(map.getCenter()) as [number, number];
                const distance = calculateDistance(center, nativeCenter);

                if (distance > 0.6) {
                    requestRestart();

                    setTimeout(() => {
                        mapInstance!.flyTo(nativeCenter);
                    });
                }
            }
        });

        return null;
    };

    return (
        <div className="size-full max-w-full max-h-full overflow-hidden relative">
            <MapContainer className="size-full scale-[1.7] lg:scale-[1.9] !bg-black" zoomControl={false} scrollWheelZoom={false} center={position as LatLngExpression} maxZoom={18} zoom={22}>
                <TileLayer url="/tiles/{z}/{x}/{y}.jpg" maxZoom={25} maxNativeZoom={25} />
                {/* <TileLayer url="http://localhost:8800/{x}/{y}" maxZoom={25} maxNativeZoom={25} /> */}
                {
                    places && places.map((place) => {
                        const markerIcon = new L.Icon({
                            iconUrl: place.iconUrl,
                            iconSize: [20, 20],
                            iconAnchor: [7, 12],
                            popupAnchor: [0, -34],
                        });
                        
                        const markerIconActive = new L.Icon({
                            iconUrl: place.iconUrl,
                            iconSize: [30, 30],
                            iconAnchor: [13, 14],
                            popupAnchor: [0, -34],
                        });

                        return (
                            <Marker
                                key={place.id}
                                eventHandlers={{
                                    click: () => onPlaceClick(place)
                                }}
                                position={place.coordinate}
                                icon={activePlace === place ? markerIconActive : markerIcon}>
                            </Marker>
                        );
                    })
                }
                <Polyline positions={[[-8.132050029995854, 115.13441862606756], [-8.13312694012695, 115.13331158358946], [-8.133559220140647, 115.13338053433205], [-8.133805695378369, 115.13350694402675], [-8.13401804315397, 115.13367549028642], [-8.134207639287174, 115.13388234251414], [-8.134416194930086, 115.1340623805642], [-8.134526160589017, 115.13407770295143], [-8.134632334300047, 115.13402407459613], [-8.134742299899717, 115.1339742768376], [-8.134939479520057, 115.1335644029789], [-8.13514424286933, 115.13321964926602]]} color="rgba(255, 255, 255, 0.4)" weight={7} />
                <Polyline positions={[[-8.13312694012695, 115.13331158358946], [-8.133100396602176, 115.13281360600416], [-8.132656740284645, 115.13283658958503], [-8.132387512707298, 115.13281743660096], [-8.132266170641511, 115.13273699406797], [-8.132258586761157, 115.13247268288806], [-8.131940063657762, 115.13224284707948], [-8.131902144223835, 115.13185595680167], [-8.13220170765412, 115.13158398442816], [-8.132607445107947, 115.13167974934844], [-8.132698451583256, 115.1321432515624], [-8.132569525737136, 115.13235010379015], [-8.132266170641511, 115.13249183587214]]} color="rgba(255, 255, 255, 0.4)" weight={7} />
                <Polyline positions={[[-8.133343905384764, 115.13212800829999], [-8.1334273278347, 115.1321854672521], [-8.13347283098191, 115.13274090378955], [-8.133108805659745, 115.13280985453216]]} color="rgba(255, 255, 255, 0.4)" weight={7} />
                <Polyline positions={[[-8.13347283098191, 115.13274090378955], [-8.133528884716293, 115.1333728731384]]} color="rgba(255, 255, 255, 0.4)" weight={7} />
                <Polyline positions={[[-8.134734716066207, 115.13400492161207], [-8.134765051399306, 115.1340508887738], [-8.134677837310457, 115.13416580667807], [-8.134666461558336, 115.13426157159836], [-8.134730924149414, 115.13436882830902], [-8.134833305890385, 115.13445310143885]]} color="rgba(255, 255, 255, 0.5)" weight={7} />
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default WorldMap;