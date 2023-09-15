const tabbableSelectors = [
    'a[href]',
    'button',
    'textarea',
    'input[type="text"]',
    'input[type="radio"]',
    'input[type="checkbox"]',
    'select',
    '[tabindex]',
]
    .map((selector) => selector + ':not([disabled]):not([tabindex^="-"])')
    .join(', ');

const cache = new WeakMap<HTMLElement, HTMLElement[]>();

/**
 * Traps focus within bottom sheet
 * @param within Element to search focusable elements within
 * @param event Keyboard event
 */
export default function trapFocus(within: HTMLElement, event: KeyboardEvent) {
    let tabbableElements: HTMLElement[];
    if (cache.has(within)) {
        tabbableElements = cache.get(within) as HTMLElement[];
    } else {
        tabbableElements = Array.from(
            within.querySelectorAll(tabbableSelectors)
        );
        cache.set(within, tabbableElements);
    }

    if (tabbableElements.length === 0) {
        event.preventDefault();
        return;
    }

    const activeElement = document.activeElement;
    const firstTabbable = tabbableElements[0];
    const lastTabbable = tabbableElements[tabbableElements.length - 1];

    if (event.shiftKey && activeElement === firstTabbable) {
        lastTabbable.focus();
        event.preventDefault();
    } else if (!event.shiftKey && activeElement === lastTabbable) {
        firstTabbable.focus();
        event.preventDefault();
    }
}
