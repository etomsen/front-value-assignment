import { Component, State, h, Listen } from '@stencil/core';
import { actionFetchQuotes, actionToggleFav, selectQuotes, StoreQuote } from '../../store/quotes.store';

@Component({
    tag: 'tab-random',
    styleUrl: 'tab-random.css',
    shadow: true,
})
export class TabRandom {
    @State()
    suspendFetching = false;

    componentWillLoad() {
        actionFetchQuotes();
    }

    @Listen('toggleFav')
    handleToggleFav(quote: StoreQuote) {
        try {
            actionToggleFav(quote);
            quote = { ...quote, isFav: !quote.isFav };
        } catch (error) {
            this.showFavError(quote, error);
        }
    }

    async showFavError(quote: StoreQuote, error: Error) {
        this.suspendFetching = true;
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
        this.suspendFetching = false;
    }

    render() {
        const quotes = selectQuotes();
        const ids: Array<{ id: string; rerender?: boolean }> = quotes.map(q => ({ id: q.key }));
        ids[0].rerender = true;

        return (
            <virtual-queue
                ids={ids}
                renderItem={(i: number) => {
                    return <quote-list-item fetchNext={this.suspendFetching ? false : i === 0} quote={quotes[i]}></quote-list-item>;
                }}
            ></virtual-queue>
        );
    }
}
