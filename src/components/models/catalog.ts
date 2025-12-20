import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  private _items: IProduct[] = [];
  private _preview: string | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]) {
    this._items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return [...this._items];
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setPreview(item: IProduct) {
    this._preview = item.id;
    this.events.emit('preview:changed', item);
  }

  getPreview(): IProduct | undefined {
    if (!this._preview) return undefined;
    return this.getItem(this._preview);
  }
}