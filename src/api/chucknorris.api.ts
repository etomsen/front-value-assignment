export interface Quote {
    id: string;
    text: string;
}

export async function getRandomQuotes(count: number): Promise<Array<Quote>> {
    const abortController = new AbortController();
    const promises = Array(count)
        .fill(null)
        .map(() => getRandomQuote({ abortController }));

    const timeoutId = setTimeout(() => abortController.abort(), 5000);
    const all = await Promise.allSettled(promises);

    clearTimeout(timeoutId);
    const result = all.map(p => (p.status === 'fulfilled' ? p.value : null)).filter(Boolean);
    if (!result.length) {
        throw new Error('Chack Norris did not want u to read any quote');
    }
    const ids = new Set();
    return result.reduce((result, q) => {
        if (!ids.has(q.id)) {
            result.push(q);
        }
        return result;
    }, []);
}

export interface GetQuoteOptions {
    abortController?: AbortController;
    timeoutMs?: number;
}

export async function getRandomDistinctQuote(excludeIds: Set<string>, options: GetQuoteOptions = {}): Promise<Quote> {
    const abortController = options.abortController || new AbortController();
    if (!options.abortController) {
        var timeoutId = setTimeout(() => abortController.abort(), options.timeoutMs || 5000);
    }
    const fuse = 100;
    for (let i = 0; i < fuse; i++) {
        const q = await getRandomQuote(options);
        if (!excludeIds.has(q.id)) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            return q;
        }
    }
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    throw new Error('Chanck Norris thinks that you already know all his random quotes!');
}

export async function getRandomQuote(options: GetQuoteOptions = {}): Promise<Quote> {
    const abortController = options.abortController || new AbortController();
    if (!options.abortController) {
        var timeoutId = setTimeout(() => abortController.abort(), options.timeoutMs || 5000);
    }
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            signal: abortController.signal,
        });
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (!response.ok) {
            //console.error('getRandomQuote API failed with status', response.status);
            throw new Error('Chack Norris prevented you of fetching a random quote');
        }
        const json = await response.json();
        return {
            id: json.id,
            text: json.value,
        };
    } catch (error) {
        //console.error(error);
        if (!options.abortController && error.name === 'AbortError') {
            throw error;
        }
        throw new Error('Chack Norris prevented of of fetching this random quote');
    }
}
