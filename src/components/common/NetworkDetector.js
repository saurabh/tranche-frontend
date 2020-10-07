import React, { Component } from 'react';
import JibrelLogo from "assets/images/svg/JibrelLogo.svg";
import JibrelLogoError from "assets/images/svg/JibrelLogoError.svg";
import closeModal from "assets/images/svg/closeModal.svg";
export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false,
      showNotification: false
    }

    componentDidMount() {
      this.handleConnectionChange();
      window.addEventListener('online', this.handleConnectionChange);
      window.addEventListener('offline', this.handleConnectionChange);
    }

    componentWillUnmount() {
      window.removeEventListener('online', this.handleConnectionChange);
      window.removeEventListener('offline', this.handleConnectionChange);
    }


    handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      if (condition === 'online') {
        const webPing = setInterval(
          () => {
            fetch('//google.com', {
              mode: 'no-cors',
              })
            .then(() => {
              this.setState({ isDisconnected: false, showNotification: false }, () => {
                return clearInterval(webPing)
              });
            }).catch(() => this.setState({ isDisconnected: true, showNotification: true }) )
          }, 1000);
        return;
      }

      return this.setState({ isDisconnected: true, showNotification: true });
    }

    closeNotification = (e) =>{
        e.preventDefault();
        this.setState({showNotification: false})
    }

    render() {
      const { isDisconnected, showNotification } = this.state;
      return (
        <div>
          { (isDisconnected && showNotification) && (<div className="internet-error">
              <div className="internet-notification-wrapper offline">
                <div className="closeNotification">
                    <button onClick={(e) => this.closeNotification(e)}><img src={closeModal} alt=""/></button>
                </div>
                <div className="notification-content">
                    <div className="notification-logo">
                        <img src={JibrelLogoError} alt=""/>
                    </div>
                    <div className="notification-text">
                        <h2>Internet Disconnected</h2>
                    </div>
                </div>
              </div>
            </div>)
          }
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  return NetworkDetector;
}