/* eslint-disable react/prop-types */
import anime from 'animejs';
import { useEffect, useRef } from 'react';
import useCollisionTest from './useCollisionTest';
import useComponentRegistry from './useComponentRegistry';
import useGame from './useGame';
import useGameObject from './useGameObject';
import waitForMs from './utils/waitForMs';

export default function Moveable({ isStatic = false }) {
    const {
        settings: { movementDuration },
    } = useGame();
    const { transform, publish, nodeRef } = useGameObject();
    const canMove = useRef(!isStatic);
    const testCollision = useCollisionTest();
    const nextPosition = useRef({ x: transform.x, y: transform.y });
    const facingDirection = useRef(1);
    const movingDirection = useRef([0, 0]);

    const api = useComponentRegistry('Moveable', {
        canMove(position) {
            if (isStatic) return false;
            if (position && !testCollision(position)) return false;
            return canMove.current;
        },
        isMoving() {
            return !isStatic && !canMove.current;
        },
        async blockMovement(delayMs) {
            canMove.current = false;
            await waitForMs(delayMs);
            canMove.current = true;
        },
        async move(targetPosition, type = 'move') {
            if (isStatic) return false;
            if (!canMove.current) return false;

            const isJumping = type === 'jump';
            const isPushed = type === 'push';
            const isForced = isJumping || isPushed;

            !isPushed && publish('attempt-move', targetPosition);

            if (!testCollision(targetPosition)) {
                publish('cannot-move', targetPosition);
                await api.blockMovement(movementDuration / 2);
                return false;
            }

            publish('will-change-position', targetPosition);
            !isForced && publish('will-move', targetPosition);

            const dirX = (targetPosition.x - transform.x);
            const dirY = (targetPosition.y - transform.y);
            nextPosition.current = targetPosition;
            movingDirection.current = [dirX, dirY];
            facingDirection.current = dirX || facingDirection.current;

            canMove.current = false;

            const fromX = transform.x;
            const fromY = transform.y;
            const toX = targetPosition.x;
            const toY = targetPosition.y;

            anime.remove(nodeRef.current.position);

            await anime({
                targets: nodeRef.current.position,
                x: [fromX, toX],
                y: [fromY, toY],
                duration: movementDuration,
                easing: 'linear',
                begin() {
                    if (dirX) transform.setX(targetPosition.x);
                    if (dirY) transform.setY(targetPosition.y);
                },
                update() {
                    !isForced &&
                        publish('moving', {
                            currentPosition: nodeRef.current.position,
                            nextPosition: targetPosition,
                            direction: movingDirection.current,
                            facingDirection: facingDirection.current,
                        });
                },
            }).finished;

            canMove.current = true;

            publish('did-change-position', targetPosition);
            !isForced && publish('did-move', nextPosition.current);

            return true;
        },
    });

    useEffect(() => {
        const node = nodeRef.current;
        return () => anime.remove(node.position);
    }, [nodeRef]);

    return null;
}
