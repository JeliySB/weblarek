import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._closeButton.addEventListener('click', this.close.bind(this))
    container.addEventListener('click', (evt) => {
      if (evt.target === container) {
        this.close();
      }
    });
    container.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open')
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = document.createElement('div');
    this.events.emit('modal:close')
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open()
    return this.container
  }
}