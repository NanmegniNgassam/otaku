import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Modal } from '../../models/modal';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalComponent {
  @Input() modal!: Modal;
  @Input() show!: boolean;

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
      await this.modal.onCancel();
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
      await this.modal.onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      this._isShown = false;
    }
  }
}
