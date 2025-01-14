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
  _isConfirmLoading: boolean = false;
  _isConfirmDone: boolean = false;

  constructor() {
    this._isShown = this.show;
  }

  /**
   * 
   * 
  */
  async onDismiss() {
    try {
      this._isConfirmDone = false;
      await this.modal.onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      this._isShown = false;
    }
  }

  /**
   * Handles the user confirmation action.
   */
  async onUserConfirm() {
    try {
      this._isConfirmLoading = true;
      await this.modal.onConfirm();
      
      this._isConfirmDone = true;
    } catch (error) {
      console.error("Error while validating the modal: ", error);
    } finally {
      this._isConfirmLoading = false;

      setTimeout(async () => {
        await this.onDismiss();
      }, 5 * 1000);
    }
  }
}
