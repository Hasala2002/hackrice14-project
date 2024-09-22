/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei'; // Make sure you're importing Html correctly
import useGame from './useGame';

export default function HtmlOverlay({ children, ...props }) {
    const { paused } = useGame();
    const node = useRef();

    useEffect(() => {
        if (node.current?.parentElement) {
            node.current.parentElement.style.pointerEvents = 'none';
            node.current.parentElement.style.whiteSpace = 'nowrap';
        }
    }, [node]); // It's good practice to add node as a dependency

    if (paused) return null;

    return (
        <Html ref={node} zIndexRange={[0, 0]} eps={0.1} {...props}>
            {children}
        </Html> // Corrected from HTML to Html
    );
}
