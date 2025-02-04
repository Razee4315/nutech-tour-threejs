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
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  max-width: 300px;
`;

// Fullscreen toggle button at top right
const FullscreenButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  background-color: rgba(20, 20, 20, 0.85);
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);

  &:hover {
    background-color: rgba(20, 20, 20, 1);
  }
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

// Navigation button styles
const NavigationButton = styled.button`
  padding: 12px 24px;
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);

  &:hover {
    transform: scale(1.05);
    background-color: #f0f0f0;
  }
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

// Button to close the modal
const ModalCloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
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
   
   Each location object contains:
     - id: Unique identifier
     - title: Location title
     - image: URL to the 360° image
     - info: Short description of the location
     - hotSpots: Array of hotspot objects

   Each hotspot object should contain:
     - pitch: The vertical angle (for positioning within the panorama)
     - yaw: The horizontal angle (for positioning within the panorama)
     - type: 'custom' for navigation or 'info' for displaying info
     - text: Label displayed for the hotspot
     - handleClick: A function that handles the hotspot click event.  
       If set to null, a default modal displaying info will appear.
       
   *To add or modify a hotspot, edit the corresponding object in the hotSpots array.*
--------------------------------------------------------------------------- */
const locations = [
  {
    id: 1,
    title: 'First Location',
    image: '/images/1.jpg',
    info: 'Welcome to the first 360° experience.',
    hotSpots: [
      {
        // Hotspot for navigating to the second location
        pitch: -10,
        yaw: 0,
        type: 'custom',
        text: 'Go to Second Image',
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(1);
        }
      },
      {
        // Hotspot for displaying additional information
        pitch: 15,
        yaw: 90,
        type: 'info',
        text: 'THis is more info about the info in the first image',
        handleClick: null // This will trigger the modal popup
      }
    ]
  },
  {
    id: 2,
    title: 'Second Location',
    image: '/images/2.jpg',
    info: 'Discover the second immersive environment.',
    hotSpots: [
      {
        // Hotspot for returning to the first location
        pitch: 0,
        yaw: 180,
        type: 'custom',
        text: 'Return to First Image',
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(0);
        }
      }
    ]
  }
];

const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });
  const panImageRef = useRef(null);

  // Destructure the current location data for ease of access
  const currentData = locations[currentLocation];

  // Navigation handlers for switching locations
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

  // Default handler for hotspots that do not have a custom action: display modal
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
        pitch={10} // Initial pitch (vertical view) for the panorama
        yaw={180}  // Initial yaw (horizontal view) for the panorama
        hfov={110}
        autoRotate={2}  // Fixed auto-rotate speed
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
              // If a custom hotspot action is provided, execute it; otherwise, show modal
              if (hotspot.handleClick) {
                hotspot.handleClick(setCurrentLocation);
              } else {
                handleHotspotInfo(hotspot);
              }
            }}
          />
        ))}
      </Pannellum>

      {/* Navigation buttons container */}
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
