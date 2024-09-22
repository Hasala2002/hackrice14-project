/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import useForceUpdate from './useForceUpdate';
import useGame from './useGame';
import useGameObject from './useGameObject';
import useGameObjectStore from './useGameObjectStore';
import createPubSub from './utils/createPubSub';

export const GameObjectContext = React.createContext(null);

export default function GameObject({
    name,
    displayName,
    layer,
    children,
    disabled: initialDisabled = false,
    persisted = false,
    ...props
}) {
    const identifier = useRef(Symbol('GameObject'));
    const node = useRef(null);
    const [registry] = useState(() => new Map());
    const [pubSub] = useState(() => createPubSub());
    const [x, setX] = useState(props.x || 0);
    const [y, setY] = useState(props.y || 0);
    const [disabled, setDisabled] = useState(initialDisabled);
    const { registerGameObject, unregisterGameObject } = useGame();
    const forceUpdate = useForceUpdate();

    const registryUtils = useMemo(() => ({
        registerComponent(id, api) {
            registry.set(id, api);
        },
        unregisterComponent(id) {
            registry.delete(id);
        },
        getComponent(id) {
            return registry.get(id);
        },
    }), [registry]);

    const transform = useMemo(() => ({
        x,
        y,
        setX,
        setY,
    }), [x, y, setX, setY]);

    const gameObjectRef = useMemo(() => ({
        id: identifier.current,
        name,
        displayName,
        layer,
        transform,
        getComponent: registryUtils.getComponent,
        disabled,
        setDisabled,
        subscribe: pubSub.subscribe,
    }), [name, displayName, layer, transform, registryUtils, disabled, pubSub]);

    const getRef = useCallback(() => gameObjectRef, [gameObjectRef]);

    useLayoutEffect(() => {
        const id = identifier.current;
        registerGameObject(id, gameObjectRef);
        return () => unregisterGameObject(id, gameObjectRef);
    }, [registerGameObject, unregisterGameObject, gameObjectRef]);

    const contextValue = {
        id: identifier.current,
        name,
        transform,
        forceUpdate,
        nodeRef: node,
        getRef,
        ...pubSub,
        ...registryUtils,
    };

    let offsetZ = 0;
    if (layer === 'ground') offsetZ = -1;
    if (layer === 'ground-decal') offsetZ = 0.1;
    if (layer === 'obstacle') offsetZ = 0.2;
    if (layer === 'item') offsetZ = 0.3;
    if (layer === 'character') offsetZ = 0.5;
    if (layer === 'fx') offsetZ = 4;

    return (
        <GameObjectContext.Provider value={contextValue}>
            {persisted && <Persistence />}
            <group ref={node} position={[x, y, (-y + offsetZ) / 100]}>
                {!disabled && children}
            </group>
        </GameObjectContext.Provider>
    );
}

function Persistence() {
    const { getRef } = useGameObject();

    useGameObjectStore(
        '_gameObject',
        () => {
            const self = getRef();
            return {
                x: self.transform.x,
                y: self.transform.y,
                disabled: self.disabled,
            };
        },
        stored => {
            const self = getRef();
            self.setDisabled(stored.disabled);
        }
    );

    return null;
}
