import { useRef } from 'react';
import useComponentRegistry from './useComponentRegistry';
import useGame from './useGame';
import useGameObject from './useGameObject';

export default function Interactable() {
    const { findGameObjectsByXY } = useGame();
    const { getRef, publish, hasSubscriptions } = useGameObject();
    const canInteract = useRef(true);

    useComponentRegistry('Interactable', {
        async interact({ x, y }) {
            const interactables = findGameObjectsByXY(x, y)
                .map(obj => obj.getComponent('Interactable'))
                .filter(component => component?.canReceiveInteraction());

            if (!interactables.length) return false;

            publish('will-interact', { x, y });
            canInteract.current = false;
            await Promise.all(interactables.map(comp => comp.onInteract(getRef())));
            canInteract.current = true;
            publish('did-interact', { x, y });
            return true;
        },
        async onInteract(gameObject) {
            if (canInteract.current) {
                canInteract.current = false;
                publish('will-interact', gameObject.transform);
                await publish('interaction', gameObject);
                publish('did-interact', gameObject.transform);
                canInteract.current = true;
            }
        },
        canInteract() {
            return canInteract.current;
        },
        canReceiveInteraction() {
            return (
                canInteract.current &&
                hasSubscriptions('interaction') > 0
            );
        },
    });

    return null;
}
