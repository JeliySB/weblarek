import { Card } from '../Card';
import { IProduct } from '../../../types';

export class CardCatalog extends Card<IProduct> {
    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        container.addEventListener('click', onClick);
    }
}