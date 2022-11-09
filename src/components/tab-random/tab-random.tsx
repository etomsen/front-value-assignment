import { Component, h } from '@stencil/core';
import { actionFetchQuotes, selectQuotes } from '../../store/quotes.store';

@Component({
    tag: 'tab-random',
    styleUrl: 'tab-random.css',
    shadow: true,
})
export class TabRandom {
    componentWillLoad() {
        actionFetchQuotes();
    }

    render() {
        const quotes = selectQuotes();
        const ids = quotes.map(q => q.key);
        return (
            <virtual-queue
                ids={ids}
                renderItem={(i: number) => {
                    return <quote-list-item fetchNext={i === 0} quote={quotes[i]}></quote-list-item>;
                }}
            ></virtual-queue>
        );
    }
}
