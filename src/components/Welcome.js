import React from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

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

const Welcome = ({ onStart }) => {
  return (
    <WelcomeContainer>
      <Title>Welcome to NUTECH Tour</Title>
      <Subtitle>Experience our campus in 360°</Subtitle>
      <StartButton onClick={onStart}>Start Tour</StartButton>
    </WelcomeContainer>
  );
};

export default Welcome;
