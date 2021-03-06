document.addEventListener("DOMContentLoaded", function (event) {
  function getPageName() {
    return document.querySelector('body').id || 'main_page';
  }

  const loader = {
    main_page: () => {
      asafonov.accounts = new Accounts(
        {Account1: 300000, Account2: 4142181} // test data
      );
      const accountsController = new AccountsController();
      const accountsView = new AccountsView();
      accountsView.updateList();
      const budgetsView = new BudgetsView();
      budgetsView.updateList();
      const transactionsView = new TransactionsView();
      transactionsView.updateList();
      const reportsController = new ReportsController();
      reportsController.build();
    },
    charts_page: () => {
      const reportsView = new ReportsView();
      reportsView.show();
    }
  };

  loader[getPageName()]();
});
