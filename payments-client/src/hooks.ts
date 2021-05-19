import { useRef, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './state/store';

// Exported for type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
