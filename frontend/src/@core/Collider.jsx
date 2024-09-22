/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import  useGame from './useGame';
import useGameObject  from './useGameObject';
import  useGameObjectEvent  from './useGameObjectEvent';
import useComponentRegistry from './useComponentRegistry';

export default function Collider({ isTrigger = false }) {
    const { findGameObjectsByXY } = useGame();
    const { id, getRef, publish, transform } = useGameObject();
    const [walkable, setWalkable] = useState(isTrigger);
    const prevPosition = useRef(transform);

    useGameObjectEvent('cannot-move', ({ x, y }) => {
        findGameObjectsByXY(x, y)
            .map(obj => obj.getComponent('Collider'))
            .forEach(collider => collider?.onCollision(getRef()));
    });

    useGameObjectEvent('did-change-position', ({ x, y }) => {
        findGameObjectsByXY(x, y)
            .filter(obj => obj.id !== id) // skip self
            .map(obj => obj.getComponent('Collider'))
            .forEach(collider => collider?.onTrigger(getRef()));
    });

    useGameObjectEvent('did-change-position', nextPosition => {
        const { x, y } = prevPosition.current;
        findGameObjectsByXY(x, y)
            .filter(obj => obj.id !== id) // skip self
            .map(obj => obj.getComponent('Collider'))
            .forEach(collider => collider?.onTriggerExit(getRef()));
        prevPosition.current = nextPosition;
    });

    useComponentRegistry('Collider', {
        walkable,
        setWalkable,
        canCrossEdge() {
            return true;
        },
        onCollision(ref) {
            publish('collision', ref);
        },
        onTrigger(ref) {
            publish('trigger', ref);
        },
        onTriggerExit(ref) {
            publish('trigger-exit', ref);
        },
    });

    return null;
}
