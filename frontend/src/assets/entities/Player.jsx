/* eslint-disable no-unused-vars */
import React from 'react';
import Collider from '../../@core/Collider';
import GameObject from '../../@core/GameObject';
import Interactable from '../../@core/Interactable';
import Moveable from '../../@core/Moveable';
import Sprite from '../../@core/Sprite';
import CameraFollowScript from '../components/CameraFollowScript';
import CharacterScript from '../components/CharacterScript';
import PlayerScript from '../components/PlayerScript';
import spriteData from '../../spriteData';

export default function Player(props) {
    return (
        <GameObject name="player" displayName="Player" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <CharacterScript>
                <Sprite {...spriteData.player} />
            </CharacterScript>
            <CameraFollowScript />
            <PlayerScript />
        </GameObject>
    );
}
