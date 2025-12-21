import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { TPayment } from '../../../types';

export class OrderForm extends Form<{
    payment: TPayment | null;
    address: string;
}> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = container.querySelectorAll('.button_alt');
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
            const method = button.name as TPayment;
            this.payment = method;
            this.events.emit(`${this.container.name}:change`, {
                field: 'payment' as keyof this,
                value: method
            });
            });
        });
    }

    set payment(value: TPayment | null) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}