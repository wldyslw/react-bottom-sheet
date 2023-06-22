import {
    memo,
    forwardRef,
    useState,
    useCallback,
    useRef,
    type TouchEvent,
    type ReactNode,
    useImperativeHandle,
} from 'react';
import './index.css';

export type SheetRef = {
    scrollTo: (x: number, y: number) => void;
    open: () => void;
    close: () => void;
    expand: () => void;
    collapse: () => void;
};

export type SheetProps = {
    /**
     * Sheet's content
     */
    children?: ReactNode;
    /**
     * Value that will be used inside `transformY()` CSS function
     * to determine detend for expanded state relative to the bottom of the page.
     * You can also use CSS `var()` expression here.
     * @default "100%"
     */
    expandedDetent?: string;
    /**
     * Value that will be used inside `transformY()` CSS function
     * to determine detend for collapsed state relative to the bottom of the page.
     * You can also use CSS `var()` expression here.
     * @default "-9rem"
     */
    collapsedDetent?: string;
    /**
     * Array of detents that sheet should stick to.
     * IMPORTANT: detents should be in order from smallest to largest, otherwise the result might look stange.
     */
    detents?: string[];
    /**
     * Additional class names that will be applied to the sheet
     */
    className?: string;
    /**
     * Amount of pixels that sheet should be dragged before switching expanded state
     * @default 50
     */
    expansionSwitchThreshold?: number;
    /**
     * Controls whether sheet persists on page or not
     * @default false
     */
    permanent?: boolean;
};

const defaultDetents = [
    'var(--sheet-detent-collapsed)',
    'var(--sheet-detent-expanded)',
];

const Sheet = forwardRef<SheetRef, SheetProps>(function Sheet(
    {
        expandedDetent = 'var(--sheet-detent-expanded)',
        collapsedDetent = 'var(--sheet-detent-collapsed)',
        detents = defaultDetents,
        children,
        className = '',
        expansionSwitchThreshold = 50,
        permanent = false,
    },
    ref
) {
    const [expanded, expand] = useState(false);
    const [currentDetentIndex, setCurrentDetendIndex] = useState(0); // TBD
    const [opened, open] = useState(permanent);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [origin, setOrigin] = useState<number | null>(null);
    const [transform, setTransform] = useState<number>(0);

    const toggleExpansion = useCallback(() => {
        if (expanded) {
            scrollContainerRef.current?.scrollTo(0, 0);
        }
        expand((v) => !v);
    }, [expanded]);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        const scrollTop = scrollContainerRef.current?.scrollTop;
        if (scrollTop !== undefined && scrollTop <= 0) {
            setOrigin(e.touches[0].pageY);
        }
    }, []);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (origin !== null) {
                const delta = e.touches[0].pageY - origin;
                if (expanded && delta >= 0) {
                    scrollContainerRef.current?.scrollTo(0, 0);
                    setTransform(delta);
                } else if (!expanded) {
                    if (permanent) {
                        // asymptotically approaches expansionSwitchThreshold
                        setTransform(
                            delta <= 0
                                ? delta
                                : delta / (delta / expansionSwitchThreshold + 1)
                        );
                    } else {
                        setTransform(delta);
                    }
                }
            }
        },
        [expanded, expansionSwitchThreshold, origin, permanent]
    );

    const handleTouchEnd = useCallback(() => {
        if (expanded && transform > expansionSwitchThreshold) {
            expand(false);
            scrollContainerRef.current?.scrollTo(0, 0);
        } else if (!expanded && transform < -expansionSwitchThreshold) {
            expand(true);
        } else if (
            !permanent &&
            !expanded &&
            transform > expansionSwitchThreshold
        ) {
            open(false);
        }
        setOrigin(null);
        setTransform(0);
    }, [expanded, expansionSwitchThreshold, permanent, transform]);

    const handleTouchCancel = useCallback(() => {
        setOrigin(null);
        setTransform(0);
    }, []);

    useImperativeHandle(
        ref,
        () => {
            return {
                scrollTo(x: number, y: number) {
                    scrollContainerRef.current?.scrollTo(x, y);
                },
                open() {
                    open(true);
                },
                close() {
                    open(false);
                },
                expand() {
                    expand(true);
                },
                collapse() {
                    expand(false);
                },
            };
        },
        []
    );

    const getBasicTransform = useCallback(() => {
        if (opened) {
            return expanded ? expandedDetent : collapsedDetent;
        } else {
            return '0';
        }
    }, [collapsedDetent, expanded, expandedDetent, opened]);

    return (
        <>
            <div
                id="dim"
                className={`${
                    expanded
                        ? 'pointer-events-auto bg-zinc-950/60'
                        : 'pointer-events-none bg-zinc-950/0'
                } absolute inset-0 transition-colors`}
            ></div>
            <div
                style={{
                    transform: `translateY(${getBasicTransform()}) translateY(${transform}px)`,
                }}
                className={`${
                    origin === null ? 'bottom-sheet-transform' : ''
                } ${
                    transform === 0 && expanded
                        ? 'rounded-t-none'
                        : 'rounded-t-3xl'
                } pointer-events-auto absolute inset-x-0 -bottom-full my-auto flex h-full w-full max-w-2xl shrink-0 flex-col bg-white drop-shadow-xl backdrop-blur-md ${className}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
            >
                <div
                    role="button"
                    onClick={toggleExpansion}
                    className="flex shrink-0 cursor-pointer justify-center py-3"
                >
                    <span className="h-1 w-8 rounded-full bg-zinc-500"></span>
                </div>
                <div
                    ref={scrollContainerRef}
                    className={`h-full ${
                        transform !== 0 ? 'overscroll-none' : ''
                    } ${expanded ? '' : 'touch-none'} overflow-y-auto px-3`}
                >
                    {children}
                </div>
            </div>
        </>
    );
});

const MemoizedSheet = memo(Sheet);

export default MemoizedSheet;
