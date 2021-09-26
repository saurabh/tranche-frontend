import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { StakingAddresses } from 'config';

import { epochTimeRemaining } from 'services/contractMethods';
import moment from 'moment';
import ProgressBarComp from './ProgressBarComp';
const ProgressBar = ({ widthBar, colorOne, colorTwo }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const setEpochTime = async () => {
      const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
      let dateTime = result;
      const interval = setInterval(() => {
        if (dateTime > 0) {
          dateTime -= 1;
        } else {
          const setTime = async () => {
            const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
            dateTime = result;
          };
          setTime();
        }
        setProgress(100 - (100 * dateTime) / 604800);
        let current = moment.unix(moment().unix());
        let date = moment.unix(moment().unix() + dateTime);
        let time = date - current;
        let duration = moment.duration(time);
        let days = duration.days();
        let hours = duration.hours();
        let minutes = duration.minutes();
        let seconds = duration.seconds();
        let final = {
          days,
          hours,
          minutes,
          seconds
        };
      }, 1000);

      return () => clearInterval(interval);
    };
    setEpochTime();
  }, []);
  return (
    <ProgressBarComp widthBar={widthBar} colorOne={colorOne} progress={progress} colorTwo={colorTwo}/>
  );
};

export default ProgressBar;
