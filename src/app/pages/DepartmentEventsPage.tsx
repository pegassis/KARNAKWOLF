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
    name: 'Computer Science',
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
        venue: 'Room 130',
        image: '/depfolds/comps/vrposter.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        fee: '50',
        badge: 2,
        venue: 'Computer Lab 3',
        image: '/depfolds/comps/GAMING_XP.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Rehab ', phone: '7907844588' }, { name: 'Fidha ', phone: '9947304940' }]
      },
      {
        id: 3,
        name: 'PIXELIA',
        description: 'Unleash your creativity and technical imagination in our Poster Designing Competition conducted as part of the Tech Fest. Participants will design a digital poster based on a given theme using the computer systems provided in the lab. The event aims to test creativity, visual communication skills, layout design, and effective use of design tools. Create a poster that is visually appealing, informative, and impactful within the given time\n\nRULES & REGULATIONS\n\n 1. Participants must report to the lab 15 minutes before the event starts.\n2. The poster theme/topic will be announced on the spot.\n3. Only the software available on the lab computers may be used(Canva Web)\n4. Internet usage allowed only under supervision.\n5. Participants must not use pre-made templates or previously created posters.\n6. All designs must be created during the competition time only.\n7. External storage devices (pen drives, hard disks) are not allowed\n8. Posters must include a title and relevant visual elements related to the theme.\n9. Any form of copying or plagiarism will lead to disqualification.\n10. Final poster must be saved with the participant name and submitted before the deadline in the specified format (PNG).\n11. Judges’ decision will  be final',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: '1000',
        fee: '60',
        badge: 3,
        venue: 'Computer Lab 8',
        image: '/depfolds/comps/pixelia.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Hail Mary', phone: '8078925526' }, { name: 'Joel George', phone: '9188492986' }]
      },
      {
        id: 4,
        name: 'Pixel Puzzle',
        description: 'Design is where creativity meets functionality, transforming ideas into meaningful digital experiences. Showcase your UI/UX skills, push the boundaries of innovation, and bring your concepts to life through intuitive, impactful, and visually compelling designs\n\nDuration : 1.5 hours \n\nRULES AND REGULATIONS\n\n1.Team Size – Individual\n2.Time Limit – Designs must be completed and submitted within the allotted time. Late submissions will not be accepted.\n3.Original Work Only – All designs must be original. Plagiarism will lead to disqualification.\n4.Theme Adherence – Designs must strictly follow the given theme/problem statement.\n5.No Pre-made Templates– Ready-made templates or pre-designed UI kits are not allowed (unless permitted).\n6.AI Usage Policy– AI tools (like ChatGPT, Midjourney, etc.) are not allowed.\n7.Reference Materials – Only allowed resources may be used.\n8.Multiple Entries – A participant can be part of only one team.\n9.Power Backup– Organizers are not responsible for personal device technical failures.\n10.Software Installation– Required software must be pre-installed before the event.\n\n Conduct and discipline\n\n•Maintain decorum and professional behavior.\n•No disruptive behavior inside the venue.\n•Any misconduct leads to immediate disqualification.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: '1500',
        fee: '60',
        badge: 3,
        venue: 'Computer Lab 3',
        image: '/depfolds/comps/puzzle.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        venue: 'Basketball court',
        image: '/depfolds/comps/splash.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Kevin', phone: '8075723712' }, { name: 'Ryan', phone: '6238890177' }]
      },
      {
        id: 6,
        name: 'Tech Trove',
        description: 'Explore innovative projects, interact with new technologies and connect with creative minds. Have a project? Join us and showcase your innovation to the world!',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: 'NA',
        fee: 'FREE',
        badge: 1,
        venue: 'Classroom 133,134',
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
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Adwaith K S', phone: '9037861197' }, { name: 'Anna Palanattu', phone: '6235432740' }],
      
      badge: 2
      },
      {
      id: 8,
        name: 'CODE X BLIND (Blind Coding)',
        description: 'CODE X BLIND is a thrilling coding challenge designed to test a participant’s logical thinking, syntax accuracy, and confidence. Participants will be given a problem statement and must write the complete code within the given time without compiling or running it themselves. The competition is conducted in C programming language .Once submitted, the code will be compiled and executed by the invigilators. Accuracy matters more than retries—clean code wins.\n\n1st price : ₹1000\n2nd price : ₹500\n\nRules & Regulations\n 1. The problem statement will be provided at the start of the event.\n2. The competition is conducted strictly in C programming language.\n3. Participants must write the code within the allotted time.\n4. Compiling and execution are strictly done only by the invigilators.\n5. Participants must stop coding immediately after submission.\n6. The screen will remain visible, but no test runs are allowed.\n7. Internet access and external help are strictly prohibited.\n8. The winner will be decided based on:\n•Least number of errors\n•Correct output\n•Time taken to complete the code.\n9. Any form of malpractice will lead to immediate disqualification.\n10. Judges and coordinators decisions will be final.',
        date: 'February 27, 2026',
        time: 'Forenoon',
        prizepool: '1500',
        fee: '60',
        venue: 'Computer Lab 8',
        image: '/depfolds/comps/blindcoding.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Leen Leo', phone: '8075750254' }, { name: 'Emil Mareena P', phone: '6235868192' }]
      ,
      badge: 3
      },
      {
      id: 9,
        name: 'CODE REWIND (Reverse Coding Challenge)',
        description: 'CODE REWIND is a unique reverse coding challenge where participants are given the expected output and must determine the correct input to generate it through a valid program.Participants may use any programming language. The event tests logical thinking, analytical skills, and problem-solving ability. If the exact output is not achieved, judges will evaluate the logic and approach used. Accuracy and clarity matter.\n\n1st price : ₹1000\n2nd price : ₹500\n\nRules & Regulations\n 1. The expected output will be provided at the start of the event.\n2. Participants must determine suitable input and write a program that produces the given output.\n3. Any programming language is allowed.\n4. The program must be completed within the allotted time.\n5. If the output does not match exactly, judges will evaluate the logic and approach.\n6. Participants may be asked to explain their code and reasoning.\n7. Internet access and external assistance are strictly prohibited.\n8. Plagiarism or copying from others will lead to immediate disqualification.\n9. Winners will be decided based on:\n• Accuracy of the output\n• Logical correctness\n• Efficiency of the solution• Explanation and clarity.\n10. The decision of the judges and coordinators will be final and binding.',
        date: 'February 28, 2026',
        time: 'Forenoon',
        prizepool: '1500',
        fee: '60',
        venue: 'Computer Lab 9',
        image: '/depfolds/comps/reversecoding.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/prompt.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Gayathridevi K', phone: '8921169842' }, { name: 'Rinsa Fathima M A', phone: '8606033545' }]
      ,
      badge: 2
      },
      {
        id: 11,
        name: 'Tech Hunt',
        description: 'Step into a campus wide tech scavenger hunt like no other, where logic replaces luck and clues are hidden in code. The Tech Hunt challenges participants to think, decode, and solve their way through a series of mysteries. Only sharp minds, quick reasoning, and technical intuition will lead you to the final prize. Get ready to explore, analyze, and conquer.\n\nRules & Regulations\n1. The treasure hunt must be completed within the allotted time.\n2. All team members must stay together throughout the event.\n3. Certain tasks may require full team participation.\n4. At Each Location Teams must find the next clue card and must keep them until the end.\n5. Clues must be followed in order; skipping locations is not allowed.\n6. Teams cannot ask volunteers or coordinators for hints.\n7. The number of participants allowed for each team is 3-5.\n8. Fragments & Progress: \nEach team must collect all 5 clue card to proceed to the final round.\n9. Final Round & Winner Selection:\n If more than one team reaches and completes the final round: a tie breaker task will be given.\n10. Device Policy:\n Mobile phones, smart watches, and all smart devices are strictly prohibited during the hunt.\n11. Any team found using them will be disqualified.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: 'NA',
        fee: '20 per person',
        venue: 'Campus',
        image: '/depfolds/comps/techhunt.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Anudev', phone: '9778155243' }, { name: 'Anna', phone: '8714224467' }]
      ,
      badge: 3
      },
      {
        id: 12,
        name: 'NETRIOT (LAN Gaming)',
        description: 'Get ready to play, compete, and win! Participate in our mobile gaming event and test your skills against fellow gamers in an action-packed experience',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: '₹3000',
        fee: '40',
        venue: 'Room M131',
        image: '/depfolds/comps/netriot.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Febin', phone: '9562767233' }, { name: 'Sain', phone: '8139879470' }]
      ,
      badge: 3
      },
      {
        id: 13,
        name: 'THE THINK TANk',
        description: 'ThinkTanks is an intercollege ideathon designed to give students a platform to present innovative ideas to a wider audience. The event encourages participants to identify real-world challenges and propose creative, practical solutions that address problems faced by modern society. It is a space where critical thinking, collaboration, and imagination converge to inspire meaningful change. Join us to showcase your vision, exchange perspectives, and turn ideas into possibilities\n\nRules & Regulations\n\n1.participants must reach venue atleast 20 minutes before the event starts\n2.ensure chest number is visibly attached on one of the presenters\n3.each team is alloted 15 minutes per presentation and any longer points will be deducted',
        date: 'February 27, 2026',
        time: 'Forenoon',
        prizepool: '₹1500',
        fee: 'FREE',
        venue: 'Computer Lab 9',
        image: '/depfolds/comps/thinktank.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Samuel', phone: '8137897726' }, { name: 'Helvin', phone: '8590018466' }]
      ,
      badge: 3
      },
        {
        id: 14,
        name: 'LPSG InnovateX ',
        description: 'Liquid Propulsion Systems Centre (LPSC) is one of Indian Space Research Organisation’s major research and development centres. It focuses on designing and building liquid propulsion systems (engines and related tech) that power India’s launch vehicles and spacecraft.These expos are meant to spark interest in science and help people learn about Indian space technology.',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Room M10',
        image: '/depfolds/comps/lpsg.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Aleena', phone: '9048847676' }, { name: 'Gouripriya', phone: '9447290587' }]
      ,
      badge: 1
      },
      {
        id: 15,
        name: 'THE IPL AUCTION-PITCH TO POCKET',
        description: 'Where talent meets big money! Watch franchises battle it out as cricket stars go under the hammer and dreams turn into multi-crore deals. From explosive hitters to deadly bowlers, every bid counts!Join us for the ultimate showdown of strategy, suspense, and spectacular signings. Dont miss the action — be part of the excitement!.\n\nRules & REgulations \n\n•Only 6 teams can participate.\n•Each team consisting of 4 members only\n•First 6 teams to register can only participate.\n•Teams are to report 10min prior to the event time\n•Registration fees is to be paid online.\n•Others Rules Regarding the event will be told on 27th Feb\n•Laptops can be used but only one in a team.\n•Pens and calculators will be provided (if needed).',
        date: 'February 27, 2026',
        time: 'Afternoon',
        fee: '200 per team',
        prizepool: '₹3500',
        venue: 'Room M131',
        image: '/depfolds/comps/ipl.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Joel', phone: '7907502537' }, { name: 'Seetha', phone: '9074490518' }]
      ,
      badge: 3
      },
      {
        id: 16,
        name: 'VIBE.EXE(Vibe Coding)',
        description: 'Code the vibe. Build the future. ⚡💻Step into the world of fast-paced coding where creativity meets logic! Vibe Coding – vibe.exe is all about solving fun and challenging problems in a high-energy environment. Whether you are a beginner or a pro, this is your chance to test your skills, learn new tricks, and vibe with fellow coders.Think quick. Code smart. Let your vibe do the talking. 🚀\n\nRules & Regulations\n* Participants must bring their own laptops.\n* Reporting time: 27th Feb – Afternoon session.\n* The event will be conducted in Lab 8.\n* Basic guidelines and problem statements will be explained at the venue.\n* Fair play is mandatory; any malpractice may lead to disqualification.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        fee: '*For IEEE Members – ₹0 ( Free ) \n  *For Non-IEEE Members – ₹30',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/vibe.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      ,
      badge: 2
      },
      {
        id: 17,
        name: 'HACK / DEMO / DEFEND\n(Ethical Hacking Workshop)',
        description: 'Learn to hack. Understand to defend. 🔐💻Ever wondered how hackers think and how systems are protected from attacks? HACK / DEMO / DEFEND is a hands-on ethical hacking workshop designed to give you real-world exposure to cyber security basics.From live demos of common attacks to understanding how to defend against them, this session will open your eyes to the world of ethical hacking and digital safety. Perfect for beginners who want to step into cyber security! 🛡️\n\nRules & Regulations\n* Participants must bring their own laptops.\n* Reporting time: 27th Feb – Morning session (Forenoon).\n* The workshop will be conducted in Lab 8.\n* All activities are for educational purposes only.\n* Any misuse of techniques outside the workshop is strictly discouraged.\n\nParticipation certificates will be provided 🎓',
        date: 'February 27, 2026',
        time: 'Forenoon',
        fee: '*For IEEE Members – ₹0 ( Free ) \n  *For Non-IEEE Members – ₹30',
        venue: 'Lab 7',
        image: '/depfolds/comps/hack.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Navaneeth', phone: '8281450604' }]
      ,
      badge: 2
      },
      {
        id: 18,
        name: 'Funfinity (Mini Games)',
        description: 'Funfinity – Where Fun Has No Limits! \nFunfinity is a fun-filled mini-games zone at our Techfest, packed with exciting quick challenges. It features interactive games like Walker Bottle, Balloon Pyramid, Circle Switch, and Flip & Find — each designed to test balance, speed, focus, and memory in a thrilling way. It’s all about friendly competition, energy, and enjoying simple yet exciting challenges with endless fun!\nNo rules& regulations',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'CSE Block Corridors',
        image: '/depfolds/comps/funfinity.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Vismaya', phone: '9544251901' }, { name: 'Vinayathri', phone: '9778140400' }]
      ,
      badge: 4
      },
      {
        id: 19,
        name: 'Mechamorphosis (E-Waste Sculpture)',
        description: 'Mechamorphosis is a sustainable art installation that transforms electronic waste into a life-size robotic sculpture. It reimagines discarded technology as creative expression, promoting responsible recycling and sustainability.\nSymbolizing technological rebirth, it stands as a mechanical guardian, highlighting innovation, environmental awareness, and the power of reuse in the digital age',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        fee: 'FREE',
        venue: 'Open Area CSE Block',
        image: '/depfolds/comps/ewaste.jpeg',
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
        description: 'Duration: 2hr\n\n Step into a warm and inspiring learning experience at our Bulb Making Workshop. Discover the simple science behind how a bulb lights up and enjoy creating your own model with gentle guidance. This hands-on session is designed to spark curiosity, encourage creativity, and brighten your understanding in a fun and welcoming environment. /n/n Last date for reg: 26 feb',
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
        description: 'Duration:2hr \n\nEnter a world where ideas come alive through code and creativity. Our Arduino Simulation Competition offers a vibrant platform for participants to design and simulate innovative embedded systems in a dynamic virtual environment. \nWith every circuit you connect and every line of code you write, you’ll shape intelligent solutions that reflect precision and imagination. This event celebrates thoughtful design, technical elegance, and the excitement of transforming simple concepts into smart digital creations. Join us and let your innovation shine.\n\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nGeneral Guidelines:\n • Each team can have a maximum of  1-2 members.\n • Participants must design and simulate an Arduino-based project using simulation software (Proteus / Tinkercad ). \n• The coding part for an Arduino Simulation Competition can be done in (Arduino IDE). \n• Certificate will be provided.' ,
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
        description: 'Step into the world of smart technology and friendly competition at our Line Follower Robot Competition. This exciting event invites participants to design and build autonomous robots that gracefully follow a marked path with precision and speed. It’s a wonderful opportunity to explore creativity, teamwork, and problem-solving while applying your knowledge of robotics and programming. \nLet your innovation lead the way as your robot navigates curves and challenges with confidence. Join us for a day filled with learning, excitement, and the joy of turning ideas into motion! \n\n1st Prize: Rs.6000 \n2nd Prize: Rs.4000 \n\nGENERAL GUIDELINES: \n• There will be check-in for the participants. \n• Every team should have at least one laptop. \n• Your bots must be within the size limit 20cm x 20cm x 20cm (l x b x h). \n• Board size will be 7(height)x10(length).  \n• Track will be solid black.  \n• Track size will be 25mm in width. \n• You could use any microcontroller. \n • Battery pack should be onboard and max permissible voltage is 12V.\n\n SCORING CRITERIA\n Task points will be as follows: \n• Successfully travelling through each section - 20 points \n • Successfully stopping at the finishing point - 40 points  \n• Total - 100 points \n\nNegative points\n After starting the competition, if any physical intervention is noticed then a hand touch penalty of 10 points shall be reduced for each hand touch.\n\nLast date for reg: 26 Feb',
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
        name: 'route it right (pcb design simulation competition)',
        description: 'Duration: 3hr \n\nStep into an exclusive arena of innovation and precision with our PCB Design Simulation Competition. This premium event invites participants to demonstrate mastery in PCB layout, precision routing, and design optimization within a professional simulation environment. Engineered to challenge both creativity and technical depth, the competition emphasizes innovation, efficiency, and aesthetic clarity in every trace and connection. It is an opportunity to showcase advanced design thinking, attention to detail, and a refined understanding of circuit architecture. \nJoin us for an elite experience where sophistication meets technology, and every design reflects true engineering excellence\n\n1st Prize: Rs.2000 \n2nd Prize: Rs.1000 \n\nLast date for reg: 26 Feb',
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
        name: '🔧 IC ENGINE WORKSHOP',
        description: '🏆 Benefits\n* Practical knowledge of engine components\n* Understanding of working cycles and mechanisms\n* Hands-on exposure to real engine models\n* Participation certificates will be provided 🎓\n\n⚙️ Learn the heart of automobiles. Understand how engines power the world.\n📘 About the Workshop\nThe IC Engine Workshop is a hands-on technical session designed to help participants understand the working principles of internal combustion engines.\nParticipants will get practical exposure to engine components, working cycles, and real-time demonstrations. The workshop focuses on explaining how fuel converts into mechanical power and how different engine systems operate together. This session is ideal for students interested in automobiles, mechanical systems, and engine technology.\n\n🔥 Workshop Highlights\n* Live Engine Demonstration\n* Hands-on Tool Usage\n* Engine Component Explanation\n* Working Cycle Demonstration\n\n📌 Rules / Guidelines\n* Participants must follow workshop safety instructions\n* Proper handling of engine components is mandatory\n* Workshop is strictly for educational purposes\n* Participants must report on time',
        date: 'February 27, 2026',
        time: 'Forenoon',
        venue: 'Automobile lab',
        prizepool: '₹3,000',
        fee: '30',
        badge: 2,
        image: '/depfolds/mec/icengine.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 1,
        contact: [{ name: 'Varghese Biju', phone: '9746323751' }, { name: 'Don Basil', phone: '8590796049' },{ name: 'Amal Wilson', phone: '8590029539' }]
      }
    ]
  },
  'civil': {
    name: 'Civil',
    color: '#FF6B35',
    events: [
      
    ]
  },
  'electrical': {
    name: 'Electrical',
    color: '#FFA500',
    events: [
    
    ]
  },
  'general': {
    name: 'Computer Applications',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'PES (E-Football)',
        description: 'PES (E-Football)\nRegistration Amount – ₹60\n Prize Pool – ₹3,000\nMATCH SETTING:\n•	7 MIN MATCH \n•	5  SUB \n•	RANDOM FORM\n•	PENALTY ON \n\nRules and Regulations:\n📌 Exit from the match at the beginning if you face any lag or network issues . Exiting from the match after scoring a goal by the opponent will not be considered as an excuse.\n📌 Exiting from the match after getting a red card will be considered as a win for your opponent.\n📌 Smart assist must be off , TEAM STRENGTH Must be under 3150 \n📌 Beware of match creation , points raised after the opponents win will not be valued.\n📌 Exiting from the match when the opponent gets a chance to score goal , will reward a goal for the person who got the chance to score.\n📌 If the match gets disconnected in between start a new match with same aggregate score with remaining time [❗SAME SQUAD & SAME MANAGER❗] \n📌 If the match disconnects at/after 80 minutes a win will be awarded for the player who is in the lead.\n📌 If valid proofs are provided immediate action or coordinators will slowly understand the truth about the situation and take action according to it.\n📌Avoid unnecessary verbal arguments between players and if someone misbehaves, report it to the coordinators without escalating the problem.\n📌 If any Match disconnects due to any issue kindly please inform to the coordinators . And Admin will decide the rematch according to the Aggregate score with the remaining minutes of the match .\n📌If any doubt regarding the Match or anything you can inform the coordinators personally.\n📌 All participants must report at the venue 30 minutes before the event starts\n📌 CORDINATORS DECISION WILL BE FINAL',
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
<<<<<<< HEAD
=======
        name: 'Tech Talk Series',
        description: 'Industry expert sessions',
        date: 'February 26-27, 2026',
        time: '10:00 AM - 2:00 PM',
        prizepool: 'TBA',
        fee: 'FREE',
        badge: 2,
        image: '/depfolds/ca/qubits.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
        contact: [{ name: 'Aman Kapoor', phone: '9967812345' }, { name: 'Ritu Verma', phone: '9789123456' }]
      },
      {
        id: 3,
>>>>>>> 3364c3232e62925a7fd0db292746354a37cbc829
        name: 'TREX: Trail of Clues (TREASURE HUNT)',
        description: 'TREX: Trail of Clues challenges your wit, teamwork, and speed as you race against time to crack clues and uncover secrets hidden in plain sight\n.Get ready for the ultimate adventure where mystery, clues, and hidden treasures await!Every step brings you closer to victory—if you can think smart, move fast, and trust your team.\n\nRules and Regulations:\n* Teams must consist of 4 members only.\n* The hunt is restricted to campus areas only.\n* Clues must be solved in order, skipping or sharing clues is strictly prohibited. \n * Any damage, misconduct, or unsafe behaviour will lead to disqualification.\n* The first team to complete all clues correctly will be declared the winner.\n* The organizers’ decision is final.\n* All participants must report at the venue 30 minutes before the event start time.',
        date: 'February 27, 2026',
        time: 'TBA',
        prizepool: '₹5,000',
        fee: '50 per person',
        venue: 'TBA',
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
        time: 'TBA',
        prizepool: ' ₹3,000',
        fee: '50',
        venue: 'TBA',
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
        time: 'TBA',
        prizepool: '₹2,000',
        fee: '30',
        venue: 'TBA',
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
        time: 'TBA',
        prizepool: '₹3000',
        fee: '60',
        venue:'Lab 10',
        badge: 3,
        image: '/depfolds/ca/rootforce.jpeg',
<<<<<<< HEAD
        registrationUrl: 'https://makemypass.com/event/rootforce',

=======
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
>>>>>>> 3364c3232e62925a7fd0db292746354a37cbc829
        contact: [{ name: 'Vishnupriya', phone: '7907456401' }, { name: 'Jerald', phone: '7025497088' }]

      },
      {
        id: 6,
        name: 'CLASH OF KEYS ( SPEED TYPING )',
        description: '1. The competition is open to all registered participants of the tech fest.\n2. The event is an individual competition unless otherwise specified.\n3. Participants must report at the venue at least 15 minutes before their scheduled round.\n4. Each participant will be allotted a system; changing systems is not permitted without permission from the coordinator.\n5. Use of mobile phones, smart watches, earphones, or any external devices is strictly prohibited during the competition.\n6. Copy-paste, auto-correct tools, predictive text, or any typing assistance software is not allowed.\n7. Participants must type only the text displayed and follow round-specific instructions carefully.\n8. Any form of malpractice, disturbance, or unfair means will lead to immediate disqualification.\n9. Participants must maintain silence and discipline during the event.\n10. The decision of the judges and event coordinators will be final and binding.',
        date: 'February 28, 2026',
        time: 'TBA',
        prizepool: '₹2000',
        fee: '30',
        venue: 'TBA',
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
        time: 'TBA',
        prizepool: '₹3000',
        fee: '50',
        venue: 'TBA',
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
        time: 'TBA',
        fee: 'FREE',
        venue: 'MBA Lecture Hall, MBITS',
        badge: 2,
        image: '/depfolds/ca/robotic.jpeg',
<<<<<<< HEAD
        registrationUrl: 'https://makemypass.com/event/robotic-workshop',
        registerOption: 1,
=======
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        registerOption: 2,
>>>>>>> 3364c3232e62925a7fd0db292746354a37cbc829
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
        venue: 'M213A',
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
  }
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
            className="text-2xl md:text-1xl lg:text-1xl mb-6"
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
