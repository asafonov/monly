class AccountsView {
  constructor() {
    this.model = new Accounts();
    this.listElement = document.querySelector('.accounts fieldset');
    this.selects = document.querySelectorAll('select[name=type]');
  }

  initList() {
    this.listElement.innerHTML = '<legend class="gr">accounts</legend>';
    const list = this.model.getList();

    for (let i = 0; i < this.selects.length; ++i) {
        this.selects[i].innerHTML = '';
    }

    for (let key in list) {
        this.listElement.innerHTML += '<div><span>' + key + '</span><span>' + asafonov.utils.displayMoney(list[key].value) + '</span></div>';

        for (i = 0; i < this.selects.length; ++i) {
            var option = document.createElement('option');
            option.innerHTML = key;
            option.value = key;
            this.selects[i].appendChild(option);
        }
    }
  }
}
