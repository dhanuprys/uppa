import PlaceEntity from '../entities/PlaceEntity';
import BuildingIcon from '../../assets/images/building.png';
import SoccerIcon from '../../assets/images/soccer.png';
import PuraIcon from '../../assets/images/pura.png';
import RoadIcon from '../../assets/images/road.png';
import ShopIcon from '../../assets/images/shop.png';

const places: PlaceEntity[] = [
    {
        id: 'ga-1',
        name: 'JALAN MASUK',
        tags: ['jln', 'jallan', 'jaldan', 'jlan', 'jakan', 'jalwb', 'jala', 'jalana', 'msk', 'msuk', 'masul', 'nasul', 'masul', 'masduak', 'mausk', 'msukk', 'masukk'],
        description: 'Jalan masuk undiksha',
        location: '',
        category: 'Jalan',
        vistaIndex: 1,
        coordinate: [-8.132032, 115.134423],
        images: [],
        iconUrl: RoadIcon
    },
    {
        id: 'ga-2',
        name: 'GEDUNG ASRAMA',
        tags: ['gdung', 'gdng', 'aasrama', 'geding', 'asrmaa', 'geudng', 'asrama', 'asrma', 'ged', 'asr', 'asrama', 'gduhg', 'aserma', 'gdugg'],
        description: 'Gedung asrama Undiksha Jinengdalem dibagi menjadi 2 jenis Gedung yakni 1 Gedung asrama putri dan 2 gedung asrama putra...',
        location: '',
        category: 'Gedung',
        vistaIndex: 17,
        coordinate: [-8.134964, 115.133820],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-3',
        name: 'PARAHYANGAN',
        tags: ['parahyangnan', 'parhayangan', 'par', 'parhayangan', 'psrahyangan', 'psr', 'parhyangan', 'pwrahyangna', 'parahyangna', 'prah', 'parahyangann', 'paarahyangan', 'ar'],
        description: 'Parahyangan Undiksha Jinengdalem yakni tempat Suci yang sangat dihormati serta sebagai tempat Ibadah...',
        location: '',
        category: 'Pura',
        vistaIndex: 29,
        coordinate: [-8.134786, 115.134582],
        images: [],
        iconUrl: PuraIcon
    },
    {
        id: 'ga-4',
        name: 'GEDUNG OLAHRAGA FOK',
        tags: ['gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'olahrga', 'oalraga', 'olahrg', 'olah', 'oalh', 'olahr', 'fokk', 'fok', 'f', 'gor'],
        description: 'Gedung Olahraga Fakultas Olahraga dan Kesehatan di Jinengdalem...',
        location: '',
        category: 'Gedung',
        vistaIndex: 13,
        coordinate: [-8.134406, 115.133399],
        images: [],
        iconUrl: SoccerIcon
    },
    {
        id: 'ga-5',
        name: 'GEDUNG FOK',
        tags: ['gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'olahrga', 'oalraga', 'olahrg', 'olah', 'oalh', 'olahr', 'fokk', 'fok', 'f', 'gor'],
        description: 'Gedung Olahraga Fakultas Olahraga dan Kesehatan di Jinengdalem...',
        location: '',
        category: 'Gedung',
        vistaIndex: 30,
        coordinate: [-8.133288, 115.132981],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-6',
        name: 'GEDUNG PERKULIAHAN FOK',
        tags: ['gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'olahrga', 'oalraga', 'olahrg', 'olah', 'oalh', 'olahr', 'fokk', 'fok', 'f', 'gor', 'perkullian', 'perkuliahna', 'perkuliahann', 'perkliahan', 'perkuliahan', 'prkuliahan'],
        description: 'Gedung perkuliahan FOK undiksha jinengdalem saat ini digunakan sebagai tempat perkuliahan...',
        location: '',
        category: 'Gedung',
        vistaIndex: 83,
        coordinate: [-8.133177, 115.132498],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-7',
        name: 'GEDUNG LABORATORIUM FOK',
        tags: ['lab', 'gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'fokk', 'fok', 'f', 'ofk', 'kof'],
        description: 'Gedung laboratorium FOK Undiksha Jinengdalem...',
        location: '',
        category: 'Gedung',
        vistaIndex: 90,
        coordinate: [-8.132909, 115.132548],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-8',
        name: 'GEDUNG KEMAHASISWAAN FTK',
        tags: ['gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'f', 'fak', 'gedu', 'kemahadasiswaan', 'kema', 'siswaan', 'kmahsiswaaan', 'keemaa', 'kenasiswaan', 'kemahsiswan', 'teknik', 'kejuruan'],
        description: 'Gedung Kemahasiswaan Fakultas Teknik dan Kejuruan (FTK) Undiksha...',
        location: '',
        category: 'Gedung',
        vistaIndex: 76,
        coordinate: [-8.133139, 115.132069],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-9',
        name: 'GEDUNG GOR TENIS INDOOR',
        tags: ['gdung', 'gdng', 'geding', 'geudng', 'ged', 'gduhg', 'gdugg', 'olahrga', 'oalraga', 'olahrg', 'olah', 'oalh', 'olahr', 'fokk', 'fok', 'f', 'gor', 'gr', 'tennis', 'tnnis', 'indor', 'indoar', 'indora'],
        description: 'Undiksha Jinengdalem juga memiliki GOR Tenis Indoor...',
        location: '',
        category: 'Gedung',
        vistaIndex: 52,
        coordinate: [-8.132201, 115.131984],
        images: [],
        iconUrl: SoccerIcon
    },
    {
        id: 'ga-10',
        name: 'LAPANGAN TENIS OUTDOOR',
        tags: ['lap', 'lpngan', 'apangan', 'lapngan', 'tennis', 'tnnis', 'otdor', 'outror', 'lpangn'],
        description: 'Undiksha Jinengdalem memiliki lapangan tenis Outdoor yang luas...',
        location: '',
        category: 'Ruang Lapang',
        vistaIndex: 45,
        coordinate: [-8.131670, 115.131717],
        images: [],
        iconUrl: SoccerIcon
    },
    {
        id: 'ga-11',
        name: 'KANTIN',
        tags: ['kntin', 'ktin', 'katinn', 'kantinn', 'ktn', 'canteen', 'kan', 'kantinn', 'kaatnin', 'kaantin', 'kantinn'],
        description: 'Kantin di Gedung Perkuliahan Fakultas Olahraga dan Kesehatan (FOK) Undiksha Jinengdalem...',
        location: '',
        category: 'Gedung',
        vistaIndex: 72,
        coordinate: [-8.133552, 115.132728],
        images: [],
        iconUrl: ShopIcon
    },
    {
        id: 'ga-12',
        name: 'PARKIR UTAMA',
        tags: ['pparkr', 'uatam', 'parir', 'utana', 'parkil', 'utamaa', 'utamaa', 'parkir', 'ytama', 'parlir', 'utamq'],
        description: 'Parkir utama ini merupakan parkir terluas yang ada di Jinengdalem...',
        location: '',
        category: 'Ruang Lapang',
        vistaIndex: 53,
        coordinate: [-8.132901, 115.133025],
        images: [],
        iconUrl: BuildingIcon
    },
    {
        id: 'ga-13',
        name: 'GEDUNG ASRAMA PUTRA',
        tags: ['gdng', 'aasrama', 'geding', 'asrmaa', 'geudng', 'asrama', 'asrma', 'ged', 'asr', 'asrama', 'gduhg', 'aserma', 'gdugg'],
        description: 'Gedung asrama Undiksha Jinengdalem dibagi menjadi 2 jenis Gedung yakni 1 Gedung asrama putri dan 2 gedung asrama putra...',
        location: '',
        category: 'Gedung',
        vistaIndex: 14,
        coordinate: [-8.135101, 115.134550],
        images: [],
        iconUrl: BuildingIcon
    }
];

export default places;