/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';
import Graphic from './Graphic';
import useComponentRegistry from './useComponentRegistry';

export default function Sprite({
    sheet,
    state: initialState = 'default',
    flipX: initialFlipX,
    color: initialColor,
    opacity: initialOpacity,
    offset: initialOffset,
    scale: initialScale,
    ...graphicProps
}) {
    const [color, setColor] = useState(initialColor);
    const [opacity, setOpacity] = useState(initialOpacity);
    const [flipX, setFlipX] = useState(initialFlipX);
    const [state, setState] = useState(initialState);
    const [offset, setOffset] = useState(initialOffset);
    const [scale, setScale] = useState(initialScale);
    const nodeRef = useRef();

    useComponentRegistry('Sprite', {
        setColor,
        setOpacity,
        setState,
        setOffset,
        setScale,
        setFlipX,
        flipX,
        nodeRef,
    });

    return (
        <Graphic
            ref={nodeRef}
            sheet={sheet}
            state={state}
            flipX={flipX}
            color={color}
            opacity={opacity}
            offset={offset}
            scale={scale}
            {...graphicProps}
        />
    );
}
