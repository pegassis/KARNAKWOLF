import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, IndianRupee, Users, ExternalLink, Edit, Trash, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { EventForm } from '../components/EventForm';
import { VideoModal } from '../components/VideoModal';
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
        venue: 'Room 130,131',
        image: '/depfolds/comps/vrposter.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        badge: 1,
        venue: 'Room 231,232',
        image: '/depfolds/comps/GAMING_XP.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Rehab ', phone: '7907844588' }, { name: 'Fidha ', phone: '9947304940' }]
      },
      {
        id: 3,
        name: 'PIXELIA',
        description: 'Unleash your creativity in our pixel art competition! Design stunning pixel masterpieces and compete for glory. Whether youre a seasoned artist or a pixel enthusiast, join us for a colorful challenge that celebrates the art of pixels.\n\nRULES & REGULATIONS\n\n 1. Participants must report to the lab 15 minutes before the event starts.\n2. The poster theme/topic will be announced on the spot\n3. Only the software available on the lab computers may be used(Canva Web)\n4. Internet usage allowed only under supervision.\n5. Participants must not use pre-made templates or previously created posters.\n6. All designs must be created during the competition time only.\n7. External storage devices (pen drives, hard disks) are not allowed\n8. Posters must include a title and relevant visual elements related to the theme.\n9. Any form of copying or plagiarism will lead to disqualification.\n10. Final poster must be saved with the team/participant name and submitted before the deadline in the specified format (JPEG/PNG/PDF).\n11. Judges’ decision will  be final',
        date: 'February 28, 2026',
        time: 'Forenoon',
        prizepool: '1000',
        fee: '₹60',
        badge: 3,
        venue: 'Lab 3 Room 225',
        image: '/depfolds/comps/pixelia.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        contact: [{ name: 'Yeldho', phone: '9495171414' }, { name: 'Agnus', phone: '9544266892' }]
      },
      {
        id: 5,
        name: 'Splash Pitch',
        description: 'Dive into the slippery excitement of soapy football at our event — where you don’t just play, you slip, slide, laugh, and score in a wild, foam-filled twist on classic football. Whether you’re chasing the ball, bumping into friends, or trying to stay on your feet, every moment is full of energy, surprises, and unforgettable fun.\n\nDuration : 30 minutes',
        date: 'February 27, 2026',
        time: 'FULL DAY',
        prizepool: 'TBA',
        fee: '600 (per team of 4 players)',
        badge: 4,
        venue: 'Basketball court',
        image: '/depfolds/comps/splash.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Kevin', phone: '8075723712' }, { name: 'Ryan', phone: '6238890177' }]
      },
      {
        id: 6,
        name: 'Tech Trove',
        description: 'Explore innovative projects, interact with new technologies and connect with creative minds. Have a project? Join us and showcase your innovation to the world!',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: 'NA',
        fee: '₹FREE',
        badge: 1,
        venue: 'Classroom 133,134',
        image: '/depfolds/comps/techtrove.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Justin', phone: '7736309758' }, { name: 'Amrutha', phone: '7594907504' }]
      },
      {
      id: 7,
        name: ' Code, Predict, Conquer – Machine Learning Workshop',
        description: 'A hands-on introduction to Machine Learning organized by IEDC MBITS, where participants explore how machines analyze data, build predictive models, and solve real-world problems. Designed for beginners, this workshop emphasizes practical learning and the fundamentals of intelligent system development.\n\nOrganized By: IEDC MBITS\nCategory: Workshop\nMode: Offline (Lab Session)\nSeats: Limited seats available \n\nBenefits\n * Certificates will be provided to all participants upon successful completion of the workshop.\n* Activity points will be awarded.\n\nRules & Regulations\n* Entry is permitted only for registered participants.\n* Certificates will be issued only after full attendance throughout the session.',
        date: 'February 28, 2026',
        time: '10:00 AM – 01:00 PM',
        Organizedby:'IEDC MBITS',
        fee: '₹FREE',
        venue: 'Lab 8',
        image: '/depfolds/comps/codepredict.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        fee: '₹60',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/blindcoding.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        fee: '₹60',
        venue: 'Computer Lab 9',
        image: '/depfolds/comps/reversecoding.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
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
        fee: '₹60',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/prompt.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Gayathridevi K', phone: '8921169842' }, { name: 'Rinsa Fathima M A', phone: '8606033545' }]
      ,
      badge: 2
      },
      {
        id: 11,
        name: 'Tech Hunt',
        description: 'Step into a treasure hunt like no other, where logic replaces luck and clues are hidden in code. The Tech Hunt challenges participants to think, decode, and solve their way through a series of mysteries. Only sharp minds, quick reasoning, and technical intuition will lead you to the final prize. Get ready to explore, analyze, and conquer the hunt.',
        date: 'February 27, 2026',
        time: 'Afternoon',
        prizepool: 'NA',
        fee: '₹20',
        venue: 'Computer Lab 7',
        image: '/depfolds/comps/techhunt.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Anudev', phone: '9778155243' }, { name: 'Anna', phone: '8714224467' }]
      ,
      badge: 3
      },
      {
        id: 12,
        name: 'NETRIOT',
        description: 'Get ready to play, compete, and win! Participate in our mobile gaming event and test your skills against fellow gamers in an action-packed experience',
        date: 'February 27-28, 2026',
        time: 'FULL DAY',
        prizepool: '₹3000',
        fee: '₹40',
        venue: 'Room 229',
        image: '/depfolds/comps/netriot.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Febin', phone: '9562767233' }, { name: 'Sain', phone: '8139879470' }]
      ,
      badge: 3
      },
      
    ]
  },
  'electronics': {
    name: 'Electronics',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'Circuit Master',
        description: 'Circuit design and debugging',
        date: 'February 26-27, 2026',
        time: '9:30 AM - 12:30 PM',
        prizepool: 'TBA',
        fee: '₹250',
        badge: 3,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Rahul Mehra', phone: '9812345678' }, { name: 'Isha Pandey', phone: '9723456789' }]
      },
      {
        id: 2,
        name: 'IoT Innovation',
        description: 'Build smart IoT solutions',
        date: 'February 26-27, 2026',
        time: '1:00 PM - 5:00 PM',
        prizepool: 'TBA',
        fee: '₹400',
        badge: 1,
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Sneha Roy', phone: '9823456781' }, { name: 'Karan Singh', phone: '9834567892' }]
      },
      {
        id: 3,
        name: 'Embedded Challenge',
        description: 'Embedded systems programming',
        date: 'February 26-27, 2026',
        time: '10:00 AM - 1:00 PM',
        prizepool: 'TBA',
        fee: '₹350',
        badge: 2,
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Vikram Singh', phone: '9834567812' }, { name: 'Anjali Nair', phone: '9845678923' }]
      },
      {
        id: 4,
        name: 'PCB Design Contest',
        description: 'Professional PCB design',
        date: 'February 26-27, 2026',
        time: '2:30 PM - 5:30 PM',
        prizepool: 'TBA',
        fee: '₹300',
        badge: 3,
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Aarti Sharma', phone: '9845678123' }, { name: 'Mohit Patel', phone: '9756789034' }]
      }
    ]
  },
  'mechanical': {
    name: 'Mechanical',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'Robo Race',
        description: 'Autonomous robot racing',
        date: 'February 26-27, 2026',
        time: '11:00 AM - 4:00 PM',
        prizepool: 'TBA',
        fee: '₹500',
        badge: 3,
        image: 'https://images.unsplash.com/photo-1561144257-e32e8eef8e8e?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Suresh Babu', phone: '9856781234' }, { name: 'Priya Gupta', phone: '9867892345' }]
      },
      {
        id: 2,
        name: 'CAD Master',
        description: '3D modeling competition',
        date: 'February 26-27, 2026',
        time: '9:00 AM - 2:00 PM',
        prizepool: 'TBA',
        fee: '₹250',
        badge: 3,
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Meena Pillai', phone: '9867812345' }, { name: 'Dev Yadav', phone: '9978903456' }]
      },
      {
        id: 3,
        name: 'Bridge Build',
        description: 'Build the strongest bridge',
        date: 'February 26-27, 2026',
        time: '1:30 PM - 5:30 PM',
        prizepool: 'TBA',
        fee: '₹400',
        badge: 3,
        image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Arjun Das', phone: '9878123456' }, { name: 'Sophia Khan', phone: '9789012367' }]
      },
      {
        id: 4,
        name: 'Hydraulic Challenge',
        description: 'Design hydraulic systems',
        date: 'February 26-27, 2026',
        time: '10:30 AM - 3:30 PM',
        prizepool: 'TBA',
        fee: '₹350',
        badge: 2,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112e89af45?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Divya Nair', phone: '9881234567' }, { name: 'Sameer Chopra', phone: '9890123478' }]
      }
    ]
  },
  'civil': {
    name: 'Civil',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'Structure Design',
        description: 'Structural engineering design',
        date: 'February 26-27, 2026',
        time: '9:30 AM - 12:30 PM',
        prizepool: 'TBA',
        fee: '₹300',
        badge: 3,
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Karthik Rao', phone: '9891234567' }, { name: 'Divya Desai', phone: '9912345678' }]
      },
      {
        id: 2,
        name: 'City Planning',
        description: 'Urban planning competition',
        date: 'February 26-27, 2026',
        time: '2:00 PM - 5:00 PM',
        prizepool: 'TBA',
        fee: '₹250',
        badge: 1,
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Shalini Menon', phone: '9901234567' }, { name: 'Nikhil Bhat', phone: '9823456789' }]
      },
      {
        id: 3,
        name: 'AutoCAD Challenge',
        description: 'Technical drawing competition.JAGSJJAERBHBKFBLHBABHBIAEIRIUBBEA.&nbsp;',
        date: 'February 26, 2026',
        time: '10:00 AM - 1:00 PM',
        prizepool: '₹10,000',
        fee: '₹200',
        badge: 3,
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Mohit Verma', phone: '9912345678' }, { name: 'Ruhi Kapoor', phone: '9734567890' }]
      }
    ]
  },
  'electrical': {
    name: 'Electrical',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'Power Grid',
        description: 'Power systems design',
        date: 'February 26-27, 2026',
        time: '9:00 AM - 1:00 PM',
        prizepool: 'TBA',
        fee: '₹300',
        badge: 1,
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Anil Joshi', phone: '9923456781' }, { name: 'Sneha Iyer', phone: '9845678901' }]
      },
      {
        id: 2,
        name: 'Motor Control',
        description: 'Electric motor control systems',
        date: 'February 26-27, 2026',
        time: '1:30 PM - 4:30 PM',
        prizepool: 'TBA',
        fee: '₹350',
        badge: 2,
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Sunita Rao', phone: '9934567812' }, { name: 'Vikrant Sinha', phone: '9756890123' }]
      },
      {
        id: 3,
        name: 'Renewable Energy',
        description: 'Sustainable energy projects',
        date: 'February 26-27, 2026',
        time: '10:00 AM - 3:00 PM',
        prizepool: 'TBA',
        fee: 'FREE',
        badge: 1,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Rakesh Gupta', phone: '9945678123' }, { name: 'Aarav Singh', phone: '9867901234' }]
      }
    ]
  },
  'general': {
    name: 'Computer Applications',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'Innovation Summit',
        description: 'Cross-domain innovation showcase',
        date: 'February 26-27, 2026',
        time: '9:00 AM - 5:00 PM',
        prizepool: 'TBA',
        fee: 'FREE',
        badge: 1,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Nisha Jain', phone: '9956781234' }, { name: 'Yash Mishra', phone: '9878012345' }]
      },
      {
        id: 2,
        name: 'Tech Talk Series',
        description: 'Industry expert sessions',
        date: 'February 26-27, 2026',
        time: '10:00 AM - 2:00 PM',
        prizepool: 'TBA',
        fee: 'FREE',
        badge: 2,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Aman Kapoor', phone: '9967812345' }, { name: 'Ritu Verma', phone: '9789123456' }]
      },
      {
        id: 3,
        name: 'Paper Presentation',
        description: 'Present your research',
        date: 'February 26-27, 2026',
        time: '2:00 PM - 5:00 PM',
        prizepool: 'TBA',
        fee: '₹150',
        badge: 2,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Farhan Ali', phone: '9978123456' }, { name: 'Maya Reddy', phone: '9890234567' }]
      },
      {
        id: 4,
        name: 'Startup Pitch',
        description: 'Pitch your startup idea',
        date: 'February 26-27, 2026',
        time: '3:00 PM - 6:00 PM',
        prizepool: 'TBA',
        fee: '₹200',
        badge: 1,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
        registrationUrl: 'https://t4.ftcdn.net/jpg/17/77/94/27/360_F_1777942761_UTY0WxIs5of7FgsgrkLmzqFdCapwHHgN.jpg',
        contact: [{ name: 'Geeta Reddy', phone: '9981234567' }, { name: 'Karan Tiwari', phone: '9901345678' }]
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

  const department = departmentId ? departmentEvents[departmentId] : null;

  // Show video modal only once after component mounts for mechanical department
  useEffect(() => {
    if (departmentId === 'mechanical') {
      setShowVideoModal(true);
    }
  }, [departmentId]);

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
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
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
    <div className="min-h-screen pt-24 lg:pt-32 pb-16 relative">
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
            {/* Video Background for Electronics Department */}
      {departmentId === 'electronics' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Vid />
          {/* dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}

      {/* Image Background for Mechanical Department */}
      {departmentId === 'mechanical' && !showVideoModal && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <img 
            src={isMobile ? '/moferrari.jpg' : '/winferrari.jpg'}
            alt="Mechanical Department Background"
            className="w-full h-full object-cover"
          />
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

     
      {/* Video Modal for Mechanical Department */}
      <VideoModal
        isOpen={showVideoModal}
        videoSrc="https://res.cloudinary.com/dts9wynrs/video/upload/v1771159245/mectyre_hlffsi.mp4"
        onClose={() => setShowVideoModal(false)}
        autoPlay={true}
      />

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
            className="text-6xl md:text-7xl mb-6"
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

                {/* Fee Box - Centered with Orange Border */}
                <div className="px-4 py-1 bg-[#1A1A1A] flex-shrink-0 flex justify-center">
                  <div className="border-2 border-[#FFA500] rounded-lg px-3 py-0.5 flex items-center gap-2" style={{ borderColor: department.color }}>
                    <IndianRupee className="w-5 h-5" style={{ color: department.color }} />
                    <span className="font-bold text-lg text-white">{event.fee}</span>
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
