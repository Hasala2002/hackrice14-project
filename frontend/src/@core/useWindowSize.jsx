import { useEffect, useState } from 'react';

export default function useWindowSize() {
    const [size, setSize] = useState([0, 0]); // Initialize size as [0, 0] for safety

    useEffect(() => {
        function handleResize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        // Set initial size if window is available (avoids issues during SSR)
        if (typeof window !== 'undefined') {
            setSize([window.innerWidth, window.innerHeight]);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []); // Empty dependency array ensures effect runs only on mount and unmount

    return size;
}
