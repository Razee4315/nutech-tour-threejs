import React from 'react';
import styled from 'styled-components';

// Wrapper that holds the background image, overlay, and content.
const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
`;

// Background image with slight blur.
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/background.jpg') center center/cover no-repeat;
  filter: blur(4px);
  z-index: 1;
`;

// Semi-transparent overlay to improve text readability.
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 60, 114, 0.5);
  z-index: 2;
`;

// Main container for welcome content.
const WelcomeContainer = styled.div`
  position: relative;
  z-index: 3;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 20px;
`;

// Styled header text.
const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

// Styled subtitle text.
const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

// Styled start button.
const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #ffffff;
  color: #1e3c72;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }
`;

// Footer container for project information.
const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: white;
  line-height: 1.5;
  z-index: 3;
`;

const Welcome = ({ onStart }) => {
  return (
    <Wrapper>
      <BackgroundImage />
      <Overlay />
      <WelcomeContainer>
        <Title>Welcome to NUTECH Tour</Title>
        <Subtitle>Experience our campus in 360°</Subtitle>
        <StartButton onClick={onStart}>Start Tour</StartButton>
      </WelcomeContainer>
      <Footer>
        <div><strong>ICAT Project</strong></div>
        <div>BS AI</div>
        <div><strong>Members:</strong> Saqlain, Aleena, Sadia, Malaika, Aena</div>
        <div><strong>Supervisor:</strong> Tahreem Khalil</div>
      </Footer>
    </Wrapper>
  );
};

export default Welcome;
