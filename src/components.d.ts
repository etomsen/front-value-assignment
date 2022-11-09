/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { StoreQuote } from "./store/quotes.store";
import { ChildType } from "@stencil/core/internal";
export namespace Components {
    interface AppRoot {
    }
    interface QuoteListItem {
        "fetchNext": boolean;
        "quote": StoreQuote;
    }
    interface TabFavs {
    }
    interface TabRandom {
    }
    interface VirtualQueue {
        "ids": Array<string>;
        "renderItem": (index: number, id: string) => ChildType;
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLQuoteListItemElement extends Components.QuoteListItem, HTMLStencilElement {
    }
    var HTMLQuoteListItemElement: {
        prototype: HTMLQuoteListItemElement;
        new (): HTMLQuoteListItemElement;
    };
    interface HTMLTabFavsElement extends Components.TabFavs, HTMLStencilElement {
    }
    var HTMLTabFavsElement: {
        prototype: HTMLTabFavsElement;
        new (): HTMLTabFavsElement;
    };
    interface HTMLTabRandomElement extends Components.TabRandom, HTMLStencilElement {
    }
    var HTMLTabRandomElement: {
        prototype: HTMLTabRandomElement;
        new (): HTMLTabRandomElement;
    };
    interface HTMLVirtualQueueElement extends Components.VirtualQueue, HTMLStencilElement {
    }
    var HTMLVirtualQueueElement: {
        prototype: HTMLVirtualQueueElement;
        new (): HTMLVirtualQueueElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "quote-list-item": HTMLQuoteListItemElement;
        "tab-favs": HTMLTabFavsElement;
        "tab-random": HTMLTabRandomElement;
        "virtual-queue": HTMLVirtualQueueElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface QuoteListItem {
        "fetchNext"?: boolean;
        "quote"?: StoreQuote;
    }
    interface TabFavs {
    }
    interface TabRandom {
    }
    interface VirtualQueue {
        "ids": Array<string>;
        "renderItem": (index: number, id: string) => ChildType;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "quote-list-item": QuoteListItem;
        "tab-favs": TabFavs;
        "tab-random": TabRandom;
        "virtual-queue": VirtualQueue;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "quote-list-item": LocalJSX.QuoteListItem & JSXBase.HTMLAttributes<HTMLQuoteListItemElement>;
            "tab-favs": LocalJSX.TabFavs & JSXBase.HTMLAttributes<HTMLTabFavsElement>;
            "tab-random": LocalJSX.TabRandom & JSXBase.HTMLAttributes<HTMLTabRandomElement>;
            "virtual-queue": LocalJSX.VirtualQueue & JSXBase.HTMLAttributes<HTMLVirtualQueueElement>;
        }
    }
}
