class AccountsController {

  constructor() {
    this.model = asafonov.accounts;
    asafonov.messageBus.subscribe(asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated');
  }

  onTransactionUpdated (event) {
    const amountChanged = event.to.amount - (event.from !== null ? event.from.amount : 0);
    const accountChanged = event.from && event.to.account !== event.from.account;

    if (amountChanged != 0) {
      this.onAmountChanged(-amountChanged, event.to.account);
    }

    if (accountChanged) {
      this.onAccountChanged();
    }
  }

  onAmountChanged (amount, account) {
    this.model.purchase(account, amount);
  }

  onAccountChanged() {
  }

  destroy() {
    asafonov.messageBus.unsubscribe(asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated');
  }

}
