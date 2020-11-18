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
      width: 770px;
    }
  }

  
  .navbar-right{
    width: 66%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition-property: height;
    transition-duration: 300ms;
    transition-timing-function: ease;
  }

  #logo-wrapper{
    width: 34%;
  }


  
  
  .address-wrapper{
    width: 28%;
  }
  .status-wrapper{
    width: 12%;
  }
  .status-wrapper h2{
    margin-left: 15px;
  }
  .remaining-wrapper{
    width: 12%;
    .remaining-title-content div{
      right: -4px !important;
    }
    h2{
      text-align: center;
    }
  }
  .ratio-wrapper{
    width: 12%;
    h2{
      text-align: center;
    }
  }
  
  .interest-paid-wrapper{
    width: 12%;
    .interest-paid-title-content div{
      right: 19px !important;
    }
    h2{
      text-align: center;
    }
  }
  .head-btns-wrapper{
    width: 12%;
  }
  @media (min-width: 992px){
    .navbar-container{
      width: 990px;
    }
    .content-container{
      width: 990px;
    }
  }
  @media (min-width: 1200px){
    .navbar-container{
      width: 1126px;
    }
    .content-container{
      width: 1126px;
    }
  }
 

  @media only screen and (max-width: 700px) {
    
  }
`;

export { GlobalStyle };