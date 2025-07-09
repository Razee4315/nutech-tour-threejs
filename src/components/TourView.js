import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import R3FPanorama from './R3FPanorama';

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
   Satellite Map Component - replaces Location Info Box
------------------------------------- */
const SatelliteMapContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
  width: 350px;
  height: 280px;
  background-color: rgba(20, 20, 20, 0.85);
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const MapHeader = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const MapImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
`;

const SatelliteImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
`;

const LocationMarker = styled.button`
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: #ff4444;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: scale(1.4);
    background-color: #ff6666;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  }
  
  &.current {
    background-color: #44ff44;
    width: 18px;
    height: 18px;
    border: 3px solid #fff;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(68, 255, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(68, 255, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(68, 255, 68, 0);
    }
  }
`;

const MarkerTooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 20;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  ${LocationMarker}:hover & {
    opacity: 1;
    visibility: visible;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const FullMapButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 15;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(0, 0, 0, 0.85);
    transform: scale(1.05);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  }
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
   All Views button positioned at bottom right with hover container
------------------------------------- */
const AllViewsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
`;

const AllViewsButton = styled(GlassButton)`
  position: relative;
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
   Container for the "All Views" hover dropdown - glassmorphism theme
------------------------------------- */
const ViewsHoverDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  padding: 20px;
  width: 450px;
  max-height: 70vh;
  overflow-y: auto;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transform: ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(10px)')};
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 20px;
    border: 8px solid transparent;
    border-top-color: rgba(255, 255, 255, 0.35);
  }

  h3 {
    margin: 0 0 15px 0;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }
`;

/* ----------------------------------
   Removed ViewsModalContent - now using ViewsHoverDropdown
------------------------------------- */

/* ----------------------------------
   Grid container for view cards
------------------------------------- */
const ViewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-top: 15px;
`;

/* ----------------------------------
   Styled card for each view (glassmorphism style)
------------------------------------- */
const ViewCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  overflow: hidden;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px) scale(1.03);
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
  border-radius: 8px 8px 0 0;
`;

/* ----------------------------------
   Card title styling for each view card
------------------------------------- */
const CardTitle = styled.div`
  padding: 6px 8px;
  color: #000;
  font-weight: 600;
  font-size: 11px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
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
   Satellite Map Component for location navigation
------------------------------------- */
const SatelliteMapComponent = ({ currentLocation, locations, onLocationChange }) => {
  // Define accurate positions for each location based on the satellite image
  // These positions are percentages (0-100) from top-left corner
  // Updated with precise coordinates from coordinate finder tool
  const locationPositions = {
    0: { top: 79.22, left: 49.18 }, // Point 1  Main entrance
    1: { top: 63.85, left: 46.99 }, // Point 2  Main Walkway
    2: { top: 63.13, left: 34.02 }, // Point 3  Campus pathway 
    3: { top: 48.33, left: 24.18 }, // Point 4  Academic block
    4: { top: 13.85, left: 51.09 }, // Point 5  Admin Pathway
    5: { top: 13.13, left: 42.08 }, // Point 6  Admin Block
    6: { top: 23.91, left: 24.04 }, // Point 7  Campus View Point
  };

  return (
    <SatelliteMapContainer>
      <MapHeader>
        University Campus Map
      </MapHeader>
      <MapImageContainer>
        {/* Real satellite image of NUTECH campus */}
        <SatelliteImage 
          src={`${process.env.PUBLIC_URL}/images/satellite_img.png`} 
          alt="NUTECH University Campus Satellite View" 
          onError={(e) => {
            // Fallback to placeholder text if image fails to load
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div style="padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.4;">
                📍 Interactive Campus Map<br/>
                <small>Click markers to navigate</small><br/>
                <small style="color: #aaa; font-size: 11px;">
                  Loading satellite image...<br/>
                  ${locations[currentLocation]?.title}
                </small>
              </div>
            `;
          }}
        />
        
        {/* Render location markers */}
        {locations.map((location, index) => {
          const position = locationPositions[index] || { top: 50, left: 50 };
          const isCurrentLocation = index === currentLocation;
          
          return (
            <LocationMarker
              key={location.id}
              className={isCurrentLocation ? 'current' : ''}
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`
              }}
              onClick={() => onLocationChange(index)}
            >
              <MarkerTooltip>
                {location.title}
                {isCurrentLocation && ' (Current)'}
              </MarkerTooltip>
            </LocationMarker>
          );
        })}
        
        {/* Full Map button */}
        <FullMapButton 
          onClick={() => window.open('https://earth.google.com/web/search/NUTECH+University+Islamabad,+Karnal+Sher+Khan+Shaheed+Road,+I-12,+Islamabad/@33.6258115,73.0115244,522.55728268a,689.68427761d,35y,318.55494546h,0t,0r/data=CnMaRRI_CiUweDM4ZGY5NTYxYTMwNmMwYzU6MHg5OWFkNGYwNDIwMTM3ZTg3KhZOYXRpb25hbCBVbml2ZXJzaXR5IG9mGAIgASImCiQJt9AhbOrPQEAREkxPEATPQEAZRfvRtlpBUkAhTBm_qjpAUkBCAggBOgMKATBCAggASg0I____________ARAA?authuser=0', '_blank')}
        >
          Full Map
        </FullMapButton>
      </MapImageContainer>
    </SatelliteMapContainer>
  );
};

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
        text: 'Secondary entrance to the Admin Block.'
      },
      {
        yaw: -77.67,
        pitch: -0.34,
        type: 'info',
        text: 'Lab Block: Contains specialized labs for practical learning.'
      },
      {
        yaw: -3.79,
        pitch: 12.55,
        type: 'info',
        text: 'Academic Block: Consists of lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: 63.72,
        pitch: 6.50,
        type: 'info',
        text: 'Khalid Office Block'
      },
      {
        yaw: -129.24,
        pitch: 1.15,
        type: 'info',
        text: 'Habib ATM (HBL): On-campus ATM facility for banking services.'
      },
      {
        yaw: -42.96,
        pitch: 5.61,
        type: 'info',
        text: 'Boys\' Cafeteria: Dining area designated for male students.'
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
        text: 'Lab Block: Houses various engineering and computing labs for practical sessions.'
      },
      {
        yaw: 4.64,
        pitch: 11.56,
        type: 'info',
        text: 'Academic Block: Contains lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: -38.50,
        pitch: 1.65,
        type: 'info',
        text: 'Parking area designated for faculty members.'
      },
      {
        yaw: 36.87,
        pitch: 15.53,
        type: 'info',
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
        text: 'NUtech Main Exit Point.'
      },
      {
        yaw: 86.96,
        pitch: 13.55,
        type: 'info',
        text: 'CTTI Building.'
      },
      {
        yaw: 46.79,
        pitch: 3.63,
        type: 'info',
        text: 'Friendship Park: A recreational space for students.'
      },
      
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
        text: 'Main entrance to the Admin Block.'
      },
      {
        yaw: -97.01,
        pitch: 42.31,
        type: 'info',
        text: 'NUtech Tower: One of the prominent buildings on campus.'
      },
      {
        yaw: -158.00,
        pitch: 5.12,
        type: 'info',
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
        text: 'Admin Block: Central hub for university administration and student services.'
      },
      {
        yaw: 54.23,
        pitch: -7.78,
        type: 'info',
        text: 'Ground: Open space for sports and student activities.'
      },
      {
        yaw: 93.90,
        pitch: 18.01,
        type: 'info',
        text: 'Academic Block: Includes lecture halls, classrooms, and faculty offices.'
      },
      {
        yaw: 115.37,
        pitch: 0.43,
        type: 'info',
        text: 'Khalid Block: Under development for future expansion.'
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
        text: 'CTTI Main Building: Central facility of CTTI.'
      },
      {
        yaw: -32.55,
        pitch: 0.16,
        type: 'info',
        text: 'Friendship Park: A recreational area for students.'
      },
      {
        yaw: 54.73,
        pitch: 1.65,
        type: 'info',
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
        text: 'Student Facilitation Desk: Provides information and support for students.'
      },
      {
        yaw: 24.18,
        pitch: 3.33,
        text: 'Way to classrooms and computer labs.'
      },
      {
        yaw: 79.22,
        pitch: -3.44,
        type: 'info',
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
        text: 'Conference Room: Reserved for meetings, discussions, and presentations.'
      },
      {
        yaw: -107.10,
        pitch: -2.99,
        type: 'info',
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
        text: 'Main entrance to the auditorium.'
      },
      {
        yaw: -48.42,
        pitch: 8.09,
        type: 'info',
        text: 'Entrance to the Faculty and Girls\' Café.'
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
        text: 'NUtech Entrance: Students must present their student ID for verification.'
      },
      {
        yaw: 40.15,
        pitch: 0.50,
        type: 'info',
        text: 'CTTI Entrance: Access for CTTI students upon student ID verification.'
      },
      {
        yaw: 99.25,
        pitch: 2.76,
        type: 'info',
        text: 'Designated student parking area.'
      },
      {
        yaw: -87.97,
        pitch: -0.85,
        type: 'info',
        text: 'Vehicle checkpost for security inspection.'
      },
      {
        yaw: -130.38,
        pitch: -2.66,
        type: 'info',
        text: 'Main IJP Road, Islamabad.'
      },
      {
        yaw: -2.44,
        pitch: -21.58,
        type: 'start',
        text: 'START'
      },
      {
        yaw: -2.26,
        pitch: -13.82,
        type: 'arrow',
        text: '↑'
      }
    ]
  }
];

const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(13); // Start at Main Entrance
  const [visitHistory, setVisitHistory] = useState([13]); // Track visited locations
  const [isLoading, setIsLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ $show: false, title: '', message: '' });
  const [showAllViewsHover, setShowAllViewsHover] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

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
    // Location tracking for visit history management
  }, [currentLocation, visitHistory]);

  const currentData = locations[currentLocation];

  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === 'custom' && hotspot.handleClick) {
      hotspot.handleClick(setCurrentLocation);
    }
  };

  useEffect(() => {
    if (visitHistory.length === 1 && visitHistory[0] === currentLocation) {
      return;
    }
    
    if (visitHistory[visitHistory.length - 1] !== currentLocation) {
      setVisitHistory(prevHistory => [...prevHistory, currentLocation]);
    }
  }, [currentLocation, visitHistory]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const goToPreviousLocation = () => {
    if (visitHistory.length > 1) {
      const newHistory = [...visitHistory];
      newHistory.pop();
      const previousLocation = newHistory[newHistory.length - 1];
      
      setCurrentLocation(previousLocation);
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

  // Handle hover with smooth delay
  const handleAllViewsEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowAllViewsHover(true);
  };

  const handleAllViewsLeave = () => {
    const timeout = setTimeout(() => {
      setShowAllViewsHover(false);
    }, 200); // Small delay to allow mouse movement to dropdown
    setHoverTimeout(timeout);
  };

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
        setVisitHistory([13]);
      }}>Main Entrance</HomeButton>

      <AllViewsContainer
        onMouseEnter={handleAllViewsEnter}
        onMouseLeave={handleAllViewsLeave}
      >
        <AllViewsButton>All Views</AllViewsButton>
        <ViewsHoverDropdown $show={showAllViewsHover}>
          <h3>Quick View Selection</h3>
          <ViewGrid>
            {locations.map((loc, index) => (
              <ViewCard
                key={loc.id}
                onClick={() => {
                  if (index !== currentLocation) {
                    setCurrentLocation(index);
                  }
                  setShowAllViewsHover(false);
                }}
              >
                <Thumbnail src={loc.image} alt={loc.title} />
                <CardTitle>{loc.title}</CardTitle>
              </ViewCard>
            ))}
          </ViewGrid>
        </ViewsHoverDropdown>
      </AllViewsContainer>

             {/* Interactive Satellite Map Component */}
       <SatelliteMapComponent 
         currentLocation={currentLocation} 
         locations={locations}
         onLocationChange={setCurrentLocation}
       />

      {currentData && currentData.image && (
        <R3FPanorama
          image={currentData.image}
          initialPitch={currentData.initialPitch || 0}
          initialYaw={currentData.initialYaw || 0}
          hfov={currentData.hfov || 110}
          autoRotate={currentData.autoRotate !== undefined ? currentData.autoRotate : false}
          autoRotateSpeed={currentData.autoRotateSpeed || 0.005}
          hotSpots={currentData.hotSpots.filter((hotspot) => !hotspot.fixed)}
          onHotspotClick={handleHotspotClick}
          onLoad={handlePanoramaLoad}
          showHotspots={!showAllViewsHover}
        />
      )}

      {!showAllViewsHover && currentData.hotSpots
        .filter((hotspot) => hotspot.fixed)
        .map((hotspot, index) => (
          <FixedHotspot
            key={index}
            onClick={() => handleHotspotClick(hotspot)}
          >
            {hotspot.text}
          </FixedHotspot>
        ))}

      {visitHistory.length > 1 && (
        <NavButtonContainer>
          <NavigationButton onClick={goToPreviousLocation}>
            Previous Location
          </NavigationButton>
        </NavButtonContainer>
      )}

      <InfoModal
        $show={modalInfo.$show}
        onClose={closeModal}
        title={modalInfo.title}
        message={modalInfo.message}
      />

      {/* Removed old modal - now using hover dropdown */}

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

      <style>
        {/* Remove Pannellum-specific CSS */}
        {/* 
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
        */}
        {`
          /* Any remaining global styles needed can stay here */
          /* For instance, if you have body overflow hidden or other app-wide styles */
        `}
      </style>
    </ViewerContainer>
  );
};

export default TourView;