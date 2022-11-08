import { Component, Prop, h, Watch } from '@stencil/core';
import { actionFetchRandomQuote } from '../../store/quotes.store';

@Component({
    tag: 'quote-list-item',
    styleUrl: 'quote-list-item.scss',
    shadow: true,
})
export class QuoteListItemComponent {
    @Prop()
    id: string;

    @Prop()
    text: string;

    @Prop()
    isFav: boolean;

    @Prop()
    fetchNext = false;

    fetchNextTimer?: NodeJS.Timeout;

    componentDidRender() {
        if (this.fetchNext) {
            console.log(`Fetch next ${this.id}`, this.fetchNext);
            this.fetchNextTimer = setTimeout(this.fetchNewQuote.bind(this), 5000);
        }
    }

    @Watch('fetchNext')
    onFetchNextChange(prev: boolean, next: boolean) {
        console.log('Clearing timeout');
        if (prev && !next && this.fetchNextTimer) {
            clearTimeout(this.fetchNextTimer);
        }
    }

    async fetchNewQuote() {
        console.log('Fetching new from', this.id);
        try {
            await actionFetchRandomQuote();
        } catch (error) {
            clearTimeout(this.fetchNextTimer);
            this.fetchNextTimer = setTimeout(this.fetchNewQuote.bind(this), 5000);
        }
    }

    disconnectedCallback() {
        if (this.fetchNextTimer) {
            clearTimeout(this.fetchNextTimer);
        }
    }

    render() {
        return (
            <ion-item>
                <io-label>{this.text}</io-label>
                <ion-button slot="end">
                    <ion-icon slot="icon-only"></ion-icon>
                </ion-button>
            </ion-item>
        );
    }
}
