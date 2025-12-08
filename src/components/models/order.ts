import { IBuyer } from '../../types';
import type { TPayment } from '../../types';

export class Order {
  private _payment: TPayment | null = null;
  private _email = '';
  private _phone = '';
  private _address = '';

  setPayment(method: TPayment) {
    this._payment = method;
  }

  setEmail(email: string) {
    this._email = email;
  }

  setPhone(phone: string) {
    this._phone = phone;
  }

  setAddress(address: string) {
    this._address = address;
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
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this._payment) errors.payment = 'Не выбран вид оплаты';
    if (!this._email) errors.email = 'Укажите email';
    if (!this._phone) errors.phone = 'Укажите телефон';
    if (!this._address) errors.address = 'Укажите адрес';

    return errors;
  }
}