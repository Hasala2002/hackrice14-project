/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Collider from './Collider';
import useGameObjectEvent from './useGameObjectEvent';
import useSceneManager from './useSceneManager';

export default function SceneSwitch({ targetScene }) {
    const { setScene } = useSceneManager();

    useGameObjectEvent('trigger', () => setScene(targetScene));

    return <Collider isTrigger />;
}
