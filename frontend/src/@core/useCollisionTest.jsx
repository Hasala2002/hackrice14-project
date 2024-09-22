import { useCallback } from 'react';
import useGame from './useGame';
import useGameObject from './useGameObject';

export default function useCollisionTest({ sight = false, hit = false } = {}) {
    const { findGameObjectsByXY } = useGame();
    const { id } = useGameObject() || {}; // optional

    return useCallback(
        (position) => {
            const { x, y } = position;
            const gameObjectsAtXY = findGameObjectsByXY(x, y);

            // no object at position is considered out of bounds
            if (!gameObjectsAtXY.length) return false;

            return gameObjectsAtXY.every(gameObject => {
                // skip own collider
                if (gameObject.id === id) return true;

                const collider = gameObject.getComponent('Collider');

                if (sight) {
                    return (
                        gameObject.layer == null ||
                        (gameObject.layer !== 'wall' &&
                            gameObject.layer !== 'obstacle') ||
                        (collider && collider.walkable)
                    );
                }
                if (hit) {
                    return (
                        gameObject.layer == null ||
                        (gameObject.layer !== 'wall' &&
                            gameObject.layer !== 'visible-wall' &&
                            gameObject.layer !== 'obstacle') ||
                        (collider && collider.walkable)
                    );
                }

                return !collider || collider.walkable;
            });
        },
        [id, findGameObjectsByXY, sight, hit]
    );
}
