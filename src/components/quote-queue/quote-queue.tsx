import { State, Component, h, Prop, Element, VNode } from '@stencil/core';
import { Quote } from '../../api/chucknorris.api';

@Component({
    tag: 'quote-queue',
    styleUrl: 'quote-queue.scss',
    shadow: true,
})
export class QuoteQueue {
    @Element() host!: HTMLDivElement;

    @Prop()
    items!: Array<Quote>;

    @State()
    children: VNode[] = [];

    @State()
    firstRenderDone = false;

    updateChildren() {
        const result: VNode[] = [];
        const map = new Map<string, VNode>(this.children.map(i => [i.$attrs$['key'], i]));
        let translate = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (map.has(this.items[i].id)) {
                const node = map.get(this.items[i].id) as VNode;
                node.$elm$.style.transform = `translate(0,${translate}px)`;
                translate += node.$elm$.clientHeight;
                result.push(node);
            } else {
                const item = this.items[i];
                const node = (
                    <li key={item.id} style={{ transform: `translate(0,${translate}px)` }}>
                        <quote-list-item quote={item} fetchNext={i === 0}></quote-list-item>
                    </li>
                );
                result.push(node);
            }
        }
        return result;
    }

    componentDidRender() {
        if (this.items.length && !this.firstRenderDone) {
            setTimeout(() => {
                this.firstRenderDone = true;
            });
        }
    }

    render() {
        this.children = this.updateChildren();
        return <ul>{this.children}</ul>;
    }
}
