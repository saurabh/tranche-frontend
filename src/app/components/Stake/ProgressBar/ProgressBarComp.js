import React from "react";
import styled from 'styled-components';
const ProgressBarContainer = styled.div`
    height: 5px;
    width: ${props => props.widthBar}%;    
    background-color: ${props => props.colorOne};
    border-radius: 100px;
`;
const Progress = styled.div`
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${props => props.colorTwo};
    transition: width 1s ease-in-out;
    border-radius: inherit;
    text-align: right;
`;
const ProgressBarComp = ({ widthBar, colorOne, colorTwo, progress }) => {
  return (
    <ProgressBarContainer widthBar={widthBar} colorOne={colorOne}>
      <Progress progress={progress} colorTwo={colorTwo}>
      </Progress>
    </ProgressBarContainer>
  );
};

export default ProgressBarComp;
