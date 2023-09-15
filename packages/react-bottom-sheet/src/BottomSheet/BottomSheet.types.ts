import type { ReactNode, MutableRefObject } from 'react';

export interface BottomSheetRef {
    /**
     * Reference to the DOM node which holds sheet's children
     */
    scrollContainer: MutableRefObject<HTMLDivElement | null>;
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
