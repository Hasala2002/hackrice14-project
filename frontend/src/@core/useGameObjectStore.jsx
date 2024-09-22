import React, { useCallback, useContext, useRef } from 'react';
import useGame from './useGame';
import useGameEvent from './useGameEvent';
import useGameObject from './useGameObject';
import useSceneManager from './useSceneManager';
import waitForMs from './utils/waitForMs';

export const StoreContext = React.createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export default function useGameObjectStore(key, write, read) {
    const { name, forceUpdate } = useGameObject();
    const { getState, setState } = useContext(StoreContext);

    const writeCallback = useRef(null);
    writeCallback.current = write;

    const readCallback = useRef(null);
    readCallback.current = read;

    useGameEvent('scene-init', () => {
        if (!readCallback.current) {
            return;
        }
        if (!name) {
            console.error('Attempting to use GameObject store without a name.');
            return;
        }

        const stored = getState(`${name}.${key}`);
        if (stored != null) {
            readCallback.current(stored);
            waitForMs(0).then(forceUpdate);
        }
    }, [key, name]);

    const save = useCallback(async () => {
        if (!name) return;
        setState(`${name}.${key}`, writeCallback.current());
    }, [key, name, setState]);

    useGameEvent('scene-exit', save, [save]);
    useGameEvent('save-game', save, [save]);

    return getState(`${name}.${key}`);
}

export function useGameObjectStoreValue(key) {
    const { name } = useGameObject();
    const { getState } = useContext(StoreContext);

    if (!name) {
        console.error('Attempting to use GameObject store without a name.');
        return undefined;
    }

    const stored = getState(`${name}.${key}`);
    return stored;
}

// eslint-disable-next-line react/prop-types
export function GameStoreProvider({ children }) {
    const { getGameState, setGameState } = useGame();

    const contextValue = {
        getState: getGameState,
        setState: setGameState,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react/prop-types
export function SceneStoreProvider({ children }) {
    const { getSceneState, setSceneState } = useSceneManager();

    const contextValue = {
        getState: getSceneState,
        setState: setSceneState,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}
