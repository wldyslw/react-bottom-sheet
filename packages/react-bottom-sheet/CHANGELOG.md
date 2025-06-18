# @wldyslw/react-bottom-sheet

## 0.4.0

### Minor Changes

-   ecbbdb5: Keyboard controls introduced: `Esc` key closes sheet, focus persists within it when user uses `Tab` key. Appreciations section expanded

### Patch Changes

-   e1e8c77: Type definitions moved to separate file; `scrollContainerRef` handle now receives ref, not DOM node

## 0.3.1

### Patch Changes

-   2741ee6: Sheet can now be expanded on desktop if scroll container has non-zero scroll.
    Mobile behaviour left unchanged.
    Resolves #3 (https://github.com/wldyslw/react-bottom-sheet/issues/3)
-   3e7451b: Sheet's overdrag is restricted up to largest detent, resolving #1 (https://github.com/wldyslw/react-bottom-sheet/issues/1)
    Also, bottom margin that allows scroll on non-largest detents (primarly on desktop) now receives easing (css transition) only when sheet collapses

## 0.3.0

### Minor Changes

-   4c9eb9a: By default, bottom sheet is now rendered on client only (resolves #4).

    Also `standalone` and `domNode` props added for advanced control over mounting and rendering.
