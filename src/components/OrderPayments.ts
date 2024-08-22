import { Form } from './common/Form';
import { IOrderPayments } from '../types';
import { IEvents } from './base/events';

export class OrderPayments extends Form<IOrderPayments> {
    protected _cardButton: HTMLButtonElement | null;
    protected _cashButton: HTMLButtonElement | null;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._cardButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement | null;
        this._cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement | null;

        if (this._cardButton) {
            this._cardButton.addEventListener('click', this.createPaymentEventHandler(this._cardButton));
        }

        if (this._cashButton) {
            this._cashButton.addEventListener('click', this.createPaymentEventHandler(this._cashButton));
        }
    }

    private createPaymentEventHandler(button: HTMLButtonElement) {
        return () => {
            this.events.emit('order:change payment', {
                payment: button.name,
                button: button,
            });
        };
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    togglePayment(value: HTMLElement) {
        this.cancelPayment();
        this.toggleClass(value, 'button_alt-active', true);
    }

    cancelPayment() {
        this.toggleClass(this._cardButton, 'button_alt-active', false);
        this.toggleClass(this._cashButton, 'button_alt-active', false);
    }

    private removeEventHandlers() {
        if (this._cardButton) {
            this._cardButton.removeEventListener('click', this.createPaymentEventHandler(this._cardButton));
        }

        if (this._cashButton) {
            this._cashButton.removeEventListener('click', this.createPaymentEventHandler(this._cashButton));
        }
    }
}