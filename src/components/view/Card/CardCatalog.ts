import { Card } from '../Card';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class CardCatalog extends Card<IProduct> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        container.addEventListener('click', () => {
            this.events.emit('card:select', this._data);
        })
     }

    render(data: IProduct) {
        this._data = data;
        return super.render(data)
    }

    protected _data?: IProduct
}