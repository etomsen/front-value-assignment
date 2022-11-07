import { SegmentCustomEvent } from '@ionic/core';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'app-root',
    styleUrl: 'app.css',
    scoped: true,
})
export class AppRoot {
    @State()
    activeTab = 'random';

    onTabChange(event: SegmentCustomEvent) {
        console.log(event.detail);
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
                            <ion-segment-button value="favs">Favourite quotes</ion-segment-button>
                        </ion-segment>
                        <ion-progress-bar color="light" type="indeterminate"></ion-progress-bar>
                    </ion-toolbar>
                </ion-header>
                <ion-content fullscreen>
                    {this.activeTab === 'random' && <tab-random></tab-random>}
                    {this.activeTab === 'favs' && <tab-favs></tab-favs>}
                </ion-content>
            </ion-app>
        );
    }
}
