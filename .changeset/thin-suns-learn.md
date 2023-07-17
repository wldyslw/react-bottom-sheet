---
'@wldyslw/react-bottom-sheet': patch
---

Sheet's overdrag is restricted up to largest detent, resolving #1 (https://github.com/wldyslw/react-bottom-sheet/issues/1)
Also, bottom margin that allows scroll on non-largest detents (primarly on desktop) now receives easing (css transition) only when sheet collapses
