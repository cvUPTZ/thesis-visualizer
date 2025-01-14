// hooks/useThrottledState.ts
import { useState, useCallback } from 'react';
import { throttle } from 'lodash';

export function useThrottledState<T>(initialState: T, wait: number = 300) {
  const [state, setState] = useState<T>(initialState);
  
  const throttledSetState = useCallback(
    throttle((newState: T) => {
      setState(newState);
    }, wait),
    []
  );

  return [state, throttledSetState] as const;
}
