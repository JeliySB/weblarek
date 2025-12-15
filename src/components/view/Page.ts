import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IPage {
    gallery: HTMLElement[];
    basketCount: number;
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._gallery = ensureElement<HTMLElement>('.gallery', container);
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
        this._basketButton = ensureElement<HTMLElement>('.header__basket', container);

        // Клик по корзине в хедере
        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set basketCount(value: number) {
        this._basketCounter.textContent = String(value);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}