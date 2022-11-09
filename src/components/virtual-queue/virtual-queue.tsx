import { State, Component, h, Prop, VNode } from '@stencil/core';
import { ChildType } from '@stencil/core/internal';

@Component({
    tag: 'virtual-queue',
    styleUrl: 'virtual-queue.scss',
    shadow: true,
})
export class QuoteQueue {
    @Prop()
    ids!: Array<{ id: string; rerender?: boolean }>;

    @State()
    children: VNode[] = [];

    @State()
    firstRenderDone = false; // positioning can be done only after first render

    @Prop()
    renderItem!: (index: number, id: string) => ChildType;

    updateChildren() {
        const result: VNode[] = [];
        const map = new Map<string, VNode>(this.children.map(i => [i.$attrs$['key'], i]));
        let translate = 0;
        for (let i = 0; i < this.ids.length; i++) {
            const id = this.ids[i].id;
            const rerender = !!this.ids[i].rerender;

            if (map.has(id) && !rerender) {
                const node = map.get(id) as VNode;
                node.$elm$.style.transform = `translate(0,${translate}px)`;
                translate += node.$elm$.clientHeight;
                result.push(node);
            } else {
                const node = (
                    <li key={id} style={{ transform: `translate(0,${translate}px)` }}>
                        {this.renderItem(i, id)}
                    </li>
                );
                if (map.has(id)) {
                    // if node was already created (rerender) - can extract height
                    const node = map.get(id) as VNode;
                    translate += node.$elm$.clientHeight;
                }
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
