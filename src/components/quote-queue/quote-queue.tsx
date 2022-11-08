import { Component, h, Prop, Element } from '@stencil/core';

@Component({
    tag: 'quote-queue',
    styleUrl: 'quote-queue.scss',
    shadow: true,
})
export class QuoteQueue {
    @Element() host: HTMLDivElement;

    @Prop()
    items: Array<{ id: string; text: string }> = [];

    render() {
        console.log('rendering queue', this.items.length);
        return (
            <ul>
                {this.items.map((i, index) => (
                    <quote-list-item key={i.id} text={i.text} fetchNext={index === 0}></quote-list-item>
                ))}
            </ul>
        );
    }
}
