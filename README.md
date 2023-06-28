# React Bottom Sheet Component

![npm (scoped)](https://img.shields.io/npm/v/%40wldyslw/react-bottom-sheet)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40wldyslw/react-bottom-sheet)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/%40wldyslw/react-bottom-sheet)

-   ⚡️ **PERFORMANT**: every motion is done purely with CSS transforms, providing near-native UX.
-   🪶 **LIGHTWEIGHT**: **~36kb** uncompressed, **~11kb** gziped. **0 dependencies**.
-   🧘 **MINIMALISTIC**: nothing redundant, yet everything you may need.
-   ⚙️ **TYPED**: writen in TypeScript, so `.d.ts` file with prop and ref types included.

# Getting Started

1. Install the package:

```sh
pnpm install @wldyslw/react-bottom-sheet
```

2. Use it:

```js
import { useRef } from 'react';
import BottomSheet from '@wldyslw/react-bottom-sheet';
import '@wldyslw/react-bottom-sheet/lib/style.css'; // don't forget styles!

function App() {
    const sheetRef = useRef(null);

    return (
        <>
            <button onClick={() => sheetRef.current?.open()}>Open Sheet</button>
            <BottomSheet ref={sheetRef}>Hello!</BottomSheet>
        </>
    );
}
```

# API Reference

## Props

| Name                          | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children?`                   | `ReactNode`              | Sheet's content                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `className?`                  | `string`                 | Additional class names that will be applied to the sheet                                                                                                                                                                                                                                                                                                                                                                                                      |
| `detents?`                    | (`string` \| `number`)[] | Array of detent values that sheet should stick to. Each detent be either a number of pixels or a percentage of the vertical viewport, both counting from the bottom to the top. Non-`number` or inapropriately formatted `string` values will be ignored. **IMPORTANT**: Detents should be in order from smallest to largest, otherwise the result might look stange. **`Example`** `[100, 200, 300] [100, "50%"], ["90%"], ` **`Default`** `["50%", "97%"] ` |
| `expansionSwitchThreshold?`   | `number`                 | Amount of pixels that sheet should be dragged before switching expanded state **`Default`** `50 `                                                                                                                                                                                                                                                                                                                                                             |
| `grabberVisible?`             | `boolean`                | A Boolean value that determines whether the sheet shows a grabber at the top. **`Default`** `false `                                                                                                                                                                                                                                                                                                                                                          |
| `largestUndimmedDetentIndex?` | `number`                 | The largest detent's index that doesn’t dim the view underneath the sheet. Default value is `-1` which means that dim is always enabled. **`Default`** `-1 `                                                                                                                                                                                                                                                                                                  |
| `permanent?`                  | `boolean`                | Controls whether sheet persists on page or not **`Default`** `false `                                                                                                                                                                                                                                                                                                                                                                                         |

## Ref Object Properties

| Name              | Type                       | Description                                            |
| :---------------- | :------------------------- | :----------------------------------------------------- |
| `close`           | () => `void`               | Closes sheet                                           |
| `collapse`        | () => `void`               | Collapses sheet one detent down                        |
| `expand`          | () => `void`               | Expands sheet one detent up                            |
| `expandToIndex`   | (`i`: `number`) => `void`  | Expands sheet to specific detent by it's index         |
| `open`            | () => `void`               | Opens sheet                                            |
| `scrollContainer` | `HTMLDivElement` \| `null` | Reference to the DOM node which holds sheet's children |

# Credits

Some project solutions heavily inspired by [stipsan's react-spring-bottom-sheet](https://github.com/stipsan/react-spring-bottom-sheet).
Despite being no longer maintained, this project is still in order of magnitude more complex and mature than mine.

# License

MIT
