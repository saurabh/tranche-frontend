import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { removeNotification } from 'redux/actions/NotificationToggle';
import Parser from 'html-react-parser';

const Notification = props => {
  const [exit, setExit] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const secondsRef = useRef();
  const removeNotificationVar1 = useRef();
  const removeNotificationVar2 = useRef();

  const handleStartTimer = () => {
    const timerFunction = () => {
      setSeconds(prev => prev + 1);
    }
    secondsRef.current = setInterval(() => timerFunction(), 1000)
  };


  useEffect(() =>{
    if(seconds >= 60 && seconds % 60 === 0){
      setMinutes(parseInt(seconds/60));
    }
  }, [seconds, setMinutes])

  const handleResetTimer = () => {
    clearInterval(secondsRef.current);
  };

  const handleCloseNotification = () => {
    if (!props.notification.type === 'PENDING') {
      handleResetTimer();
      setExit(true);
      setTimeout(() => {
        props.removeNotification();
      }, 400)
    }
  };
  const clearLogger = (val) => {
    return new Promise(resolve => resolve(clearTimeout(val)));
  };
  
  useEffect(() => {
    setSeconds(0);
    setMinutes(0);
    // eslint-disable-next-line
  }, [props.notification.type]);

  useEffect(() => {
    handleStartTimer();
  }, []);
  useEffect(() => {
    if(props.notification.type === "SUCCESS"){
      clearLogger(removeNotificationVar2.current).then(() => {
        removeNotificationVar1.current = setTimeout(() => {
          handleCloseNotification();
        }, 3000);
      });
    }
    else if(props.notification.type === "WAITING"){
      clearLogger(removeNotificationVar1.current).then(() => {
        removeNotificationVar2.current = setTimeout(() => {
          handleCloseNotification();
        }, 3000);
      });
    }
    // eslint-disable-next-line
  }, [props.notification.type]);

  return (
    <div
      className={`NotifyItem ${exit ? "NotifyExit" : ""}`}
    >
      <div id="NotifySvgIcon">
        {props.notification.type === "SUCCESS" ? <svg viewBox="0 0 185 168" xmlns="http://www.w3.org/2000/svg" id="el_3OA8Szq_A" className="svelte-ta62lj">
          <path d="m176.126953 63.8789062-94.4130858 95.4130858-72.87402345-72.8740232
            27.93945315-27.9394532 44.9345703 44.9345704 94.4130858-94.413086" strokeLinecap="round" strokeLinejoin="round" id="el_RzYtw9rUyN"></path>
        </svg> : (props.notification.type === "PENDING" || props.notification.type === "WAITING") ?
        <svg viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg" id="el_XWLVvD_rP" className="svelte-ta62lj">
            <g fillRule="evenodd" id="el_Uh6HOhkAVi">
              <circle cx="88" cy="88" r="88" id="el_PHAWgO26lN"></circle>
              <g strokeLinecap="round" strokeLinejoin="round" id="el_A4XF5QQwhp">
                  <g id="el_fv0z90vBrL_an_PwUBZ96LS" data-animator-group="true" data-animator-type="1">
                    <path d="m88 25v62.5878906" id="el_fv0z90vBrL"></path>
                  </g>
                  <g id="el_u3QHGLTow3_an_EQ8OetHGq" data-animator-group="true" data-animator-type="1">
                    <path d="m88 45.9160156v41.671875" id="el_u3QHGLTow3"></path>
                  </g>
              </g>
            </g>
        </svg> : props.notification.type === "REJECTED" ? 
        <svg viewBox="0 0 178 178" xmlns="http://www.w3.org/2000/svg" id="el_bYTVKD04y" className="svelte-ta62lj">
            <g fillRule="evenodd" id="el_doMgf96Cxx">
              <path d="m96.9442719 17.8885438 71.8196601 143.6393202c2.469893
                  4.939785.467649 10.946515-4.472136 13.416408-1.388554.694277-2.919685
                  1.055728-4.472136 1.055728h-143.6393201c-5.5228475
                  0-10.00000001-4.477153-10.00000001-10 0-1.552451.36145092-3.083582
                  1.05572809-4.472136l71.81966012-143.6393202c2.4698925-4.939785
                  8.4766229-6.9420284 13.4164079-4.4721359 1.935274.967637 3.5044989
                  2.5368619 4.4721359 4.4721359z" strokeLinejoin="round" id="el_5BNAI_PBsn"></path>
              <g id="el_q_eIK0z3HI_an_045tZJOHl" data-animator-group="true" data-animator-type="2">
                  <circle cx="88.5" cy="144.5" r="7.5" id="el_q_eIK0z3HI"></circle>
              </g>
              <path d="m88.5 112.413086v-39.413086" strokeLinecap="round" strokeLinejoin="round" id="el_IAuv9ut-2-"></path>
            </g>
        </svg>
        : ""}
      </div>
      <div id="NotifyText">
        <p>{Parser(props.notification.message)}</p>
        <span>
         {new Date().toLocaleTimeString([], {timeStyle: 'short'})} {(props.notification.type === "PENDING" || props.notification.type === "WAITING")? <span>- <svg width="15px" height="16px" viewBox="0 0 15 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="svelte-1c9mzro">
                       <g id="Notify-Style-Concepts" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <path d="M7.06681227,1.92484595 C10.9634297,1.92484595 14.1336806,5.03922755
                             14.1336806,8.86724251 C14.1336806,12.6953675 10.9634297,15.8096941
                             7.06681227,15.8096941 C3.17019489,15.8096941 1.66977543e-13,12.6953675
                             1.66977543e-13,8.86724251 C1.66977543e-13,5.03922755 3.17019489,1.92484595
                             7.06681227,1.92484595 Z M7.06681227,13.5248129 C9.68105959,13.5248129
                             11.8078517,11.4354643 11.8078517,8.8672425 C11.8078517,8.25643705
                             11.6862119,7.67319541 11.4676859,7.13820421 L7.06334005,8.88946962
                             L7.06334005,4.20972711 C4.45066084,4.2115977 2.32577285,6.30028608
                             2.32577285,8.86724251 C2.32577285,11.4354643 4.45256495,13.5248129
                             7.06681227,13.5248129 Z M5.53007392,1.22124533e-14
                             L8.61626343,1.22124533e-14 L8.61626343,1.6696743 L5.53007392,1.6696743
                             L5.53007392,1.22124533e-14 Z" id="transaction-timer" fill="#AEAEAE" fillRule="nonzero"></path>
                       </g>
                    </svg> {seconds > 60 ? minutes : seconds} {seconds > 60 ? 'min' : 'sec'}</span> : ""}

        </span>
      </div>
      <div id="NotifyCloseIcon" onClick={handleCloseNotification}>
        <svg height="8" viewBox="0 0 12 12" width="8" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#9B9B9B" strokeLinecap="square" strokeWidth="2" transform="translate(2 2)" style={{transition: 'stroke 150ms ease-in-out 0s'}}>
              <path d="m.1.1 7.82304289 7.82304289"></path>
              <path d="m.1.1 7.82304289 7.82304289" transform="matrix(-1 0 0 1 8 0)"></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  NotificationToggle: state.NotificationToggle
});

export default connect(mapStateToProps, {
  removeNotification
})(Notification);