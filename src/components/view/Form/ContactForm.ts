import { Form } from './Form';
import { IEvents } from '../../base/Events';

export class ContactForm extends Form<{
    email: string;
    phone: string;
}> {
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
    }

    set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}