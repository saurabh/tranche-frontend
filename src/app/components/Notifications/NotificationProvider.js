import React from "react";
import { connect } from 'react-redux';
import Notification from "./Notification";
import { removeNotification } from 'redux/actions/NotificationToggle';

const NotificationProvider = ({ NotificationToggle, removeNotification }) => {

  return(
    <div>
      <div className="NotifyWrapper">
        {NotificationToggle.map((note, index) => {
          return <Notification removeNotification={removeNotification} key={index} {...note} />
        })}
      </div>
    </div>
  )
};


const mapStateToProps = (state) => ({
  NotificationToggle: state.NotificationToggle
});

export default connect(mapStateToProps, {
  removeNotification
})(NotificationProvider);