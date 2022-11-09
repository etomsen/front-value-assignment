import { Listen, Component, h } from '@stencil/core';
import { Quote } from '../../api/chucknorris.api';
import { actionToggleFav, selectFavs } from '../../store/quotes.store';

@Component({
    tag: 'tab-favs',
    styleUrl: 'tab-favs.css',
    shadow: true,
})
export class TabFavs {
    @Listen('toggleFav')
    handleToggleFav(e: CustomEvent<Quote>) {
        const quote = e.detail;
        actionToggleFav(quote);
    }

    render() {
        const favs = selectFavs();
        return (
            <ul>
                {favs.map(q => (
                    <li key={q.id}>
                        <quote-list-item quote={q}></quote-list-item>
                    </li>
                ))}
            </ul>
        );
    }
}
