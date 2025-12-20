import { IBuyer } from '../../types';
import type { TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Order {
  private _payment: TPayment | null = null;
  private _email = '';
  private _phone = '';
  private _address = '';

  constructor(protected events: IEvents) {}

  setPayment(method: TPayment) {
    this._payment = method;
    this.events.emit('order:changed');
  }

  setEmail(email: string) {
    this._email = email;
    this.events.emit('order:changed');
  }

  setPhone(phone: string) {
    this._phone = phone;
    this.events.emit('order:changed');
  }

  setAddress(address: string) {
    this._address = address;
    this.events.emit('order:changed');
  }

  getOrderData(): IBuyer {
    return {
      payment: this._payment!,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear() {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.events.emit('order:changed');
  }

  validateStep1(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this._payment) errors.payment = 'Не выбран способ оплаты';
    if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
    return errors;
  }

  validateStep2(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите телефон';
    return errors;
  }

  isValidStep1(): boolean {
    return Object.keys(this.validateStep1()).length === 0;
  }

  isValidStep2(): boolean {
    return Object.keys(this.validateStep2()).length === 0;
  }
}