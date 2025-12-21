import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

//class header

interface IHeader {
    basketCount: number;
}

export class Header extends Component<IHeader> {
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basketButton = ensureElement<HTMLElement>('.header__basket', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set basketCount(value: number) {
        this._basketCounter.textContent = String(value);
    }
}