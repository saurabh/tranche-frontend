import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body{
    background-color: #F2F2F2;
    font-family: 'Roboto', sans-serif;
    overflow-x: hidden;
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

  @media(min-width: 768px){ 
      .container{ 
          width: 750px; 
      } 
  } 

  @media(min-width: 992px){ 
      .container{ 
          width: 970px; 
      } 
  } 

  @media (min-width: 1200px){ 
      .container{ 
          width: 1170px;
      } 
  }


  #navbar-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  // @media (min-width: 768px){
  //   container{
  //     width: 770px;
  //   }
  // }
  
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

  .return-wrapper{
    width: 9%;
    .return-title-content div{
      right: -9px !important;
    }
    h2{
      text-align: center;
    }
  }
  .subscription-wrapper{
    width: 15%;
    .subscription-title-content div{
      right: 24px !important;
    }
    h2{
      text-align: center;
    }
  }
  .address-wrapper{
    width: 28%;
  }
  .status-wrapper{
    text-align: center;
    .apy-content div{
      right: 20px !important;
    }
    .status-title-content div{
      right: 27px !important;
    }
    .bondApy-title-content div{
      right: 20px !important;
    }
    width: 12%;
  }
  // .status-wrapper h2{
  //   margin-left: 15px;
  // }
  .remaining-wrapper{
    width: 12%;
    .tranche-size-content div{
      right: 10px !important;
    }
    .remaining-title-content div{
      right: 25px !important;
    }

    .value-title-content div{
      right: 7px !important;
    }
    h2{
      text-align: center;
    }
  }
  .return-wrapper{
    width: 9%;
    .return-content div{
      right: -9px !important;
    }
    .ratio-title-content div{
      right: 9px !important;
    }
    .return-title-content div{
      right: -27px !important;
    }
    h2{
      text-align: center;
    }
  }
  .ratio-wrapper{
    width: 7%;
    .return-content div{
      right: -25px !important;
    }
    .ratio-title-content div{
      right: 9px !important;
    }
    .return-title-content div{
      right: -27px !important;
    }
    h2{
      text-align: center;
    }
  }
  
  .interest-paid-wrapper{
    width: 17%;
    .interest-paid-title-content div{
      right: 36px !important;
    }
    .subscription-title-content div{
      right: 33px !important;
    }
    h2{
      text-align: center;
    }
  }
  .head-btns-wrapper{
    width: 18%;
  }
  // @media (min-width: 992px){
  //   container{
  //     width: 990px;
  //   }
  // }
  // @media (min-width: 1200px){
  //   container{
  //     width: 1126px;
  //   }
  // }
 

  @media only screen and (max-width: 700px) {
    
  }
`;

export { GlobalStyle };