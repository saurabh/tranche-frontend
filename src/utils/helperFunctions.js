import ReactHtmlParser from 'react-html-parser';

export const addrShortener = (addr) => {
  return ReactHtmlParser(
    addr.substring(0, 5) +
      '...' +
    addr.substring(addr.length - 4, addr.length)
  );
}

export const statusShortner = (status) => {
  return ReactHtmlParser(
    status.substring(0, 12) + (status.length >= 12 ? "." : "")
  );
}