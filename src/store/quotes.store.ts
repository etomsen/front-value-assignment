import { createStore } from '@stencil/store';
import { getRandomQuote, getRandomQuotes, Quote } from '../api/chucknorris.api';

export const loadingQuotes = Symbol('Loading quotes');
export const COUNT = 10;

export interface QuotesState {
    state?: typeof loadingQuotes | Error;
    ids: Set<string>;
    favsIds: Set<string>;
    favs: Array<Quote>;
    quotes: Array<Quote>;
}
const savedQuotes: Array<Quote> = JSON.parse(localStorage.getItem('quotes') || '[]') as unknown as Quote[];
const savedFavs: Array<Quote> = JSON.parse(localStorage.getItem('favs') || '[]') as unknown as Quote[];

const quotesStore = createStore<QuotesState>({
    quotes: savedQuotes,
    favs: savedFavs,
    ids: new Set(savedQuotes.map(q => q.id)),
    favsIds: new Set(savedFavs.map(q => q.id)),
});

const { onChange, set, state } = quotesStore;

onChange('quotes', quotes => {
    set('ids', new Set(quotes.map(q => q.id)));
    localStorage.setItem('quotes', JSON.stringify(state.quotes));
});

onChange('favs', quotes => {
    set('favsIds', new Set(quotes.map(q => q.id)));
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
    return state.quotes.map(q => ({ ...q, isFav: state.favsIds.has(q.id) }));
}

export default state;
