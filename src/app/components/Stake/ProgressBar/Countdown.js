import React, { useState, useEffect } from "react";
import {
    Countdown
} from '../Header/styles/HeaderComponents';
import { StakingAddresses } from 'config';

import { epochTimeRemaining } from 'services/contractMethods';
import i18n from '../../locale/i18n';
import moment from 'moment';
import { ModeThemes } from "config";

const CountdownWrapper = ({ modal, theme }) => {
  const [timerData, setTimerData] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
        setTimerData(final);
      }, 1000);

      return () => clearInterval(interval);
    };
    setEpochTime();
  }, []);
  return (
    <Countdown modal={modal} textColor={ModeThemes[theme].ModalText}>
        <h2>
        {timerData && timerData.days}
        <span>{i18n.t('days')}</span>
        </h2>
        <h2>
        {timerData && timerData.hours}
        <span>{i18n.t('hours')}</span>
        </h2>
        <h2>
        {timerData && timerData.minutes}
        <span>minutes</span>
        </h2>
        <h2>
        {timerData && timerData.seconds}
        <span>seconds</span>
        </h2>
    </Countdown>
  );
};

export default CountdownWrapper;
