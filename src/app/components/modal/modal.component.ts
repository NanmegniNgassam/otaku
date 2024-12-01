import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() show!: boolean;
  @Input() onCancel!: Function;
  @Input() onConfirm!: Function;
  @Input() confirmText!: string;
  @Input() cancelText!: string;

  _isShown!: boolean;

  constructor() {
    this._isShown = this.show;
  }

  /**
   * 
   * 
  */
  async onDismiss() {
    try {
      // TODO: Add in onCancel logic a dismiss when the fonction goes wrong
      await this.onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      this._isShown = false;
    }
  }

  /**
   * 
   */
  async onUserConfirm() {
    try {
      await this.onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      this._isShown = false;
    }
  }
}
