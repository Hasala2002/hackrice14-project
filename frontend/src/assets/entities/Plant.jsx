/* eslint-disable no-unused-vars */
import React from 'react';
import Collider from '../../@core/Collider';
import GameObject from '../../@core/GameObject';
import Sprite from '../../@core/Sprite';
import spriteData from '../../spriteData';

export default function Plant(props) {
    return (
        <GameObject layer="obstacle" {...props}>
            <Collider />
            <Sprite {...spriteData.objects} state="plant" offset={{ x: 0, y: 0.25 }} />
        </GameObject>
    );
}
