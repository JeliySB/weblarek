import { Card } from '../Card';
import { ICardPreview } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class CardPreview extends Card<ICardPreview> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
      super(container);

      this._description = ensureElement<HTMLElement>('.card__text', container);
      this._button = ensureElement<HTMLButtonElement>('.card__button', container);

      this._button.addEventListener('click', onClick);
    }

    set description(value: string) {
      this._description.textContent = value;
    }

    set inBasket(value: boolean) {
      this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
    }

    set buttonDisabled(value: boolean) {
      this._button.disabled = value;
    }
}