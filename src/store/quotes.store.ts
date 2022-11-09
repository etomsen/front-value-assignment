import { createStore } from '@stencil/store';
import { getRandomQuote, getRandomQuotes, Quote } from '../api/chucknorris.api';

export const loadingQuotes = Symbol('Loading quotes');
export const COUNT = 10;

export interface StoreQuote extends Quote {
    isFav?: boolean;
}

export interface QuotesState {
    state?: typeof loadingQuotes | Error;
    indices: Map<string, number>;
    favIndices: Map<string, number>;
    favs: Array<Quote>;
    quotes: Array<StoreQuote>;
}
const savedQuotes: Array<Quote> = JSON.parse(localStorage.getItem('quotes') || '[]') as unknown as Quote[];
const savedFavs: Array<Quote> = JSON.parse(localStorage.getItem('favs') || '[]') as unknown as Quote[];

const quotesStore = createStore<QuotesState>({
    quotes: savedQuotes,
    favs: savedFavs,
    indices: new Map(savedQuotes.map((q, index) => [q.id, index])),
    favIndices: new Map(savedFavs.map((q, index) => [q.id, index])),
});

const { onChange, set, state } = quotesStore;

onChange('quotes', quotes => {
    set('indices', new Map(quotes.map((q, index) => [q.id, index])));
    localStorage.setItem('quotes', JSON.stringify(state.quotes));
});

onChange('favs', quotes => {
    set('favIndices', new Map(quotes.map((q, index) => [q.id, index])));
    localStorage.setItem('favs', JSON.stringify(state.favs));
});

export async function actionFetchRandomQuote() {
    set('state', loadingQuotes);
    try {
        const q = await getRandomQuote();
        set('quotes', [q, ...state.quotes]);
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
    if (state.favs.length === COUNT && !force) {
        throw new Error(`Chack does not allow you to save more than ${COUNT} quotes. Delete the oldest?`);
    }
    if (state.indices.has(quote.id)) {
        // for performace optimization, don't rewrite the quotes array
        state.quotes[state.indices.get(quote.id)] = { ...state.quotes[state.indices.get(quote.id)], isFav: true };
    }
    if (state.favIndices.has(quote.id)) {
        set('favs', state.favs.splice(state.favIndices.get(quote.id)));
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
        set('quotes', await getRandomQuotes(COUNT));
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
