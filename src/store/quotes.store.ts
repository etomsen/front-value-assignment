import { toastController } from '@ionic/core';
import { createStore } from '@stencil/store';
import { getRandomDistinctQuote, getRandomQuotes, Quote } from '../api/chucknorris.api';

export const loadingQuotes = Symbol('Loading quotes');
export const COUNT = 10;

export interface StoreQuote extends Quote {
    isFav?: boolean;
    key: string; // unique key (in case we have duplicates in the list)
}

export interface QuotesState {
    state?: typeof loadingQuotes | Error;
    favIndices: Map<string, number>;
    favs: Array<Quote>;
    quotes: Array<StoreQuote>;
}
const savedFavs = JSON.parse(localStorage.getItem('favs') || '[]') as unknown as Quote[];
const createToast = toastController.create.bind(toastController);

const quotesStore = createStore<QuotesState>({
    quotes: [],
    favs: savedFavs,
    favIndices: new Map(savedFavs.map((q, index) => [q.id, index])),
});

const { onChange, set, state } = quotesStore;

onChange('state', async state => {
    if (state instanceof Error) {
        const errToast = await createToast({
            message: (state as Error).message,
            duration: 4000,
            cssClass: 'error-toast',
        });
        await errToast.present();
    }
});

onChange('favs', quotes => {
    set('favIndices', new Map(quotes.map((q, index) => [q.id, index])));
    localStorage.setItem('favs', JSON.stringify(state.favs));
});

function generateQuoteKey() {
    return String(Math.floor(Math.random() * Date.now()));
}

export async function actionFetchRandomQuote(abortController?: AbortController) {
    set('state', loadingQuotes);
    const ids = new Set(state.quotes.map(q => q.id));
    try {
        const q = await getRandomDistinctQuote(ids, { abortController });
        set('quotes', [{ ...q, key: generateQuoteKey() }, ...state.quotes]);
        set('state', undefined);
        setTimeout(() => {
            if (state.quotes.length > COUNT) {
                const quotes = state.quotes.slice(0, -1);
                set('quotes', quotes);
            }
        }, 1000);
    } catch (error) {
        set('state', error);
        throw error;
    }
}

export function actionToggleFav(quote: Quote, force = false) {
    const isFav = state.favIndices.has(quote.id);
    if (!isFav && state.favs.length === COUNT && !force) {
        throw new Error(`Chack does not allow you to save more than ${COUNT} quotes. Delete the oldest?`);
    }
    const index = state.favIndices.get(quote.id);
    if (isFav) {
        state.favs.splice(index, 1);
        set('favs', [...state.favs]);
    } else {
        const favs = state.favs.length < COUNT ? state.favs : state.favs.slice(0, -1);
        set('favs', [quote, ...favs]);
    }
}

export async function actionFetchQuotes() {
    set('state', loadingQuotes);
    if (state.quotes.length === COUNT) {
        set('state', undefined);
        return;
    }
    try {
        const quotes = await getRandomQuotes(COUNT);
        set(
            'quotes',
            quotes.map(q => ({ ...q, key: generateQuoteKey() })),
        );
        set('state', undefined);
    } catch (error) {
        set('state', error);
        throw error;
    }
}

export function selectLoadingQuotes() {
    return state.state === loadingQuotes;
}

export function selectQuotes() {
    return state.quotes.map(q => ({ ...q, isFav: state.favIndices.has(q.id) }));
}

export function selectFavs() {
    return state.favs.map(q => ({ ...q, isFav: true }));
}

export function selectFavsCount() {
    return state.favs.length;
}
export default state;
