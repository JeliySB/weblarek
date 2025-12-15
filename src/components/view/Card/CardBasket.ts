import { Card } from '../Card';
import { ICardBasket } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _removeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this._removeButton.addEventListener('click', onRemove);
    }

    set index(value: number) {
        this._index.textContent = String(value + 1);
    }
}