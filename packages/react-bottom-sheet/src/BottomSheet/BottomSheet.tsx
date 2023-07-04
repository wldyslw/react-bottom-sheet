import {
    memo,
    forwardRef,
    useState,
    useCallback,
    useRef,
    type TouchEvent,
    type PointerEvent,
    type ReactNode,
    useImperativeHandle,
    useEffect,
    useMemo,
} from 'react';
import { createPortal } from 'react-dom';

import throttle from './throttle';
import './index.css';

export interface BottomSheetRef {
    /**
     * Reference to the DOM node which holds sheet's children
     */
    scrollContainer: HTMLDivElement | null;
    /**
     * Opens sheet
     */
    open: () => void;
    /**
     * Closes sheet
     */
    close: () => void;
    /**
     * Expands sheet one detent up
     */
    expand: () => void;
    /**
     * Expands sheet to specific detent by it's index
     */
    expandToIndex: (i: number) => void;
    /**
     * Collapses sheet one detent down
     */
    collapse: () => void;
}

export interface BottomSheetProps {
    /**
     * Sheet's content
     */
    children?: ReactNode;
    /**
     * Array of detent values that sheet should stick to.
     *
     * Each detent be either a number of pixels or a percentage of the vertical viewport, both counting from the bottom to the top.
     * Non-`number` or inapropriately formatted `string` values will be ignored.
     *
     * **IMPORTANT**: Detents should be in order from smallest to largest, otherwise the result might look stange.
     *
     * @example [100, 200, 300]
     * [100, "50%"],
     * ["90%"],
     *
     * @default ["50%", "97%"]
     */
    detents?: Array<string | number>;
    /**
     * The largest detent's index that doesn’t dim the view underneath the sheet.
     * Default value is `-1` which means that dim is always enabled.
     * @default -1
     */
    largestUndimmedDetentIndex?: number;
    /**
     * Additional class names that will be applied to the sheet.
     */
    className?: string;
    /**
     * Amount of pixels that sheet should be dragged before switching expanded state.
     * @default 50
     */
    expansionSwitchThreshold?: number;
    /**
     * Whether sheet persists on page and can be dissmissed or not.
     * @default false
     */
    permanent?: boolean;
    /**
     * Whether the sheet shows a grabber at the top.
     *
     * NOTE: while this component is generally developed for mobile experiences,
     * it's also possible to drag grabber on desktops to expand/collapse sheet.
     * @default false
     */
    grabberVisible?: boolean;
    /**
     * Custom DOM node to render bottom sheet into.
     *
     * Passed directly to `createPortal`.
     *
     * @default document.body
     */
    domNode?: Element | DocumentFragment;
    /**
     * Renders component without a portal.
     *
     * By default, bottom sheet is rendered inside a portal, thus only on client side in SSR/SSG environments
     * (because React's `createPortal` cannot be called server-side).
     *
     * If you want to heavily customize rendering behaviour, like allowing it to bypass mentioned limitation,
     * you can pass this prop.
     *
     * @default false
     */
    standalone?: boolean;
}

const defaultDetents = ['50%', '97%'];

/**
 * Inertializes the value to apply 'bouncy' effect
 * @param value Value to inertialize
 * @param factor Inertia factor
 * @returns Inertialized value
 */
const inertialize = (value: number, factor = 0.1) => {
    // rounding greatly improves the performance
    return Math.round(value * factor);
};

const Sheet = forwardRef<BottomSheetRef, BottomSheetProps>(function BottomSheet(
    {
        detents = defaultDetents,
        largestUndimmedDetentIndex = -1,
        children,
        className = '',
        expansionSwitchThreshold = 50,
        permanent = false,
        grabberVisible = false,
        domNode,
        standalone = false,
    }: BottomSheetProps,
    ref
) {
    const [currentDetentIndex, setCurrentDetendIndex] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    const parsedDetents = useMemo(() => {
        return detents
            .map((d) => {
                if (typeof d === 'number') {
                    return d;
                } else if (typeof d === 'string') {
                    if (!d.endsWith('%')) {
                        return undefined;
                    }
                    const parsed = +d.slice(0, -1);
                    if (Number.isNaN(parsed)) {
                        return undefined;
                    }
                    return Math.round((parsed / 100) * viewportHeight);
                }
                return undefined;
            })
            .filter((v) => v !== undefined) as number[];
    }, [detents, viewportHeight]);

    const currentDetent = parsedDetents[currentDetentIndex];
    const largetsDetent = parsedDetents[parsedDetents.length - 1];
    const isLargestDetent = currentDetentIndex === parsedDetents.length - 1;
    const isSmallestDetent = currentDetentIndex === 0;

    const [opened, open] = useState(permanent);

    const [origin, setOrigin] = useState<number | null>(null);
    const [transform, setTransform] = useState<number>(0);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const sheetContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const resizeListener = throttle(() => {
                setViewportHeight(window.innerHeight);
            }, 100);
            setViewportHeight(window.innerHeight);
            window.addEventListener('resize', resizeListener);
            return () => {
                window.removeEventListener('resize', resizeListener);
            };
        }
    }, []);

    const handleDissmiss = useCallback(() => {
        if (!permanent) {
            setCurrentDetendIndex(0);
            open(false);
        }
    }, [permanent]);

    const handleGestureStart = useCallback((y: number) => {
        const scrollTop = scrollContainerRef.current?.scrollTop;
        if (scrollTop !== undefined && scrollTop <= 0) {
            setOrigin(y);
        }
    }, []);

    const handleGestureMove = useCallback(
        (y: number) => {
            if (origin !== null) {
                const delta = y - origin;
                const isSingleDetent = parsedDetents.length === 1;
                if (isSingleDetent) {
                    setTransform(
                        delta >= 0 && !permanent ? delta : inertialize(delta)
                    );
                } else if (isLargestDetent) {
                    setTransform(delta >= 0 ? delta : 0);
                } else if (isSmallestDetent) {
                    setTransform(
                        delta <= 0 || !permanent ? delta : inertialize(delta)
                    );
                } else {
                    setTransform(delta);
                }
            }
        },
        [
            parsedDetents.length,
            isLargestDetent,
            isSmallestDetent,
            origin,
            permanent,
        ]
    );

    const handleGestureEnd = useCallback(() => {
        if (transform > expansionSwitchThreshold) {
            if (!permanent && isSmallestDetent) {
                open(false);
            } else {
                setCurrentDetendIndex((i) => i - 1);
                scrollContainerRef.current?.scrollTo(0, 0);
            }
        } else if (transform < -expansionSwitchThreshold) {
            setCurrentDetendIndex((i) => i + 1);
        }
        setOrigin(null);
        setTransform(0);
    }, [expansionSwitchThreshold, isSmallestDetent, permanent, transform]);

    const handleGestureCancel = useCallback(() => {
        setOrigin(null);
        setTransform(0);
    }, []);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            const y = e.touches[0].pageY;
            handleGestureStart(y);
        },
        [handleGestureStart]
    );
    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            const y = e.touches[0].pageY;
            handleGestureMove(y);
        },
        [handleGestureMove]
    );

    const handlePointerDown = useCallback(
        (e: PointerEvent) => {
            handleGestureStart(e.clientY);
        },
        [handleGestureStart]
    );
    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            handleGestureMove(e.clientY);
        },
        [handleGestureMove]
    );

    useImperativeHandle(
        ref,
        () => {
            return {
                scrollContainer: scrollContainerRef.current,
                open() {
                    open(true);
                },
                close() {
                    open(false);
                },
                expand() {
                    setCurrentDetendIndex((v) =>
                        v < parsedDetents.length - 1 ? v + 1 : v
                    );
                },
                expandToIndex(i) {
                    setCurrentDetendIndex(i);
                },
                collapse() {
                    setCurrentDetendIndex((v) => (v > 0 ? v - 1 : v));
                },
            };
        },
        [parsedDetents.length]
    );

    const resultingTransform = transform + (opened ? -currentDetent : 0);

    const content = (
        <div
            ref={sheetContainerRef}
            id="bottom-sheet-container"
            className="pointer-events-none fixed overflow-hidden overscroll-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handleGestureEnd}
        >
            <div
                id="bottom-sheet-dim"
                onPointerDown={handleDissmiss}
                className={`${
                    opened && currentDetentIndex > largestUndimmedDetentIndex
                        ? 'pointer-events-auto touch-none overscroll-none bg-zinc-950/60'
                        : 'pointer-events-none bg-zinc-950/0'
                } fixed inset-0 transition-colors`}
            ></div>
            <div
                aria-modal
                role="dialog"
                style={{
                    // TODO: support overdrag above largest detent. Minimum solution (works choppy on iOS):
                    // height: Math.abs(transform) > 0 ? 'auto' : `${largetsDetent}px`,
                    height: `${largetsDetent}px`,
                    bottom: 0,
                    transform: `translate3d(0, calc(100% + ${resultingTransform}px), 0)`,
                }}
                className={`${
                    transform === 0
                        ? 'transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'
                        : ''
                } pointer-events-auto fixed inset-x-0 mx-auto flex w-full max-w-3xl shrink-0 flex-col rounded-t-2xl bg-white drop-shadow-xl will-change-transform ${className}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleGestureEnd}
                onTouchCancel={handleGestureCancel}
            >
                <div
                    id="bottom-sheet-grabber"
                    className={`${
                        grabberVisible ? 'flex' : 'hidden'
                    } shrink-0 cursor-ns-resize touch-none justify-center py-3`}
                    onPointerDown={handlePointerDown}
                    onPointerCancel={handleGestureCancel}
                >
                    <span className="h-1 w-8 rounded-full bg-zinc-950/20"></span>
                </div>
                <div
                    id="bottom-sheet-content"
                    style={{
                        marginBottom: `${largetsDetent + resultingTransform}px`,
                    }}
                    ref={scrollContainerRef}
                    // TODO: apply easingClasses only when sheet is collapsing
                    className={`${
                        transform === 0
                            ? 'transition-[margin-bottom] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'
                            : ''
                    } h-full ${grabberVisible ? '' : 'pt-3'} ${
                        transform !== 0
                            ? 'overscroll-none'
                            : 'overscroll-contain'
                    } ${isLargestDetent ? '' : 'touch-none'} overflow-y-auto`}
                >
                    {children}
                </div>
            </div>
        </div>
    );

    const [isClientRender, setIsClientRender] = useState(false);

    useEffect(() => {
        if (!isClientRender && !standalone) {
            setIsClientRender(true);
        }
    }, [isClientRender, standalone]);

    if (standalone) {
        return content;
    }

    // only return content during client renders (with SSR - the second and subsequent ones)
    return isClientRender
        ? createPortal(content, domNode ?? document.body)
        : null;
});

const MemoizedSheet = memo(Sheet);

export default MemoizedSheet;
