/* eslint-disable react/prop-types */
import React, { useMemo, useRef, useState } from 'react';
import useGame from './useGame';
import { SceneStoreProvider } from './useGameObjectStore';
import waitForMs from './utils/waitForMs';

export const SceneManagerContext = React.createContext(null);

export default function SceneManager({ defaultScene, children }) {
    const { publish } = useGame();
    // support scene string format: 'sceneId:level'
    
    const [initialScene, initialLevel = 0] = defaultScene.split(':');
    const [currentScene, setScene] = useState(initialScene);
    const prevLevel = useRef(-1);
    const currentLevel = useRef(Number(initialLevel));
    const sceneStore = useRef(new Map());

    const api = useMemo(() => ({
        currentScene,
        prevLevel: prevLevel.current,
        currentLevel: currentLevel.current,
        async setScene(nextScene) {
            let [targetScene, targetLevel = 0] = nextScene.split(':');
            targetLevel = Number(targetLevel);

            if (currentScene !== targetScene) {
                // switch scene
                if (currentScene !== '') {
                    await publish('scene-pre-exit', currentScene);
                    await publish('scene-exit', currentScene);
                    // always go to empty scene first and then to the target scene
                    // (this should help clearing cached react components)
                    setScene('');
                    await waitForMs(100);
                }
                prevLevel.current = -1;
                currentLevel.current = targetLevel;
                setScene(targetScene);
            } else if (currentLevel.current !== targetLevel) {
                // switch level
                api.setLevel(targetLevel);
            }
        },
        async setLevel(level) {
            if (level !== currentLevel.current) {
                prevLevel.current = currentLevel.current;
                currentLevel.current = level;
                await api.resetScene();
            }
        },
        async resetScene() {
            const prevScene = currentScene;
            const formerCurrentLevel = currentLevel.current;
            const formerPrevLevel = prevLevel.current;
            // switch to empty scene
            await api.setScene('');
            await waitForMs(100);
            // restore prev scene + level
            prevLevel.current = formerPrevLevel;
            currentLevel.current = formerCurrentLevel;
            setScene(prevScene);
        },
        setSceneState(key, value) {
            sceneStore.current.set(`${currentScene}.${key}`, value);
        },
        getSceneState(key) {
            return sceneStore.current.get(`${currentScene}.${key}`);
        },
    }), [currentScene, currentLevel, publish]);

    return (
        <SceneManagerContext.Provider value={api}>
            <SceneStoreProvider>{children}</SceneStoreProvider>
        </SceneManagerContext.Provider>
    );
}
