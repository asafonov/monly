var monly = {

    _transaction_form: null,
    _net_worth: null,
    _accounts: null,
    _data: null,

    padlen: function(str, len, item) {
        typeof(len) != 'undefined' || (len = 2);
        typeof(item) != 'undefined' || (item = '0');
        str = str + '';
        while (str.length < len) {
            str = item + str;
        }
        return str;
    },

    formatMoney: function(str) {
        str = str + '';
        return str.replace(/(\d{3})/g, ' $1').replace(/^\s/, '');
    },

    showTransactionForm: function() {
        for (var i=0; i<this._transaction_form.length; i++) {
            this._transaction_form[i].style.visibility = 'inherit';
        }
    },

    hideTransactionForm: function() {
        for (var i=0; i<this._transaction_form.length; i++) {
            this._transaction_form[i].style.visibility = 'hidden';
        }
    },

    showNetWorth: function() {
        this._net_worth.innerHTML = Math.floor(this._data.net_worth / 100) + ' <sup class="gr">' + this.padlen(Math.abs(this._data.net_worth % 100)) + '</sup>';
    },

    showAccounts: function() {
        this._accounts.innerHTML = '<legend class="gr">accounts</legend>';
        var accounts_selects = document.querySelectorAll('select[name=type]');
        for (var i=0; i<accounts_selects.length; i++) {
            accounts_selects[i].innerHTML = '';
        }
        
        for (var key in this._data.accounts) {
            this._accounts.innerHTML += '<div><span>' + key + '</span><span>' + this.formatMoney(this._data.accounts[key] / 100) + '</span></div>';
            for (i=0; i<accounts_selects.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = key;
                option.value = key;
                accounts_selects[i].appendChild(option);
            }
        }
        
    },

    showTransactions: function() {
        this._full_table.innerHTML = '<tr><th>date</th><th>amount</th><th>description</th><th>tags</th></tr>';
        this._small_table.innerHTML = '';
        for (var i=this._data.transactions.length-1; i>=Math.max(0, this._data.transactions.length - 10); i--) {
            this._full_table.innerHTML += '<tr><td class="data">' + this._data.transactions[i].date + '</td><td class="money min">' + Math.floor(this._data.transactions[i].amount / 100) + ' <sup>' + this.padlen(Math.abs(this._data.transactions[i].amount % 100)) + '</sup></td><td>' + this._data.transactions[i].description + ' <span>' + this._data.transactions[i].type + '</span><td><mark>' + this._data.transactions[i].tags.join('</mark><mark>') + '</mark></td></tr>';
            this._small_table.innerHTML += '<tr><td class="data">' + this._data.transactions[i].date + '</td><td>' + this._data.transactions[i].description + '<span>' + this._data.transactions[i].type + '</span><span class="grey">' + this._data.transactions[i].tags.join(', ') + '</span></td><td class="money min">' + Math.floor(this._data.transactions[i].amount / 100) + ' <sup>' + this.padlen(Math.abs(this._data.transactions[i].amount % 100)) + '</sup></td></tr>';
        }
    },

    saveTransaction: function(obj) {
        var form = obj.parentNode.querySelector('form');
        var amount = parseFloat(form.elements['amount'].value || '0');
        if (amount != 0) {
            var item = {
                amount: parseInt(amount * 100),
                date: form.elements['date'].value || new Date().toISOString().slice(0, 10),
                description: form.elements['description'].value,
                type: form.elements['type'].value,
                tags: form.elements['tags'].value.split(' ')
            }
            this.addTransaction(item);
            this.saveData();
            this.showAccounts();
            this.showNetWorth();
            this.showTransactions();
        }
        this.hideTransactionForm();
    },

    addTransaction: function(item) {
        this._data.transactions.push(item);
        this._data.net_worth = this._data.net_worth += -1 * item.amount;
        this._data.accounts[item.type] += -1 * item.amount;
    },

    getData: function() {
        this._data = storage.get('monly');
    },

    saveData: function() {
        storage.set('monly', this._data);
    },

    __init__: function() {
        this._transaction_form = document.querySelectorAll('.add_tran');
        this._net_worth = document.querySelector('.js-net_worth');
        this._accounts = document.querySelector('.js-accounts fieldset');
        this._full_table = document.querySelector('#full_table tbody');
        this._small_table = document.querySelector('#small_table tbody');
        var context = this;
        eyeless(document.querySelector('.js-add_button')).event('click', function() {context.showTransactionForm()});
        for (var i=0; i<this._transaction_form.length; i++) {
            eyeless(this._transaction_form[i].querySelector('button[name=save]')).event('click', function() {context.saveTransaction(this)});
        }

        this.getData();
        !this._data && (this._data = {
            net_worth: 0,
            accounts: {
                City: 0,
                Credit: 0,
                AlfaBank: 0,
                Cash: 0,
            },
            transactions: [],
        });
        this.saveData();

        this.showNetWorth();
        this.showAccounts();
        this.showTransactions();
    }
}
