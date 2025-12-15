import { Form } from '../Form';
import { IEvents } from '../../base/Events';
import { TPayment } from '../../../types';

export class OrderForm extends Form<{
    payment: TPayment | null;
    address: string;
}> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);

      this._paymentButtons = container.querySelectorAll('.button_alt')

      this._paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
          const method = button.name as TPayment;
          this.payment = method;

          this.events.emit('order:change', {
              field: 'payment',
              value: method
          });
        });
      });
    }

    set payment(value: TPayment) {
      this._paymentButtons.forEach(button => {
          button.classList.toggle('button_alt-active', button.name === value)
      });
    }

    set address(value: string) {
      const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
      if (addressInput) {
        addressInput.value = value;
      }}
}