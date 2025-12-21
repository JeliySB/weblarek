import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { CDN_URL } from '../../../utils/constants';

export class Card<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = container.querySelector('.card__category') ?? undefined;
        this._image = container.querySelector('.card__image') ?? undefined;
    }

    set title(value: string) {
        this._title.textContent = value;
    }
    set price(value: number |  null) {
        if (value === null) {
            this._price.textContent = 'Недоступно';
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }

    set category(value: string) {
      if (this._category)  {
            this._category.textContent = value;

            Object.values(categoryMap).forEach(className => {
                this._category!.classList.remove(className);
            });

            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this._category!.classList.add(modifier);
            }
        }
    }

    // изменено
    set image(value: string) {
    if (this._image && value) {
        const fullUrl = `${CDN_URL}/${value}`;
        this.setImage(this._image, fullUrl, this.title || 'Товар');
    }
}
    // render перенесен в класс card
    render(data: T): HTMLElement {
        if (data.id) {
            this.container.dataset.id = data.id;
        }
        Object.assign(this, data);
        return this.container;
    }
    }