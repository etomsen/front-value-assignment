import { State, Component, h, Prop, VNode } from '@stencil/core';
import { ChildType } from '@stencil/core/internal';

@Component({
    tag: 'virtual-queue',
    styleUrl: 'quote-queue.scss',
    shadow: true,
})
export class QuoteQueue {
    @Prop()
    ids!: Array<string>;

    @State()
    children: VNode[] = [];

    @State()
    firstRenderDone = false;

    @Prop()
    renderItem!: (index: number, id: string) => ChildType;

    updateChildren() {
        const result: VNode[] = [];
        const map = new Map<string, VNode>(this.children.map(i => [i.$attrs$['key'], i]));
        let translate = 0;
        for (let i = 0; i < this.ids.length; i++) {
            if (map.has(this.ids[i])) {
                const node = map.get(this.ids[i]) as VNode;
                node.$elm$.style.transform = `translate(0,${translate}px)`;
                translate += node.$elm$.clientHeight;
                result.push(node);
            } else {
                const node = (
                    <li key={this.ids[i]} style={{ transform: `translate(0,${translate}px)` }}>
                        {this.renderItem(i, this.ids[i])}
                    </li>
                );
                result.push(node);
            }
        }
        return result;
    }

    componentWillRender() {
        this.children = this.updateChildren();
    }

    componentDidRender() {
        if (this.ids.length && !this.firstRenderDone) {
            setTimeout(() => {
                this.firstRenderDone = true;
            });
        }
    }

    render() {
        return <ul>{this.children}</ul>;
    }
}
