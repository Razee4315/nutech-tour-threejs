import React, { useState, useRef, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';
import styled, { keyframes } from 'styled-components';

/* ----------------------------------
   Spinner keyframes for loading animation
------------------------------------- */
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/* ----------------------------------
   Main viewer container with a dark background
------------------------------------- */
const ViewerContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #000;
`;

/* ----------------------------------
   Improved Location Info Box
------------------------------------- */
const LocationInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
  background-color: rgba(20, 20, 20, 0.85);
  color: #fff;
  padding: 20px 28px;
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 350px;
  font-size: 1rem;
`;

/* ----------------------------------
   Glassmorphism style for buttons (text color updated to black)
------------------------------------- */
const GlassButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #000; /* Black text */
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }
`;

/* ----------------------------------
   Fullscreen toggle button at top right
------------------------------------- */
const FullscreenButton = styled(GlassButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  font-size: 0.9rem;
  border-radius: 20px;
  z-index: 1100;
`;

/* ----------------------------------
   Home button positioned at bottom left
------------------------------------- */
const HomeButton = styled(GlassButton)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1100;
`;

/* ----------------------------------
   All Views button positioned at bottom right
------------------------------------- */
const AllViewsButton = styled(GlassButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
`;

/* ----------------------------------
   Loading overlay with a spinner
------------------------------------- */
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: ${({ $isLoading }) => ($isLoading ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Spinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;

/* ----------------------------------
   Navigation container for previous button
------------------------------------- */
const NavButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

/* ----------------------------------
   Navigation button using the glass style
------------------------------------- */
const NavigationButton = styled(GlassButton)`
  padding: 12px 24px;
  font-size: 1rem;
`;

/* ----------------------------------
   Modal overlay for displaying popups (tutorial, info, view selection)
------------------------------------- */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.8);
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 3000;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

/* ----------------------------------
   Base Modal content styling
------------------------------------- */
const ModalContent = styled.div`
  background: #fff;
  color: #333;
  padding: 24px 32px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

/* ----------------------------------
   Improved Tutorial Content styling
------------------------------------- */
const TutorialContent = styled(ModalContent)`
  max-width: 550px;
  padding: 40px 48px;
  border-radius: 16px;
`;

/* ----------------------------------
   Modal close button using glass style (text color updated)
------------------------------------- */
const ModalCloseButton = styled(GlassButton)`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 0.9rem;
  background: rgba(20, 20, 20, 0.15);
  border: 1px solid rgba(20, 20, 20, 0.3);
  color: #000;

  &:hover {
    background: rgba(20, 20, 20, 0.25);
  }
`;

/* ----------------------------------
   Container for the "All Views" modal content
------------------------------------- */
const ViewsModalContent = styled(ModalContent)`
  max-height: 80vh;
  overflow-y: auto;
`;

/* ----------------------------------
   Grid container for view cards
------------------------------------- */
const ViewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

/* ----------------------------------
   Styled card for each view (glassmorphism style)
------------------------------------- */
const ViewCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  overflow: hidden;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }
`;

/* ----------------------------------
   Thumbnail image for each view card
------------------------------------- */
const Thumbnail = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
`;

/* ----------------------------------
   Card title styling for each view card
------------------------------------- */
const CardTitle = styled.div`
  padding: 8px;
  color: #000;
  font-weight: 600;
  text-align: center;
`;

/* ----------------------------------
   Progress Bar for the tutorial steps
------------------------------------- */
const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
`;
const ProgressBarFill = styled.div`
  height: 8px;
  background: #000;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease;
`;

/* ----------------------------------
   Fixed Hotspot styling for hotspots that should not move with the panorama
------------------------------------- */
const FixedHotspot = styled.div`
  position: absolute;
  left: 50%;
  bottom: 30%;
  transform: translateX(-50%);
  padding: 10px 16px;
  background: rgba(255,255,255,0.8);
  border-radius: 8px;
  cursor: pointer;
  z-index: 1500;
  font-size: 1rem;
  color: #000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);

  &:hover {
    background: rgba(255,255,255,1);
  }
`;

/* ----------------------------------
   Reusable modal component for hotspot information (no longer needed for info hotspots)
------------------------------------- */
const InfoModal = ({ $show, onClose, title, message }) => (
  <ModalOverlay $show={$show}>
    <ModalContent>
      {title && <h3>{title}</h3>}
      <p>{message}</p>
      <ModalCloseButton onClick={onClose}>Close</ModalCloseButton>
    </ModalContent>
  </ModalOverlay>
);

/* ----------------------------------
   Tour location data and hotspot configuration
------------------------------------- */
const locations = [
  {
    id: 1,
    title: 'Academic Block',
    image: `${process.env.PUBLIC_URL}/images/Academic_block.jpg`,
    info: 'The Academic Block houses classrooms, faculty offices, library, and labs serving as the core space for academic activities.',
    hotSpots: [
      {
        yaw: -4.96,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Atrium',
        handleClick: (setCurrentLocation) => setCurrentLocation(6)
      },
      {
        yaw: 81.83,
        pitch: 7.39,
        type: 'custom',
        text: 'Go to Campus Viewpoint',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      },
      {
        yaw: -124.78,
        pitch: 1.07,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        yaw: -157.51,
        pitch: 0.16,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Secondary entrance to the Admin Block.'
      },
      {
        yaw: -77.67,
        pitch: -0.34,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Lab Block: Contains specialized labs for practical learning.'
      },
      {
        yaw: -3.79,
        pitch: 12.55,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Academic Block: Consists of lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: 63.72,
        pitch: 6.50,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'NSDD Office Block'
      },
      {
        yaw: -129.24,
        pitch: 1.15,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Habib ATM (HBL): On-campus ATM facility for banking services.'
      },
      {
        yaw: -42.96,
        pitch: 5.61,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Boys’ Cafeteria: Dining area designated for male students.'
      }
    ]
  },
  {
    id: 2,
    title: 'Campus Pathway',
    image: `${process.env.PUBLIC_URL}/images/Campus_Pathway.jpg`,
    info: 'It leads to the main campus, lab block, and auditorium.',
    hotSpots: [
      {
        yaw: 14.89,
        pitch: -0.28,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        yaw: 44.66,
        pitch: 7.84,
        type: 'custom',
        text: 'Go to Auditorium External View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
      },
      {
        yaw: 133.71,
        pitch: 6.48,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      },
      {
        yaw: -15.69,
        pitch: 11.07,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Lab Block: Houses various engineering and computing labs for practical sessions.'
      },
      {
        yaw: 4.64,
        pitch: 11.56,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Academic Block: Contains lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: -38.50,
        pitch: 1.65,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Parking area designated for faculty members.'
      },
      {
        yaw: 36.87,
        pitch: 15.53,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Auditorium and Faculty Café: Venue for seminars and events, with a dedicated café for faculty.'
      }
    ]
  },
  {
    id: 3,
    title: 'Main walkway',
    image: `${process.env.PUBLIC_URL}/images/Main_walkway.jpg`,
    info: 'It serves as the primary route leading to campus and the Admin Block.',
    hotSpots: [
      {
        yaw: -63.61,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        yaw: 27.70,
        pitch: 5.58,
        type: 'custom',
        text: 'Go to Admin Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        yaw: -162.86,
        pitch: 8.29,
        type: 'custom',
        text: 'Go to Main Entrance',
        handleClick: (setCurrentLocation) => setCurrentLocation(13)
      },
      {
        yaw: -155.52,
        pitch: 6.60,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'NUtech Main Exit Point.'
      },
      {
        yaw: 86.96,
        pitch: 13.55,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'CTTI Building.'
      },
      {
        yaw: 46.79,
        pitch: 3.63,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Friendship Park: A recreational space for students.'
      },
      {
        yaw: 2.46,
        pitch: 3.97,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Flag Area: Displays flags of NUtech and its departments.'
      }
    ]
  },
  {
    id: 4,
    title: 'Admin_Block',
    image: `${process.env.PUBLIC_URL}/images/Admin_Block.jpg`,
    info: 'Admin Block houses the administrative offices including admissions, student services, and administration.',
    hotSpots: [
      {
        yaw: -39.25,
        pitch: 1.97,
        type: 'custom',
        text: 'Go to Admin Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        yaw: 103.94,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Campus Viewpoint',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      },
      {
        yaw: 62.66,
        pitch: 12.55,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Main entrance to the Admin Block.'
      },
      {
        yaw: -97.01,
        pitch: 42.31,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'NUtech Tower: One of the prominent buildings on campus.'
      },
      {
        yaw: -158.00,
        pitch: 5.12,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Al Habib ATM: On-campus ATM facility for banking services.'
      }
    ]
  },
  {
    id: 5,
    title: 'Campus Viewpoint',
    image: `${process.env.PUBLIC_URL}/images/Campus_Viewpoint.jpg`,
    info: 'Experience the beauty of Campus Viewpoint.',
    hotSpots: [
      {
        yaw: 64.51,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        yaw: 35.88,
        pitch: 9.08,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Admin Block: Central hub for university administration and student services.'
      },
      {
        yaw: 54.23,
        pitch: -7.78,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Ground: Open space for sports and student activities.'
      },
      {
        yaw: 93.90,
        pitch: 18.01,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Academic Block: Includes lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: 115.37,
        pitch: 0.43,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'NSDD: Under development for future expansion.'
      }
    ]
  },
  {
    id: 6,
    title: 'Admin Pathway',
    image: `${process.env.PUBLIC_URL}/images/Admin_Pathway.jpg`,
    info: 'Admin Pathway leads to the administrative block.',
    hotSpots: [
      {
        yaw: 76.24,
        pitch: -6.15,
        type: 'custom',
        text: 'Go to Admin Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(3)
      },
      {
        yaw: 0.63,
        pitch: -2.54,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      },
      {
        yaw: -164.45,
        pitch: 5.61,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'CTTI Main Building: Central facility of CTTI.'
      },
      {
        yaw: -32.55,
        pitch: 0.16,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Friendship Park: A recreational area for students.'
      },
      {
        yaw: 54.73,
        pitch: 1.65,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Main entrance to the Admin Block.'
      }
    ]
  },
  {
    id: 7,
    title: 'Atrium',
    image: `${process.env.PUBLIC_URL}/images/Atrium.jpg`,
    info: 'The Atrium is a central hub featuring a student facility desk and gateway to the classes, library, and faculty offices.',
    hotSpots: [
      {
        yaw: 27.52,
        pitch: -5.70,
        type: 'custom',
        text: 'Go to Computer Lab',
        handleClick: (setCurrentLocation) => setCurrentLocation(7)
      },
      {
        yaw: -176.84,
        pitch: -7.05,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        yaw: 45.74,
        pitch: -1.64,
        type: 'custom',
        text: 'Go to Classroom',
        handleClick: (setCurrentLocation) => setCurrentLocation(12)
      },
      {
        yaw: -67.22,
        pitch: -5.24,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Student Facilitation Desk: Provides information and support for students.'
      },
      {
        yaw: 0.72,
        pitch: -2.09,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Lift: Access to all floors of the Academic Block.'
      },
      {
        yaw: 24.18,
        pitch: 3.33,
        
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Way to classrooms and computer labs.'
      },
      {
        yaw: 79.22,
        pitch: -3.44,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Display Point / Sale Point: Area for showcasing and selling university-related items.'
      }
    ]
  },
  {
    id: 8,
    title: 'Computer Lab',
    image: `${process.env.PUBLIC_URL}/images/Computer_Lab.jpg`,
    info: 'The Computer Lab offers a workspace for students to work on their projects and perform necessary tasks.',
    hotSpots: [
      {
        yaw: 121.35,
        pitch: -21.48,
        type: 'custom',
        text: 'Go to Library First Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(8)
      }
    ]
  },
  {
    id: 9,
    title: 'Library First Floor',
    image: `${process.env.PUBLIC_URL}/images/Library_First_Floor.jpg`,
    info: 'The library offers a variety of digital resources and books to students.',
    hotSpots: [
      {
        yaw: 120.90,
        pitch: -7.50,
        type: 'custom',
        text: 'Go to Library Second Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(9)
      },
      {
        yaw: 141.38,
        pitch: -8.40,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        yaw: 84.81,
        pitch: -5.70,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Library Help Desk 1: Main help desk for library services and inquiries.'
      }
    ]
  },
  {
    id: 10,
    title: 'Library Second Floor',
    image: `${process.env.PUBLIC_URL}/images/Library_Second_Floor.jpg`,
    info: 'This is the second floor of the library.',
    hotSpots: [
      {
        yaw: -116.84,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Library First Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(8)
      },
      {
        yaw: 164.66,
        pitch: -1.64,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Conference Room: Reserved for meetings, discussions, and presentations.'
      },
      {
        yaw: -107.10,
        pitch: -2.99,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Library Help Desk 2: Assistance point for students on the second floor.'
      }
    ]
  },
  {
    id: 11,
    title: 'Faculty and Girls Cafe',
    image: `${process.env.PUBLIC_URL}/images/Facualty_and_girl_cafe.jpg`,
    info: 'The cafe offers a cozy space for students and staff to unwind, socialize, and enjoy delicious meals and refreshments.',
    hotSpots: [
      {
        yaw: 83.46,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Auditorium External View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
      },
      {
        yaw: -59.55,
        pitch: -6.15,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Cash Counter: Payment point for food and beverages.'
      }
    ]
  },
  {
    id: 12,
    title: 'Auditorium External View',
    image: `${process.env.PUBLIC_URL}/images/Auditorium_external_view.jpg`,
    info: 'This is the external view of the auditorium.',
    hotSpots: [
      {
        yaw: 168.72,
        pitch: -4.79,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        yaw: -49.62,
        pitch: -0.28,
        type: 'custom',
        text: 'Go to Faculty and Girls Cafe',
        handleClick: (setCurrentLocation) => setCurrentLocation(10)
      },
      {
        yaw: -56.84,
        pitch: 7.60,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Main entrance to the auditorium.'
      },
      {
        yaw: -48.42,
        pitch: 8.09,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Entrance to the Faculty and Girls’ Café.'
      }
    ]
  },
  {
    id: 13,
    title: 'Classroom',
    image: `${process.env.PUBLIC_URL}/images/classroom.jpg`,
    info: 'This view shows the classroom.',
    hotSpots: [
      {
        yaw: -107.82,
        pitch: -7.50,
        type: 'custom',
        text: 'Go to Atrium',
        handleClick: (setCurrentLocation) => setCurrentLocation(6)
      }
    ]
  },
  {
    id: 14,
    title: 'Main Entrance',
    image: `${process.env.PUBLIC_URL}/images/main_entrance.jpg`,
    info: 'This view shows the main entrance.',
    hotSpots: [
      {
        yaw: -1.35,
        pitch: 0.62,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      },
      {
        yaw: -16.51,
        pitch: 1.40,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'NUtech Entrance: Students must present their student ID for verification.'
      },
      {
        yaw: 40.15,
        pitch: 0.50,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'CTTI Entrance: Access for CTTI students upon student ID verification.'
      },
      {
        yaw: 99.25,
        pitch: 2.76,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Designated student parking area.'
      },
      {
        yaw: -87.97,
        pitch: -0.85,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Vehicle checkpost for security inspection.'
      },
      {
        yaw: -130.38,
        pitch: -2.66,
        type: 'info',
        cssClass: 'info-hotspot',
        text: 'Main IJP Road, Islamabad.'
      }
    ]
  }
];

const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(13); // Start at Main Entrance
  const [visitHistory, setVisitHistory] = useState([13]); // Track visited locations
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ $show: false, title: '', message: '' });
  const [showAllViews, setShowAllViews] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const panImageRef = useRef(null);

  const tutorialSteps = [
    {
      title: 'Hotspots',
      content: 'Click navigation hotspots to move, or hover over info hotspots for details.'
    },
    {
      title: 'Navigation',
      content: 'Use the Previous Location button to go back to the last place you visited.'
    },
    {
      title: 'All Views',
      content: 'Click the "All Views" button to see thumbnail previews of every location.'
    },
    {
      title: 'Fullscreen',
      content: 'Toggle fullscreen mode for an immersive experience.'
    },
    {
      title: 'Home',
      content: 'Click Home to return to the starting view.'
    }
  ];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    console.log('Current Location:', currentLocation);
    console.log('Visit History:', visitHistory);
  }, [currentLocation, visitHistory]);

  const currentData = locations[currentLocation];

  const handleHotspotClick = (hotspot) => {
    if (hotspot.handleClick) {
      const previousLocation = currentLocation;
      console.log('Before Click - Current:', previousLocation, 'History:', visitHistory);
      
      // Update the current location without modifying history here
      // The history will be updated by the useEffect below
      hotspot.handleClick(setCurrentLocation);
    }
  };

  // Add a useEffect to track location changes
  useEffect(() => {
    // Skip on initial render
    if (visitHistory.length === 1 && visitHistory[0] === currentLocation) {
      return;
    }
    
    // If the current location is different from the last one in history, add it
    if (visitHistory[visitHistory.length - 1] !== currentLocation) {
      console.log('Location changed, updating history:', [...visitHistory, currentLocation]);
      setVisitHistory(prevHistory => [...prevHistory, currentLocation]);
    }
  }, [currentLocation, visitHistory]);

  const goToPreviousLocation = () => {
    if (visitHistory.length > 1) {
      const newHistory = [...visitHistory];
      newHistory.pop(); // Remove the current location
      const previousLocation = newHistory[newHistory.length - 1];
      console.log('Going to Previous Location:', previousLocation, 'New History:', newHistory);
      
      // Set the new location without modifying history here
      setCurrentLocation(previousLocation);
      // Update history directly
      setVisitHistory(newHistory);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const handlePanoramaLoad = () => {
    setIsLoading(false);
  };

  const closeModal = () => {
    setModalInfo({ $show: false, title: '', message: '' });
  };

  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const progressPercent = ((tutorialStep + 1) / tutorialSteps.length) * 100;

  return (
    <ViewerContainer>
      <LoadingOverlay $isLoading={isLoading}>
        <Spinner />
      </LoadingOverlay>

      <FullscreenButton onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </FullscreenButton>

      <HomeButton onClick={() => {
        setCurrentLocation(13);
        setVisitHistory([13]); // Reset history to just Main Entrance
      }}>Home</HomeButton>

      <AllViewsButton onClick={() => setShowAllViews(true)}>All Views</AllViewsButton>

      <LocationInfo>
        <h3>{currentData.title}</h3>
        <p>{currentData.info}</p>
      </LocationInfo>

      <Pannellum
        width="100%"
        height="100vh"
        image={currentData.image}
        pitch={0}
        yaw={0}
        hfov={110}
        autoRotate={2}
        ref={panImageRef}
        autoLoad
        onLoad={handlePanoramaLoad}
        hotspotDebug={false}
      >
        {currentData.hotSpots
          .filter((hotspot) => !hotspot.fixed)
          .map((hotspot, index) => (
            <Pannellum.Hotspot
              key={index}
              type={hotspot.type}
              pitch={hotspot.pitch}
              yaw={hotspot.yaw}
              text={hotspot.text}
              cssClass={hotspot.cssClass || 'custom-hotspot'}
              handleClick={hotspot.handleClick ? () => handleHotspotClick(hotspot) : null}
            />
          ))}
      </Pannellum>

      {currentData.hotSpots
        .filter((hotspot) => hotspot.fixed)
        .map((hotspot, index) => (
          <FixedHotspot
            key={index}
            onClick={() => handleHotspotClick(hotspot)}
          >
            {hotspot.text}
          </FixedHotspot>
        ))}

      <NavButtonContainer>
        <NavigationButton onClick={goToPreviousLocation} disabled={visitHistory.length <= 1}>
          Previous Location
        </NavigationButton>
      </NavButtonContainer>

      <InfoModal
        $show={modalInfo.$show}
        onClose={closeModal}
        title={modalInfo.title}
        message={modalInfo.message}
      />

      <ModalOverlay $show={showAllViews}>
        <ViewsModalContent>
          <h3>Select a View</h3>
          <ViewGrid>
            {locations.map((loc, index) => (
              <ViewCard
                key={loc.id}
                onClick={() => {
                  if (index !== currentLocation) {
                    // Just update the current location
                    // The history will be updated by the useEffect
                    setCurrentLocation(index);
                  }
                  setShowAllViews(false);
                }}
              >
                <Thumbnail src={loc.image} alt={loc.title} />
                <CardTitle>{loc.title}</CardTitle>
              </ViewCard>
            ))}
          </ViewGrid>
          <ModalCloseButton onClick={() => setShowAllViews(false)}>Close</ModalCloseButton>
        </ViewsModalContent>
      </ModalOverlay>

      {showTutorial && (
        <ModalOverlay $show={showTutorial}>
          <TutorialContent>
            <h3>
              Step {tutorialStep + 1} of {tutorialSteps.length}: {tutorialSteps[tutorialStep].title}
            </h3>
            <ProgressBarContainer>
              <ProgressBarFill $progress={progressPercent} />
            </ProgressBarContainer>
            <p>{tutorialSteps[tutorialStep].content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <GlassButton onClick={() => setShowTutorial(false)}>Skip Tutorial</GlassButton>
              <GlassButton onClick={handleTutorialNext}>
                {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
              </GlassButton>
            </div>
          </TutorialContent>
        </ModalOverlay>
      )}

      {/* Add CSS for hotspots */}
      <style>
        {`
          .pnlm-hotspot.custom-hotspot {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            padding: 5px 10px;
            cursor: pointer;
          }
          .pnlm-hotspot.info-hotspot {
            background-color: #00f;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: default;
          }
          .pnlm-hotspot.info-hotspot .pnlm-tooltip {
            background-color: rgba(0, 0, 255, 0.8);
            color: #fff;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 14px;
            max-width: 200px;
            white-space: normal;
          }
        `}
      </style>
    </ViewerContainer>
  );
};

export default TourView;