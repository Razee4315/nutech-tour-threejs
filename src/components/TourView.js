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
  display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
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
   Navigation container for previous and next buttons
------------------------------------- */
const NavButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 20px;
`;

/* ----------------------------------
   Navigation buttons using the glass style
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
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 3000;
  opacity: ${({ show }) => (show ? 1 : 0)};
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
  width: ${({ progress }) => progress}%;
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
   Reusable modal component for hotspot information
------------------------------------- */
const InfoModal = ({ show, onClose, title, message }) => (
  <ModalOverlay show={show}>
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
        // From Academic Block to Atrium
        yaw: -4.96,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Atrium',
        handleClick: (setCurrentLocation) => setCurrentLocation(6)
      },
      {
        // From Academic Block to Campus Viewpoint
        yaw: 81.83,
        pitch: 7.39,
        type: 'custom',
        text: 'Go to Campus Viewpoint',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      },
      {
        // From Academic Block to Campus Pathway
        yaw: -124.78,
        pitch: 1.07,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
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
        // From Campus Pathway to Academic Block
        yaw: 14.89,
        pitch: -0.28,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        // From Campus Pathway to Auditorium External View
        yaw: 44.66,
        pitch: 7.84,
        type: 'custom',
        text: 'Go to Auditorium External View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
      },
      {
        // From Campus Pathway to Main walkway
        yaw: 133.71,
        pitch: 6.48,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
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
        // From Main walkway to Campus Pathway
        yaw: -63.61,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        // From Main walkway to Admin Pathway
        yaw: 27.70,
        pitch: 5.58,
        type: 'custom',
        text: 'Go to Admin Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        // New hotspot: from Main walkway to Main Entrance
        yaw: -162.86,
        pitch: 8.29,
        type: 'custom',
        text: 'Go to Main Entrance',
        handleClick: (setCurrentLocation) => setCurrentLocation(13)
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
        // From Admin_Block to Admin Pathway
        yaw: -39.25,
        pitch: 1.97,
        type: 'custom',
        text: 'Go to Admin Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        // From Admin_Block to Campus Viewpoint
        yaw: 103.94,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Campus Viewpoint',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
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
        // From Campus Viewpoint to Academic Block
        yaw: 64.51,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
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
        // From Admin Pathway to Admin_Block
        yaw: 76.24,
        pitch: -6.15,
        type: 'custom',
        text: 'Go to Admin Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(3)
      },
      {
        // From Admin Pathway to Main walkway
        yaw: 0.63,
        pitch: -2.54,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
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
        // New hotspot: go to Computer Lab
        yaw: 27.52,
        pitch: -5.70,
        type: 'custom',
        text: 'Go to Computer Lab',
        handleClick: (setCurrentLocation) => setCurrentLocation(7)
      },
      {
        // New hotspot: go to Library (Library First Floor)
        yaw: -176.84,
        pitch: -7.05,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        // New hotspot: go to Classroom
        yaw: 45.74,
        pitch: -1.64,
        type: 'custom',
        text: 'Go to Classroom',
        handleClick: (setCurrentLocation) => setCurrentLocation(12)
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
        // From Computer Lab to Library First Floor
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
        // From Library First Floor to Library Second Floor
        yaw: 120.90,
        pitch: -7.50,
        type: 'custom',
        text: 'Go to Library Second Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(9)
      },
      {
        // From Library First Floor to Academic Block
        yaw: 141.38,
        pitch: -8.40,
        type: 'custom',
        text: 'Go to Academic Block',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
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
        // From Library Second Floor to Library First Floor
        yaw: -116.84,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Library First Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(8)
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
        // From Faculty and Girls Cafe to Auditorium External View
        yaw: 83.46,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Auditorium External View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
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
        // From Auditorium External View to Campus Pathway
        yaw: 168.72,
        pitch: -4.79,
        type: 'custom',
        text: 'Go to Campus Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        // New hotspot: from Auditorium External View to Faculty and Girls Cafe
        yaw: -49.62,
        pitch: -0.28,
        type: 'custom',
        text: 'Go to Faculty and Girls Cafe',
        handleClick: (setCurrentLocation) => setCurrentLocation(10)
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
        // In Classroom, tap to return to Atrium
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
    hotSpots:
    [
      {
        yaw: -1.35,
        pitch: 0.62,
        type: 'custom',
        text: 'Go to Main walkway',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      }
    ]
  }
];

const TourView = () => {
  // Set initial state to index 13 (Main Entrance)
  const [currentLocation, setCurrentLocation] = useState(13);
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });
  const [showAllViews, setShowAllViews] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Tutorial state: whether to show and which step is current
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const panImageRef = useRef(null);

  // Array of tutorial steps
  const tutorialSteps = [
    {
      title: 'Hotspots',
      content: 'Click on hotspots within the panorama to learn more about the area.'
    },
    {
      title: 'Navigation',
      content: 'Use the Previous and Next buttons to move between locations.'
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
      content: 'Click Home at any time to return to the starting view.'
    }
  ];

  // Listen for fullscreen change events so we can update the button text
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Get current location data
  const currentData = locations[currentLocation];

  // Navigation handlers
  const goToPreviousLocation = () =>
    setCurrentLocation((prev) => (prev - 1 + locations.length) % locations.length);
  const goToNextLocation = () =>
    setCurrentLocation((prev) => (prev + 1) % locations.length);

  // Toggle fullscreen mode using the Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  // Called when the panorama has fully loaded
  const handlePanoramaLoad = () => {
    setIsLoading(false);
  };

  // Default handler for hotspots without a custom action: display modal
  const handleHotspotInfo = (hotspot) => {
    setModalInfo({
      show: true,
      title: hotspot.text,
      message: `Detailed information about ${currentData.title}.`
    });
  };

  const closeModal = () => {
    setModalInfo({ show: false, title: '', message: '' });
  };

  // Handler for progressing the tutorial
  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  // Calculate progress percentage for the progress bar
  const progressPercent = ((tutorialStep + 1) / tutorialSteps.length) * 100;

  return (
    <ViewerContainer>
      {/* Loading overlay with spinner */}
      <LoadingOverlay isLoading={isLoading}>
        <Spinner />
      </LoadingOverlay>

      {/* Fullscreen toggle button */}
      <FullscreenButton onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </FullscreenButton>

      {/* Home button */}
      <HomeButton onClick={() => setCurrentLocation(13)}>Home</HomeButton>

      {/* All Views button */}
      <AllViewsButton onClick={() => setShowAllViews(true)}>All Views</AllViewsButton>

      {/* Location information box */}
      <LocationInfo>
        <h3>{currentData.title}</h3>
        <p>{currentData.info}</p>
      </LocationInfo>

      {/* 360° Panorama Viewer with autorotate active and centered view */}
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
      >
        {/* Render only non-fixed hotspots inside the panorama */}
        {currentData.hotSpots
          .filter((hotspot) => !hotspot.fixed)
          .map((hotspot, index) => (
            <Pannellum.Hotspot
              key={index}
              type={hotspot.type}
              pitch={hotspot.pitch}
              yaw={hotspot.yaw}
              text={hotspot.text}
              handleClick={() => {
                if (hotspot.handleClick) {
                  hotspot.handleClick(setCurrentLocation);
                } else {
                  handleHotspotInfo(hotspot);
                }
              }}
            />
          ))}
      </Pannellum>

      {/* Render fixed hotspots (they will remain at the defined position regardless of panorama rotation) */}
      {currentData.hotSpots
        .filter((hotspot) => hotspot.fixed)
        .map((hotspot, index) => (
          <FixedHotspot
            key={index}
            onClick={() => {
              hotspot.handleClick(setCurrentLocation);
            }}
          >
            {hotspot.text}
          </FixedHotspot>
        ))}

      {/* External Navigation Buttons */}
      {locations.length > 1 && (
        <NavButtonContainer>
          <NavigationButton onClick={goToPreviousLocation}>Previous Location</NavigationButton>
          <NavigationButton onClick={goToNextLocation}>Next Location</NavigationButton>
        </NavButtonContainer>
      )}

      {/* Info Modal for Hotspots */}
      <InfoModal
        show={modalInfo.show}
        onClose={closeModal}
        title={modalInfo.title}
        message={modalInfo.message}
      />

      {/* All Views Modal with Thumbnails */}
      <ModalOverlay show={showAllViews}>
        <ViewsModalContent>
          <h3>Select a View</h3>
          <ViewGrid>
            {locations.map((loc, index) => (
              <ViewCard
                key={loc.id}
                onClick={() => {
                  setCurrentLocation(index);
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

      {/* Step-by-Step Tutorial Overlay */}
      {showTutorial && (
        <ModalOverlay show={showTutorial}>
          <TutorialContent>
            <h3>
              Step {tutorialStep + 1} of {tutorialSteps.length}: {tutorialSteps[tutorialStep].title}
            </h3>
            <ProgressBarContainer>
              <ProgressBarFill progress={progressPercent} />
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
    </ViewerContainer>
  );
};

export default TourView;
