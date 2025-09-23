import { useState, useEffect } from 'react';

export function useScroll() {
    const [scrollDirection, setScroll] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScroll = () => {
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? 'down' : 'up';
            if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
                setScroll(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        }
    }, [scrollDirection]);

    return scrollDirection;
};