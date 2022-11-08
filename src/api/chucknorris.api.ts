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
    // TODO: should we addintionally fetch the data if  some of promises have failed?
    // TODO: should we fetch distinct random quotes?

    clearTimeout(timeoutId);
    const result = all.map(p => (p.status === 'fulfilled' ? p.value : null)).filter(Boolean);
    if (!result.length) {
        throw new Error('Chack Norris did not want u to read any quote');
    }
    return result;
}

export async function getRandomQuote(options: { abortController?: AbortController; timeoutMs?: number } = {}): Promise<{ id: string; text: string }> {
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
            console.error('getRandomQuote API failed with status', response.status);
            throw new Error('Chack Norris prevented of of fetching this random quote');
        }
        const json = await response.json();
        return {
            id: json.id,
            text: json.value,
        };
    } catch (error) {
        console.error(error);
        if (!options.abortController && error.name === 'AbortError') {
            throw error;
        }
        throw new Error('Chack Norris prevented of of fetching this random quote');
    }
}
