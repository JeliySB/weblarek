import { Card } from './Card';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class CardCatalog extends Card<IProduct> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        container.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('card:select', { id });
            }
        })
     }
}