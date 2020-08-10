import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body{
    background: white;
    min-height: 100vh;
    margin: 0;
    color: black;
    font-family: 'Mulish'
  }

  @media only screen and (max-width: 700px) {
    
  }
`;

export { GlobalStyle };
