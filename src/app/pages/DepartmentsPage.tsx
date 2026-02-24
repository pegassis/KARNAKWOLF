import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Cog, Building2, Lightbulb, Hammer, PartyPopper, Star, Search, X, ArrowRight, Calendar, IndianRupee } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// import StarBorder from '../components/StarBorder';

const departments = [
    {
    id: 'all',
    name: 'Registration for All Events',
    icon: Star,
    color: '#5acc40',
 
    gradient: 'from-[#5acc40]/20 to-[#5BA3A3]/5'
  },
   {
    id: 'civil',
    name: 'Civil',
    icon: Building2,
    color: '#C65D3B',
    description: 'Structures, Design, Planning',
    gradient: 'from-[#C65D3B]/20 to-[#C65D3B]/5'
  },
    {
    id: 'mechanical',
    name: 'Mechanical',
    icon: Cog,
    color: '#5BA3A3',
    description: 'Robotics, CAD, Manufacturing',
    gradient: 'from-[#5BA3A3]/20 to-[#5BA3A3]/5'
  },
   {
    id: 'electrical',
    name: 'Electrical',
    icon: Lightbulb,
    color: '#B8956A',
    description: 'Power Systems, Control, Energy',
    gradient: 'from-[#B8956A]/20 to-[#B8956A]/5'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    color: '#B8956A',
    description: 'Circuits, Embedded Systems, IoT',
    gradient: 'from-[#B8956A]/20 to-[#B8956A]/5'
  },
  {
    id: 'computer-science',
    name: '‎ ‎ ‎ ‎Computer  Science,‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ Data Science, AI & ML',
    icon: Cpu,
    color: '#C65D3B',
    description: 'Coding, AI, Web Dev, Cybersecurity',
    gradient: 'from-[#C65D3B]/20 to-[#C65D3B]/5'
  },
  {
    id: 'general',
    name: 'Computer Applications',
    icon: Hammer,
    color: '#5BA3A3',
    description: 'Cross-domain, Workshops, Talks',
    gradient: 'from-[#5BA3A3]/20 to-[#5BA3A3]/5'
  },
  {
    id: 'fun',
    name: 'Fun-Games',
    icon: PartyPopper,
    color: '#775ba3',
    description: 'Fun And Fun Only',
    gradient: 'from-[#775ba3]/20 to-[#775ba3]/5'
  }
 
];

// Events data structure for search
const departmentEvents: Record<string, any> = {
  'computer-science': {
    name: 'Computer Science (DS, AI & ML)',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'VR Vortex',
        date: 'February 27-28, 2026',
        fee: '₹30-40',
        badge: 'Expo',
        image: '/depfolds/comps/vrposter.jpeg',
        registrationUrl: 'https://makemypass.com/event/vr-vortex',
        contact: [{ name: 'Adinath', phone: '8921798670' }, { name: 'Anand', phone: '6238763675' }]
      },
      {
        id: 2,
        name: 'GAMING_XP',
        date: 'February 27-28, 2026',
        fee: '₹30-40',
        badge: 'Workshop',
        image: '/depfolds/comps/GAMING_XP.jpeg',
        registrationUrl: 'https://makemypass.com/event/gamingxp',
        contact: [{ name: 'Rehab', phone: '7907844588' }, { name: 'Fidha', phone: '9947304940' }]
      },
      {
        id: 3,
        name: 'PIXELIA',
        date: 'February 27, 2026',
        fee: '₹50-60',
        badge: 'Competition',
        image: '/depfolds/comps/pixelia.jpeg',
        registrationUrl: 'https://makemypass.com/event/pixelia',
        contact: [{ name: 'Hail Mary', phone: '8078925526' }, { name: 'Joel George', phone: '9188492986' }]
      },
      {
        id: 4,
        name: 'Pixel Puzzle',
        date: 'February 27, 2026',
        fee: '₹50-60',
        badge: 'Competition',
        image: '/depfolds/comps/puzzle.jpeg',
        registrationUrl: 'https://makemypass.com/event/pixel-puzzle',
        contact: [{ name: 'Yeldho', phone: '9495171414' }, { name: 'Agnus', phone: '9544266892' }]
      },
      {
        id: 5,
        name: 'Splash Pitch',
        date: 'February 27, 2026',
        fee: '₹500-600',
        badge: 'Entertainment',
        image: '/depfolds/comps/splash.jpeg',
        registrationUrl: 'https://makemypass.com/event/splash-pitch',
        contact: [{ name: 'Kevin', phone: '8075723712' }, { name: 'Ryan', phone: '6238890177' }]
      },
      {
        id: 6,
        name: 'Tech Trove',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/comps/techtrove.jpeg',
        registrationUrl: 'https://makemypass.com/event/techtrove',
        contact: [{ name: 'Justin', phone: '7736309758' }, { name: 'Amrutha', phone: '7594907504' }]
      },
      {
        id: 7,
        name: 'Code, Predict, Conquer – Machine Learning Workshop',
        date: 'February 28, 2026',
        fee: 'FREE',
        badge: 'Workshop',
        image: '/depfolds/comps/codepredict.jpeg',
        registrationUrl: 'https://makemypass.com/event/code-predict-conquer',
      },
      {
        id: 8,
        name: 'CODE X BLIND (Blind Coding)',
        date: 'February 27, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/comps/blindcoding.jpeg',
        registrationUrl: 'https://makemypass.com/event/blindx-code',
        contact: [{ name: 'Leen Leo', phone: '8075750254' }, { name: 'Emil Mareena P', phone: '6235868192' }]
      },
      {
        id: 9,
        name: 'CODE REWIND (Reverse Coding Challenge)',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/comps/codewind.jpeg',
        registrationUrl: 'https://makemypass.com/event/code-rewind',
      },
      {
        id: 10,
        name: 'Tech Hunt',
        date: 'February 27, 2026',
        fee: '₹10-20',
        badge: 'Competition',
        image: '/depfolds/comps/techhunt.jpeg',
        registrationUrl: 'https://makemypass.com/event/tech-hunt',
        contact: [{ name: 'Anudev', phone: '9778155243' }, { name: 'Anna', phone: '8714224467' }]
      },
      {
        id: 11,
        name: 'NETRIOT (LAN Gaming)',
        date: 'February 27-28, 2026',
        fee: '₹30-40',
        badge: 'Competition',
        image: '/depfolds/comps/netriot.jpeg',
        registrationUrl: 'https://makemypass.com/event/netriot',
        contact: [{ name: 'Febin', phone: '9562767233' }, { name: 'Sain', phone: '8139879470' }]
      },
      {
        id: 12,
        name: 'CODE REWIND (Reverse Coding Challenge)',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/comps/reversecoding.jpeg',
        registrationUrl: 'https://makemypass.com/event/coderewind',
        contact: [{ name: 'Christepher C Biju', phone: '8921057348' }, { name: 'Basil Biju', phone: '7558850154' }]
      },
      {
        id: 13,
        name: 'PROMPT TO PIXEL (AI Application Building workshop)',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Workshop',
        image: '/depfolds/comps/prompt.jpeg',
        registrationUrl: 'https://makemypass.com/event/prompt-to-pixel',
        contact: [{ name: 'Gayathridevi K', phone: '8921169842' }, { name: 'Rinsa Fathima M A', phone: '8606033545' }]
      },
      {
        id: 14,
        name: 'THE THINK TANk',
        date: 'February 27, 2026',
        fee: 'FREE',
        badge: 'Competition',
        image: '/depfolds/comps/thinktank.jpeg',
        registrationUrl: 'https://makemypass.com/event/the-thinktank',
        contact: [{ name: 'Samuel', phone: '8137897726' }, { name: 'Helvin', phone: '8590018466' }]
      },
      {
        id: 15,
        name: 'LPSC InnovateX',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/comps/lpsc.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Aleena', phone: '9048847676' }, { name: 'Gouripriya', phone: '9447290587' }]
      },
      {
        id: 16,
        name: 'THE IPL AUCTION-PITCH TO POCKET',
        date: 'February 27, 2026',
        fee: '₹160-200',
        badge: 'Competition',
        image: '/depfolds/comps/ipl.jpeg',
        registrationUrl: 'https://makemypass.com/event/pitch-to-pocket',
        contact: [{ name: 'Joel', phone: '7907502537' }, { name: 'Seetha', phone: '9074490518' }]
      },
      {
        id: 17,
        name: 'VIBE.EXE(Vibe Coding)',
        date: 'February 27, 2026',
        fee: '₹30',
        badge: 'Competition',
        image: '/depfolds/comps/vibe.jpeg',
        registrationUrl: 'https://makemypass.com/event/vibe-exe',
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      },
      {
        id: 18,
        name: 'HACK / DEMO / DEFEND (Ethical Hacking Workshop)',
        date: 'February 27, 2026',
        fee: '₹30',
        badge: 'Workshop',
        image: '/depfolds/comps/hack.jpeg',
        registrationUrl: 'https://makemypass.com/event/hack-demo-defend',
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      },
      {
        id: 19,
        name: 'RALLY RAID (RC Off-road Challenge)',
        date: 'February 27-28, 2026',
        fee: '₹40-50',
        badge: 'Competition',
        image: '/depfolds/comps/rally.jpeg',
        registrationUrl: 'https://makemypass.com/event/rally-raid',
        contact: [{ name: 'Eldho', phone: '8590616499' }, { name: 'Sain', phone: '8139879470' }]
      },
      {
        id: 20,
        name: 'Steel Storm',
        date: 'February 27-28, 2026',
        fee: '₹40-50',
        badge: 'Competition',
        image: '/depfolds/comps/steel.jpeg',
        registrationUrl: 'https://makemypass.com/event/steelstorm',
        contact: [{ name: 'Manna', phone: '8089581794' }, { name: 'Edwin', phone: '9778305942' }]
      },
      {
        id: 21,
        name: 'Deadlock',
        date: 'February 27-28, 2026',
        fee: '₹70-90',
        badge: 'Entertainment',
        image: '/depfolds/comps/deadlock.jpeg',
        registrationUrl: 'https://makemypass.com/event/deadlock',
        contact: [{ name: 'Vandana M P', phone: '7012334369' }, { name: 'Marwa', phone: '8301909588' }]
      },
      {
        id: 22,
        name: 'Funfinity (Mini Games)',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Entertainment',
        image: '/depfolds/comps/minigames.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Vismaya', phone: '9544251901' }, { name: 'Vinayathri', phone: '9778140400' }]
      },
      {
        id: 23,
        name: 'Mechamorphosis (E-Waste Sculpture)',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/comps/mecha.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Manna', phone: '8089581794' }]
      },
    ]
  },
  'civil': {
    name: 'Civil',
    color: '#C65D3B',
    events: [
      {
        id: 1,
        name: 'TITAN TENSION (BRIDGE MAKING COMPETITION)',
        date: 'February 28, 2026',
        fee: '₹165',
        badge: 'Competition',
        image: '/depfolds/civ/titan.jpeg',
        registrationUrl: 'https://makemypass.com/event/titan-tension',
        contact: [{ name: 'Mathew Abraham', phone: '8078426690' }, { name: 'Akshara K R', phone: '8848070864' }]
      },
      {
        id: 2,
        name: 'STATICA (STILL MODEL COMPETITION)',
        date: 'February 27, 2026',
        fee: '₹220',
        badge: 'Competition',
        image: '/depfolds/civ/static.jpeg',
        registrationUrl: 'https://makemypass.com/event/statica',
        contact: [{ name: 'Prof. Rinku Kuriakose', phone: '9846271793' }, { name: 'Mariya Stanselavos', phone: '9074185655' }]
      },
      {
        id: 3,
        name: 'The Heavy Haulage Show',
        date: 'February 27, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/civ/heavy.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Mr. Basil Eldhose', phone: '9895343839' }, { name: 'Eldho Paulose', phone: '8075587355' }]
      },
      {
        id: 4,
        name: 'BIMNOVA',
        date: 'February 27, 2026',
        fee: '₹110',
        badge: 'Workshop',
        image: '/depfolds/civ/bimnova.jpeg',
        registrationUrl: 'https://makemypass.com/event/bimnova',
        contact: [{ name: 'Ms. Vidya Vijayan', phone: '8138827243' }, { name: 'Ms. Arya P. V.', phone: '8590876166' }]
      },
      {
        id: 5,
        name: 'VISION IN LINES',
        date: 'February 28, 2026',
        fee: '₹110',
        badge: 'Workshop',
        image: '/depfolds/civ/vision.jpeg',
        registrationUrl: 'https://makemypass.com/event/vision-in-lines',
        contact: [{ name: 'Prof.Vidya Vijayan', phone: '8138827243' }, { name: 'Meera P Gireesh', phone: '8590698764' }]
      },
      {
        id: 6,
        name: 'MAQUETA ACTIVA',
        date: 'February 27, 2026',
        fee: '₹220',
        badge: 'Competition',
        image: '/depfolds/civ/maqueta.jpeg',
        registrationUrl: 'https://makemypass.com/event/maqueta-activa',
        contact: [{ name: 'Prof.Devanjana Manu', phone: '9778257605' }, { name: 'Jithu Joby', phone: '8590741298' }]
      },
      {
        id: 7,
        name: 'CAD PINNACLE (CAD Drawing Competition)',
        date: 'February 27, 2026',
        fee: '₹55',
        badge: 'Competition',
        image: '/depfolds/civ/cadpin.jpeg',
        registrationUrl: 'https://makemypass.com/event/cad-pinnacle',
        contact: [{ name: 'Mr. Adeeb A.A', phone: '9995370174' }, { name: 'Mr. Niranjan T.P', phone: '8129291099' }]
      },
      {
        id: 8,
        name: 'BITSCAZA (TREASURE HUNT)',
        date: 'February 27, 2026',
        fee: '₹165',
        badge: 'Competition',
        image: '/depfolds/civ/8.jpeg',
        registrationUrl: 'https://makemypass.com/event/bitscaza',
        contact: [{ name: 'Salini Mohan', phone: '9633099290' }, { name: 'Sreehari Shaji', phone: '9037275307' }]
      },
      {
        id: 9,
        name: 'IDEA 2 INFRA (BUILD-UP IDEATHON)',
        date: 'February 27, 2026',
        fee: '₹275',
        badge: 'Competition',
        image: '/depfolds/civ/9.jpeg',
        registrationUrl: 'https://makemypass.com/event/idea-2-infra',
        contact: [{ name: 'Supriya T.S', phone: '8075493079' }, { name: 'Sona Eldhose', phone: '8086491985' }]
      },
      {
        id: 10,
        name: 'RAKSHAK (Fire & Rescue Awareness Initiative)',
        date: 'February 27, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/civ/10.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Mr. Kailas G Nath', phone: '7306844581' }, { name: 'Mr. Basil Shaji', phone: '8111895460' }]
      },
      {
        id: 11,
        name: 'The Civilverse',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/civ/11.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Prof.Deepthy Varkey', phone: '9496333858' }, { name: 'Adhithyan c jain', phone: '7736233238' }]
      },
    ]
  },
  'mechanical': {
    name: 'Mechanical',
    color: '#5BA3A3',
    events: [
      {
        id: 1,
        name: 'SEMINAR AND INNOVATION',
        date: 'February 27, 2026',
        fee: '₹80',
        badge: 'Competition',
        image: '/depfolds/mec/idea.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Nandana Sunil', phone: '6235734127' }, { name: 'Anand', phone: '9778442389' }]
      },
      {
        id: 2,
        name: 'CIRCLE SMASH (Mini Game)',
        date: 'February 27, 2026',
        fee: '₹30',
        badge: 'Entertainment',
        image: '/depfolds/mec/mini.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Basil Eldhose', phone: '6235366926' }, { name: 'Martin Antony', phone: '6235887598' }]
      },
      {
        id: 3,
        name: 'LATHE MASTER',
        date: 'February 27, 2026',
        fee: '₹130',
        badge: 'Competition',
        image: '/depfolds/mec/spin.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Midhun', phone: '9037165193' }]
      },
      {
        id: 4,
        name: 'AUTO XPLORE',
        date: 'February 27, 2026',
        fee: '₹230',
        badge: 'Workshop',
        image: '/depfolds/mec/auto.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Shifan', phone: '9747723133' }, { name: 'Ashkar', phone: '6238535799' }]
      },
      {
        id: 5,
        name: 'STEEL ARMS (CHALLENGE)',
        date: 'February 27, 2026',
        fee: '₹30',
        badge: 'Competition',
        image: '/depfolds/mec/5.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Eldhose', phone: '9061022005' }]
      },
      {
        id: 6,
        name: 'FREE FIRE XPLORE 2026',
        date: 'February 27, 2026',
        fee: '₹230',
        badge: 'Competition',
        image: '/depfolds/mec/6.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Shown k Moncy', phone: '7510316752' }, { name: 'Sobin Chacko', phone: '9496806446' }]
      },
      {
        id: 7,
        name: 'MEP Master Workshop',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Workshop',
        image: '/depfolds/mec/7.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Kevin S Dev', phone: '9495887576' }, { name: 'Thahir PS', phone: '7593906129' }]
      },
      {
        id: 8,
        name: 'GRIP & FIT CHALLENGE',
        date: 'February 27, 2026',
        fee: '₹130',
        badge: 'Competition',
        image: '/depfolds/mec/8.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Andrews', phone: '9562336350' }, { name: 'Seth', phone: '8590973900' }]
      },
      {
        id: 9,
        name: 'TECHNOVA',
        date: 'February 27, 2026',
        fee: '₹80',
        badge: 'Competition',
        image: '/depfolds/mec/9.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Anson P Babu', phone: '8943479975' }, { name: 'Govindh Krishnan', phone: '7510723398' }]
      },
    ]
  },
  'electrical': {
    name: 'Electrical',
    color: '#B8956A',
    events: [
      {
        id: 1,
        name: 'EV SHOW',
        date: 'February 27, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/eee/1.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Mohammed Arshad K A', phone: '6235273173' }]
      },
      {
        id: 2,
        name: 'POSTER & LOGO COMPETITION',
        date: 'February 27, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/eee/poster.jpeg',
        registrationUrl: 'https://makemypass.com/event/poster-logo',
        contact: [{ name: 'Fathima Zahra', phone: '7560826349' }, { name: 'Achu T V', phone: '7306990697' }]
      },
      {
        id: 3,
        name: 'CAD LAB WORKSHOP',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Workshop',
        image: '/depfolds/eee/cad.jpeg',
        registrationUrl: 'https://makemypass.com/event/eee-cad-workshop',
        contact: [{ name: 'Aboobakkar Sidhiq T A', phone: '9605558231' }, { name: 'Muhammed Shah V M', phone: '7736207517' }]
      },
      {
        id: 4,
        name: 'ELECTRICAL QUIZ',
        date: 'February 28, 2026',
        fee: '₹100',
        badge: 'Competition',
        image: '/depfolds/eee/quiz.jpeg',
        registrationUrl: 'https://makemypass.com/event/electrical-quizz',
        contact: [{ name: 'Alvin Saju', phone: '7012877401' }, { name: 'Deva Surya', phone: '8078472116' }]
      },
      {
        id: 5,
        name: 'MISSION: BOMB DEFUSE',
        date: 'February 27, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/eee/bomb.jpeg',
        registrationUrl: 'https://makemypass.com/event/bomb-diffusal',
        contact: [{ name: 'Basil Mathew Eldho', phone: '8281207566' }]
      },
      {
        id: 6,
        name: 'Wiring wizards (wiring Competition)',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/eee/wiring.jpeg',
        registrationUrl: 'https://makemypass.com/event/wiring-competition-1',
        contact: [{ name: 'Anjal', phone: '9400090728' }, { name: 'Ljin', phone: '9074807202' }]
      },
    ]
  },
  'electronics': {
    name: 'Electronics',
    color: '#B8956A',
    events: [
      {
        id: 1,
        name: 'skyforge (drone workshop)',
        date: 'February 27, 2026',
        fee: '₹200',
        badge: 'Workshop',
        image: '/depfolds/ec/skyforge.jpeg',
        registrationUrl: 'https://makemypass.com/event/skyforge',
        contact: [{ name: 'Fawas T Hamsa', phone: '9037220618' }, { name: 'Harikrishnan', phone: '9037018509' }]
      },
      {
        id: 2,
        name: 'voltera (bulb making workshop)',
        date: 'February 28, 2026',
        fee: '₹110',
        badge: 'Workshop',
        image: '/depfolds/ec/voltera.jpeg',
        registrationUrl: 'https://makemypass.com/event/voltera',
        contact: [{ name: 'Navaneeth C V', phone: '9072392054' }, { name: 'Ashkar Salim', phone: '8590330521' }]
      },
      {
        id: 3,
        name: 'pi stark (rasberry pi workshop)',
        date: 'February 27, 2026',
        fee: '₹150',
        badge: 'Workshop',
        image: '/depfolds/ec/pistack.jpeg',
        registrationUrl: 'https://makemypass.com/event/pi-stark',
        contact: [{ name: 'Samuel Joshy', phone: '8075187294' }, { name: 'Sana Fathima', phone: '9497670658' }]
      },
      {
        id: 4,
        name: 'Spark hub (arduino workshop)',
        date: 'February 28, 2026',
        fee: '₹130',
        badge: 'Workshop',
        image: '/depfolds/ec/arduino.jpeg',
        registrationUrl: 'https://makemypass.com/event/aurduino-101',
        contact: [{ name: 'Adon Eldho', phone: '7907035790' }, { name: 'Minna Eldho', phone: '8848239305' }]
      },
      {
        id: 5,
        name: 'arducode (arduino simulation competition)',
        date: 'February 28, 2026',
        fee: '₹170',
        badge: 'Competition',
        image: '/depfolds/ec/a.jpeg',
        registrationUrl: 'https://makemypass.com/event/arducode',
        contact: [{ name: 'Basil Thomas', phone: '7736045956' }, { name: 'Sen Anoop', phone: '6238103683' }]
      },
      {
        id: 6,
        name: 'linex (line follower robotics)',
        date: 'February 27, 2026',
        fee: '₹200',
        badge: 'Competition',
        image: '/depfolds/ec/linex.jpeg',
        registrationUrl: 'https://makemypass.com/event/linex',
        contact: [{ name: 'Anand S', phone: '8111836424' }, { name: 'Jesald Tony', phone: '9188201911' }]
      },
      {
        id: 7,
        name: 'route it right (pcb design competition)',
        date: 'February 27, 2026',
        fee: '₹130',
        badge: 'Competition',
        image: '/depfolds/ec/routeit.jpeg',
        registrationUrl: 'https://makemypass.com/event/route-it-right',
        contact: [{ name: 'Lakshmi', phone: '7736487168' }, { name: 'Aksa Mariyam', phone: '8075791698' }]
      },
      {
        id: 8,
        name: 'M-CODE (MATLAB CODING)',
        date: 'February 28, 2026',
        fee: '₹170',
        badge: 'Competition',
        image: '/depfolds/ec/mcode.jpeg',
        registrationUrl: 'https://makemypass.com/event/m-code',
        contact: [{ name: 'Adon Eldho', phone: '7907035790' }, { name: 'Henna MP', phone: '9037205706' }]
      },
      {
        id: 9,
        name: 'TECHTACKLE (ROBO SOCCER COMPETITION)',
        date: 'February 28, 2026',
        fee: '₹130',
        badge: 'Competition',
        image: '/depfolds/ec/robosoccer.jpeg',
        registrationUrl: 'https://makemypass.com/event/tech-tackle',
        contact: [{ name: 'Benson Kuriakose', phone: '7736234898' }, { name: 'Samuel Joshy', phone: '8075187294' }]
      },
      {
        id: 10,
        name: 'LASER STRIKE (LASER TAG)',
        date: 'February 28, 2026',
        fee: '₹110',
        badge: 'Entertainment',
        image: '/depfolds/ec/l.jpeg',
        registrationUrl: 'https://makemypass.com/event/laser-strike',
        contact: [{ name: 'Naveen Sunil', phone: '9074131206' }, { name: 'Alwin Sibi', phone: '8848558945' }]
      },
      {
        id: 11,
        name: 'ROYALE WARFARE (E GAME – BGMI)',
        date: 'February 24, 2026',
        fee: '₹110',
        badge: 'Competition',
        image: '/depfolds/ec/bgmi.jpeg',
        registrationUrl: 'https://makemypass.com/event/royalwarfare',
        contact: [{ name: 'Arundev NB', phone: '7034235202' }, { name: 'Albin Eldhose', phone: '7034920887' }]
      }
    ]
  },
  'general': {
    name: 'Computer Applications',
    color: '#5BA3A3',
    events: [
      {
        id: 1,
        name: 'PES (E-Football)',
        date: 'February 27, 2026',
        fee: '₹60',
        badge: 'Competition',
        image: '/depfolds/ca/efootball.jpeg',
        registrationUrl: 'https://makemypass.com/event/pes-e-football',
        contact: [{ name: 'Neeraj', phone: '8086368571' }, { name: 'Vyshnav', phone: '9496669914' }]
      },
      {
        id: 2,
        name: 'TREX: Trail of Clues (TREASURE HUNT)',
        date: 'February 27, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/ca/treasurehunt.jpeg',
        registrationUrl: 'https://makemypass.com/event/trextrail-of-clues',
        contact: [{ name: 'Ashli Sojan', phone: '6235736827' }, { name: 'Anna Rose Joshi', phone: '6238254635' }]
      },
      {
        id: 3,
        name: 'CODE QUEST (CODING CHALLENGE)',
        date: 'February 27, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/ca/codequest.jpeg',
        registrationUrl: 'https://makemypass.com/event/codequest',
        contact: [{ name: 'Aparna', phone: '7012713377' }, { name: 'Alan', phone: '6238236726' }]
      },
      {
        id: 4,
        name: 'SHUTTER STORIES (PHOTOGRAPHY COMPETITION)',
        date: 'February 27, 2026',
        fee: '₹30',
        badge: 'Competition',
        image: '/depfolds/ca/shutter.jpeg',
        registrationUrl: 'https://makemypass.com/event/shuttlestories',
        contact: [{ name: 'Ajay', phone: '8129529363' }, { name: 'Cenna', phone: '6235263729' }]
      },
      {
        id: 5,
        name: 'ROOTFORCE (CTF)',
        date: 'February 28, 2026',
        fee: '₹60',
        badge: 'Competition',
        image: '/depfolds/ca/rootforce.jpeg',
        registrationUrl: 'https://makemypass.com/event/rootforce',
        contact: [{ name: 'Vishnupriya', phone: '7907456401' }, { name: 'Jerald', phone: '7025497088' }]
      },
      {
        id: 6,
        name: 'CLASH OF KEYS (SPEED TYPING)',
        date: 'February 28, 2026',
        fee: '₹30',
        badge: 'Competition',
        image: '/depfolds/ca/clash.jpeg',
        registrationUrl: 'https://makemypass.com/event/clash-of-keys',
        contact: [{ name: 'Sibion', phone: '7306769579' }, { name: 'Achu', phone: '9496110247' }]
      },
      {
        id: 7,
        name: 'CODE CRUSH (OUTPUT PREDICTION)',
        date: 'February 28, 2026',
        fee: '₹50',
        badge: 'Competition',
        image: '/depfolds/ca/codecrush.jpeg',
        registrationUrl: 'https://makemypass.com/event/codecrush',
        contact: [{ name: 'Jeswin', phone: '9778230580' }, { name: 'Sahala', phone: '9400395924' }]
      },
      {
        id: 8,
        name: 'ROBOTIC WORKSHOP',
        date: 'February 27, 2026',
        fee: 'FREE',
        badge: 'Workshop',
        image: '/depfolds/ca/robotic.jpeg',
        registrationUrl: 'https://makemypass.com/event/robotic-workshop',
        contact: [{ name: 'Ajin Biju', phone: '8590463106' }, { name: 'Ignatious', phone: '7510130510' }]
      },
      {
        id: 9,
        name: 'FRONTEND FRONTIER (WEB DEVELOPMENT)',
        date: 'February 27, 2026',
        fee: '₹200',
        badge: 'Competition',
        image: '/depfolds/ca/front.jpeg',
        registrationUrl: 'https://makemypass.com/event/frontend-frontier',
        contact: [{ name: 'Abhinav', phone: '9633053081' }, { name: 'Albin', phone: '9037130224' }]
      },
      {
        id: 10,
        name: 'QUBITZ (TECH QUIZ COMPETITION)',
        date: 'February 27, 2026',
        fee: '₹60',
        badge: 'Competition',
        image: '/depfolds/ca/qubits.jpeg',
        registrationUrl: 'https://makemypass.com/event/qubitz',
        contact: [{ name: 'Honey', phone: '7501734346' }, { name: 'Akshay', phone: '8714583190' }]
      },
      {
        id: 11,
        name: 'KERNEL CORNER (Tech stall)',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Expo',
        image: '/depfolds/ca/kernal.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Aiswarya', phone: '7510822516' }, { name: 'Aryalakshmi', phone: '9562015498' }]
      }
    ]
  },
  'fun': {
    name: 'Fun-Games',
    color: '#775ba3',
    events: [
      {
        id: 1,
        name: 'DISK ROLLER',
        date: 'February 27-28, 2026',
        fee: '₹30',
        badge: 'Entertainment',
        image: '/depfolds/fun/disk.jpeg',
        registrationUrl: '',
        contact: [{ name: 'James', phone: '9846035018' }]
      },
      {
        id: 2,
        name: 'Bean Bag Toss',
        date: 'February 27-28, 2026',
        fee: 'FREE',
        badge: 'Entertainment',
        image: '/depfolds/fun/bean.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Arjun K R', phone: '9961070206' }]
      },
      {
        id: 3,
        name: 'Poke A Prize',
        date: 'February 27-28, 2026',
        fee: '₹20',
        badge: 'Entertainment',
        image: '/depfolds/fun/poke.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Anagha', phone: '8848300368' }]
      },
      {
        id: 4,
        name: 'Stand The Bottle',
        date: 'February 27-28, 2026',
        fee: '₹20',
        badge: 'Entertainment',
        image: '/depfolds/fun/stand.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Event Coordinator', phone: '9495874057' }]
      },
      {
        id: 5,
        name: 'ZIG ZAG BALL RAMP',
        date: 'February 27-28, 2026',
        fee: '₹30',
        badge: 'Entertainment',
        image: '/depfolds/fun/zig.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Febin', phone: '6235684635' }]
      },
      {
        id: 6,
        name: 'CRICKET BOWLING MACHINE',
        date: 'February 27-28, 2026',
        fee: '₹30',
        badge: 'Entertainment',
        image: '/depfolds/fun/cricket.jpeg',
        registrationUrl: '',
        contact: [{ name: 'Event Coordinator', phone: '8590262698' }]
      },
    ]
  }
};

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
};

// Calculate similarity score between two strings
const getSimilarityScore = (str1: string, str2: string): number => {
  const lower1 = str1.toLowerCase();
  const lower2 = str2.toLowerCase();
  
  // Exact match (highest priority)
  if (lower1 === lower2) return 1000;
  
  // Substring match (high priority)
  if (lower1.includes(lower2) || lower2.includes(lower1)) return 500;
  
  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(lower1, lower2);
  const maxLength = Math.max(lower1.length, lower2.length);
  const similarity = (maxLength - distance) / maxLength;
  
  // Word-based matching (check if words match)
  const words1 = lower1.split(/[\s\-_]+/);
  const words2 = lower2.split(/[\s\-_]+/);
  
  let wordMatchScore = 0;
  for (const word2 of words2) {
    for (const word1 of words1) {
      if (word1.includes(word2) || word2.includes(word1)) {
        wordMatchScore = Math.max(wordMatchScore, 300);
      }
      const wordDist = levenshteinDistance(word1, word2);
      const wordMaxLen = Math.max(word1.length, word2.length);
      const wordSim = (wordMaxLen - wordDist) / wordMaxLen;
      if (wordSim > 0.7) {
        wordMatchScore = Math.max(wordMatchScore, wordSim * 200);
      }
    }
  }
  
  return Math.max(similarity * 100, wordMatchScore);
};

export function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('');

  // Get all events with their department info
  const allEvents = useMemo(() => {
    const events: any[] = [];
    Object.entries(departmentEvents).forEach(([deptId, deptData]: any) => {
      if (deptData.events) {
        deptData.events.forEach((event: any) => {
          events.push({
            ...event,
            departmentId: deptId,
            departmentName: deptData.name,
            departmentColor: deptData.color,
          });
        });
      }
    });
    return events;
  }, []);

// Filter and rank events based on search query with fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const scored = allEvents
      .map(event => {
        // Score event name
        let eventNameScore = getSimilarityScore(event.name, searchQuery);
        
        // Score contact names
        let contactScore = 0;
        if (event.contact) {
          if (Array.isArray(event.contact)) {
            for (const contact of event.contact) {
              if (contact.name) {
                const nameScore = getSimilarityScore(contact.name, searchQuery);
                contactScore = Math.max(contactScore, nameScore);
              }
            }
          } else if (event.contact.name) {
            contactScore = getSimilarityScore(event.contact.name, searchQuery);
          }
        }
        
        // Use the higher score between event name and contact name
        const score = Math.max(eventNameScore, contactScore);
        
        return {
          event,
          score
        };
      })
      .filter(({ score }) => score > 20) // Only show results with decent similarity
      .filter(({ event }) => {
        // Filter by badge type if selected
        if (badgeFilter === 'free') {
          return event.fee === 'FREE';
        } else if (badgeFilter) {
          return event.badge?.toLowerCase() === badgeFilter.toLowerCase();
        }
        return true;
      })
      .sort((a, b) => b.score - a.score); // Sort by score (highest first)
    
    return scored.map(({ event }) => event);
  }, [searchQuery, badgeFilter, allEvents]);

  // Filter events when no search query but filter is applied
  const filteredEvents = useMemo(() => {
    if (searchQuery.trim()) return []; // Only show filtered results when no search
    if (!badgeFilter) return []; // Only show when filter is applied but no search
    
    return allEvents.filter(event => {
      // Filter by badge type if selected
      if (badgeFilter === 'free') {
        return event.fee === 'FREE';
      } else if (badgeFilter) {
        return event.badge?.toLowerCase() === badgeFilter.toLowerCase();
      }
      return true;
    });
  }, [badgeFilter, allEvents, searchQuery]);
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl mb-6">Departments</h1>
          <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto mb-8">
            Select a department to explore events and competitions
          </p>
          
          {/* Decorative Circuit Underline */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C65D3B]" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#C65D3B] to-[#B8956A]" />
            <div className="w-3 h-3 rounded-full bg-[#B8956A] ring-4 ring-[#B8956A]/20" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#B8956A] to-[#5BA3A3]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA3A3]" />
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <div className="relative flex gap-4">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#B0B0B0] pointer-events-none" />
              <input
                type="text"
                placeholder="Search events by name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#FF6B35]/30 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 hover:bg-[#FF6B35]/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#FF6B35]" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              className="bg-[#1A1A1A] border border-[#FF6B35]/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all cursor-pointer min-w-[180px]"
            >
              <option value="">All Events</option>
              <option value="free">Free</option>
              <option value="competition">Competition</option>
              <option value="workshop">Workshop</option>
              <option value="expo">Expo</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
        </motion.div>

{/* Filtered Results (when no search but filter is applied) */}
        {!searchQuery.trim() && badgeFilter && filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#E8E8E8]">
              {badgeFilter === 'free' ? 'Free Events' : badgeFilter.charAt(0).toUpperCase() + badgeFilter.slice(1) + ' Events'} ({filteredEvents.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={`${event.departmentId}-${event.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all shadow-lg hover:shadow-xl"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                  </div>

                  {/* Event Details */}
                  <div className="p-5">
                    {/* Department Badge */}
                    <div className="mb-2">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${event.departmentColor}20`,
                          color: event.departmentColor,
                          border: `1px solid ${event.departmentColor}40`
                        }}
                      >
                        {event.departmentName}
                      </span>
                    </div>

                    {/* Event Name */}
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                      {event.name}
                    </h3>

                    {/* Event Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-[#B0B0B0]">
                        <Calendar className="w-4 h-4" style={{ color: event.departmentColor }} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#B0B0B0]">
                        <IndianRupee className="w-4 h-4" style={{ color: event.departmentColor }} />
                        <span>{event.fee}</span>
                      </div>
                      {event.badge && (
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: event.badge === 'Competition' ? '#ef4444' : 
                                             event.badge === 'Workshop' ? '#eab308' :
                                             event.badge === 'Expo' ? '#22c55e' : '#3b82f6',
                              color: event.badge === 'Workshop' ? '#000' : '#fff'
                            }}
                          >
                            {event.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Register Button */}
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: event.departmentColor,
                        cursor: 'pointer'
                      }}
                    >
                      Register
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-12 mb-12 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
          </motion.div>
        )}

        {/* Search Results */}
        {searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#E8E8E8]">
              Search Results ({searchResults.length})
            </h2>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((event, index) => (
                  <motion.div
                    key={`${event.departmentId}-${event.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all shadow-lg hover:shadow-xl"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                    </div>

                    {/* Event Details */}
                    <div className="p-5">
                      {/* Department Badge */}
                      <div className="mb-2">
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${event.departmentColor}20`,
                            color: event.departmentColor,
                            border: `1px solid ${event.departmentColor}40`
                          }}
                        >
                          {event.departmentName}
                        </span>
                      </div>

                      {/* Event Name */}
                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                        {event.name}
                      </h3>

                      {/* Event Info */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-[#B0B0B0]">
                          <Calendar className="w-4 h-4" style={{ color: event.departmentColor }} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#B0B0B0]">
                          <IndianRupee className="w-4 h-4" style={{ color: event.departmentColor }} />
                          <span>{event.fee}</span>
                        </div>
                        {event.badge && (
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-semibold"
                              style={{
                                backgroundColor: event.badge === 'Competition' ? '#ef4444' : 
                                               event.badge === 'Workshop' ? '#eab308' :
                                               event.badge === 'Expo' ? '#22c55e' : '#3b82f6',
                                color: event.badge === 'Workshop' ? '#000' : '#fff'
                              }}
                            >
                              {event.badge}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Register Button */}
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-all hover:shadow-lg"
                        style={{
                          backgroundColor: event.departmentColor,
                          cursor: 'pointer'
                        }}
                      >
                        Register
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-[#1A1A1A]/50 rounded-2xl border border-[#FF6B35]/20"
              >
                <Search className="w-12 h-12 text-[#FF6B35]/30 mx-auto mb-4" />
                <p className="text-[#B0B0B0] text-lg">No events found matching "{searchQuery}"</p>
                <p className="text-[#6B6B6B] mt-2">Try searching with different keywords</p>
              </motion.div>
            )}

            {/* Divider */}
            <div className="mt-12 mb-12 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
          </motion.div>
        )}

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            const isFunGames = dept.id === 'fun';
            const isAllEvents = dept.id === 'all';
            const isWide = isFunGames || isAllEvents;
            
            const CardLink = isAllEvents 
              ? ({ children }: { children: React.ReactNode }) => (
                  <a href="https://org.makemypass.com/web/karnak-26" target="_blank" rel="noopener noreferrer" style={{textAlign:'center'}} className="block w-full h-full">
                    {children}
                  </a>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <Link to={`/departments/${dept.id}`} style={{textAlign:'center'}} className="block w-full h-full">
                    {children}
                  </Link>
                );
            
            return (
              <div key={dept.id} className={`w-full h-full ${isWide ? 'md:col-span-1 lg:col-span-3' : ''}`}>
                <CardLink>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group relative ${isWide ? 'h-48' : 'h-80'} rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
                  >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.gradient}`} />
                  
                  {/* Tech Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`pattern-${dept.id}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                          <circle cx="30" cy="30" r="2" fill={dept.color} />
                          <line x1="30" y1="30" x2="60" y2="30" stroke={dept.color} strokeWidth="1" />
                          <line x1="30" y1="30" x2="30" y2="60" stroke={dept.color} strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${dept.id})`} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8">
                    {/* Icon */}
                    <div className="flex justify-between items-start">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <Icon className="w-8 h-8" style={{ color: dept.color }} />
                      </div>

                      {/* Hover arrow */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={dept.color}
                          strokeWidth="2"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 
                        className="text-3xl mb-2 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ color: dept.color }}
                      >
                        {dept.name}
                      </h3>
                      <p className="text-[#6B6B6B]">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  {/* Border glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      boxShadow: `inset 0 0 0 2px ${dept.color}40`
                    }}
                  />

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke={dept.color} strokeWidth="2" />
                      <circle cx="50" cy="50" r="25" stroke={dept.color} strokeWidth="1" />
                      <circle cx="50" cy="50" r="5" fill={dept.color} />
                      <line x1="50" y1="10" x2="50" y2="25" stroke={dept.color} strokeWidth="2" />
                      <line x1="50" y1="75" x2="50" y2="90" stroke={dept.color} strokeWidth="2" />
                      <line x1="10" y1="50" x2="25" y2="50" stroke={dept.color} strokeWidth="2" />
                      <line x1="75" y1="50" x2="90" y2="50" stroke={dept.color} strokeWidth="2" />
                    </svg>
                  </div>
                </motion.div>
                </CardLink>
              </div>
            );
          })}
        </div>
       
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 bg-[#1A1A1A] rounded-3xl shadow-lg border border-[#FF6B35]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="text-xl mb-2 text-[#E8E8E8]">Ready to participate?</h3>
              <p className="text-[#B0B0B0] leading-relaxed">
                Click on any department to view all events. Each event card will have a registration button 
                that redirects you to the official registration form. Make sure to read the event details 
                carefully before registering.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}