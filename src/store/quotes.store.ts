import { createStore } from '@stencil/store';
import { getRandomQuote, getRandomQuotes, Quote } from '../api/chucknorris.api';

export const loadingQuotes = Symbol('Loading quotes');
export const COUNT = 10;

export interface StoreQuote extends Quote {
    isFav?: boolean;
    key: string; // unique key. quotes with same id within a queue have different keys
}

export interface QuotesState {
    state?: typeof loadingQuotes | Error;
    favIndices: Map<string, number>;
    favs: Array<Quote>;
    quotes: Array<StoreQuote>;
}
const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]') as unknown as StoreQuote[];
const savedFavs = JSON.parse(localStorage.getItem('favs') || '[]') as unknown as Quote[];

const quotesStore = createStore<QuotesState>({
    quotes: savedQuotes,
    favs: savedFavs,
    favIndices: new Map(savedFavs.map((q, index) => [q.id, index])),
});

const { onChange, set, state } = quotesStore;

onChange('quotes', quotes => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
    try {
        const q = await getRandomQuote({ abortController });
        set('quotes', [{ ...q, key: generateQuoteKey() }, ...state.quotes]);
        set('state', undefined);
        setTimeout(() => {
            const quotes = state.quotes.slice(0, -1);
            set('quotes', quotes);
        }, 1000);
    } catch (error) {
        set('state', error);
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
    if (state.quotes.length === COUNT) {
        set('state', undefined);
        return;
    }
    set('state', loadingQuotes);
    try {
        const quotes = await getRandomQuotes(COUNT);
        set(
            'quotes',
            quotes.map(q => ({ ...q, key: generateQuoteKey() })),
        );
        set('state', undefined);
    } catch (error) {
        set('state', error);
    }
}

export function selectLoadingQuotes() {
    return state.state === loadingQuotes;
}

export function selectQuotes() {
    return state.quotes.map(q => ({ ...q, isFav: state.favIndices.has(q.id) }));
}

export default state;
