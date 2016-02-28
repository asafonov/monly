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
        this._net_worth.innerHTML = Math.floor(this._data.net_worth / 100) + ' <sup class="gr">' + this.padlen(this._data.net_worth % 100) + '</sup>';
    },

    showAccounts: function() {
        this._accounts.innerHTML = '<legend class="gr">accounts</legend>';
        for (var key in this._data.accounts) {
            this._accounts.innerHTML += '<div><span>' + key + '</span><span>' + this.formatMoney(this._data.accounts[key]) + '</span></div>';
        }
    },

    __init__: function() {
        this._transaction_form = document.querySelectorAll('.add_tran');
        this._net_worth = document.querySelector('.js-net_worth');
        this._accounts = document.querySelector('.js-accounts fieldset');
        var context = this;
        eyeless(document.querySelector('.js-add_button')).event('click', function() {context.showTransactionForm()});

        this._data = storage.get('monly');
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
        storage.set('monly', this._data);

        this.showNetWorth();
        this.showAccounts();
    }
}
