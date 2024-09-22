/* eslint-disable react/prop-types */
import { useThree } from 'react-three-fiber';
import useComponentRegistry from './useComponentRegistry';
import useGame from './useGame';
import useGameEvent from './useGameEvent';
import useGameObject from './useGameObject';
import useInteraction from './useInteraction';
import useSceneManager from './useSceneManager';

const targetPortalKey = Symbol('targetPortalKey');
const portedGameObjectKey = Symbol('portedGameObjectKey');

export default function ScenePortal({
    name,
    target: targetProp,
    enterDirection = [0, 0],
    controlled = false,
    onEnter,
    onLeave,
}) {
    const { findGameObjectByName, setGameState, getGameState } = useGame();
    const { transform, nodeRef } = useGameObject();
    const { setScene } = useSceneManager();
    const { camera } = useThree();
    const [enterX, enterY] = enterDirection;

    const api = useComponentRegistry('ScenePortal', {
        name,
        target: targetProp,
        port(target = targetProp) {
            const [targetScene, targetPortal] = target.split('/');

            setGameState(targetPortalKey, targetPortal);
            setGameState(portedGameObjectKey, 'player');
            onEnter?.();
            setScene(targetScene);
        },
    });

    useInteraction(async ref => {
        if (controlled) return;
        if (ref.name !== 'player') return;
        api.port();
    });

    // Set position of target game object to this portal
    useGameEvent('scene-init', () => {
        const targetName = getGameState(targetPortalKey);
        if (targetName !== name) return;

        const portedKey = getGameState(portedGameObjectKey);
        const portedObj = findGameObjectByName(portedKey);
        portedObj.transform.setX(transform.x);
        portedObj.transform.setY(transform.y);

        // Update camera position
        camera.position.setX(nodeRef.current.position.x);
        camera.position.setY(nodeRef.current.position.y);
    }, [name, transform]);

    // Move target game object in enter direction
    useGameEvent('scene-ready', () => {
        const targetName = getGameState(targetPortalKey);
        if (targetName !== name) return;
        if (!enterX && !enterY) return;

        const portedKey = getGameState(portedGameObjectKey);
        const portedObj = findGameObjectByName(portedKey);
        if (!portedObj) return;

        onLeave?.();

        portedObj
            .getComponent('Moveable')
            .move({ x: transform.x + enterX, y: transform.y + enterY });

        // Reset game state
        setGameState(targetPortalKey, null);
        setGameState(portedGameObjectKey, null);
    }, [name, enterX, enterY, transform]);

    return null;
}
