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
    title: 'Location 1',
    image: `${process.env.PUBLIC_URL}/images/1.jpg`,
    info: 'Explore the vibrant atmosphere of Location 1.',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Location 2',
        handleClick: (setCurrentLocation) => setCurrentLocation(1)
      },
      {
        pitch: 15,
        yaw: 90,
        type: 'info',
        text: 'Learn More',
        handleClick: null
      }
    ]
  },
  {
    id: 2,
    title: 'Location 2',
    image: `${process.env.PUBLIC_URL}/images/2.jpg`,
    info: 'Step into the serene views of Location 2.',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Location 3',
        handleClick: (setCurrentLocation) => setCurrentLocation(2)
      },
      {
        pitch: 10,
        yaw: 80,
        type: 'info',
        text: 'More Details',
        handleClick: null
      }
    ]
  },
  {
    id: 3,
    title: 'Location 3',
    image: `${process.env.PUBLIC_URL}/images/3.jpg`,
    info: 'Discover the historical charm of Location 3.',
    hotSpots: [
      {
        pitch: -12,
        yaw: 5,
        type: 'custom',
        text: 'Go to Location 4',
        handleClick: (setCurrentLocation) => setCurrentLocation(3)
      },
      {
        pitch: 18,
        yaw: 70,
        type: 'info',
        text: 'View Info',
        handleClick: null
      }
    ]
  },
  {
    id: 4,
    title: 'Location 4',
    image: `${process.env.PUBLIC_URL}/images/4.jpg`,
    info: 'Immerse yourself in the beauty of Location 4.',
    hotSpots: [
      {
        pitch: -8,
        yaw: 15,
        type: 'custom',
        text: 'Go to Location 5',
        handleClick: (setCurrentLocation) => setCurrentLocation(4)
      },
      {
        pitch: 12,
        yaw: 95,
        type: 'info',
        text: 'Discover More',
        handleClick: null
      }
    ]
  },
  {
    id: 5,
    title: 'Location 5',
    image: `${process.env.PUBLIC_URL}/images/5.jpg`,
    info: 'Witness breathtaking scenes at Location 5.',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Location 6',
        handleClick: (setCurrentLocation) => setCurrentLocation(5)
      },
      {
        pitch: 14,
        yaw: 85,
        type: 'info',
        text: 'More Info',
        handleClick: null
      }
    ]
  },
  {
    id: 6,
    title: 'Location 6',
    image: `${process.env.PUBLIC_URL}/images/6.jpg`,
    info: 'Experience the dynamic energy of Location 6.',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Location 7',
        handleClick: (setCurrentLocation) => setCurrentLocation(6)
      },
      {
        pitch: 16,
        yaw: 100,
        type: 'info',
        text: 'Learn More',
        handleClick: null
      }
    ]
  },
  {
    id: 7,
    title: 'Location 7',
    image: `${process.env.PUBLIC_URL}/images/7.jpg`,
    info: 'Conclude your tour with the stunning Location 7.',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Back to Location 1',
        handleClick: (setCurrentLocation) => setCurrentLocation(0)
      },
      {
        pitch: 20,
        yaw: 110,
        type: 'info',
        text: 'Final Info',
        handleClick: null
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
