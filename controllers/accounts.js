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
      this.onAccountChanged(event.from.account, event.to.account, event.to.amount);
    }
  }

  onAmountChanged (amount, account) {
    this.model.purchase(account, amount);
  }

  onAccountChanged (from, to, amount) {
    this.model.purchase(from, amount);
    this.model.purchase(to, -amount);
  }

  destroy() {
    asafonov.messageBus.unsubscribe(asafonov.events.TRANSACTION_UPDATED, this, 'onTransactionUpdated');
  }

}
