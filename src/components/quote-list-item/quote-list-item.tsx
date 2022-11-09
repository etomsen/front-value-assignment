import { Component, Prop, h, Watch } from '@stencil/core';
import { StoreQuote, actionFetchRandomQuote, actionToggleFav } from '../../store/quotes.store';

@Component({
    tag: 'quote-list-item',
    styleUrl: 'quote-list-item.scss',
    shadow: true,
})
export class QuoteListItemComponent {
    @Prop({ mutable: true })
    quote: StoreQuote;

    @Prop()
    fetchNext = false;

    fetchNextTimer?: NodeJS.Timeout;

    componentDidRender() {
        if (this.fetchNext) {
            this.fetchNextTimer = setTimeout(this.fetchNewQuote.bind(this), 5000);
        }
    }

    @Watch('fetchNext')
    onFetchNextChange(prev: boolean, next: boolean) {
        if (prev && !next && this.fetchNextTimer) {
            clearTimeout(this.fetchNextTimer);
        }
    }

    handleFavClick() {
        try {
            actionToggleFav(this.quote);
            this.quote = { ...this.quote, isFav: !this.quote.isFav };
        } catch (error) {
            this.showFavError(error);
        }
    }

    async showFavError(error: Error) {
        const confirmationDialog = document.createElement('ion-alert');
        confirmationDialog.header = error.message;
        confirmationDialog.buttons = [
            {
                text: 'Cancel',
                role: 'cancel',
            },
            {
                text: 'OK',
                role: 'confirm',
            },
        ];

        document.body.appendChild(confirmationDialog);
        await confirmationDialog.present();

        const { role } = await confirmationDialog.onDidDismiss();
        alert(role);
    }

    async fetchNewQuote() {
        clearTimeout(this.fetchNextTimer);
        try {
            await actionFetchRandomQuote();
        } catch (error) {
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
                <io-label>{this.quote.text}</io-label>
                <ion-button onClick={this.handleFavClick.bind(this)} slot="end" color="light">
                    <ion-icon class={{ 'fav-icon': true, 'fav-icon--is-fav': this.quote.isFav }} src="assets/icon/star.svg" slot="icon-only"></ion-icon>
                </ion-button>
            </ion-item>
        );
    }
}
