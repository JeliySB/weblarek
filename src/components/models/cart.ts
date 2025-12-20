import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
  private _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return [...this._items] 
  }

  addItem(item: IProduct) {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
      this.events.emit('cart:changed');
    }
  }

  removeItem(id: string) {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('cart:changed');
  
  }

  clear() {
    this._items = [];
    this.events.emit('cart:changed');
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id)
  }

  getItemIds(): string[] {
    return this._items.map(item => item.id)
  }
}