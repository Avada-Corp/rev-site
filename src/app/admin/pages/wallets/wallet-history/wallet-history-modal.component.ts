import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WalletCommission } from 'src/app/page/types/page.interface';

@Component({
  selector: 'app-wallet-history-modal',
  templateUrl: './wallet-history-modal.component.html',
  styleUrls: ['./wallet-history-modal.component.scss'],
})
export class WalletHistoryModalComponent {
  @Input() visible: boolean = false;
  @Input() modalTitle: string = '';
  @Input() selectedWalletCommissions: WalletCommission[] = [];
  @Input() selectedWalletManualTransactions: WalletCommission[] = [];
  @Input() selectedWalletReferralTransactions: WalletCommission[] = [];
  @Input() selectedWalletReferralWithdrawals: WalletCommission[] = [];
  @Input() selectedWalletPartnerCommissions: WalletCommission[] = [];
  @Input() selectedWalletCryptoTransactions: WalletCommission[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() formatExplanation = new EventEmitter<string>();

  onVisibleChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  onFormatExplanation(explanation: string): string {
    return explanation; // Родительский компонент передаст уже отформатированное объяснение
  }
}
