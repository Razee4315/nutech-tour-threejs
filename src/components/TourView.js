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
    title: 'Uni_Ground',
    image: `${process.env.PUBLIC_URL}/images/Uni_Ground.jpg`,
    info: 'Explore the vibrant atmosphere of Uni_Ground.',
    hotSpots: [
      {
        // Destination: Entrance_Acdemic → Location 7 (index 6)
        yaw: -4.96,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Entrance_Acdemic',
        handleClick: (setCurrentLocation) => setCurrentLocation(6)
      },
      {
        // Destination: Campus_View → Location 5 (index 4)
        yaw: 81.83,
        pitch: 7.39,
        type: 'custom',
        text: 'Go to Campus_View',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      },
      {
        // Destination: Uni_Ground_Pathway_1 → Location 2 (index 1)
        yaw: -124.78,
        pitch: 1.07,
        type: 'custom',
        text: 'Go to Uni_Ground_Pathway_1',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      }
    ]
  },
  {
    id: 2,
    title: 'Uni_Ground_Pathway_1',
    image: `${process.env.PUBLIC_URL}/images/Uni_Ground_Pathway_1.jpg`,
    info: 'Step into the serene views of Uni_Ground_Pathway_1.',
    hotSpots: [
      {
        // Destination: Uni_Ground → Location 1 (index 0)
        yaw: 14.89,
        pitch: -0.28,
        type: 'custom',
        text: 'Go to Uni_Ground',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        // Destination: Admin_View → Location 12 (index 11)
        yaw: 44.66,
        pitch: 7.84,
        type: 'custom',
        text: 'Go to Admin_View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
      },
      {
        // Destination: Uni_Ground_Pathway_2 → Location 3 (index 2)
        yaw: 133.71,
        pitch: 6.48,
        type: 'custom',
        text: 'Go to Uni_Ground_Pathway_2',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      }
    ]
  },
  {
    id: 3,
    title: 'Uni_Ground_Pathway_2',
    image: `${process.env.PUBLIC_URL}/images/Uni_Ground_Pathway_2.jpg`,
    info: 'Discover the historical charm of Uni_Ground_Pathway_2.',
    hotSpots: [
      {
        // Destination: Uni_Ground_Pathway_1 → Location 2 (index 1)
        yaw: -63.61,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Uni_Ground_Pathway_1',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        // Destination: Admin_Pathway → Location 6 (index 5)
        yaw: 27.70,
        pitch: 5.58,
        type: 'custom',
        text: 'Go to Admin_Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      }
    ]
  },
  {
    id: 4,
    title: 'Admin_Block_Front',
    image: `${process.env.PUBLIC_URL}/images/Admin_Block_Front.jpg`,
    info: 'Immerse yourself in the beauty of Admin_Block_Front.',
    hotSpots: [
      {
        // Destination: Admin_Pathway → Location 6 (index 5)
        yaw: -39.25,
        pitch: 1.97,
        type: 'custom',
        text: 'Go to Admin_Pathway',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        // Destination: Campus_View → Location 5 (index 4)
        yaw: 103.94,
        pitch: 3.33,
        type: 'custom',
        text: 'Go to Campus_View',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      }
    ]
  },
  {
    id: 5,
    title: 'Campus_View',
    image: `${process.env.PUBLIC_URL}/images/Campus_View.jpg`,
    info: 'Witness breathtaking scenes at Campus_View.',
    hotSpots: [
      {
        // Destination: Uni_Ground → Location 1 (index 0)
        yaw: 64.51,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Uni_Ground',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      }
    ]
  },
  {
    id: 6,
    title: 'Admin_Pathway',
    image: `${process.env.PUBLIC_URL}/images/Admin_Pathway.jpg`,
    info: 'Experience the dynamic energy of Admin_Pathway.',
    hotSpots: [
      {
        // Destination: Admin_Block_Front → Location 4 (index 3)
        yaw: 76.24,
        pitch: -6.15,
        type: 'custom',
        text: 'Go to Admin_Block_Front',
        handleClick: (setCurrentLocation) => setCurrentLocation(3)
      },
      {
        // Destination: Uni_Ground_Pathway_2 → Location 3 (index 2)
        yaw: 0.63,
        pitch: -2.54,
        type: 'custom',
        text: 'Go to Uni_Ground_Pathway_2',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      }
    ]
  },
  {
    id: 7,
    title: 'Entrance_Acdemic',
    image: `${process.env.PUBLIC_URL}/images/Entrance_Acdemic.jpg`,
    info: 'Conclude your tour with the stunning Entrance_Acdemic.',
    hotSpots: [
      {
        // Destination: Uni_Ground → Location 1 (index 0)
        yaw: -177.74,
        pitch: -7.50,
        type: 'custom',
        text: 'Go to Uni_Ground',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        // Destination: Computer_Lab → Location 8 (index 7)
        yaw: 27.25,
        pitch: -5.24,
        type: 'custom',
        text: 'Go to Computer_Lab',
        handleClick: (setCurrentLocation) => setCurrentLocation(7)
      }
    ]
  },
  {
    id: 8,
    title: 'Computer_Lab',
    image: `${process.env.PUBLIC_URL}/images/Computer_Lab.jpg`,
    info: 'Embrace the charm of Computer_Lab.',
    hotSpots: [
      {
        // Destination: Library_First_Floor → Location 9 (index 8)
        yaw: 121.35,
        pitch: -21.48,
        type: 'custom',
        text: 'Go to Library_First_Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(8)
      }
    ]
  },
  {
    id: 9,
    title: 'Library_First_Floor',
    image: `${process.env.PUBLIC_URL}/images/Library_First_Floor.jpg`,
    info: 'Bask in the serene environment of Library_First_Floor.',
    hotSpots: [
      {
        // Destination: Library_Second_Floor → Location 10 (index 9)
        yaw: 120.90,
        pitch: -7.50,
        type: 'custom',
        text: 'Go to Library_Second_Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(9)
      },
      {
        // Destination: Uni_Ground → Location 1 (index 0)
        yaw: 141.38,
        pitch: -8.40,
        type: 'custom',
        text: 'Go to Uni_Ground',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      }
    ]
  },
  {
    id: 10,
    title: 'Library_Second_Floor',
    image: `${process.env.PUBLIC_URL}/images/Library_Second_Floor.jpg`,
    info: 'Delight in the scenic beauty of Library_Second_Floor.',
    hotSpots: [
      {
        // Destination: Library_First_Floor → Location 9 (index 8)
        yaw: -116.84,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Library_First_Floor',
        handleClick: (setCurrentLocation) => setCurrentLocation(8)
      }
    ]
  },
  {
    id: 11,
    title: 'Cafe_1',
    image: `${process.env.PUBLIC_URL}/images/Cafe_1.jpg`,
    info: 'Experience the unique allure of Cafe_1.',
    hotSpots: [
      {
        // Destination: Admin_View → Location 12 (index 11)
        yaw: 83.46,
        pitch: -6.60,
        type: 'custom',
        text: 'Go to Admin_View',
        handleClick: (setCurrentLocation) => setCurrentLocation(11)
      }
    ]
  },
  {
    id: 12,
    title: 'Admin_View',
    image: `${process.env.PUBLIC_URL}/images/Admin_View.jpg`,
    info: 'Conclude your journey with the captivating views of Admin_View.',
    hotSpots: [
      {
        // Destination: Uni_Ground_Pathway_1 → Location 2 (index 1)
        yaw: 168.72,
        pitch: -4.79,
        type: 'custom',
        text: 'Go to Uni_Ground_Pathway_1',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      }
    ]
  }
];


const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(0);
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
      <HomeButton onClick={() => setCurrentLocation(0)}>Home</HomeButton>

      {/* All Views button */}
      <AllViewsButton onClick={() => setShowAllViews(true)}>All Views</AllViewsButton>

      {/* Location information box */}
      <LocationInfo>
        <h3>{currentData.title}</h3>
        <p>{currentData.info}</p>
      </LocationInfo>

      {/* 360° Panorama Viewer */}
      <Pannellum
        width="100%"
        height="100vh"
        image={currentData.image}
        pitch={10}
        yaw={180}
        hfov={110}
        autoRotate={2}
        ref={panImageRef}
        autoLoad
        onLoad={handlePanoramaLoad}
      >
        {currentData.hotSpots.map((hotspot, index) => (
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
