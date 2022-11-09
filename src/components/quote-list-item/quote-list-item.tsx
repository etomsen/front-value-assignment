import { Event, EventEmitter, Component, Prop, h, Watch } from '@stencil/core';
import { StoreQuote, actionFetchRandomQuote, actionToggleFav } from '../../store/quotes.store';

@Component({
    tag: 'quote-list-item',
    styleUrl: 'quote-list-item.scss',
    shadow: true,
})
export class QuoteListItemComponent {
    @Prop()
    quote: StoreQuote;

    @Prop()
    fetchNext = false;

    @Event()
    toggleFav: EventEmitter<StoreQuote>;

    fetchNextTimer?: NodeJS.Timeout;

    abortController?: AbortController;

    componentDidRender() {
        if (this.fetchNext && !this.fetchNextTimer) {
            this.fetchNextTimer = setTimeout(this.fetchNewQuote.bind(this), 5000);
        }
    }

    @Watch('fetchNext')
    onFetchNextChange(next: boolean, prev: boolean) {
        if (prev && !next && this.fetchNextTimer) {
            clearTimeout(this.fetchNextTimer);
            delete this.fetchNextTimer;
            if (this.abortController) {
                this.abortController.abort();
            }
        }
    }

    handleFavClick() {
        this.toggleFav.emit(this.quote);
    }

    async fetchNewQuote() {
        clearTimeout(this.fetchNextTimer);
        delete this.fetchNextTimer;
        try {
            this.abortController = new AbortController();
            setTimeout(() => this.abortController.abort(), 5000);
            await actionFetchRandomQuote(this.abortController);
        } catch (error) {
            this.fetchNextTimer = setTimeout(this.fetchNewQuote.bind(this), 5000);
        }
    }

    disconnectedCallback() {
        if (this.fetchNextTimer) {
            clearTimeout(this.fetchNextTimer);
            delete this.fetchNextTimer;
        }
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    render() {
        return (
            <ion-item>
                <io-label>
                    <p>{this.quote.text}</p>
                </io-label>
                <ion-button onClick={this.handleFavClick.bind(this)} slot="end" color="light">
                    <ion-icon class={{ 'fav-icon': true, 'fav-icon--is-fav': this.quote.isFav }} src="assets/icon/star.svg" slot="icon-only"></ion-icon>
                </ion-button>
            </ion-item>
        );
    }
}
