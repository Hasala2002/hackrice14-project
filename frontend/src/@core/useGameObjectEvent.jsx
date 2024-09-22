import { useEffect, useRef } from 'react';
import useGameObject from './useGameObject';

export default function useGameObjectEvent(eventName, callback, deps = []) {
    const callbackRef = useRef();
    const { subscribe } = useGameObject();

    callbackRef.current = callback;

    useEffect(() => {
        return subscribe(eventName, callbackRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribe, eventName, ...deps]);
}
