import { useLayoutEffect } from 'react';
import useGameObject from './useGameObject';

export default function useComponentRegistry(name, api) {
    const { registerComponent, unregisterComponent } = useGameObject();

    useLayoutEffect(() => {
        registerComponent(name, api);
    }, [registerComponent, name, api]);

    useLayoutEffect(() => {
        return () => unregisterComponent(name);
    }, [unregisterComponent, name]);

    return api;
}
