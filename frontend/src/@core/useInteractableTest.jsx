import { useCallback } from 'react';
import useGame from './useGame';
import useGameObject from './useGameObject';

export default function useInteractableTest() {
    const { findGameObjectsByXY } = useGame();
    const { id } = useGameObject() || {}; // optional

    return useCallback(
        (position) => {
            const { x, y } = position;

            return findGameObjectsByXY(x, y).some(gameObject => {
                // Skip own collider
                if (gameObject.id === id) return false;

                const interactable = gameObject.getComponent('Interactable');
                return !!interactable;
            });
        },
        [id, findGameObjectsByXY]
    );
}
