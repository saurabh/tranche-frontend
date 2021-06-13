import React from 'react';
import { connect } from 'react-redux';
import Notification from './Notification';
import { removeNotification } from 'redux/actions/ethereum';

const NotificationProvider = ({ Notifications, removeNotification }) => {
  return (
    <div>
      <div className='NotifyWrapper'>
        {Notifications.map((notification, i) => {
          return <Notification key={i} notification={notification} removeNotification={removeNotification} />
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  Notifications: state.ethereum.notifications
});

export default connect(mapStateToProps, {
  removeNotification
})(NotificationProvider);
