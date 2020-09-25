import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body{
    background-color: #F2F2F2;
    font-family: 'Roboto', sans-serif;
  }

  h2{
    margin: 0;
  }

  .header-text h2{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    color: rgba(255, 255, 255, 0.5);
  }
  .container{
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  #navbar-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  @media (min-width: 768px){
    .navbar-container{
      width: 770px;
    }
    .content-container{
      width: 500px;
    }
  }
  .active-navbar-link{
    border-bottom: 2px solid #CEB7FF;
    opacity: 1 !important;
  }
  .active-tab-btn{
    opacity: 1 !important;
    border-color: #CEB7FF;
  }
  
  .navbar-right{
    width: 766px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition-property: height;
    transition-duration: 300ms;
    transition-timing-function: ease;
  }
  
  .address-wrapper{
    width: 269px;
  }
  .remaining-wrapper{
    width: 139px;
  }
  .ratio-wrapper{
    width: 100px;
  }
  
  .interest-paid-wrapper{
    width: 226px;
  }

  @media (min-width: 992px){
    .navbar-container{
      width: 990px;
    }
    .content-container{
     width: 626px; 
    }
  }
  @media (min-width: 1200px){
    .navbar-container{
      width: 1126px;
    }
    .content-container{
      width: 826px;
    }
  }
 

  @media only screen and (max-width: 700px) {
    
  }
`;

export { GlobalStyle };