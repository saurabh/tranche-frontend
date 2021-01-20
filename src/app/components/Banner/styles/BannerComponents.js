import styled from 'styled-components';


const BannerWrapper = styled.div` 
  position: relative;
  background: #f7f7f7;
  z-index: 2000;
`
const BannerContent = styled.div` 
  width: 100%;
  min-height: 70px;
  background: #F2F2F@;
  box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.17);
  display: flex;
  padding: 15px;
  align-items: center;
  position: relative;
  justify-content: center;
`
const BannerText = styled.h2` 
  text-align: center;
  font-size: 14px;
  color: #292929;
  font-weight: 300;
`
const Close = styled.img` 
  position: absolute;
  right: 25px;
  cursor: pointer;
`


export {
  BannerWrapper,
  BannerContent,
  BannerText,
  Close
};