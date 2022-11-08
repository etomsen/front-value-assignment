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
        return <quote-queue items={selectQuotes()}></quote-queue>;
    }
}
