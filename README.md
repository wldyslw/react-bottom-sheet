# React Bottom Sheet Component

[![npm
    (scoped)](https://img.shields.io/npm/v/%40wldyslw/react-bottom-sheet)](https://www.npmjs.com/package/@wldyslw/react-bottom-sheet)
[![npm bundle size
    (scoped)](https://img.shields.io/bundlephobia/min/%40wldyslw/react-bottom-sheet)](https://bundlephobia.com/package/@wldyslw/react-bottom-sheet)
[![npm bundle size
    (scoped)](https://img.shields.io/bundlephobia/minzip/%40wldyslw/react-bottom-sheet)](https://bundlephobia.com/package/@wldyslw/react-bottom-sheet)

![Screenshot of sheet's example usage](./promo/screenshot.png)

-   ⚡️ **PERFORMANT**: every motion is done purely with CSS transforms, providing near-native UX.
-   🪶 **LIGHTWEIGHT**: **~4.6kb** mifified UMD, **~2.1kb** gziped. **0 dependencies**.
-   🧘 **MINIMALISTIC**: nothing redundant, yet everything you may need.
-   ⚙️ **TYPED**: writen in TypeScript, so `.d.ts` file with prop and ref types included!

# Getting Started

1. Install the package:

```sh
pnpm install @wldyslw/react-bottom-sheet
```

2. Use it:

```js
import { useRef } from 'react';
import BottomSheet from '@wldyslw/react-bottom-sheet';
// don't forget styles! If you use TailwindCSS, you can include package to config.content and save even more precious kilobytes!
import '@wldyslw/react-bottom-sheet/lib/style.css';

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

# Docs

You can check API Reference as well as examples at official [docs page](https://wldyslw.github.io/react-bottom-sheet)

# Appreciations

-   Some project solutions heavily inspired by [stipsan's react-spring-bottom-sheet](https://github.com/stipsan/react-spring-bottom-sheet).
    Despite being no longer actively maintained, this project is still in order of magnitude more complex and mature than mine.

-   A11y improvements wouldn't be possible without [KittyGiraudel's a11y-dialog package](https://github.com/KittyGiraudel/a11y-dialog).

# License

MIT
