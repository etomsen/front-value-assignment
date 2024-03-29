import { SegmentCustomEvent } from '@ionic/core';
import { Component, h, State } from '@stencil/core';
import { selectFavsCount, selectLoadingQuotes } from '../store/quotes.store';

@Component({
    tag: 'app-root',
    styleUrl: 'app.scss',
    scoped: true,
})
export class AppRoot {
    @State()
    activeTab = 'random';

    onTabChange(event: SegmentCustomEvent) {
        this.activeTab = event.detail.value;
    }

    render() {
        return (
            <ion-app>
                <ion-header translucent>
                    <ion-toolbar>
                        <ion-title>Chack Norris Quotes</ion-title>
                    </ion-toolbar>
                    <ion-toolbar>
                        <ion-segment value={this.activeTab} color="primary" onIonChange={this.onTabChange.bind(this)}>
                            <ion-segment-button value="random">Random quotes</ion-segment-button>
                            <ion-segment-button value="favs" layout="icon-end">
                                <span class="favs-btn__text">Favourite quotes</span>
                                <ion-badge class="favs-btn__badge">{selectFavsCount()}</ion-badge>
                            </ion-segment-button>
                        </ion-segment>
                        {selectLoadingQuotes() && <ion-progress-bar color="primary" type="indeterminate"></ion-progress-bar>}
                    </ion-toolbar>
                </ion-header>
                <ion-content fullscreen>
                    {this.activeTab === 'random' && <tab-random></tab-random>}
                    {this.activeTab === 'favs' && <tab-favs></tab-favs>}
                </ion-content>
                <ion-toast></ion-toast>
            </ion-app>
        );
    }
}
