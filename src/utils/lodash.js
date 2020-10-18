import { useCallback } from 'react';
import _ from 'lodash';

export const useDebouncedCallback = (callback, wait) => {
  const debouncedFunction = useCallback(_.debounce(callback, wait), []);
  return [debouncedFunction];
};

export const useThrottledCallback = (callback, wait) => {
  const throttledFunction = useCallback(_.throttle(callback, wait), []);
  return [throttledFunction];
};
