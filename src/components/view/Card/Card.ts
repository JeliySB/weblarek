import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

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


    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    } 
}