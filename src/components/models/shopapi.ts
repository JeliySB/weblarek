import { Api } from '../base/Api';
import type { IProduct, IOrder, IOrderResult } from '../../types';

export class ShopAPI {
  constructor(private api: Api) {}

  async getProductList(): Promise<IProduct[]> {
    const res = await this.api.get<{ items: IProduct[] }>('/product');
    return res.items;
  }

  async sendOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post('/order', order, 'POST');
  }
}