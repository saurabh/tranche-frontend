import React from 'react';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import CloseModal from "assets/images/svg/closeModal.svg";
import styled from 'styled-components';
import 'react-confirm-alert/src/react-confirm-alert.css';


const customStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  content : {
    position: 'relative',
    maxWidth: '292px',
    width: '100%',
    //height: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const ModalHeader = styled.div` 
  width: 100%;
  height: 75px;
  border-bottom: 1px solid rgba(63, 63, 63, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 33px;
  & > h2{
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    color: #3F3F3F;
  }
  & > button{
    background: transparent;
    border: none;
    cursor: pointer;
  }
`

const ModalContent = styled.div`
  padding: 33px;
  display: flex;
  flex-direction: column;
  align-item: center;
  justify-content: center;
`
const BtnGrpLoanModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ModalButton = styled.button`
  width: 100%;
  height: 32px;
  background: #ECECEC;
  /*opacity: 0.75;*/
  border: 0.3px solid #ECECEC;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(236, 236, 236, 0.4);
  border-radius: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  text-transform: uppercase;
  /*color: rgba(131, 129, 134, 0.4);*/
  cursor: pointer;
  &:last-child{
    margin: 12px 0 0 0;
    color: #ffffff;
    background: #E42013;
  }
`

const ConfirmAlertWrapper = styled.div`
  position: relative;
  width: auto;
  //height: 326px;
  height: auto;
  border-radius: 16px;
  background: #ffffff;
  border: none;
  box-shadow: 0px 2px 4px rgba(99, 99, 99, 0.7);
  padding: 33px;
  & > h2{
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    color: #3F3F3F;
  }

`
const ConfirmAlertBtnWrapper = styled.div`
  display: flex;
  justify-content: space-around;
 & > button{
    max-width: 100px;
    font-size: 14px;
    font-weight: 700;
    margin: 12px 0 0 0;
 } 
`





Modal.setAppElement('#root')
 
export default function ModalLoan({modalIsOpen, closeModal}){
    const confirm = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ConfirmAlertWrapper>
                  <h2>Are you sure you want to close this loan?</h2>
                  <ConfirmAlertBtnWrapper>
                    <ModalButton onClick={onClose}>No</ModalButton>
                    <ModalButton
                      onClick={() => {
                        alert("Deleted!")
                      }}
                    >
                      Yes
                    </ModalButton>
                  </ConfirmAlertBtnWrapper>
                </ConfirmAlertWrapper>
              );
            }
          });
    }; 

 
  
 
    return (
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          
        >
          <ModalHeader>
            <h2>Settings</h2>
            <button onClick={() => closeModal()}><img src={CloseModal} alt=""/></button>
          </ModalHeader>
          <ModalContent>
            <BtnGrpLoanModal>
              <ModalButton>Adjust Collateral</ModalButton>
              <ModalButton onClick={() => confirm()}>Close Loan</ModalButton>
            </BtnGrpLoanModal>
            {/*<button onClick={() => confirm()}>confirm</button>
            <button onClick={() => closeModal()}>close</button>*/}
          </ModalContent>
        </Modal>
      </div>
    );
}
