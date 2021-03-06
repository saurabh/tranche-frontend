import styled from 'styled-components';


const BannerWrapper = styled.div` 
  position: relative;
`
const BannerContent = styled.div` 
  width: 100%;
  min-height: 35px;
  background: #3192FF;
  box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.17);
  display: flex;
  padding: 15px 61px;
  align-items: center;
  position: relative;
  justify-content: center;
`
const BannerText = styled.h2` 
  text-align: center;
  font-size: 14px;
  color: #ffffff;
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