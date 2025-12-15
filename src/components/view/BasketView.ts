import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export default class BasketView extends Component<IBasketView> {
  protected _list:  HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container)
    this._button.addEventListener('click', () => {
        this.events.emit('basket:order');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this._list.replaceChildren(...items);
    } else  {
      this._list.replaceChildren();
      this._list.classList.add('basket__list_empty');
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`
  }

  set valid(value: boolean)  {
    this._button.disabled = !value;
  }
}