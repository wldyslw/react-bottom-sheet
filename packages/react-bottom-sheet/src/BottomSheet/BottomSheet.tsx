import {
    memo,
    forwardRef,
    useState,
    useCallback,
    useRef,
    type TouchEvent,
    type PointerEvent,
    useImperativeHandle,
    useEffect,
    useMemo,
} from 'react';
import { createPortal } from 'react-dom';

import throttle from './throttle';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';

import './index.css';

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
    const [currentDetentIndex, setCurrentDetentIndex] = useState(0);
    const [prevDetentIndex, setPrevDetentIndex] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    const updateDetentIndex = useCallback<typeof setCurrentDetentIndex>(
        (value) => {
            setCurrentDetentIndex(value);
            setPrevDetentIndex(currentDetentIndex);
        },
        [currentDetentIndex]
    );

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
            updateDetentIndex(0);
            open(false);
        }
    }, [permanent, updateDetentIndex]);

    const handleGestureStart = useCallback((y: number) => {
        setOrigin(y);
    }, []);

    const handleGestureMove = useCallback(
        (y: number) => {
            if (origin !== null) {
                const delta = y - origin;
                if (isLargestDetent) {
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
        [isLargestDetent, isSmallestDetent, origin, permanent]
    );

    const handleGestureEnd = useCallback(() => {
        if (transform > expansionSwitchThreshold) {
            if (!permanent && isSmallestDetent) {
                open(false);
            } else {
                updateDetentIndex((i) => i - 1);
                scrollContainerRef.current?.scrollTo(0, 0);
            }
        } else if (transform < -expansionSwitchThreshold) {
            updateDetentIndex((i) => i + 1);
        }
        setOrigin(null);
        setTransform(0);
    }, [
        expansionSwitchThreshold,
        isSmallestDetent,
        permanent,
        transform,
        updateDetentIndex,
    ]);

    const handleGestureCancel = useCallback(() => {
        setOrigin(null);
        setTransform(0);
    }, []);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            const scrollTop = scrollContainerRef.current?.scrollTop;
            if (scrollTop !== undefined && scrollTop <= 0) {
                const y = e.touches[0].pageY;
                handleGestureStart(y);
            }
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
                scrollContainer: scrollContainerRef,
                open() {
                    open(true);
                },
                close() {
                    open(false);
                },
                expand() {
                    updateDetentIndex((v) =>
                        v < parsedDetents.length - 1 ? v + 1 : v
                    );
                },
                expandToIndex(i) {
                    updateDetentIndex(i);
                },
                collapse() {
                    updateDetentIndex((v) => (v > 0 ? v - 1 : v));
                },
            };
        },
        [parsedDetents.length, updateDetentIndex]
    );

    // Math.max restricst expansion up to largest detent
    const resultingTransform = Math.max(
        transform + (opened ? -currentDetent : 0),
        -largetsDetent
    );

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
                className={`pointer-events-auto fixed inset-x-0 mx-auto flex w-full max-w-3xl shrink-0 flex-col rounded-t-2xl bg-white drop-shadow-xl will-change-transform ${
                    transform === 0
                        ? 'transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'
                        : ''
                } ${className}`}
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
                    // Easing is only applied when sheet is collapsing
                    className={`h-full overflow-y-auto ${
                        opened &&
                        transform === 0 &&
                        prevDetentIndex > currentDetentIndex
                            ? 'transition-[margin-bottom] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'
                            : ''
                    } ${grabberVisible ? '' : 'pt-3'} ${
                        transform !== 0
                            ? 'overscroll-none'
                            : 'overscroll-contain'
                    } ${isLargestDetent ? '' : 'touch-none'}`}
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
