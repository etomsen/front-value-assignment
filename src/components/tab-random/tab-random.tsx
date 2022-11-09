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

    rerenderItem?: string;

    componentWillLoad() {
        actionFetchQuotes();
    }

    componentDidRender() {
        delete this.rerenderItem;
    }

    @Listen('toggleFav')
    handleToggleFav(e: CustomEvent<StoreQuote>) {
        const quote = e.detail;
        debugger;
        try {
            actionToggleFav(quote);
            this.rerenderItem = quote.key;
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
        if (role === 'confirm') {
            actionToggleFav(quote, true);
            this.rerenderItem = quote.key;
        }
        this.suspendFetching = false;
    }

    render() {
        const quotes = selectQuotes();
        const ids = quotes.map((q, index) => ({ id: q.key, rerender: index === 0 || this.rerenderItem === q.key }));

        console.log(this.rerenderItem);
        console.log(ids);
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
