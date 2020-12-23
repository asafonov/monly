document.addEventListener("DOMContentLoaded", function (event) {
  asafonov.accounts = new Accounts(
    {Account1: 300000, Account2: 4142181} // test data
  )
  const accountsController = new AccountsController();
  const accountsView = new AccountsView();
  accountsView.updateList();
  const transactionsView = new TransactionsView();
  transactionsView.updateList();
});
