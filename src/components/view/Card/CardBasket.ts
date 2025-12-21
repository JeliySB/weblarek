import { Card } from './Card';
import { ICardBasket } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _removeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._removeButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('basket:item:remove', { id });
            }
        });
    }

    set index(value: number) {
        this._index.textContent = String(value + 1)
    }
}