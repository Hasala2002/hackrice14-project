/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-three-fiber';
import useGame from './useGame';
import useSceneManager from './useSceneManager';

// Contexts for Scene and Level
const SceneContext = React.createContext(null);
const LevelContext = React.createContext(null);

export function useScene() {
    return useContext(SceneContext);
}

export function useLevel() {
    return useContext(LevelContext);
}

export default function Scene({ id, children }) {
    const { publish } = useGame();
    const {
        currentScene,
        currentLevel,
        prevLevel,
        resetScene,
        setLevel,
    } = useSceneManager();
    const [instances, setInstances] = useState([]);
    const idleCallback = useRef();

    const initEvents = useCallback(async () => {
        await publish('scene-init', id);
        idleCallback.current = window.requestIdleCallback(
            () => {
                publish('scene-ready', id);
            },
            { timeout: 1000 }
        );
    }, [publish, id]);

    const contextValue = useMemo(() => ({
        instantiate(newElement, portalNode) {
            const key = newElement.key == null ? Math.random() : newElement.key;
            const instance = portalNode
                ? createPortal(newElement, portalNode, null, key)
                : React.cloneElement(newElement, { key });
            setInstances(current => [...current, instance]);
            return () => {
                setInstances(current => {
                    return current.filter(elem => elem !== instance);
                });
            };
        },
        currentScene,
        currentLevel,
        prevLevel,
        resetScene,
        setLevel,
    }), [currentScene, currentLevel, prevLevel, resetScene, setLevel]);

    const levelContextValue = useMemo(() => ({
        level: currentLevel,
        transition: prevLevel < currentLevel ? -1 : 1,
        enterPrevLevel() {
            setLevel(currentLevel - 1);
        },
        enterNextLevel() {
            setLevel(currentLevel + 1);
        },
    }), [currentLevel, prevLevel, setLevel]);

    useEffect(() => {
        if (currentScene === id) {
            initEvents();
        } else {
            setInstances([]);
        }
        return () => window.cancelIdleCallback(idleCallback.current);
    }, [currentScene, id, initEvents]);

    if (!currentScene.startsWith(id)) return null;

    return (
        <SceneContext.Provider value={contextValue}>
            <LevelContext.Provider value={levelContextValue}>
                <group>
                    <group>
                        <>{children}</>
                        <>{instances}</>
                    </group>
                </group>
            </LevelContext.Provider>
        </SceneContext.Provider>
    );
}
