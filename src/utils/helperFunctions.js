import ReactHtmlParser from 'react-html-parser';

export const addrShortener = (addr) => {
  return ReactHtmlParser(
    addr.substring(0, 5) +
      '...' +
    addr.substring(addr.length - 4, addr.length)
  );
}
