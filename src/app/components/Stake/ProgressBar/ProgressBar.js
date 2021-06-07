import React from "react";
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
    height: 5px;
    width: 90%;
    background-color: rgba(255,255,255,0.5);
    border-radius: 100px;
`;
const Progress = styled.div`
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #FFFFFF;
    transition: width 1s ease-in-out;
    border-radius: inherit;
    text-align: right;
`;
const ProgressBar = ({ progress }) => {

  return (
    <ProgressBarContainer>
      <Progress progress={progress}>
      </Progress>
    </ProgressBarContainer>
  );
};

export default ProgressBar;
