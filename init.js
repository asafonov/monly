document.addEventListener("DOMContentLoaded", function (event) { 
  const accountsView = new AccountsView();
  accountsView.updateList();
  const transactionsView = new TransactionsView();
  transactionsView.updateList();
});
