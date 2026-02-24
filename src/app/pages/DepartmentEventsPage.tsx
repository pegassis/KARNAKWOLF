import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, IndianRupee, Users, ExternalLink, Edit, Trash, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { EventForm } from '../components/EventForm';

import Lightning from '../components/Lightning';
import LetterGlitch from '../components/LetterGlitch';
import GridMotion from '../components/GridMotion';
import Vid from '../components/Vid';

import { useAdmin } from '../context/AdminContext';
import { getApiUrl, checkBackendHealth } from '../utils/apiConfig';
import { getStoredDepartmentEvents, initializeStorage, updateStoredEvent, addStoredEvent, deleteStoredEvent, saveStoredEvents } from '../utils/storageManager';


interface Event {
  id: number;
  name: string;
  tagline: string;
  description: string;
  date: string;
  time?: string;
  prizepool?: string;
  fee: string;
  image: string;
  registrationUrl: string;
  venue?: string;
  badge?: number; // 1=Expo, 2=Workshop, 3=Competition, 4=Entertainment
  registerOption?: number; // 1=Show Register Now, 2=Hide Register Now
  discount?: number; // 1 = discounted, 2 = no discount
  discountedFee?: string; // discounted fee to display when discount === 1
}

// Mock events data for each department
const departmentEvents: Record<string, any> = {
  'computer-science': {
    name: 'Computer Science (DS, AI & ML)',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'VR Vortex',
        description: 'Virtual Reality redefines how we learn, create, and experience the digital world by immersing us in environments beyond physical limits.At this VR Expo, innovation meets imagination as cutting-edge technology transforms ideas into interactive realities.devStep in, explore the future, and experience technology not just seen—but lived.\n Step in, explore the future, and experience technology not just seen—but lived.\n\n\n',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '40',
        badge: 1,
        discount: 1,
        discountedFee: '30',
        venue: 'Room M130',
        image: '/depfolds/comps/vrposter.jpeg',
        registrationUrl: 'https://makemypass.com/event/vr-vortex',
        registerOption: 1,
        contact: [{ name: 'Adinath', phone: '8921798670' }, { name: 'Anand', phone: '6238763675' }]
      },
      {
        id: 2,
        name: 'GAMING_XP',
        description: 'Experience high-performance gaming with immersive visuals in our gaming room. Play, compete, and enjoy the ultimate gaming vibe with friends.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: 'NA',
        fee: '40',
        badge: 2,
        discount: 1,
        discountedFee: '30',
        venue: 'Computer Lab 3',
        image: '/depfolds/comps/GAMING_XP.jpeg',
        registrationUrl: 'https://makemypass.com/event/gamingxp',
        registerOption: 1,
        contact: [{ name: 'Rehab ', phone: '7907844588' }, { name: 'Fidha ', phone: '9947304940' }]
      },
      {
        id: 3,
        name: 'PIXELIA',
        description: 'Unleash your creativity and technical imagination in our Poster Designing Competition conducted as part of the Tech Fest. Participants will design a digital poster based on a given theme using the computer systems provided in the lab. The event aims to test creativity, visual communication skills, layout design, and effective use of design tools. Create a poster that is visually appealing, informative, and impactful within the given time\n\nRULES & REGULATIONS\n\n 1. Individual participation only.\n2. Participants must report to the lab 15 minutes before the event starts. Maximum of 60 min will be provided for the event.\n3. The poster theme/topic will be announced on the spot.\n4. Only the software available on the lab computers may be used(Canva Web).\n5. Internet usage allowed only under supervision.\n6. Participants must not use pre-made templates or previously created posters.\n7. All designs must be created during the competition time only.\n8. External storage devices (pen drives, hard disks) are not allowed.\n9. Posters must include a title and relevant visual elements related to the theme.\n10. Any form of copying or plagiarism will lead to disqualification.\n11 ⁠Poster Size & FormatSize: A4 Dimensions: 2480 × 3508 px Orientation: Portrait only Format: PNG\n12. Final poster must be saved with the participant name and submitted before the deadline in the specified format.\n13. Judges decision will be final.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: '1000',
        fee: '60',
        badge: 3,
        discount: 1,
        discountedFee: '50',
        venue: 'Computer Lab 8',
        image: '/depfolds/comps/pixelia.jpeg',
        registrationUrl: 'https://makemypass.com/event/pixelia',
        registerOption: 1,
        contact: [{ name: 'Hail Mary', phone: '8078925526' }, { name: 'Joel George', phone: '9188492986' }]
      },
      {
        id: 4,
        name: 'Pixel Puzzle',
        description: 'Design is where creativity meets functionality, transforming ideas into meaningful digital experiences. Showcase your UI/UX skills, push the boundaries of innovation, and bring your concepts to life through intuitive, impactful, and visually compelling designs\n\nDuration : 1.5 hours \n\nRULES AND REGULATIONS\n\n1. Team Size – Individual\n2. Time Limit – Designs must be completed and submitted within the allotted time. Late submissions will not be accepted.\n3. Original Work Only – All designs must be original. Plagiarism will lead to disqualification.\n4. Theme Adherence – Designs must strictly follow the given theme/problem statement.\n5. No Pre-made Templates– Ready-made templates or pre-designed UI kits are not allowed (unless permitted).\n6. AI Usage Policy– AI tools (like ChatGPT, Midjourney, etc.) are not allowed.\n7. Reference Materials – Only allowed resources may be used.\n8. Multiple Entries – A participant can be part of only one team.\n9. Power Backup– Organizers are not responsible for personal device technical failures.\n10. Software Installation– Required software must be pre-installed before the event.\n\n Conduct and discipline\n\n• Maintain decorum and professional behavior.\n• No disruptive behavior inside the venue.\n• Any misconduct leads to immediate disqualification.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: '1500',
        fee: '60',
        badge: 3,
        discount: 1,
        discountedFee: '50',
        venue: 'Computer Lab 3',
        image: '/depfolds/comps/puzzle.jpeg',
        registrationUrl: 'https://makemypass.com/event/pixel-puzzle',
        registerOption: 1,
        contact: [{ name: 'Yeldho', phone: '9495171414' }, { name: 'Agnus', phone: '9544266892' }]
      },
      {
        id: 5,
        name: 'Splash Pitch',
        description: 'Dive into the slippery excitement of soapy football at our event — where you don’t just play, you slip, slide, laugh, and score in a wild, foam-filled twist on classic football. Whether you’re chasing the ball, bumping into friends, or trying to stay on your feet, every moment is full of energy, surprises, and unforgettable fun.\n\nDuration : 30 minutes',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        fee: '600 (per team of 5 players)',
        badge: 4,
        discount: 1,
        discountedFee: '500 (per team of 5 players)',
        venue: 'Basketball court',
        image: '/depfolds/comps/splash.jpeg',
        registrationUrl: 'https://makemypass.com/event/splash-pitch',
        registerOption: 1,
        contact: [{ name: 'Kevin', phone: '8075723712' }, { name: 'Ryan', phone: '6238890177' }]
      },
      {
        id: 6,
        name: 'Tech Trove',
        description: 'Where innovation meets opportunity! Watch brilliant ideas come alive as creators, coders, and innovators showcase their groundbreaking projects. From smart technologies to futuristic solutions, every exhibit tells a story of creativity and impact. Join us for the ultimate celebration of talent, technology, and transformation. Don’t just witness the future — be part of it!  Built something amazing? Bring it to the spotlight — contact us now! ',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: 'NA',
        fee: 'FREE',
        badge: 1,
        venue: 'Room M133,M134',
        image: '/depfolds/comps/techtrove.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Justin', phone: '7736309758' }, { name: 'Amrutha', phone: '7594907504' }]
      },
      {
      id: 7,
        name: ' Code, Predict, Conquer – Machine Learning Workshop',
        description: 'A hands-on introduction to Machine Learning organized by IEDC MBITS, where participants explore how machines analyze data, build predictive models, and solve real-world problems. Designed for beginners, this workshop emphasizes practical learning and the fundamentals of intelligent system development.\n\nOrganized By: IEDC MBITS\nCategory: Workshop\nMode: Offline (Lab Session)\nSeats: Limited seats available \n\nBenefits\n * Certificates will be provided to all participants upon successful completion of the workshop.\n* Activity points will be awarded.\n\nRules & Regulations\n* Entry is permitted only for registered participants.\n* Certificates will be issued only after full attendance throughout the session.',
        date: 'February 28, 2026',
        time: 'Forenoon',
        Organizedby:'IEDC MBITS',
        fee: 'FREE',
        venue: 'Computer Lab 8',
        image: '/depfolds/comps/codepredict.jpeg',
        registrationUrl: 'https://makemypass.com/event/code-predict-conquer',
        registerOption: 2,
        contact: [{ name: 'Adwaith K S', phone: '9037861197' }, { name: 'Anna Palanattu', phone: '6235432740' }],
      
      badge: 2
      },
      {
      id: 8,
        name: 'CODE X BLIND (Blind Coding)',
        description: 'CODE X BLIND is a thrilling coding challenge designed to test a participant’s logical thinking, syntax accuracy, and confidence. Participants will be given a problem statement and must write the complete code within the given time without compiling or running it themselves. The competition is conducted in C programming language .Once submitted, the code will be compiled and executed by the invigilators. Accuracy matters more than retries—clean code wins.\n\n1st price : ₹1000\n2nd price : ₹500\n\nRules & Regulations\n1. The problem statement will be provided at the start of the event.\n2. The competition will be conducted strictly in C programming language.\n3. Participants must write the code within the allotted time.\n4. Compiling and execution will be done only by the invigilators.\n5. Participants must stop coding immediately after the time.\n6. The screen will remain visible, but no test runs are allowed.\n7. Internet access and external assistance are strictly prohibited.\n8. The winner will be decided based on:\n* Least number of errors\n* Correct output\n* Time taken to complete the code\n9. Any form of malpractice will lead to immediate disqualification.\n10. The decision of judges and coordinators will be final.',
        date: 'February 27, 2026',
        time: 'Forenoon',
        prizepool: '1500',
        fee: '60',
        discount: 1,
        discountedFee: '50',
        venue: 'Computer Lab 8',
        image: '/depfolds/comps/blindcoding.jpeg',
        registrationUrl: 'https://makemypass.com/event/blindx-code',
        registerOption: 1,
        contact: [{ name: 'Leen Leo', phone: '8075750254' }, { name: 'Emil Mareena P', phone: '6235868192' }]
      ,
      badge: 3
      },
      {
      id: 9,
        name: 'CODE REWIND (Reverse Coding Challenge)',
        description: 'CODE REWIND is a unique reverse coding challenge where participants are provided with the expected output and must determine the correct input and logic to generate it using a valid C program. The event evaluates logical thinking, analytical ability, and problem-solving skills. If the exact output is not achieved, the judges will assess the participant’s logic, approach, and program structure. Accuracy, clarity, and correctness of the C code are given importance.\n\n1st price : ₹1000\n2nd price : ₹500\n\nRules & Regulations:\n1. Participation may be individual or in teams consisting of a maximum of two members.\n2. The expected output will be provided at the start of the event.\n3. Participants must determine suitable input values and write a program that produces the given output.\n4. Only C or Python programming languages are permitted.\n5. The program must be completed within the allotted time.\n6. If the output does not match exactly, judges will evaluate the logic and approach used.\n7. Participants may be asked to explain their code and reasoning.\n8. Internet access and external assistance are strictly prohibited.\n9. Plagiarism or copying from others will lead to immediate disqualification.\n10. Winners will be decided based on:\n\t\t• Accuracy of the output\n\t\t• Logical correctness\n\t\t• Efficiency of the solution\n\t\t• Clarity of explanation\n11. The decision of the judges and coordinators will be final and binding.',
        date: 'February 28, 2026',
        time: 'Forenoon',
        prizepool: '1500',
        fee: '60',
        discount: 1,
        discountedFee: '50',
        venue: 'Computer Lab 9',
        image: '/depfolds/comps/reversecoding.jpeg',
        registrationUrl: 'https://makemypass.com/event/coderewind',
        registerOption: 1,
        contact: [{ name: 'Christepher C Biju', phone: '8921057348' }, { name: 'Basil Biju', phone: '7558850154' }]
      ,
      badge: 3
      },
      {
      id: 10,
        name: 'PROMPT TO PIXEL (AI Application Building workshop)',
        description: 'The aim of the workshop is to teach how to design powerful prompts to get smarter, faster, and more accurate results from AI tools. This hands-on session will help you master the art of communicating with AI for content creation, coding, research, and more.\n\nRules & Regulations\n1. Participants must reach the venue on time\n2. Pen and paper will be provided.\n3. Follow instructions given by the resource person.\n4. Maintain discipline throughout the session',
        date: 'February 28, 2026',
        time: 'Forenoon',
        fee: '60',
        discount: 1,
        discountedFee: '50',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/prompt.jpeg',
        registrationUrl: 'https://makemypass.com/event/prompt-to-pixel',
        registerOption: 1,
        contact: [{ name: 'Gayathridevi K', phone: '8921169842' }, { name: 'Rinsa Fathima M A', phone: '8606033545' }]
      ,
      badge: 2
      },
      {
        id: 11,
        name: 'Tech Hunt',
        description: 'Step into a campus wide tech scavenger hunt like no other, where logic replaces luck and clues are hidden in code. The Tech Hunt challenges participants to think, decode, and solve their way through a series of mysteries. Only sharp minds, quick reasoning, and technical intuition will lead you to the final prize. Get ready to explore, analyze, and conquer.\nParticipants- 4-5 members per team\n\nRules & Regulations-\n• Only 10 teams can participate.\n• Teams should report 10min  prior to the event time\n• Registration fees should be paid online. \n• At each  location teams must find the next clue card and must keep them till the end. \n• Each team must collect all 6 clue cards to proceed to the final round.\n• The treasure hunt must be completed within 1 hour time.\n• If more than one team reaches and completes the final round: a tie breaker task will be given\n• Mobile phones, smart watches, and all smart devices are strictly prohibited during the hunt. Any team found using them will be disqualified ',
        date: 'February 27, 2026',
        time: 'Forenoon',
        prizepool: '2500',
        fee: '20 per person',
        discount: 1,
        discountedFee: '₹10 OFF per team',
        venue: 'Campus',
        image: '/depfolds/comps/techhunt.jpeg',
        registrationUrl: 'https://makemypass.com/event/tech-hunt',
        registerOption: 1,
        contact: [{ name: 'Anudev', phone: '9778155243' }, { name: 'Anna', phone: '8714224467' }]
      ,
      badge: 3
      },
      {
        id: 12,
        name: 'NETRIOT (LAN Gaming)',
        description: '🔊 Lan Gaming-NETRIOT\nGet ready to play, compete, and win! Participate in our mobile gaming event and test your skills against fellow gamers in an action-packed experience.\n\nGames-\n• Mili Militia\n• Call of Duty\n\nRules & Regulations -\n• The Game allow 2 team at a  time, with 4 members in each team.\n• Total players in the match:  8 players\n• Each team works together to  defeat the opposing team.\n• The team with the highest  number of kills within the time limit wins.\n• Using modded APKs, hacks,  cheats, scripts, bots, or any  third-party tools that give unfair advantage is prohibited.\n• Players using such hacks can  be reported  and may be banned  from games or tournaments.',
        date: 'February 27-28, 2026',
        time: ' 27th Forenoon Call of Duty & 28th Full day Mini Militia ',
        prizepool: '₹3000',
        fee: '40 per head',
        discount: 1,
        discountedFee: '30 per head',
        venue: 'Room M131',
        image: '/depfolds/comps/netriot.jpeg',
        registrationUrl: 'https://makemypass.com/event/netriot',
        registerOption: 1,
        contact: [{ name: 'Febin', phone: '9562767233' }, { name: 'Sain', phone: '8139879470' }]
      ,
      badge: 3
      },
      {
        id: 13,
        name: 'THE THINK TANk',
        description: 'ThinkTanks is an intercollege ideathon designed to give students a platform to present innovative ideas to a wider audience. The event encourages participants to identify real-world challenges and propose creative, practical solutions that address problems faced by modern society. It is a space where critical thinking, collaboration, and imagination converge to inspire meaningful change. Join us to showcase your vision, exchange perspectives, and turn ideas into possibilities\n\nRules & Regulations\n\n1. Participants must reach venue atleast 20 minutes before the event starts\n2. Ensure chest number is visibly attached on one of the presenters\n3. Each team is alloted 15 minutes per presentation and any longer points will be deducted',
        date: 'February 27, 2026',
        time: 'Forenoon',
        prizepool: '₹1500',
        fee: 'FREE',
        venue: 'Computer Lab 9',
        image: '/depfolds/comps/thinktank.jpeg',
        registrationUrl: 'https://makemypass.com/event/the-thinktank',
        registerOption: 1,
        contact: [{ name: 'Samuel', phone: '8137897726' }, { name: 'Helvin', phone: '8590018466' }]
      ,
      badge: 3
      },
        {
        id: 14,
        name: 'LPSC InnovateX ',
        description: 'Liquid Propulsion Systems Centre (LPSC) is one of Indian Space Research Organisation’s major research and development centres. It focuses on designing and building liquid propulsion systems (engines and related tech) that power India’s launch vehicles and spacecraft.These expos are meant to spark interest in science and help people learn about Indian space technology.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Room M10',
        image: '/depfolds/comps/lpsc.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Aleena', phone: '9048847676' }, { name: 'Gouripriya', phone: '9447290587' }]
      ,
      badge: 1
      },
      {
        id: 15,
        name: 'THE IPL AUCTION-PITCH TO POCKET',
        description: 'Where talent meets big money! Watch franchises battle it out as cricket stars go under the hammer and dreams turn into multi-crore deals. From explosive hitters to deadly bowlers, every bid counts!Join us for the ultimate showdown of strategy, suspense, and spectacular signings. Dont miss the action — be part of the excitement!.\n\nRules & Regulations \n\n• Only 6 teams can participate.\n• Each team consisting of 4 members only\n• First 6 teams to register can only participate.\n• Teams are to report 10min prior to the event time\n• Registration fees is to be paid online.\n• Others Rules Regarding the event will be told on 27th Feb\n• Laptops can be used but only one in a team.\n• Pens and calculators will be provided (if needed).',
        date: 'February 27, 2026',
        time: 'Afternoon',
        fee: '200 per team',
        discount: 1,
        discountedFee: '160 per team',
        prizepool: '₹3500',
        venue: 'Room M131',
        image: '/depfolds/comps/ipl.jpeg',
        registrationUrl: 'https://makemypass.com/event/pitch-to-pocket',
        registerOption: 1,
        contact: [{ name: 'Joel', phone: '7907502537' }, { name: 'Seetha', phone: '9074490518' }]
      ,
      badge: 3
      },
      {
        id: 16,
        name: 'VIBE.EXE(Vibe Coding)',
        description: 'Code the vibe. Build the future. \n💻Step into the world of fast-paced coding where creativity meets logic! Vibe Coding – vibe.exe is all about solving fun and challenging problems in a high-energy environment. Whether you are a beginner or a pro, this is your chance to test your skills, learn new tricks, and vibe with fellow coders.Think quick. Code smart. Let your vibe do the talking.\n\nRules & Regulations\n* Participants must bring their own laptops.\n* Reporting time: 27th Feb – Afternoon session.\n* The event will be conducted in Computer Lab 7.\n* Basic guidelines and problem statements will be explained at the venue.\n* Fair play is mandatory; any malpractice may lead to disqualification.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        fee: '*For IEEE Members – ₹0 ( Free ) \n  *For Non-IEEE Members – ₹30',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/vibe.jpeg',
        registrationUrl: 'https://makemypass.com/event/vibe-exe',
        registerOption: 1,
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      ,
      badge: 2
      },
      {
        id: 17,
        name: 'HACK / DEMO / DEFEND\n(Ethical Hacking Workshop)',
        description: 'Learn to hack. Understand to defend. 🔐💻Ever wondered how hackers think and how systems are protected from attacks? HACK / DEMO / DEFEND is a hands-on ethical hacking workshop designed to give you real-world exposure to cyber security basics.From live demos of common attacks to understanding how to defend against them, this session will open your eyes to the world of ethical hacking and digital safety. Perfect for beginners who want to step into cyber security! 🛡️\n\nRules & Regulations\n* Participants must bring their own laptops.\n* Reporting time: 27th Feb – Morning session (Forenoon).\n* The workshop will be conducted in Computer Lab 7.\n* All activities are for educational purposes only.\n* Any misuse of techniques outside the workshop is strictly discouraged.\n\nParticipation certificates will be provided 🎓',
        date: 'February 27, 2026',
        time: 'Forenoon',
        fee: '*For IEEE Members – ₹0 ( Free ) \n  *For Non-IEEE Members – ₹30',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/hack.jpeg',
        registrationUrl: 'https://makemypass.com/event/hack-demo-defend',
        registerOption: 1,
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      ,
      badge: 2
      },
      {
        id: 18,
        name: 'RALLY RAID (RC Off-road Challenge)',
        description: 'Test your driving skills in our Rally Offroad Challenge, where precision, control, and nerves of steel take center stage. Tackle rugged terrain, sharp turns, and unpredictable obstacles in a thrilling race built for speed and strategy.\n\nRules & Regulations\n1.Only Madness',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '50',
        discount: 1,
        discountedFee: '40',
        venue: 'Waiting room near cafeteria',
        image: '/depfolds/comps/rally.jpeg',
        registrationUrl: 'https://makemypass.com/event/rally-raid',
        registerOption: 1,
        contact: [{ name: 'Eldho', phone: '8590616499' },{ name: 'Sain', phone: '8139879470' }]
      ,
      badge: 3
      },
        {
        id: 19,
        name: 'Steel Storm',
        description: 'Witness pure mechanical madness as battling robots clash in an arena of sparks, destruction, and chaos. It’s a no-mercy showdown of power, strategy, and engineering brilliance — where only the toughest machine survives.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '50',
        discount: 1,
        discountedFee: '40',
        venue: 'Room M231',
        image: '/depfolds/comps/steel.jpeg',
        registrationUrl: 'https://makemypass.com/event/steelstorm',
        registerOption: 1,
        contact: [{ name: 'Manna', phone: '8089581794' },{ name: 'Edwin', phone: '9778305942' }]
      ,
      badge: 3
      },
      {
        id: 20,
        name: 'Deadlock',
        description: '*Deadlock* is a spine-chilling horror escape room set inside a corrupted system controlled by a mysterious entity. Surrounded by dark visuals, eerie sounds, and glitch effects, teams must uncover clues, crack codes, and solve intense puzzles before time runs out. Only the bravest can break the deadlock and escape.\n\nRules and Regulations:\n1. Mobile phones are strictly prohibited\n2. Guests are strictly forbidden to harm the actors\n3. Light Sources: Lighters, flashlights, or laser pointers are forbidden as they ruin the lighting effects.\n4. Outside Tools: Pocket knives, multi-tools, or even pen/paper are not allowed; everything needed to solve the game will be provided inside.\n5. Do not use brute force. If a drawer or lock doesn’t open with two fingers, it’s not meant to be opened.\n6. Only two teams are allowed to participate at a time inside the escape room. Other team must wait for their turn outside the Arena.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '90 for team of 3',
        discount: 1,
        discountedFee: '70 for team of 3',
        venue: 'Room M229',
        image: '/depfolds/comps/deadlock.jpeg',
        registrationUrl: 'https://makemypass.com/event/deadlock',
        registerOption: 1,
        contact: [{ name: 'Vandana M P', phone: '7012334369' },{ name: 'Marwa', phone: '8301909588' }]
      ,
      badge: 3
      },
      {
        id: 21,
        name: 'Funfinity (Mini Games)',
        description: 'Funfinity – Where Fun Has No Limits! \nFunfinity is a fun-filled mini-games zone at our Techfest, packed with exciting quick challenges. It features interactive games like Walker Bottle, Balloon Pyramid, Circle Switch, and Flip & Find — each designed to test balance, speed, focus, and memory in a thrilling way. It’s all about friendly competition, energy, and enjoying simple yet exciting challenges with endless fun!\nNo rules& regulations',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Room M232',
        image: '/depfolds/comps/minigames.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Vismaya', phone: '9544251901' }, { name: 'Vinayathri', phone: '9778140400' }]
      ,
      badge: 4
      },
      {
        id: 22,
        name: 'Mechamorphosis (E-Waste Sculpture)',
        description: 'Mechamorphosis is a sustainable art installation that transforms electronic waste into a life-size robotic sculpture. It reimagines discarded technology as creative expression, promoting responsible recycling and sustainability.\nSymbolizing technological rebirth, it stands as a mechanical guardian, highlighting innovation, environmental awareness, and the power of reuse in the digital age',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Open Area CSE Block',
        image: '/depfolds/comps/mecha.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Manna', phone: ' 8089581794' }]
      ,
      badge: 1
      },
      
    ]
  },
  'electronics': {
    name: 'Electronics',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'skyforge (drone workshop)',
        description: 'Duration: 3hr\n\n Take flight with SKYFORGE, the premier drone workshop at Karnak ’26, where innovation meets precision. Learn to build, simulate, and pilot advanced drones, mastering the technology that defines the next generation of aerial engineering. Harness the power of electronics, coding, and aerodynamics to create drones that perform, dominate, and inspire. Every participant becomes a trailblazer in the world of flight technology. \n\nSession 1: Drone Basics & Industry Overview (video 1) \n• What is a drone (UAV)  \n• Types of drones: Multicopter, Fixed-wing, VTOL \n•  Real-world applications (agriculture, firefighting, mapping) \n•  Career & startup opportunities in drones \n\n Session 2: Hands-on / Interaction \n• Students handling drone components   \n• Q&A with real use-case discussion \n\nSession 3: Drone Components & Safety (video 2)  \n• Drone frame, motors, ESC, propellers \n • Flight controller & battery basics  \n• Safety rules & DGCA overview \n\nSession 4: Live Drone Demonstration  \n• Takeoff, hover & landing demo \n• Mission Demo\n\n Last date for reg: 26 Feb',
        date: 'February 27, 2026',
        time: '10:00 AM - 01:00 PM',
        fee: '200',
        venue: 'Industry lab (M125), Volleyball court',
        badge: 2,
        image: '/depfolds/ec/skyforge.jpeg',
        registrationUrl: 'https://makemypass.com/event/skyforge',
        registerOption: 1,
        contact: [{ name: 'Fawas T Hamsa', phone: '9037220618' }, { name: 'Harikrishnan', phone: '9037018509' }]
      },
      {
        id: 2,
        name: 'voltera (bulb making workshop)',
        description: 'Duration: 2hr\n\n Step into a warm and inspiring learning experience at our Bulb Making Workshop. Discover the simple science behind how a bulb lights up and enjoy creating your own model with gentle guidance. This hands-on session is designed to spark curiosity, encourage creativity, and brighten your understanding in a fun and welcoming environment.\n\nLast date for reg: 26 feb\n\nEach participant made their own bulb and received it at the end.',
        date: 'February 28, 2026',
        time: '9:30 PM - 11:30 PM',
        fee: '110',
        venue:'Electronics workshop lab (M307) ',
        badge: 2,
        image: '/depfolds/ec/voltera.jpeg',
        registrationUrl: 'https://makemypass.com/event/voltera',
        registerOption: 1,
        contact: [{ name: 'Navaneeth C V', phone: '9072392054' }, { name: 'Ashkar Salim', phone: '8590330521' }]
      },
      {
        id: 3,
        name: 'pi stark (rasberry pi workshop)',
        description: 'Duration: 2hr \n\nUnleash your inner tech hero!\n Get ready to create, code, and innovate with one of the most powerful mini-computers out there! Build exciting projects, experiment with technology, and bring your ideas to life in a fun, hands-on workshop. Connect with fellow tech enthusiasts, learn new skills, and explore the endless possibilities of Raspberry Pi. No matter your experience level, this is your chance to unlock creativity and tech magic!\n\nLast date for reg: 26 Feb',
        date: 'February 27, 2026',
        time: '10:00 AM - 12:00 PM',
        venue: 'System lab (M305)',
        fee: '150',
        badge: 2,
        image: '/depfolds/ec/pistack.jpeg',
        registrationUrl: 'https://makemypass.com/event/pi-stark',
        registerOption: 1,
        contact: [{ name: 'Samuel Joshy', phone: '8075187294' }, { name: 'Sana Fathima', phone: '9497670658' }]
      },
      {
        id: 4,
        name: 'Spark hub (arduino workshop)',
        description: 'Duration: 2hr \n\nIgnite Your Creativity with Arduino!\n\n Join us for a hands-on workshop where innovation meets electronics. Build, code, and bring your own Arduino projects to life.Explore circuits, microcontrollers, and programming in an interactive session.Step in, experiment, and create the technology of tomorrow! Connect with like-minded innovators and turn your ideas into reality. \nDon’t miss this chance to spark your imagination and master the art of Arduino!\n\nLast date for reg: 26 Feb',
        date: 'February 28, 2026',
        time: '1:00 PM - 3:00 PM',
        fee: '130',
        venue: 'System lab (M305)',
        badge: 2,
        image: '/depfolds/ec/arduino.jpeg',
        registrationUrl: 'https://makemypass.com/event/aurduino-101',
        registerOption: 1,
        contact: [{ name: 'Adon Eldho', phone: '7907035790' }, { name: 'Minna Eldho', phone: '8848239305' }]
      },
      {
        id: 5,
        name: 'arducode (arduino simulation competition)',
        description: 'Duration:2hr \n\nEnter a world where ideas come alive through code and creativity. Our Arduino Simulation Competition offers a vibrant platform for participants to design and simulate innovative embedded systems in a dynamic virtual environment. \nWith every circuit you connect and every line of code you write, you’ll shape intelligent solutions that reflect precision and imagination. This event celebrates thoughtful design, technical elegance, and the excitement of transforming simple concepts into smart digital creations. Join us and let your innovation shine.\n\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nGeneral Guidelines:\n • Each team can have a maximum of  1-2 members.\n•	Participants must design and simulate an Arduino-based project using simulation software Proteus \n• The coding part for an Arduino Simulation Competition can be done in (Arduino IDE). \n• Certificate will be provided.' ,
        date: 'February 28, 2026',
        time: '9:00 AM -11:00 AM',
        fee: '170 per team',
        prizepool: '₹3000',
        venue: 'System lab (M305)',
        badge: 3,
        image: '/depfolds/ec/a.jpeg',
        registrationUrl: 'https://makemypass.com/event/arducode',
        registerOption: 1,
        contact: [{ name: 'Basil Thomas', phone: '7736045956' }, { name: 'Sen Anoop', phone: '6238103683' }]
      },
      {
        id: 6,
        name: 'linex (line follower robotics)',
        description: 'Step into the world of smart technology and friendly competition at our Line Follower Robot Competition. This exciting event invites participants to design and build autonomous robots that gracefully follow a marked path with precision and speed. It’s a wonderful opportunity to explore creativity, teamwork, and problem-solving while applying your knowledge of robotics and programming.\nLet your innovation lead the way as your robot navigates curves and challenges with confidence. Join us for a day filled with learning, excitement, and the joy of turning ideas into motion! \n\nPrize pool: Rs.10000\n1st Prize: Rs.6000\n2nd Prize: Rs.4000\n\nGENERAL GUIDELINES:\n•	There will be check-in for the participants.\n•	Every team should have at least one laptop.\n•	Your bots must be within the size limit 20cm x 20cm x 20cm (l x b x h).\n•	Board size will be 6feet(height)x4feet(length). \n•	Track will be solid black.\n•	Track size will be 25mm in width.\n•	You could use any microcontroller. \n•	Battery pack should be onboard and max permissible voltage is 12V.\n•	If the robot moves outside the line or track, the participant is allowed to pick up the robot and place it back at the last checkpoint successfully reached.\n•	Participants are not allowed to touch the robot while it is running during the competition\n\nScoring criteria:\nTask points will be as follows:\n•	Successfully travelling through each section - 20 points \n•	Successfully stopping at the finishing point - 40 points \n•	Total - 100 points\n\nNegative point:\n•	If a participant touches the robot during the run, a penalty of –10 marks will be given for each touch.',
        date: 'February 27, 2026',
        time: 'Starts at 10 AM',
        fee: '200',
        prizepool: '₹10000',
        venue: 'ECE classroom (M117)',
        badge: 3,
        image: '/depfolds/ec/linex.jpeg',
        registrationUrl: 'https://makemypass.com/event/linex',
        registerOption: 1,
        contact: [{ name: 'Anand S', phone: '8111836424' }, { name: 'Jesald Tony', phone: '9188201911' }]
      },
      {
        id: 7,
        name: 'route it right (pcb design competition)',
        description: 'Duration: 3hr \n\nStep into an exclusive arena of innovation and precision with our PCB Design Simulation Competition. This premium event invites participants to demonstrate mastery in PCB layout, precision routing, and design optimization within a professional simulation environment. Engineered to challenge both creativity and technical depth, the competition emphasizes innovation, efficiency, and aesthetic clarity in every trace and connection. It is an opportunity to showcase advanced design thinking, attention to detail, and a refined understanding of circuit architecture. \nJoin us for an elite experience where sophistication meets technology, and every design reflects true engineering excellence\n\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nLast date for reg: 26 Feb\n\nRules and Regulations:\n•Open to all branch students\n•Participants can compete individually or in teams (maximum 2 members)\n•Allowed software is KiCad\n•The design must be original. Copying existing PCB layouts is strictly prohibited\n•	Participants must submit schematic files, PCB layout files, Gerber files, and a PDF of the design.\n•	The final design must pass Design Rule Check (DRC) without errors\n\nScoring criteria\n:•	Circuit Functionality & Correctness                     - 25\n•	Component Placement & Layout Optimization    - 20\n•	Routing Quality (trace width, clearance, vias )     - 20\n•	DRC Compliance (Error-free design)                    -15\n•	Board Aesthetics, Neatness & Proper Labelling    -15\n•	Innovation / Design Efficiency                               -5',
        date: 'February 27, 2026',
        time: '9:30 AM - 12:30 PM',
        fee: '130 per team',
        prizepool: '₹3000',
        venue: 'Computer lab-6 (M332) ',
        badge: 3,
        image: '/depfolds/ec/routeit.jpeg',
        registrationUrl: 'https://makemypass.com/event/route-it-right',
        registerOption: 1,
        contact: [{ name: ' Lakshmi', phone: '7736487168' }, { name: ' Aksa Mariyam', phone: '8075791698' }]
      },
      {
        id: 8,
        name: 'M-CODE (MATLAB CODING)',
        description: 'Duration: 3hr \n\n Discover the art of problem-solving at our MATLAB Coding Competition, where creativity blends seamlessly with technology. This engaging event encourages participants to think critically, code confidently, and develop smart solutions to real-world challenges using MATLAB.\n It’s more than just a competition — it’s a platform to learn, explore, and showcase your programming skills in a supportive and inspiring environment. Join us to challenge your mind, express your ideas through code, and experience the excitement of innovation in action! \n\n 1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nRULES AND REGULATIONS \n 1.Eligiblity and Team Structure \n • Participants may compete individually or in a team of two (1-2 members). \n • All team must register and present at the venue 15 minutes before the start of first round.  \n2.The qualifier (MCQ) (Round - 1) \n • A written test consisting of Multiple Choice Questions. \n • Round will last for 30 minutes. \n • In case of a tie the team that finishes the quiz in the shortest time will be selected.  \n• Only the top 4 teams with highest cumulative scores will be selected to the final round. \n 3.The programming and simulation challenge (Round - 2)  \n• The 4 finalist teams will be given a specific problem statement to solve.  \n• Teams must write a MATLAB code for the specified problem. Participants must run their code and demonstrate the output to the judge.\n • External internet browsing or AI tools are strictly prohibited. \n 4.Juding and Scoring Criteria \n • The final mark will be awarded by the judge based on following: \n • Functionality \n • Code Efficiency \n • Presentation \n • Visual Output  \n5.Final Decision  \n• The team/individual with the highest score in round 2 will be declared as the winner. \n •The judge’s decision is final and cannot be contested.\n\nLast date for reg: 26/02/2026',
        date: 'February 28, 2026',
        time: ' 9.30 AM to 12.30 PM',
        fee: '170 per team ',
        prizepool:'₹3000',
        venue: 'Computer lab-6 (M332)',
        badge: 3,
        image: '/depfolds/ec/mcode.jpeg',
        registrationUrl: 'https://makemypass.com/event/m-code',
        registerOption: 1,
        contact: [{ name: ' Adon Eldho', phone: '7907035790' }, { name: 'Henna MP', phone: '9037205706' }]
      },
      {
        id: 9,
        name: 'TECHTACKLE  (ROBO SOCCER COMPETITION )',
        description: 'Duration: 3hr \n\nWe are delighted to invite you to an exciting offline Robo Soccer Competition set in a professionally crafted arena. Participants will compete using standardized robotic systems arranged by the organizers, ensuring a fair and thrilling gameplay experience. \nDemonstrate your precision, control, and strategic thinking as you aim to outscore your opponent in this dynamic robotic showdown. If you’re ready to experience technology in motion, register now and be part of the action! \n\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nRules and regulations: \n• Only one operator allowed in control area.\n • Score goals in opponent’s goalpost.\n • Player with highest goals at end of match wins.\n • Total time: 3–5 minutes.\n • Goal counts only if ball completely crosses goal line.\n • After goal, ball reset to centre. \n• If tie, extra time (1–2 minutes)\n • Or penalty shootout (3 attempts each) \n\nLast date for reg: 26/02/2026 ',
        date: 'February 28, 2026',
        time: '09:30 AM - 12:30 PM',
        fee: '130 per person',
        prizepool:'₹3000',
        venue: ' ECE classroom (M120)',
        badge: 3,
        image: '/depfolds/ec/robosoccer.jpeg',
        registrationUrl: 'https://makemypass.com/event/tech-tackle',
        registerOption: 1,
        contact: [{ name: 'Benson Kuriakose', phone: '7736234898' }, { name: 'Samuel Joshy', phone: '8075187294' }]
      },
      {
        id: 10,
        name: 'LASER STRIKE (LASER TAG)',
        description: 'Total Duration: 8 Hour\n\n Gear up, lock and load, and dive into the ultimate laser tag showdown! Blaster Blitz is not just a game it’s a heart-pounding, adrenaline-pumping battlefield where strategy meets lightning-fast action.\n Form your teams, dodge, aim, and blast your way to glory in an offline tournament packed with thrills, laughter, and fierce competition. Whether you’re a sharpshooter or a stealthy strategist, everyone’s invited to join the fun and claim the title of ultimate Blaster Blitz champion!\n Don’t just watch…be part of the Blitz!\n\nRules for Participants\n All participants must follow these rules \n1.  Two teams: Red and Blue (4 players per team) \n2. Each player gets a gun and headband — keep them paired \n3. The gun screen shows ammo and life \n4. You “die” if you’re hit 4 times (your gun shows “Game Over”) \n5. To come back, go to your team’s base — it revives players every 30 seconds \n6. Partial life cannot be restored; only fully dead players can be revived \n7. The goal is to capture the capture point in the center \n8. At the start, the capture point is white (neutral) \n9. When a team shoots directly on top of it, it turns Red or Blue for that team \n10. You must be close to the capture point to capture it. Shooting from a distance won’t work \n11. Once captured, a 2-minute countdown starts for that team \n12. If the other team captures it midway, their countdown starts from where the opponent left off \n13. Example: Red timer at 0:20 → Blue captures → Blue countdown starts, Red needs only 20 seconds more to win if recaptured\n14. Winning condition: capture for a total of 2 minutes (this time can be changed as per the requirement of the organizer) \n15. Each match has 3 rounds (best of 3) \n16. When you’re being shot at, you can’t shoot back \n17. Don’t cross into the other team’s side beyond the capture point \n18. Reloading methods differ between guns \n19. The headband vibrates when hit \n20. No running or pushing -> this is for fun, not competition!\n\nSpot registration and online registration available.  ',
        date: 'February 28, 2026',
        time: ' Starts at 9.00 AM ',
        fee: '110 per person',
        venue: 'Basketball Court',
        badge: 4,
        image: '/depfolds/ec/l.jpeg',
        registrationUrl: 'https://makemypass.com/event/laser-strike',
        registerOption: 1,
        contact: [{ name: 'Naveen Sunil', phone: '9074131206' }, { name: 'Alwin Sibi', phone: '8848558945' }]
      },
      {
        id: 11,
        name: 'ROYALE WARFARE (E GAME – BGMI )',
        description: 'Prepare for an adrenaline-charged clash where survival meets strategy and legends are forged. Conquerer unites the explosive intensity of BGMI with the precision and brilliance of eFootball in one unstoppable championship. \nDominate the battleground. Command the pitch. Outplay, outlast, and outshine the competition. This is more than a tournament — it’s your moment to claim glory and prove you belong at the top.\n Register now and rise as the true Conquerer.\n\n1st Prize: Rs.1500 \n2nd Prize: Rs.1000 \n\nRules and Regulations:  \n• 🕗 Everyone must join the room at 8:00 PM sharp. \n• 🎮 Match will start exactly at 8:15 PM. \n• 🗺 Map: Erangle. \n• 🏆 Only one match will be played to select the winner \n• 🚫 Late entries will not be allowed.\n • 🎯 Play fair – no teaming or cheating.\n • 📶 Ensure a stable internet connection. \n• 🔕 Maintain mic discipline during the match \n\nLast date for reg: 23/02/2026',
        date: 'February 24, 2026',
        time: '08:00 PM',
        fee: '110 per team',
        prizepool:'₹2500',
        venue: 'Online',
        badge: 3,
        image: '/depfolds/ec/bgmi.jpeg',
        registrationUrl: 'https://makemypass.com/event/royalwarfare',
        registerOption: 1,
        contact: [{ name: 'Arundev NB', phone: '7034235202' }, { name: 'Albin Eldhose', phone: '7034920887' }]
      }
    ]
  },
  'mechanical': {
    name: 'Mechanical',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'SEMINAR AND INNOVATION ',
        description: 'Seminar and innovation presentation \nShowcase your innovative ideas and cutting-edge engineering projects. Join us for an inspiring seminar filled with creativity, technology, and groundbreaking discoveries\n\nRules / Guidelines\n\n1.Each team shall consist of a maximum of four (4) participants. Individual participation is permitted.\n2.Participants must be currently enrolled students of a recognized college or university.\n3.All participants are required to carry and present a valid student identification card at the time of the event.\n4.The presentation topic must be related to the field of Mechanical Engineering. Acceptable areas include innovation, technology, research, entrepreneurship, sustainability, or emerging trends within the discipline.\n5.Participants must bring their own laptop/system and the required presentation file (PPT). Only a projector',
        date: 'February 27, 2026',
        time: '10:00 AM',
        venue: 'Room no. M208',
        prizepool: '₹3,000',
        fee: '80 per head',
        badge: 3,
        image: '/depfolds/mec/idea.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: ' Nandana Sunil', phone: '6235734127' }, { name: 'Anand', phone: '9778442389' },{ name: '', phone: '' }]
      },
      {
        id: 2,
        name: 'CIRCLE SMASH (Mini Game) ',
        description: 'Prize \n* score 15+ runs to get amazing prize\n*Prize varies based on scoring runs\n*Minimum prize 15+\n\nGame\n There will be a circle with out runs marked on it. Players have to defend from the center circle with their bat and reach the marked circles. Those who score 15+ runs will get gifts.\n\nRules\n•score runs with using bat only \n•stay on the circle\n•Score runs only with defensive shots',
        date: 'February 27, 2026',
        time: '9 AM',
        venue: 'Near to bike parking ',
        prizepool: 'Excisting prizes',
        fee: '30 per person',
        badge: 3,
        image: '/depfolds/mec/mini.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Basil Eldhose', phone: '6235366926' }, { name: 'Martin Antony', phone: '6235887598' },{ name: '', phone: '' }]
      },
      {
        id: 3,
        name: 'LATHE MASTER',
        description: 'Prize Pool\n1st : 2000\n2nd: 1000\n\nA high-intensity machining challenge testing precision turning, dimensional accuracy, tool control, and time efficiency. Execute real-world lathe operations and prove your technical skill to claim the title of Lathe Master.\n\nRules / Guidelines\n•Participants should wear safety shoes•\nParticipants must complete the official registration form by the given deadline.\n•Each participant will be provided with a lathe machine, cutting tools, tool holders, and work piece material\n•Participants are not allowed to bring their own tools, measuring devices, or materials\n•Participants will have a fixed time limit of 1.5 hours (including setup time) to complete the task\n•Individual Participation Only – no team entries.\n•Participants should have a valid College ID.',
        date: 'February 27, 2026',
        time: '9:00 AM',
        venue: 'MT Lab ',
        prizepool: '₹3000',
        fee: '130',
        badge: 3,
        image: '/depfolds/mec/spin.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Midhun', phone: '9037165193' }, { name: '', phone: '' },{ name: '', phone: '' }]
      },
      {
        id: 4,
        name: 'AUTO XPLORE',
        description: 'Dept. of Automobile Engineering \n🛠️ Live Engine Strip down session\n⚙️ From power➡️ precision \n🔩 Explore the mechanical logicOf Ic engine\n🧑‍🔧 Hands-on Automobile lab experience\n\nDont miss the power-packed Technical Experience!\n📌Register now & be part of the action',
        date: 'February 27, 2026',
        time: '10:00 AM',
        venue: 'MT Lab ',
        fee: '230',
        badge: 2,
        image: '/depfolds/mec/auto.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Shifan', phone: '9747723133' }, { name: 'Ashkar', phone: '6238535799' }]
      },
      {
        id: 5,
        name: 'STEEL ARMS (CHALLENGE)',
        description: 'Are you ready to defy gravity and prove your power?\nThis challenge is not just about physical strength-its about focus, resilience, and pushing beyond limits\n>Every second counts.\n>Every grip matters.\n>Only the strongest will remain hanging till the end.',
        date: 'February 27, 2026',
        time: '10:00 AM',
        venue: 'Bus Parking Area',
        prizepool: '₹500',
        fee: '30',
        badge: 4,
        image: '/depfolds/mec/5.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Eldhose', phone: '9061022005' }, { name: '', phone: '' }]
      },
      {
        id: 6,
        name: 'FREE FIRE XPLORE 2026',
        description: 'Gear Up.Lock In.Dominate the Zone\n⚙️ MECH FIRE\nExperience the fusion of Gaming + Mechanical Power\n\n💰 Registration Fee: ₹230 Per squad',
        date: 'February 27, 2026',
        time: '10:00 AM',
        venue: 'Bus Parking Area',
        prizepool: '₹1000',
        fee: '230 per SQUAD',
        badge: 3,
        image: '/depfolds/mec/6.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Shown k Moncy', phone: '7510316752' }, { name: 'Sobin Chacko', phone: '9496806446' }]
      },
      {
        id: 7,
        name: 'MEP Master Workshop',
        description: 'MEP Master Workshop\nA hands-on session introducing participants to the basics of designing Mechanical, Electrical, and Plumbing (MEP) systems using Revit. Participants will learn fundamental tools, workflows, and modeling techniques used in building design to gain practical skills for engineering and construction projects.\n\nWorkshop Highlights\n-Introduction to BIM & Revit MEP-\nRevit Interface & Navigation\n-Project Setup – Levels & Views\n-HVAC System Modeling\n-Mechanical Piping Modeling\n-Equipment, Fittings & Accessories -Placement\n-3D Views & Section Creation\n-Documentation & Industry Workflow\n-Schedules & Quantity Extraction\n-MEP Coordination & Career Scopen\n\nWorkshop Details-\nLevel: Beginner to Working \nKnowledge-\nMode: Demo + Hands-on Practice',
        date: 'February 28, 2026',
        time: '09:00 AM',
        venue: 'Lab 5',
        fee: '50',
        badge: 2,
        image: '/depfolds/mec/7.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Kevin S Dev:', phone: '9495887576' }, { name: 'Thahir PS', phone: '7593906129' }, { name: 'Rahul Manoj', phone: '8113068549' }]
      },
      {
        id: 8,
        name: 'GRIP &FIT CHALLENGE',
        description: '>You get the parts.\n>You get the time limit.\n>You get one shot.\n"Assemble a fully functional lathe chuck before the clock runs out."\nSpeed, accuracy, and teamwork decide who survives the war.\n\nEntry Fee:  ₹130 per team (2 members)\n\nPrize:\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000',
        date: 'February 27, 2026',
        time: '09:00 AM',
        venue: 'MT LAB',
        prizepool: '₹3000',
        fee: '130 per team of 2 members',
        badge: 3,
        image: '/depfolds/mec/8.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Andrews', phone: '9562336350' }, { name: 'Seth', phone: '8590973900' }]
      },
      {
        id: 9,
        name: 'TECHNOVA',
        description: 'Mini Project Expo Is A College & School Event That Showcases Students Innovative Ideas And Technical Skills Through Mini Projects. It Provides A Platform To Present Concepts, Demonstrate Working Models, And Enhance Creativity, Teamwork, And Presentation Skills.\n\nRules and Regulations:\n>First Day: Forenoon, 27/2/26\n>Duration: 4 hours\n>Team Time: 12 + 5 minutes\n>Prototype: Not mandatory\n>Team Size: Maximum of 5 persons\n>Policy: same projects from the same school or college will be cancelled\n>Registration Fees: ₹100 per team for schools; ₹50 per head for colleges\n>Identification: College ID card is mandatory\n>PPT Requirements: Must include a proof video of the project featuring the participants\n>Supervision: Staff accompaniment is mandatory for school students, but not required for college students\n\nPrize Pool:\n1st Prize: Rs.1500 \n2nd Prize: Rs.750',
        date: 'February 27, 2026',
        time: '09:00 AM',
        venue: 'Class Room 205',
        prizepool: '₹2250',
        fee: '130/- For School team, 80/- Per head for college students',
        badge: 3,
        image: '/depfolds/mec/9.jpeg',
        registrationUrl: '',
        registerOption: 1,
        contact: [{ name: 'Anson P Babu', phone: '8943479975' }, { name: 'Govindh Krishnan', phone: '7510723398' }]
      },
    ]
  },
  'civil': {
    name: 'Civil',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'TITAN TENSION (BRIDGE MAKING COMPETITION)',
        description: 'The Bridge Making Competition is a hands-on engineering event that challenges students to design and construct a model bridge using specified materials within given constraints.\n\n📝Certificates are provided\n\n📌Rules and regulations \n1. Each team can consist of 2–3 members. \n2. The bridge must span 30 cm.\n3.The material used is Wood Ice Cream Sticks.\n4.Quantity of materials will be given.\n5. Total time allotted : 90 minutes\n\n📌Testing and Loading \n1. After construction, bridges will be tested.\n2. The maximum load sustained by the bridge will be recorded.',
        date: 'February 28, 2026',
        time: '10:00 AM',
        fee: '165',
        venue: 'Drawing Hall(St.Thomas Block, MBITS)',
        prizepool: '₹2,000',
        badge: 3,
        image: '/depfolds/civ/titan.jpeg',
        registrationUrl: 'https://makemypass.com/event/titan-tension',
        registerOption: 1,
        contact: [{ name: 'Mathew Abraham', phone: '8078426690' }, { name: 'Akshara K R', phone: '8848070864' }]
      },
      {
        id: 2,
        name: 'STATICA (STILL MODEL COMPETITION)',
        description: 'As part of Tech Fest ( KARNAK 26 ),The Department of Civil Engineering, Mar Baselios Institute of Technology and Science Kothamangalam presents STILL MODEL COMPETITION\n\nEligibility - All Civil Engineering (UG, PG & Diploma) Students\n\n📌Rules and regulations \n1) Static, original civil model only.\n2 ) Bring display and description chart.\n3 ) No hazardous materials.\n4 ) 3–5 minute explanation; judges final.\n5 ) Innovation and presentation based evaluation; violation disqualified.\n\nLast Date of Registration  - 25/02/26📅',
        date: 'February 27, 2026',
        time: '10:00 AM',
        fee: '220',
        venue: 'Drawing Hall(St.Thomas Block, MBITS)',
        prizepool: '₹3,000',
        badge: 3,
        image: '/depfolds/civ/static.jpeg',
        registrationUrl: 'https://makemypass.com/event/statica',
        registerOption: 1,
        contact: [{ name: 'Prof. Rinku Kuriakose', phone: '9846271793' },{ name: 'Mariya Stanselavos', phone: '9074185655' }, { name: 'Adhul Mathew', phone: '9383466695' }]
      },
      {
        id: 3,
        name: 'The Heavy Haulage Show',
        description: 'A Civil Engineering Expo Show is a platform where students showcase innovative projects, models, and modern construction techniques. It highlights practical skills, engineering creativity, and real-world applications in areas like structures, transportation, and sustainable development.',
        date: 'February 27, 2026',
        fee: 'FREE',
        venue: 'Front Area and Ground',
        badge: 1,
        image: '/depfolds/civ/heavy.jpeg',
        registrationUrl: '',
        registerOption: 2,
        contact: [{ name: 'Mr. Basil Eldhose', phone: '9895343839' }, { name: 'Eldho Paulose', phone: '8075587355' },{ name: 'Ameenudheen E A', phone: '9188362003' }]
      },
      {
        id: 4,
        name: 'BIMNOVA ',
        description: 'The BIM Lab Workshop introduces students to Building Information Modeling (BIM) — a modern method of designing buildings using intelligent 3D models instead of 2D drawings.\n\n Eligibility: All Civil Engineering students (UG, PG & Diploma)\n\n📜 Certificates will be provided to all participants\n\n🗓 Last Date to Register: 25/02/2026',
        date: 'February 27, 2026',
        time: '09:30 AM',
        fee: '110',
        venue: 'Software Lab – LAB 1 (107)',
        badge: 2,
        image: '/depfolds/civ/bimnova.jpeg',
        registrationUrl: 'https://makemypass.com/event/bimnova',
        registerOption: 1,
        contact: [{ name: 'Ms. Vidya Vijayan', phone: '8138827243' },{ name: 'Ms. Arya P. V.', phone: '8590876166' },{ name: 'Mr. Godwin Santo', phone: '6238638364' },]
      },
      {
        id: 5,
        name: 'VISION IN LINES',
        description: 'Shape your ideas💡\nA Workshop on SketchUp is organized by the Department of Civil Engineering,Mar Baselios Institute of Technology and Science (MBITS) that focuses on 3D modeling and visualization using SketchUp.\n\n🎓Eligibility-All Civil Engineering (UG,PG,Diploma)students\n📝Certificates will be provided\n⚠️Last date for registration-25/02/2026',
        date: 'February 28, 2026',
        time: '09:30 AM',
        fee: '110',
        venue: 'Software Lab 1(107)',
        badge: 2,
        image: '/depfolds/civ/vision.jpeg',
        registrationUrl: 'https://makemypass.com/event/vision-in-lines',
        registerOption: 1,
        contact: [{ name: 'Prof.Vidya Vijayan', phone: '8138827243' },{ name: 'Meera P Gireesh', phone: '8590698764' },{ name: 'Adhiya V Majeed', phone: '7306578529' },]
      },
       {
        id: 6,
        name: 'MAQUETA ACTIVA',
        description: 'A Working Model Competition in Civil Engineering provides a platform for students to design and present functional models that demonstrate innovative solutions to real-world infrastructure and construction challenges, bridging theory with practical application.\n\n🎓 Eligibility: Civil Engineering Students (UG, PG & Diploma)\n🗓️ Last Date to Register: 25/02/2026\n\n📌 Evaluation Criteria:\n* Innovation & Creativity\n* Working Efficiency\n* Technical Knowledge\n* Practical Application\n* Presentation & Explanation',
        date: 'February 27, 2026',
        time: '10:00 AM',
        fee: '220 per team',
        venue: 'Drawing Hall, St. Thomas Block',
        prizepool: '₹3,000',
        badge: 2,
        image: '/depfolds/civ/maqueta.jpeg',
        registrationUrl: 'https://makemypass.com/event/maqueta-activa',
        registerOption: 1,
        contact: [{ name: 'Prof.Devanjana Manu', phone: '9778257605' },{ name: 'Jithu Joby', phone: '8590741298' }]
      },
      {
        id: 7,
        name: 'CAD PINNACLE (CAD Drawing Competition)',
        description: 'CAD PINNACLE – Design. Draft. Dominate. 🧩📐\nShowcase your creativity and technical precision in this exciting CAD drawing competition. Participants will be challenged to create accurate and innovative drawings using CAD software within the given time.\nThis competition tests your drafting skills, speed, visualization ability.\n\nRules / Guidelines\n* Individual participation only.\n* Participants must report on time at the venue.\n* Required software and system will be provided unless instructed otherwise.\n* Evaluation will be based on accuracy, presentation, and completion time.\n* Any malpractice or copying will lead to disqualification.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        fee: '55 ',
        venue: 'software Lab 1',
        prizepool: '₹1,000',
        badge: 3,
        image: '/depfolds/civ/cadpin.jpeg',
        registrationUrl: 'https://makemypass.com/event/cad-pinnacle',
        registerOption: 1,
        contact: [{ name: 'Mr. Adeeb A.A', phone: '9995370174' },{ name: 'Mr. Niranjan T.P', phone: '8129291099' }]
      },
      {
        id: 8,
        name: ' BITSCAZA (TREASURE HUNT)',
        description: 'BITSCAZA is an exciting on-campus treasure hunt designed to test your problem-solving skills, teamwork, logical thinking, and speed. Participants will navigate through multiple clues hidden across the campus, solving challenges and decoding hints to reach the final treasure.\n\n Team Size: 3 members per team\n\nRules & Regulations:\n>Each team must consist of exactly 3 members\n>Clues must not be damaged or removed from their locations.\n>The team that completes all levels in the shortest time wins.\n>Judges decision will be final.\n\n',
        date: 'February 27, 2026',
        time: 'TBA',
        fee: '165 ',
        venue: 'All civil Labs ',
        prizepool: '₹1500',
        badge: 3,
        image: '/depfolds/civ/8.jpeg',
        registrationUrl: 'https://makemypass.com/event/bitscaza',
        registerOption: 1,
        contact: [{ name: 'Salini Mohan', phone: '9633099290' },{ name: 'Sreehari Shaji', phone: '9037275307' },{ name: 'Vismaya Anilkumar', phone: '9847703381'}]
      },
      {
        id: 9,
        name: 'IDEA 2 INFRA (BUILD-UP IDEATHON)',
        description: 'An innovation brainstorming competition \n\n Ideathon competition -An innovation brainstorming competitionGenerate and present creative solutions to real-world problems.\nAn Ideathon is a creative competition where participants come together to identify problems and propose innovative, practical solutions within a limited time. It encourages critical thinking, teamwork, and creativity, helping participants develop problem-solving and entrepreneurial skills.\n\n👥Group size - 5 members\n\nPrize pool\n💵1st prize -2000\n💵2nd prize -1500\n📝Certificates are provided\n\nRules & Regulations \n*Participants can take part individually or in teams.\n*Each team should consist of 5members.\n*Ideas must be based on the civil engineering \n*The idea should be original and innovative\n*Participants must submit their idea within the given time limit.\n*Each team will be given limited time for presentation, followed by a Q&A session.\n*Ideas will be judged based on innoinnovation,feasibility, clarity &impact \n*The decision of the judges will be final\n*All participants must follow instructions of the organizers',
        date: 'February 27, 2026',
        time: 'Forenoon',
        fee: '275 ',
        venue: 'M108',
        prizepool: '₹3500',
        badge: 3,
        image: '/depfolds/civ/9.jpeg',
        registrationUrl: 'https://makemypass.com/event/idea-2-infra',
        registerOption: 1,
        contact: [{ name: 'Supriya T.S', phone: '8075493079' },{ name: 'Sona Eldhose', phone: '8086491985' }]
      },
      {
        id: 10,
        name: 'RAKSHAK (Fire & Rescue Awareness Initiative)',
        description: '*RAKSHAK* is a dynamic fire safety awareness and rescue demonstration program conducted in collaboration with the *Kerala Fire and Rescue Services* as part of KARNAK’26 at *Mar Baselios Institute of Technology and Science (MBITS).\nThis powerful event highlights the courage, discipline, and technical expertise of firefighting professionals through live demonstrations, safety education, and real-world rescue insights. ',
        date: 'February 27, 2026',
        time: 'TBA',
        venue: 'Central Courtyard',
        badge: 1,
        fee: 'FREE',
        image: '/depfolds/civ/10.jpeg',
        registrationUrl: '',
        registerOption: 2,
        contact: [{ name: ' Mr. Kailas G Nath', phone: '7306844581' },{ name: 'Mr. Basil Shaji', phone: '8111895460' },{ name: 'Mr. Adhithyan K S', phone: '9526875078'}]
      },
      {
        id: 11,
        name: 'The Civilverse',
        description: 'Civilverse, in the context of a Civil Engineering Tech Fest exhibition, represents an immersive digital and physical learning platform that showcases the vast and evolving world of civil engineering through innovation, visualization, and practical demonstrations \n\nHave a Comprehensive and Engaging experience of Civil Engineering ',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Room No M104,M106',
        badge: 4,
        image: '/depfolds/civ/11.jpeg',
        registrationUrl: '',
        registerOption: 2,
        contact: [{ name: 'Prof.Deepthy Varkey', phone: '9496333858' },{ name: 'Adhithyan c jain', phone: '7736233238' },{ name: 'Abhijith saju', phone: '9495525930' }]
      },
    
    ]
  },
  'electrical': {
    name: 'Electrical',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'EV SHOW',
        description: 'Step into the future of mobility with our Electric Vehicle Exhibition, where innovation meets sustainability. Experience the latest electric vehicles, smart technologies, and breakthrough designs that are redefining how we move. A must-visit for technology enthusiasts and future-ready thinkers.',
        date: 'February 27, 2026',
        time: 'TBA',
        fee: 'FREE',
        venue: 'Central Courtyard',
        badge: 4,
        image: '/depfolds/eee/1.jpeg',
        registrationUrl: '',
        registerOption: 2,
        contact: [{ name: 'Mohammed Arshad K A', phone: '6235273173' }]
      },
      {
        id: 2,
        name: '𝗣𝗼𝘀𝘁𝗲𝗿 & 𝗟𝗼𝗴𝗼 𝗖𝗼𝗺𝗽𝗲𝘁𝗶𝘁𝗶𝗼𝗻',
        description: 'Rules & Regulations- \n•Individual participation only\n•Arrange text and images neatly.\n•Font size should be readable from a distance.\n•Proper Colors\n•Use images that match the topic.\n•Keep equal spacing.\n🖼️ Poster & Logo Design Time Duration:\n* Time Duration : 2 hours\n* Use A 3 Paper',
        date: 'February 27, 2026',
        time: '12:30 PM',
        fee: '50',
        venue: 'Lab 5',
        prizepool:'1500',
        badge: 3,
        image: '/depfolds/eee/poster.jpeg',
        registrationUrl: 'https://makemypass.com/event/poster-logo',
        registerOption: 1,
        contact: [{ name: 'Fathima Zahra', phone: '7560826349' },{ name: 'Achu T V', phone: '7306990697' }]
      },
      {
        id: 3,
        name: 'CAD LAB WORKSHOP',
        description: 'In celebration of Karnak26 , the Department of Electrical & Electronics Engineering presents the CAD Lab Workshop, an interactive session focused on design innovation, practical modeling, and developing essential technical skills in computer-aided design.\n\n🔖 Certificates are provided\n\n 💢Sketch,Model,Create. Join the CAD Lab Workshop and shape your ideas ! ',
        date: 'February 28, 2026',
        time: '10:00 AM',
        fee: '50',
        venue: 'Lab 5',
        badge: 2,
        image: '/depfolds/eee/cad.jpeg',
        registrationUrl: 'https://makemypass.com/event/eee-cad-workshop',
        registerOption: 1,
        contact: [{ name: 'Aboobakkar Sidhiq T A', phone: '96055582312' },{ name: 'Muhammed Shah V M', phone: '7736207517' }]
      },
      {
        id: 4,
        name: 'ELECTRICAL QUIZ',
        description: 'In celebration of Karnak26 , the Department of Electrical & Electronics Engineering presents the Electrical quiz competion."Think you know your circuits? Test your knowledge in this  Battle through the preliminary elimination round to earn your spot on the main stage. Hit our custom-built buzzer first to claim your points and spark your brain!"\n\nRules & Regulations:\n*Open registration—unlimited entries accepted!\n* Each team must consist of exactly 2 members.\n* The event consists of a Preliminary Elimination Round followed by the Final Buzzer Stage.\n* Only top-scoring 6 teams from the prelims will advance to the buzzers.\n* Tie-Breaker: In case of a tie in the written round, the team that submitted their paper in the shortest time will advance.\n* Teams must report 10min prior to the event.\n* Registration fees is to be paid online.\n* The quiz will have multiple rounds, including a rapid-fire Buzzer Round.\n* Negative marks will apply for incorrect answers in the buzzer round.\n* Use of mobile phones, smartwatches, or any electronic gadgets is strictly prohibited.\n* The Quizmasters decision will be final and binding.\n\n✨ Step into the Electrical Quiz - dont just follow the current, be the voltage that leads',
        date: 'February 28, 2026',
        time: '11:30 AM',
        fee: '100(for a team of 2 )',
        venue: 'Room M19',
        prizepool:'2500',
        badge: 3,
        image: '/depfolds/eee/quiz.jpeg',
        registrationUrl: 'https://makemypass.com/event/electrical-quizz',
        registerOption: 1,
        contact: [{ name: 'Alvin Saju', phone: '7012877401' },{ name: 'Deva Surya', phone: '8078472116' }]
      },
      {
        id: 5,
        name: 'MISSION: BOMB DEFUSE',
        description: 'The campus is under threat, and the countdown has begun at Karnak 26! We need the brightest minds to step up, solve the puzzles, and save the day. Do you have the nerves to handle the pressure?\n\nRULES AND REGULATIONS:\n * Go Solo or Squad Up: You can take on this mission alone or participate as a group.\n* The Scavenger Hunt: Find all the clues hidden across the campus to progress.\n* The Final Stage: The last clue will reveal the secret location of the bomb and the code required to unlock it.\n* The Ultimate Test: When you face the actual bomb, it will challenge you with questions that only the sharpest minds can decode.\n* Zero Margin for Error: Only 3 errors will be tolerated. One wrong move and it’s game over,be sure to save the campus!\n\nDont wait until the timer hits zero! Contact our mission lead',
        date: 'February 27, 2026',
        time: '11:00 AM',
        fee: '50',
        venue: 'M22',
        prizepool:'2000',
        badge: 3,
        image: '/depfolds/eee/bomb.jpeg',
        registrationUrl: 'https://makemypass.com/event/bomb-diffusal',
        registerOption: 1,
        contact: [{ name: 'Basil Mathew Eldho', phone: '8281207566' }]
      },
      {
        id: 6,
        name: 'Wiring wizards (wiring Competition)',
        description: '🛠️ “Every wire has a purpose and every connection has a consequence. Excellence comes from understanding both.\n”In the part of celebration of Karnak26 The department of electrical and electronics engineering presents the Wiring competition. A thrilling experience for speed,technical skill etc...\n\n1st price : ₹1000\n2nd price : ₹500\n\nRules and regulations\n●Phones are not allowed on arena \n●There will be a digital exam conducted before the competition \n●The team should come with their own tools\n●Teams must consit of one or two people ',
        date: 'February 28, 2026',
        time: '10:30 AM',
        fee: '50',
        venue: 'EEE Workshop',
        prizepool:'1500',
        badge: 3,
        image: '/depfolds/eee/wiring.jpeg',
        registrationUrl: 'https://makemypass.com/event/wiring-competition-1',
        registerOption: 1,
        contact: [{ name: 'Anjal', phone: '9400090728' },{ name: 'Ljin', phone: '9074807202' }]
      },
    
    ]
  },
  'general': {
    name: 'Computer Applications',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'PES (E-Football)',
        description: 'PES (E-Football)\nRegistration Amount – ₹60\n Prize Pool – ₹3,000\nMATCH SETTING:\n•	7 MIN MATCH \n•	5  SUB \n•	RANDOM FORM\n•	PENALTY ON \n\nRules and Regulations:\n📌 Exit from the match at the beginning if you face any lag or network issues . Exiting from the match after scoring a goal by the opponent will not be considered as an excuse.\n📌 Exiting from the match after getting a red card will be considered as a win for your opponent.\n📌 Smart assist must be off , TEAM STRENGTH Must be under 3200 \n📌 Beware of match creation , points raised after the opponents win will not be valued.\n📌 Exiting from the match when the opponent gets a chance to score goal , will reward a goal for the person who got the chance to score.\n📌 If the match gets disconnected in between start a new match with same aggregate score with remaining time [❗SAME SQUAD & SAME MANAGER❗] \n📌 If the match disconnects at/after 80 minutes a win will be awarded for the player who is in the lead.\n📌 If valid proofs are provided immediate action or coordinators will slowly understand the truth about the situation and take action according to it.\n📌Avoid unnecessary verbal arguments between players and if someone misbehaves, report it to the coordinators without escalating the problem.\n📌 If any Match disconnects due to any issue kindly please inform to the coordinators . And Admin will decide the rematch according to the Aggregate score with the remaining minutes of the match .\n📌If any doubt regarding the Match or anything you can inform the coordinators personally.\n📌 All participants must report at the venue 30 minutes before the event starts\n📌 CORDINATORS DECISION WILL BE FINAL',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        prizepool: '₹3,000',
        fee: '60',
        badge: 3,
        image: '/depfolds/ca/efootball.jpeg',
        registrationUrl: 'https://makemypass.com/event/pes-e-football',
        registerOption: 1,
        contact: [{ name: 'Neeraj', phone: '8086368571' }, { name: 'Vyshnav', phone: '9496669914' },{ name: 'Kiran MS', phone: '8606811261' },{ name: 'Niranjan', phone: '8848669127' }]
      },
      {
        id: 2,
        name: 'TREX: Trail of Clues (TREASURE HUNT)',
        description: 'TREX: Trail of Clues challenges your wit, teamwork, and speed as you race against time to crack clues and uncover secrets hidden in plain sight\n.Get ready for the ultimate adventure where mystery, clues, and hidden treasures await!Every step brings you closer to victory—if you can think smart, move fast, and trust your team.\n\nRules and Regulations:\n* Teams must consist of 4 members only.\n* The hunt is restricted to campus areas only.\n* Clues must be solved in order, skipping or sharing clues is strictly prohibited. \n * Any damage, misconduct, or unsafe behaviour will lead to disqualification.\n* The first team to complete all clues correctly will be declared the winner.\n* The organizers’ decision is final.\n* All participants must report at the venue 30 minutes before the event start time.',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        prizepool: '₹5,000',
        fee: '50 per person',
        venue: 'Room M326',
        badge: 3,
        image: '/depfolds/ca/treasurehunt.jpeg',
        registrationUrl: 'https://makemypass.com/event/trextrail-of-clues',
        registerOption: 1,
        contact: [{ name: 'Ashli Sojan', phone: '62357 36827' }, { name: 'Anna Rose Joshi', phone: '62382 54635' }]
      },
      {
        id: 3,
        name: 'CODE QUEST (CODING CHALLENGE)',
        description: 'Enter the world of Code Quest where coders battle through brain-teasing problems and race against time.Sharpen your logic, trust your skills, and turn ideas into powerful code.The quest begins with a single line of code!\n\nRules & Regulations\n1.This is an individual participation event\n2.Participants must solve the given problem on the provided system only\n3.The competition will be conducted strictly in C programming language\n4.Participants must complete and submit their code within the allotted time.\n5.Internet access is strictly prohibited during the contest.\n6.Mobile phones, external storage devices, and any electronic gadgets are not 	allowed.\n7.Participants are not allowed to discuss or share solutions with others.\n8.Copying, plagiarism, or any form of malpractice will lead to immediate disqualification.\n9.Participants must submit their code before the deadline.\n10.The submitted program must compile and run without errors\n11.Participants must include their Name and ID in the program file.\n12.Winners will be decided based on:\nCorrectness of the output\nEfficiency of the code\nLogical approach\nTime of submission\n13.Participants must remain in the lab until the event concludes.\n14.The decision of the judges and coordinators will be final.',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        prizepool: ' ₹3,000',
        fee: '50',
        venue: 'LAB 10',
        badge: 3,
        image: '/depfolds/ca/codequest.jpeg',
        registrationUrl: 'https://makemypass.com/event/codequest',
        registerOption: 1,
        contact: [{ name: 'Aparna', phone: '7012713377' }, { name: 'Alan', phone: '6238236726' }]
      },
      {
        id: 4,
        name: 'SHUTTER STORIES (PHOTOGRAPHY COMPETITION)',
        description: 'SHUTTER STORIES is a creative photography competition that encourages participants to capture powerful moments through their lens. The event focuses on originality, creativity, and theme-based photography. Participants are expected to present their best visual stories that reflect emotion, perspective, and artistic expression.\n\nRules & Regulations:\n1. Each participant can submit a maximum of 2 entries.\n2. The theme will be announced prior to the competition.\n3. Photographs must strictly relate to the given theme.\n4. Photos must be submitted in JPEG/PNG format only.\n5. Minimum resolution required: 1920 × 1080 pixels.\n6. All photographs must be the original work of the participant.\n7. No copyrighted, downloaded, or stock images are allowed.\n8. AI-generated images are strictly prohibited.\n9. Basic editing such as brightness, contrast, cropping, and color correction is allowed.\n10. Heavy manipulation, object addition/removal, or composite images are not permitted unless specified.\n11. Watermarks, signatures, or borders must not be added.\n12. There is no restriction on device type (Mobile/DSLR/Mirrorless allowed).\n13. Plagiarism or malpractice will lead to immediate disqualification.\n14. The decision of judges and coordinators will be final and binding.',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        prizepool: '₹2,000',
        fee: '30',
        venue: 'Room M326',
        badge: 3,
        image: '/depfolds/ca/shutter.jpeg',
        registrationUrl: 'https://makemypass.com/event/shuttlestories',
        registerOption: 1,
        contact: [{ name: 'Ajay', phone: '8129529363' }, { name: 'Cenna', phone: '6235263729' }]
      },
      {
        id: 5,
        name: 'ROOTFORCE (CTF)',
        description: 'Name: Root force the ultimate hackers contest\nTheme: Mr. Robot \n\nRules for registration \n1.Competition is open to all registered participants \n2.Participants can compete individually or team of 2\n3.Each participant can be part of 1 theme\n4.Participant should bring laptop \n\nCompetition format\n\n 1.Each task contains a flag \n2.Task/challenges include:\n -Hidden files \n-Web security\n -Cryptography \n-Forensic/Reverse and miscellaneous\n3.Duration: 1-3hrs\n4.Event will start and stop strictly on time\n- Each task/challenge carries pre-defined points\n - Team with maximum points in allowed time is considered as winners\n - In case of tie team that submit earliest wins\n- Final decision is done by organising committee',
        Venue: 'LAB 10',
        Date: '28th February',
        Prize: '3,000',
        date: 'February 28, 2026',
        time: 'FULL DAY',
        prizepool: '₹3000',
        fee: '60',
        venue:'Lab 10',
        badge: 3,
        image: '/depfolds/ca/rootforce.jpeg',
        registrationUrl: 'https://makemypass.com/event/rootforce',
        contact: [{ name: 'Vishnupriya', phone: '7907456401' }, { name: 'Jerald', phone: '7025497088' }]

      },
      {
        id: 6,
        name: 'CLASH OF KEYS ( SPEED TYPING )',
        description: '1. The competition is open to all registered participants of the tech fest.\n2. The event is an individual competition unless otherwise specified.\n3. Participants must report at the venue at least 15 minutes before their scheduled round.\n4. Each participant will be allotted a system; changing systems is not permitted without permission from the coordinator.\n5. Use of mobile phones, smart watches, earphones, or any external devices is strictly prohibited during the competition.\n6. Copy-paste, auto-correct tools, predictive text, or any typing assistance software is not allowed.\n7. Participants must type only the text displayed and follow round-specific instructions carefully.\n8. Any form of malpractice, disturbance, or unfair means will lead to immediate disqualification.\n9. Participants must maintain silence and discipline during the event.\n10. The decision of the judges and event coordinators will be final and binding.',
        date: 'February 28, 2026',
        time: 'FULL DAY',
        prizepool: '₹2000',
        fee: '30',
        venue: 'LAB 11',
        badge: 3,
        image: '/depfolds/ca/clash.jpeg',
        registrationUrl: 'https://makemypass.com/event/clash-of-keys',
        registerOption: 1,
        contact: [{ name: 'Sibion', phone: '7306769579' }, { name: 'Achu', phone: '9496110247' }]
      },
      {
        id: 7,
        name: 'CODE CRUSH (OUTPUT PREDICTION)',
        description: 'Code Crush is a logic-based coding competition where participants predict the output of given pseudo code without executing it. The event tests analytical thinking, code tracing skills, and attention to detail. No compiler, no execution—just pure logic and sharp reasoning.\n\nRules & Regulations:\n1.Individual participation only \n2.Participants must carry valid college/tech fest ID.\n3.Participants will be given pseudo code / algorithm-based questions.\n4.The task is to predict the correct output without executing or compiling the code.\n5.This competition tests logical thinking, code tracing skills, and attention to detail.\n6.Internet access and external help are strictly prohibited.\n7.Use of compilers, IDEs, mobile phones, calculators, or internet is strictly prohibited\n8.Code execution is not allowed\n9.  Code may include:\n* Loops\n* Functions\n* Lists / Strings\n* OOP concepts\n* Logical / tricky questions\n10. Disqualification Criteria\n* Copying or malpractice of any kind\n* Use of electronic devices\n* Violation of competition rules\n11. Prohibited Items\n* Mobile phones\n* Smart watches\n* Compilers, IDEs, or any programming tools\n* Programmable calculators\n* Any study materials\n12. Time Rules\n* Participants must complete the round within the given time limit.\n* Late submissions will not be evaluated.\n13. Judge Authority\n* The decision of the judges/event coordinators will be final.\n* Organizers have the right to modify rules if required.',
        date: 'February 28, 2026',
        time: 'FULL DAY',
        prizepool: '₹3000',
        fee: '50',
        venue: 'Room M213B',
        badge: 3,
        image: '/depfolds/ca/codecrush.jpeg',
        registrationUrl: 'https://makemypass.com/event/codecrush',
        registerOption: 1,
        contact: [{ name: 'Jeswin', phone: '9778230580' }, { name: 'Sahala', phone: '9400395924' }]
      },
      {
        id: 8,
        name: 'ROBOTIC WORKSHOP',
        description: 'The Department of Computer Applications under Tech Nexus proudly invites students to an exciting hands-on Robotic Workshop crafted to ignite innovation and technical creativity.\n\n🔧 Workshop Highlights\n* Hands-on Robot Building Experience\n* Introduction to Robotics & Automation\n* Basic Electronics & Programming\n* Team-Based Design & Fabrication\n* Expert Mentorship\n* Certificate of Participation',
        date: 'February 27, 2026',
        time: '10:00 AM - 4:00 PM',
        fee: 'FREE',
        venue: 'MBA Lecture Hall, MBITS',
        badge: 2,
        image: '/depfolds/ca/robotic.jpeg',
        registrationUrl: 'https://makemypass.com/event/robotic-workshop',
        registerOption: 1,

        contact: [{ name: 'Ajin Biju', phone: '8590463106' }, { name: 'Ignatious', phone: '7510130510' }]
      },
      {
        id: 9,
        name: 'FRONTEND FORNTIER (WEB DEVELOPMENT)',
        description: 'Rules:\n\n *Total Duration: 6 Hours (Starts 10:00 AM)\n*You will work continuously on your idea and prototype during this time.\n *First 1 Hour → Idea + Documentation\n*You must:Understand the theme given by organizers . \n*Create a project idea based on that theme. \n*Prepare a Word document including:Project TitleProblem StatementProposed Solution\n*Expected Output AI Tools Allowed\n*You can use any type of a AI tools \n *Remaining 5 Hours → Prototype DevelopmentYou must build a working model, not just theory.\n*Prototype means:\nBasic UI working\nCore feature \nWorking Doesn’t  need to be production-level\nShould demonstrate the idea clearly',
        date: 'February 27, 2026',
        time: 'Full Day',
        fee: '200 (50 Per Head)',
        prizepool: '₹12000',
        venue: 'Lab 11',
        badge: 3,
        image: '/depfolds/ca/front.jpeg',
        registrationUrl: ' https://makemypass.com/event/frontend-frontier',
        registerOption: 1,
        contact: [{ name: 'Abhinav', phone: '+91 9633053081' }, { name: 'Albin', phone: '+91 9037130224' }]
      },
      {
        id: 10,
        name: 'QUBITZ (TECH QUIZ COMPETITION)',
        description: 'Rules :\n\n•	The quiz is open to all registered students of the college.\n•	Participants must carry a valid college ID card.\n•	Participants must report 30 minutes before the event start time.\n•	Late entry may not be permitted.\n•	Registration will be closed at 10:00 AM.\n•	No spot registrations will be entertained after the deadline.\n•	Only registered participants will be allowed to attend the quiz.\n•	Individual participation is allowed only if permitted by organizers.\n•	Team members cannot be changed after registration.\n•	The quiz may consist of multiple rounds.\n•	Use of mobile phones, smart watches, or any electronic devices is strictly prohibited.\n•	Any malpractice will result in immediate disqualification.\n•	Participants must maintain discipline throughout the event.\n•	The Quiz Master’s decision will be final and binding.\n•	Organizers reserve the right to modify rules if necessary',
        date: 'February 27, 2026',
        time: 'Full Day',
        fee: '60',
        venue: 'Room M213A',
        badge: 3,
        image: '/depfolds/ca/qubits.jpeg',
        registrationUrl: 'https://makemypass.com/event/qubitz',
        registerOption: 1,
        contact: [{ name: 'Honey', phone: '+91 7501734346' }, { name: 'Akshay', phone: '+91 8714583190' }]
      },
      {
        id: 11,
        name: 'KERNAL CORNER (Tech stall)',
        description: '🚀 What Awaits You? \n>“Kernel Corner – Play Smart, Experience AI”\nStep into an interactive tech zone where innovation meets entertainment.\n>“Tech, Games, and Intelligence – All at One Corner”.\nExplore AI-powered demos, smart games, and futuristic applications designed to challenge your mind.\n>“Step In for Fun. Step Out with Tech Experience.”\nEngage, learn, and compete while experiencing the power of modern technology firsthand.\n 🔧 Attractions\n* AI & Tech Game Arena\n* Interactive Smart Demos\n* Fun Challenges & Mini Competitions\n* Hands-on Tech Experience\n* Spot Prizes & Recognition.\n\n✨ Don’t Miss the Smartest Corner of the Fest!\n Enter Curious. Exit Inspired.',
        date: 'February 27-28, 2026',
        time: '10:00 AM – 4:00 PM',
        fee: 'FREE',
        venue: 'Tech Fest Stall Area / Campus Ground',
        badge: 1,
        image: '/depfolds/ca/kernal.jpeg',
        registerOption: 2,
        contact: [{ name: 'Aiswarya', phone: '+91 751082 2516' }, { name: 'Aryalakshmi', phone: ' +91 956201 5498' }]
      }
    ]
     
  },
   'fun': {
    name: 'Fun-Games',
    color: '#FF6B35',
    events: [
       {
        id: 1,
        name: '🪵 DISK ROLLER',
        description: '“Speed, angle, and perfect control — that’s the key to victory.Disk Roller challenges you to roll with precision and aim for the winning slot.\nIt looks simple, but the perfect roll demands focus and skill.\nCan you strike the perfect balance?”\n\nRules & Regulations:\n1.Starting Position\n>The player must stand behind the starting line.\n>Crossing the line while rolling is not allowed.\n\n2.Rolling the Disk\n>The disk must be rolled along the ground, not thrown.\n>Only one hand is used to roll the disk.\n\n3.Turns\n>Each player gets a fixed number of turns (usually 3–5).\n>Players take turns one by one.\n\n4.Scoring\n>Disk must completely rest inside a scoring zone to count.\n\n5.Fouls\n>Stepping over the line → turn cancelled.\n>Throwing or lifting the disk → no score.\n>Touching the disk after release → foul.\n\n6.Winning\n>The player who scores two out of three turns will be the winner',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '30',
        venue: 'TBA',
        badge: 4,
        image: '/depfolds/fun/disk.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: 'James', phone: '9846035018' }]
      },
      {
        id: 2,
        name: '🎯 Bean Bag Toss 🎯',
        description: 'Bean Bag Toss is an exciting precision-based fun game where focus meets fun! Step up to the board, aim carefully, and toss your bean bags to score maximum points. Sounds simple? Think again! It takes sharp concentration, steady hands, and perfect accuracy to win.\nChallenge your friends, compete for the top score, and prove your throwing skills. Only the most accurate players will dominate the board and claim victory!\n\nRules and Regulations:\n1. Each participant will receive three bean bags.\n2. Participants must stand behind the designated throw line.\n3. At least two bean bags must pass completely through the hole to win.\n4. Crossing the throw line during an attempt will lead to disqualification of that throw.\n5. The decision of the event coordinators will be final.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'TBA',
        badge: 4,
        image: '/depfolds/fun/bean.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: 'Arjun K R', phone: '9961070206' }]
      },
      {
        id: 3,
        name: '🎲 Poke A Prize 🎲',
        description: 'Poke A Prize is a fun and thrilling mystery game where luck meets excitement. Choose one cup from the set and reveal the hidden surprise beneath. One right pick could win you an amazing prize — trust your intuition and take the chance!\n\nRules & Regulations:\n1. Each participant gets only one chance to pick a cup.\n2. Cups cannot be lifted or touched before confirming your choice.\n3. Once a cup is chosen, the decision cannot be changed.\n4. Participants must follow the instructions given by the coordinators.\n 5. The organizing team’s decision will be final in all cases.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '20 per person',
        venue: 'TBA',
        badge: 4,
        image: '/depfolds/fun/poke.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: 'Anagha', phone: '8848300368' }]
      },
      {
        id: 4,
        name: 'Stand The Bottle',
        description: 'Think you have steady hands and perfect focus? Stand The Bottle is a thrilling balance challenge that tests your control, patience, and precision. Using a lifting rod, participants must carefully raise and perfectly position the bottle without losing balance. It may look simple — but only the sharpest minds and steadiest hands can make it stand!\n\nCan you lift it?\nCan you control it?\nCan you stand it?\n\nRules & Regulations:\n1. Each participant will get only one attempt per entry.\n2. The bottle must be lifted and placed upright without dropping.\n3. Direct hand contact with the bottle is not allowed.\n4. Time limit will be strictly followed.\n5. Judges decision will be final.\n6. Any unfair means will lead to immediate disqualification.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '20',
        venue: 'TBA',
        badge: 4,
        image: '/depfolds/fun/stand.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: '', phone: '9495874057' }]
      },
      {
        id: 5,
        name: '🎯 ZIG ZAG BALL RAMP 🎯',
        description: 'Test your precision, focus, and steady hands in this exciting skill-based challenge! Zig Zag Ball Ramp is a fun yet competitive game where participants must guide the ball through a twisting zig-zag pathway using a control stick. One wrong move and the ball slips off track! With increasing turns and tricky angles, only those with perfect balance and control can score big.Simple to play, tough to master — are you ready to take the challenge?\n\nRules and Regulations:\nEach participant gets one attempt per entry.\nThe ball must stay within the designated zig-zag path.\nTouching the ball with hands is not allowed.\nUse only the provided stick/controller to guide the ball.\nDecision of the coordinators will be final.\nAny damage to the equipment will lead to disqualification.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '30',
        venue: 'TBA',
        badge: 4,
        image: '/depfolds/fun/zig.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: 'Febin', phone: '6235684635' }]
      },
      {
        id: 6,
        name: '🏏 CRICKET BAWLING MACHINE',
        description: 'The Cricket Bowling Machine Challenge is here to test your reflexes, precision, and pure batting instincts!\nFeel the adrenaline as deliveries come flying at you with speed and accuracy. Whether youre a casual player or a cricket enthusiast, this is your chance to prove your timing, power, and composure.\n\nRules and Regulations\n1.Each participant gets 6 balls per round.\n2.Runs are scored based on clean hits and target zones.\n3.Basic safety gear must be worn.\n4.Only one participant in the net at a time.\n5.No practice balls before the official attempt.\n6.Misconduct or equipment damage leads to disqualification.\n7.Follow all instructions from event coordinators.\n8.Organizers may modify rules if needed.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: '30',
        venue: 'Cricket Net Area',
        badge: 4,
        image: '/depfolds/fun/cricket.jpeg',
        registrationUrl: '',
        registerOption: 2,

        contact: [{ name: '', phone: '8590262698' }]
      },
      
    ]
  },
};

export function DepartmentEventsPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { isAdmin, sessionId, token } = useAdmin();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  // Lock body scroll when event modal is open
  useEffect(() => {
    if (showEventModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showEventModal]);

  // Show video modal only once after component mounts for mechanical department
  useEffect(() => {
    if (departmentId === 'mechanical') {
      setShowVideoModal(true);
    }
  }, [departmentId]);

  const department = departmentId ? departmentEvents[departmentId] : null;

  // Handle window resize for responsive background
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize localStorage with mock data once on component mount
  useEffect(() => {
    initializeStorage(departmentEvents);
  }, []);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendAvailable(isHealthy);
    };
    checkHealth();
  }, []);

  // Fetch events from backend first, fall back to localStorage
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Only fetch from backend if backend is healthy
        if (backendAvailable) {
          const response = await fetch(`${getApiUrl()}/api/events/${departmentId}`);
          if (response.ok) {
            const data = await response.json();
            const backendEvents = data.events || [];
            setEvents(backendEvents);
            
            // Save backend events to localStorage for offline use
            if (departmentId && backendEvents.length > 0) {
              const allStored = { ...departmentEvents };
              if (allStored[departmentId]) {
                allStored[departmentId].events = backendEvents;
                saveStoredEvents(allStored);
              }
            }
          } else {
            // Backend returned error, use default mock data
            setEvents(department?.events || []);
          }
        } else {
          // Backend not available, use default mock data
          setEvents(department?.events || []);
        }
      } catch (err) {
        // If backend fails, use default mock data (not localStorage with admin changes)
        setEvents(department?.events || []);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      fetchEvents();
    }
  }, [departmentId, department, backendAvailable]);

  const handleEditEvent = (event: Event) => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }
    const newEvent: Event = {
      id: 0,
      name: '',
      description: '',
      date: '',
      fee: 'FREE',
      prizepool: '',
      image: '',
      registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg'
    };
    setEditingEvent(newEvent);
    setFormOpen(true);
  };

  const handleSaveEvent = async (updatedEvent: any): Promise<boolean> => {
    if (!backendAvailable) {
      alert('Backend is not running. Cannot save changes.');
      return false;
    }

    if (!token || !sessionId) {
      console.error('Admin not authenticated');
      return false;
    }

    try {
      console.debug('[handleSaveEvent] editingEvent id:', editingEvent?.id, 'updatedEvent.id:', updatedEvent.id);
      // Prefer the editingEvent's id if available to avoid accidental creates
      const editingId = editingEvent && editingEvent.id ? Number(editingEvent.id) : undefined;
      const providedId = updatedEvent.id !== undefined && updatedEvent.id !== null ? Number(updatedEvent.id) : undefined;
      const id = editingId ?? providedId ?? 0;
      console.debug('[handleSaveEvent] computed ids -> editingId:', editingId, 'providedId:', providedId, 'using id:', id);

      // If id is not a positive integer, create a new event
      if (!Number.isInteger(id) || id <= 0) {
        console.debug('[handleSaveEvent] performing CREATE (POST) for', updatedEvent);
        const response = await fetch(`${getApiUrl()}/api/events/${departmentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...updatedEvent,
            token: token,
            sessionId: sessionId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const created = data.event;
          // Remove any temp item with id 0 (if present) and append created
          setEvents(prev => {
            const filtered = prev.filter(e => Number(e.id) !== 0);
            return [...filtered, created];
          });
          // Save to localStorage
          if (departmentId) {
            addStoredEvent(departmentId, created);
          }
          return true;
        } else if (response.status === 403) {
          console.error('Session expired. Please login again.');
          return false;
        }

        // Backend not available
        alert('Backend is not accessible. Cannot save changes.');
        return false;
      }

      // Update existing event using determined id
      console.debug('[handleSaveEvent] performing UPDATE (PUT) for id', id, 'with', updatedEvent);
      const response = await fetch(`${getApiUrl()}/api/events/${departmentId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updatedEvent,
          token: token,
          sessionId: sessionId
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const returned = data?.event ?? { ...updatedEvent, id };
        const returnedId = Number(returned.id ?? id);
        setEvents(prev => prev.map(e => (Number(e.id) === returnedId ? returned : e)));
        // Save to localStorage
        if (departmentId) {
          updateStoredEvent(departmentId, returnedId, returned);
        }
        return true;
      } else if (response.status === 403) {
        console.error('Session expired. Please login again.');
        return false;
      }

      // Backend not available
      alert('Backend is not accessible. Cannot save changes.');
      return false;
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Backend is not accessible. Cannot save changes.');
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }

    if (!token || !sessionId) {
      alert('Admin not authenticated');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${getApiUrl()}/api/events/${departmentId}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: token, sessionId: sessionId })
      });

      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        // Delete from localStorage
        if (departmentId) {
          deleteStoredEvent(departmentId, eventId);
        }
      } else if (response.status === 403) {
        alert('Session expired or unauthorized. Please login again.');
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Backend is not accessible. Cannot delete event.');
    }
  };

  if (!department) {
    return (
      <div className="min-h-screen pt-32 pb-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Department Not Found</h1>
          <Link to="/departments" className="text-[#FF6B35] hover:underline">
            ← Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-100 relative">
      {/* Lightning Background for Electrical Department */}
      {departmentId === 'electrical' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <Lightning
            hue={30}
            xOffset={isMobile ? 0.8 : 0}
            speed={1}
            intensity={isMobile ? 1.2 : 1}
            size={isMobile ? 0.8 : 1}
          />
        </div>
      )}
      {/* Admin Welcome Message */}
      {isAdmin && (
        <div className="max-w-2xl mx-auto mt-12 mb-12 p-10 rounded-3xl bg-black text-center border-4 border-[#FFA500] shadow-xl">
          <h1 className="text-5xl font-bold mb-8 text-[#FFA500]">WELCOME!</h1>
          <div className="text-3xl font-semibold text-[#FFA500] space-y-4">
            <div>LEEN LEO</div>
            <div>CHRISTEPHER C BIJU</div>
            <div>ARYAN CS</div>
          </div>
        </div>
      )}
      {/* LetterGlitch Background for Computer Science Department */}
      {departmentId === 'computer-science' && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 opacity-15 pointer-events-none">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={['#22C55E', '#16A34A', '#86EFAC']}
          />
        </div>
      )}
      
      {/* GridMotion Background for Civil Department */}
      {departmentId === 'civil' && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-0  opacity-35 pointer-events-none">
          <GridMotion
            items={[

              'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://i.pinimg.com/736x/2e/d5/c0/2ed5c0cbb0b48273f96b48aeca994906.jpg',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://i.pinimg.com/736x/2e/d5/c0/2ed5c0cbb0b48273f96b48aeca994906.jpg',
              'https://i.pinimg.com/736x/45/35/76/4535760a5ec8fc27103dbe7c31683345.jpg',
              'https://i.pinimg.com/1200x/3e/37/68/3e3768086639779d03ad3d697ef37131.jpg',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://i.pinimg.com/736x/b5/54/cf/b554cf3460350df9b5015e35bfbdedb3.jpg',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://images.unsplash.com/photo-1583707225662-125fe69e6656?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://i.pinimg.com/736x/67/7a/a8/677aa8ffd0fd40a7d2eb5a3b9bd75695.jpg',
              'https://images.unsplash.com/photo-1583707225662-125fe69e6656?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1562679299-266edbefd6d7?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1552051263-6eb5bb6905b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww',
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1583707225662-125fe69e6656?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1562679299-266edbefd6d7?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://i.pinimg.com/736x/67/7a/a8/677aa8ffd0fd40a7d2eb5a3b9bd75695.jpg'

            ]}
          />
        </div>
      )}
      {/* Video Background for Mechanical Department */}
      {departmentId === 'mechanical' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source
              src={isMobile
                ? 'https://res.cloudinary.com/dts9wynrs/video/upload/v1771235434/mecm_xkkctt.mp4'
                : 'https://res.cloudinary.com/dts9wynrs/video/upload/v1771237160/WhatsApp_Video_2026-02-16_at_3.48.14_PM_gnxsdd.mp4'}
              type="video/mp4"
            />
          </video>
          {/* dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}
            {/* Video Background for Electronics Department */}
      {departmentId === 'electronics' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Vid />
          {/* dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}

      {/* Video Background for General Department */}
      {departmentId === 'general' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dts9wynrs/video/upload/v1771159169/WhatsApp_Video_2026-02-15_at_6.08.41_PM_inheww.mp4" type="video/mp4" />
          </video>
          {/* dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}
      {/* LetterGlitch Background for Computer Science Department */}
      {departmentId === 'fun' && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 opacity-15 pointer-events-none">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={['#22C55E', '#16A34A', '#86EFAC']}
          />
        </div>
      )}
  

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link 
            to="/departments" 
            className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-[#FF6B35] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Departments
          </Link>

          <h1
            className="text-5xl md:text-5xl lg:text-5xl mb-6"
            style={{ color: department.color }}
          >
            {department.name}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: department.color }} />
            <div className="w-24 h-1" style={{ background: `linear-gradient(to right, ${department.color}80, ${department.color}20)` }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: department.color, boxShadow: `0 0 0 4px ${department.color}20` }} />
            <div className="w-24 h-1" style={{ background: `linear-gradient(to right, ${department.color}20, transparent)` }} />
          </div>

          <p className="text-xl text-[#B0B0B0]">
            Explore all events and register through the official forms
          </p>
          {isAdmin && backendAvailable && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                + Add Event
              </button>
            </div>
          )}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? department.events : events).map((event: any, index: number) => {
            const eventCard = (
              <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-auto flex flex-col group cursor-pointer">
                {/* Event Poster - Full Height */}
                <div className="relative w-full h-[485px] overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
                </div>

                {/* Event Details Section */}
                <div className="p-5 bg-[#1A1A1A] flex-grow flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-white">{event.name}</h3>
                    <div className="ml-3">
                        {event.badge === 1 && (
                          <div title="Expo" className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Expo</div>
                        )}
                        {event.badge === 2 && (
                          <div title="Workshop" className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">Workshop</div>
                        )}
                        {event.badge === 3 && (
                          <div title="Competition" className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Competition</div>
                        )}
                        {event.badge === 4 && (
                          <div title="Entertainment" className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Entertainment</div>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-[#B0B0B0]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: department.color }} />
                      <span>{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: department.color }}>⏰</span>
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.prizepool && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: department.color }}>🏆</span>
                        <span>Prize Pool: {event.prizepool}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fee Box - Centered with Orange Border (supports optional discount) */}
                <div className="px-4 py-1 bg-[#1A1A1A] flex-shrink-0 flex justify-center">
                  <div className="relative flex flex-col items-center">
                    {event.discount === 1 && event.discountedFee && (
                      <div className="mb-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md z-30">
                        DISCOUNT AVAILABLE!
                      </div>
                    )}

                    <div className="border-2 border-[#FFA500] rounded-lg px-3 py-0.5 flex items-center gap-2" style={{ borderColor: department.color }}>
                      <IndianRupee className="w-5 h-5" style={{ color: department.color }} />
                      {event.discount === 1 && event.discountedFee ? (
                        <div className="flex items-baseline gap-3">
                          <span className="text-sm text-white/70 line-through">{event.fee}</span>
                          <span className="font-bold text-lg text-white">{event.discountedFee}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-white">{event.fee}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Details Button - Below Card */}
                <div className="p-4 bg-[#1A1A1A] flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className="w-full py-3 rounded-full flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    style={{ backgroundColor: department.color }}
                  >
                    View Details
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </motion.button>
                </div>

                {/* Admin Edit/Delete Buttons - positioned on the top right */}
                {isAdmin && backendAvailable && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteEvent(event.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-10"
                      style={{ backgroundColor: '#e11d48' }}
                      title="Delete event"
                    >
                      <Trash className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditEvent(event)}
                      className="absolute top-4 right-16 w-10 h-10 rounded-full bg-[#FF6B35] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-10"
                      style={{ backgroundColor: department.color }}
                      title="Edit event"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                  </>
                )}

               
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${department.color}40` }}
                />
              </div>
            );

            return (
              <motion.div
                key={`${event.id ?? 'ev'}-${index}-${event.name?.replace(/\s+/g,'-') ?? ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {eventCard}
              </motion.div>
            );
          })}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-[#1A1A1A]/60 backdrop-blur-sm rounded-2xl border border-[#FF6B35]/20"
        >
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#B0B0B0]">
                <strong className=" text-justify text-[#E8E8E8]">Note:</strong> Clicking "Register Now" will redirect you to the official event description and 
                event registration page. Please fill out all required information accurately. 
                For queries, contact the event cordinators listed .
              </p>
            </div>
          </div>
        </motion.div>

        {/* Event Edit Form Modal */}
        {editingEvent && (
          <EventForm
            isOpen={formOpen}
            event={editingEvent}
            departmentId={departmentId || ''}
            onClose={() => {
              setFormOpen(false);
              setEditingEvent(null);
            }}
            onSave={handleSaveEvent}
            isNew={editingEvent.id === 0}
          />
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowEventModal(false);
              setIsEditingModal(false);
              setEditFormData(null);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setIsEditingModal(false);
                  setEditFormData(null);
                }}
                className="absolute top-6 left-6 md:left-auto md:right-6 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
              >
                <X className="w-6 h-6 text-[#2A2A2A]" />
              </button>

              {/* Event Image */}
              <div className="relative w-full h-80 overflow-hidden">
                <ImageWithFallback
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white">{selectedEvent.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {!isEditingModal ? (
                  <>
                    {/* View Mode */}
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      {/* Date/Time */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm font-semibold">Date</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">{selectedEvent.date}</p>
                      </div>
                      
                      {/* Prize */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <span className="text-sm font-semibold">Time 
                           </span>
                        </div>
                        <p className="text-sm text-[#6B6B6B] font-semibold">{selectedEvent.time || 'FULL DAY'}</p>
                      </div>

                      {/* Fee */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <IndianRupee className="w-5 h-5" />
                          <span className="text-sm font-semibold">Fee</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B] font-semibold">
                          {selectedEvent.fee === 'FREE' ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            selectedEvent.fee
                          )}
                        </p>
                      </div>

                      {/* Venue */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <ExternalLink className="w-5 h-5" />
                          <span className="text-sm font-semibold">Venue</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">{selectedEvent.venue || 'TBA'}</p>
                      </div>

                      {/* Prize */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <span className="text-sm font-semibold">Prize 
                           Pool</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B] font-semibold">{selectedEvent.prizepool || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-[#C65D3B]/20 via-[#C65D3B]/10 to-transparent mb-8" />


                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-[#2A2A2A] mb-3">About This Event</h3>
                      <p className="text-[#6B6B6B] text-justify leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                    </div>

                    {/* Contact Section */}
                    {selectedEvent.contact && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-[#2A2A2A] mb-2">Contact:</h3>
                        <ul className="space-y-2">
                          {Array.isArray(selectedEvent.contact) ? selectedEvent.contact.map((c, i) => (
                            <li key={i} className="text-[#4B5563]">
                              {c.name && <span className="font-semibold mr-2">{c.name}:</span>}
                              {c.phone && (
                                <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a>
                              )}
                            </li>
                          )) : (
                            <li className="text-[#4B5563]">
                              {selectedEvent.contact.name && <span className="font-semibold mr-2">{selectedEvent.contact.name}:</span>}
                              {selectedEvent.contact.phone && (
                                <a href={`tel:${selectedEvent.contact.phone}`} className="text-blue-600 hover:underline">{selectedEvent.contact.phone}</a>
                              )}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {(selectedEvent.registerOption === 1 || selectedEvent.registerOption === '1' || selectedEvent.registerOption === undefined) && (
                        <a
                          href={selectedEvent.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                          style={{ backgroundColor: department?.color || '#C65D3B' }}
                        >
                          Register Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {isAdmin && backendAvailable && (
                        <button
                          onClick={() => {
                            setEditFormData(selectedEvent);
                            setIsEditingModal(true);
                          }}
                          className="px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all"
                          style={{ backgroundColor: `${department?.color}20`, color: department?.color }}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Event Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Date</label>
                        <input
                          type="text"
                          value={editFormData.date}
                          onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>


                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Fee</label>
                        <input
                          type="text"
                          value={editFormData.fee}
                          onChange={(e) => setEditFormData({ ...editFormData, fee: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., ₹200 or FREE"
                        />
                      </div>

                      

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Venue</label>
                        <input
                          type="text"
                          value={editFormData.venue || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., Main Auditorium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Prize Pool</label>
                        <input
                          type="text"
                          value={editFormData.prizepool || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, prizepool: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., ₹500 + Certificate"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Description</label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] resize-none text-black"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Registration URL</label>
                        <input
                          type="text"
                          value={editFormData.registrationUrl}
                          onChange={(e) => setEditFormData({ ...editFormData, registrationUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>
                    </div>

                    {/* Edit Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={async () => {
                          const success = await handleSaveEvent(editFormData);
                          if (success) {
                            setSelectedEvent(editFormData);
                            setIsEditingModal(false);
                          }
                        }}
                        className="flex-1 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: department?.color || '#C65D3B' }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingModal(false);
                          setEditFormData(null);
                        }}
                        className="flex-1 px-6 py-3 rounded-full font-semibold transition-all"
                        style={{ backgroundColor: '#F0F0F0', color: '#2A2A2A' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
