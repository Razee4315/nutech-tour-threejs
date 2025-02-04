import React from 'react';
import styled from 'styled-components';

// Outer container with relative positioning
const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
`;

// Background image with a light blur effect
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/background.jpg') center center/cover no-repeat;
  filter: blur(3px);
  transform: scale(1.05); /* Slight scale to hide blur edges */
  z-index: 1;
`;

// A semi-transparent overlay with a subtle dark gradient for improved contrast
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 100%);
  z-index: 2;
`;

// Main content container centered on screen
const Content = styled.div`
  position: relative;
  z-index: 3;
  height: 100%;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fdfdfd;
`;

// Professional title styling
const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
`;

// Clean subtitle styling
const Subtitle = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  margin-bottom: 2rem;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
`;

// Glass-effect style button with modern hover animation
const StartButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
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
    transform: translateY(-3px) scale(1.03);
    background: rgba(255, 255, 255, 0.25);
  }
`;

// Footer container with project information
const Footer = styled.footer`
  position: absolute;
  bottom: 30px;
  width: 100%;
  z-index: 3;
  text-align: center;
  color: #fdfdfd;
  font-size: 0.9rem;
  line-height: 1.4;
  padding: 0 20px;
`;

// Bold labels within the footer for emphasis
const Bold = styled.span`
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const Welcome = ({ onStart }) => {
  return (
    <Wrapper>
      <BackgroundImage />
      <Overlay />
      <Content>
        <Title>Welcome to NUTECH Tour</Title>
        <Subtitle>Experience our campus in 360°</Subtitle>
        <StartButton onClick={onStart}>Start Tour</StartButton>
      </Content>
      <Footer>
        <div>
          <Bold>ICAT Project</Bold>
        </div>
        <div>BS AI</div>
        <div>
          <Bold>Members:</Bold> Saqlain, Aleena, Sadia, Malaika, Aena
        </div>
        <div>
          <Bold>Supervisor:</Bold> Tahreem Khalil
        </div>
      </Footer>
    </Wrapper>
  );
};

export default Welcome;
