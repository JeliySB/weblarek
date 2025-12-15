import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    set total(value: number) {
        this._total.textContent = `Списано ${value} синапсов`;
    }
}