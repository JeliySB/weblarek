import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

interface IFormState {
    valid: boolean;
    errors: Record<string, string>;
}

export abstract class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // inpupt
        container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${this.container.name}:change`, { field, value });
        });

        container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(errors: Record<string, string>) {
        this._errors.textContent = Object.values(errors).join('. ');
    }

    render(state: IFormState & Partial<T>): HTMLElement {
        super.render(state);
        return this.container;
    }
}