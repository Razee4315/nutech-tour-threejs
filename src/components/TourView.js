import React, { useState, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
`;

const LocationInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  z-index: 2000;
`;

const NavigationButton = styled.button`
  position: absolute;
  bottom: 20px;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
  z-index: 1000;

  &:hover {
    transform: scale(1.05);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }
`;

const locations = [
  {
    id: 1,
    title: 'First Location',
    image: '/images/1.jpg',
    info: 'Welcome to the First Image',
    hotSpots: [
      {
        pitch: -10,
        yaw: 0,
        type: "custom",
        text: "Go to Second Image",
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(1);  // Explicitly pass the location change function
        }
      },
      {
        pitch: 15,
        yaw: 90,
        type: "info",
        text: "Information Point",
        handleClick: () => {
          alert("Welcome to our virtual tour!");
        }
      },
      {
        pitch: 30,
        yaw: -45,
        type: "custom",
        text: "Explore More",
        handleClick: () => {
          console.log("Exploring more details");
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Second Location',
    image: '/images/2.jpg',
    info: 'Welcome to the Second Image',
    hotSpots: [
      {
        pitch: 0,
        yaw: 180,
        type: "custom",
        text: "Return to First Image",
        handleClick: (setCurrentLocation) => {
          setCurrentLocation(0);  // Explicitly pass the location change function
        }
      },
      {
        pitch: 20,
        yaw: 90,
        type: "info",
        text: "Location Details",
        handleClick: () => {
          alert("You are viewing the second image!");
        }
      }
    ]
  }
];

const TourView = () => {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);
  const panImage = React.useRef(null);

  const handleMouseUp = (event) => {
    if (panImage.current) {
      const coords = panImage.current.getViewer().mouseEventToCoords(event);
      setPitch(coords[0]);
      setYaw(coords[1]);
    }
  };

  return (
    <ViewerContainer>
      <LocationInfo>
        <h3>{locations[currentLocation].title}</h3>
        <p>{locations[currentLocation].info}</p>
        <p>Pitch: {pitch.toFixed(2)} | Yaw: {yaw.toFixed(2)}</p>
      </LocationInfo>

      <Pannellum
        width='100%'
        height='100vh'
        image={locations[currentLocation].image}
        pitch={10}
        yaw={180}
        hfov={110}
        autoRotate={2}
        onMouseup={handleMouseUp}
        ref={panImage}
      >
        {locations[currentLocation].hotSpots.map((hotspot, index) => (
          <Pannellum.Hotspot
            key={index}
            type={hotspot.type}
            pitch={hotspot.pitch}
            yaw={hotspot.yaw}
            text={hotspot.text}
            handleClick={() => {
              if (hotspot.handleClick) {
                hotspot.handleClick(setCurrentLocation);
              }
            }}
          />
        ))}
      </Pannellum>
      {locations.length > 1 && (
        <>
          <NavigationButton className="prev" onClick={() => setCurrentLocation((prev) => (prev - 1 + locations.length) % locations.length)}>
            Previous Location
          </NavigationButton>
          <NavigationButton className="next" onClick={() => setCurrentLocation((prev) => (prev + 1) % locations.length)}>
            Next Location
          </NavigationButton>
        </>
      )}
    </ViewerContainer>
  );
};

export default TourView;
