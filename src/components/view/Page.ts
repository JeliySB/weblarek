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

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._gallery = ensureElement<HTMLElement>('.gallery', container);
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            document.body.classList.add('page_locked');
        } else {
            document.body.classList.remove('page_locked');
        }
    }
}