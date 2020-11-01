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
    width: 200px;
  }
  .status-wrapper{
    width: 109px;
  }
  .status-wrapper h2{
    margin-left: 15px;
  }
  .remaining-wrapper{
    width: 149px;
  }
  .ratio-wrapper{
    width: 110px;
  }
  
  .interest-paid-wrapper{
    width: 146px;
  }
  .head-btns-wrapper{
    width: 103px;
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
      width: 942px;
    }
  }
 

  @media only screen and (max-width: 700px) {
    
  }
`;

export { GlobalStyle };