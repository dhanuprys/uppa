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
        description: 'Gedung asrama Undiksha Jinengdalem dibagi menjadi 2 jenis Gedung yakni 1 Gedung asrama putri dan 2 gedung asrama putra. Adapun asrama undiksha jinengdalem memiliki beberapa fasilitas yakni setiap 1 kamar terdiri dari ruang tidur dan belajar, 2 ranjang, kamar mandi, wastafel, balkon, dipan, kursi, meja, almari, buffet, nakas, cermin, jemuran, kipas angin, listrik, air dan internet yang disediakan juga gratis. Biaya tinggal di asrama tersebut yakni sebesar Rp. 2.500.000/ orang/tahun.',
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
        description: 'Parahyangan Undiksha Jinengdalem yakni tempat Suci yang sangat dihormati serta sebagai tempat Ibadah untuk umat Hindu. Khususnya umat hindu yang melakukan aktivitas di kampus Undiksha Jinengdalem. Terletak di sebelah utara Asrama. Memiliki 1 bale, pelinggih Surya dan pelinggih Taksu. Pada saat piodalan Parahyangan Jinengdalem, kami menyebutnya sebagai Piodalan FOK karena kampus Jinengdalem dominan dipakai oleh FOK.',
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
        description: 'Gedung Olahraga Fakultas Olahraga dan Kesehatan di Jinengdalem merupakan Gedung yang digunakan untuk melakukan kegiatan olahraga dan rekreasi, selain itu GOR FOK  juga sering digunakan sebagai tempat kegiatan seperti lomba, pkkmb Fakultas, dll. Dengan fasilitas yang lengkap dan berstandar tinggi, gedung ini menjadi pusat aktivitas fisik dan sosial bagi mahasiswa dan komunitas kampus.',
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
        description: 'Gedung Olahraga Fakultas Olahraga dan Kesehatan di Jinengdalem merupakan Gedung yang digunakan untuk melakukan kegiatan olahraga dan rekreasi, selain itu GOR FOK  juga sering digunakan sebagai tempat kegiatan seperti lomba, pkkmb Fakultas, dll. Dengan fasilitas yang lengkap dan berstandar tinggi, gedung ini menjadi pusat aktivitas fisik dan sosial bagi mahasiswa dan komunitas kampus.',
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
        description: 'Gedung perkuliahan FOK undiksha jinengdalem saat ini digunakan sebagai tempat perkuliahan bagi mahasiswa fakultas Teknik dan Kejuruan. Gedung ini memiliki lobby lantai 1 dan 2 lantai sebagai tempat perkuliahan. Gedung ini menjadi tempat yang strategis untuk memfasilitasi pengajaran dan pengembangan keterampilan mahasiswa dalam berbagai bidang studi. Ruang-ruang kelasnya  dirancang untuk mendukung metode pembelajaran yang interaktif dan kolaboratif, dengan kursi yang ergonomis dan teknologi yang memadai, seperti proyektor.',
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
        description: 'Gedung laboratorium FOK Undiksha Jinengdalem. Pada lantai 1 terdapat lobby dan juga tempat fitness, lantai pertama menyambut pengunjung dengan lobby yang luas dan nyaman, dilengkapi dengan area tunggu yang ramah sedangkan lantai 2 dan 3 digunakan sebagai tempat perkuliahan bagi mahasiswa FTK dan FOK.  Dengan desain yang baik, setiap ruang menciptakan atmosfer belajar yang kondusif, membantu mahasiswa dalam memahami materi dengan lebih efektif',
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
        description: 'Gedung Kemahasiswaan Fakultas Teknik dan Kejuruan (FTK) Undiksha merupakan pusat kegiatan yang dirancang untuk mendukung kehidupan mahasiswa di kampus. Dengan tiga lantai yang fungsional, gedung ini menjadi tempat yang ideal untuk belajar, bersosialisasi, dan berkolaborasi. Lantai paling atas memiliki 2 gazebo yang digunakan sebagai tempat bersantai. Gedung ini terletak di belakang Gedung perkuliahan FOK.',
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
        description: 'Undiksha Jinengdalem juga memiliki GOR Tenis Indoor, tak hanya kegiatan olahraga, Gedung ini sering kali digunakan sebagai tempat pengenalan kampus bagi mahasiswa baru khususnya FOK dan FTK, dan kegiatan lainnya. Gedung ini memiliki tribun dibagian lantai 2 tepat atas pintu masuk depan dan belakang.',
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
        description: 'Undiksha Jinengdalem  memiliki lapangan tenis Outdoor yang luas. Terletak di sebelah utara GOR Tenis Indoor, lapangan ini dirancang khusus untuk permainan tenis di luar ruangan. Lapangan ini juga dibatasi pembatas disekitar lapangan, pembatas jenis besi berwarna hijau, untuk menghindari bola yang keluar dari lapangan.',
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
        description: 'Kantin di Gedung Perkuliahan Fakultas Olahraga dan Kesehatan (FOK) Undiksha Jinengdalem merupakan tempat yang ramai dan hidup, menjadi pusat interaksi sosial bagi mahasiswa, dosen, dan staf. Kantin ini menyediakan suasana yang menyenangkan untuk bersantai dan beristirahat di antara jadwal perkuliahan. Kantin Undiksha Jinengdalem merupakan kantin satu-satunya yang ada di dalam lingkungan kampus. Kantin ini terletak di antara Gedung FOK dan Gedung perkuliahan FOK. Kantin Undiksha menjual beberapa menu yakni, nasi campur, nasi goreng, nasi rawon, mie instan dan aneka jajanan lainnya.',
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
        description: 'Parkir utama ini merupakan parkir terluas yang ada di Jinengdalem yang terletak tepat di depan Gedung Fakultas Olahraga dan Kesehatan. Parkir ini diperuntukan oleh Mahasiswa. Di parkir ini terdapat 2 jenis parkir yakni diperuntukan untuk motor dan mobil. Parkir ini memiliki pembatas berwarna kuning. Dengan fasilitas parkir yang memadai dan akses transportasi yang baik, mahasiswa dapat dengan mudah datang dan pergi.',
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
        description: 'GOR Fakultas Olahraga dan Kesehatan merupakan Gedung yang digunakan melakukan kegiatan keolahragaan, Gedung ini memiliki tribun yang berwarna merah, oranye, biru, putih. Gedung ini sering digunakan selain melakukan kegiatan keolahragaan juga dapat digunakan sebagai pkkmb fakultas, perlombaan antar jurusan dll. ',
        location: '',
        category: 'Gedung',
        vistaIndex: 19,
        coordinate: [-8.135307, 115.133389],
        images: [],
        iconUrl: BuildingIcon
    },
];

export default places;