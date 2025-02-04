import React, { useState, useRef } from 'react';
import { Pannellum } from 'pannellum-react';
import styled, { keyframes } from 'styled-components';

// Spinner keyframes for loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Main viewer container with a dark background
const ViewerContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #000;
`;

// Styled info box at top left (displays location title and description)
const LocationInfo = styled.div`
  position: absolute;
  top: 5px;
  left: 40px;
  background-color: rgba(20, 20, 20, 0.85);
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  max-width: 300px;
`;

// Glassmorphism style for buttons
const GlassButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #fdfdfd;
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

// Fullscreen toggle button at top right (ensuring it stays visible)
const FullscreenButton = styled(GlassButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  font-size: 0.9rem;
  border-radius: 20px;
  z-index: 1100;
`;

// Loading overlay with a spinner
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

// Navigation container for previous and next buttons, positioned at the bottom center
const NavButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 20px;
`;

// Navigation buttons using the glass style
const NavigationButton = styled(GlassButton)`
  padding: 12px 24px;
  font-size: 1rem;
`;

// Modal overlay for displaying hotspot information
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
`;

// Modal content styling
const ModalContent = styled.div`
  background: #fff;
  color: #333;
  padding: 24px 32px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

// Modal close button using glass style for consistency
const ModalCloseButton = styled(GlassButton)`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 0.9rem;
  background: rgba(20, 20, 20, 0.15);
  border: 1px solid rgba(20, 20, 20, 0.3);
  color: #fdfdfd;

  &:hover {
    background: rgba(20, 20, 20, 0.25);
  }
`;

// Reusable modal component for hotspot information
const InfoModal = ({ show, onClose, title, message }) => (
  <ModalOverlay show={show}>
    <ModalContent>
      {title && <h3>{title}</h3>}
      <p>{message}</p>
      <ModalCloseButton onClick={onClose}>Close</ModalCloseButton>
    </ModalContent>
  </ModalOverlay>
);

/* ---------------------------------------------------------------------------
   Tour location data and hotspot configuration:
   Each location object now contains exactly two hotspots:
     - One hotspot for navigation (next image)
     - One hotspot for displaying info
--------------------------------------------------------------------------- */
const locations = [
  {
    id: 1,
    title: 'First Location',
    image: 'https://razee4315.github.io/nutech-tour/images/1.jpg',
    info: 'Welcome to the first 360° experience.',
    hotSpots: [
      {
        // Navigation hotspot: go to second location
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Next Image',
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(1);
        }
      },
      {
        // Info hotspot: display modal information
        pitch: 15,
        yaw: 90,
        type: 'info',
        text: 'More Info',
        handleClick: null // Triggers default modal
      }
    ]
  },
  {
    id: 2,
    title: 'Second Location',
    image: 'https://razee4315.github.io/nutech-tour/images/2.jpg',
    info: 'Discover the second immersive environment.',
    hotSpots: [
      {
        // Navigation hotspot: loop back to first location
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Next Image',
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(0);
        }
      },
      {
        // Info hotspot: display modal information
        pitch: 15,
        yaw: 90,
        type: 'info',
        text: 'More Info',
        handleClick: null // Triggers default modal
      }
    ]
  }
];

const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });
  const panImageRef = useRef(null);

  // Get current location data
  const currentData = locations[currentLocation];

  // Navigation handlers (optional if using external navigation buttons)
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

  return (
    <ViewerContainer>
      {/* Loading overlay with spinner */}
      <LoadingOverlay isLoading={isLoading}>
        <Spinner />
      </LoadingOverlay>

      {/* Fullscreen toggle button */}
      <FullscreenButton onClick={toggleFullscreen}>
        Fullscreen
      </FullscreenButton>

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
        pitch={10} // Initial pitch
        yaw={180}  // Initial yaw
        hfov={110}
        autoRotate={2}  // Auto-rotate speed
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

      {/* Optional external navigation buttons */}
      {locations.length > 1 && (
        <NavButtonContainer>
          <NavigationButton onClick={goToPreviousLocation}>
            Previous Location
          </NavigationButton>
          <NavigationButton onClick={goToNextLocation}>
            Next Location
          </NavigationButton>
        </NavButtonContainer>
      )}

      {/* Info modal for hotspots */}
      <InfoModal
        show={modalInfo.show}
        onClose={closeModal}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </ViewerContainer>
  );
};

export default TourView;
