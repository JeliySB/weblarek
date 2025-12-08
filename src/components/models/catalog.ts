import { IProduct } from '../../types';

export class Catalog {
  private _items: IProduct[] = [];
  private _preview: string | null = null;

  setItems(items: IProduct[]) {
    this._items = items;
  }

  getItems(): IProduct[] {
    return [...this._items];
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setPreview(item: IProduct) {
    this._preview = item.id;
  }

  getPreview(): IProduct | undefined {
    if (!this._preview) return undefined;
    return this.getItem(this._preview);
  }
}