var monly = {

    _transaction_form: null,
    _net_worth: null,
    _accounts: null,
    _data: null,
    _periods: [],
    _id: null,
    _password: null,
    _url: 'http://monly.asafonov.org/ajax/',

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
        return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
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

    toggleMenu: function() {
        if (this._menu.style.display == 'none') {
            this._menu.style.display = 'block';
        } else {
            this._menu.style.display = 'none';
        }
    },

    showNetWorth: function() {
        this._net_worth.innerHTML = this.formatMoney(~~(this._data.net_worth / 100)) + ' <sup class="gr">' + this.padlen(Math.abs(this._data.net_worth % 100)) + '</sup>';
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
            this.updateUI();
        }
        this.hideTransactionForm();
    },

    addTransaction: function(item) {
        this._data.transactions.push(item);
        this._data.net_worth = this._data.net_worth += -1 * item.amount;
        this._data.accounts[item.type] += -1 * item.amount;
    },

    updateUI: function() {
        this.showAccounts();
        this.showNetWorth();
        this.overviewPeriod(this._periods[this._period_select.value]);
    },

    getData: function() {
        this._data = storage.get('monly');
    },

    saveData: function() {
        storage.set('monly', this._data);
    },

    overviewPeriod: function(period) {
        if (typeof period == 'undefined') {
            period = new Date().toISOString().slice(0, 7);
        }

        var income = 0;
        var expense = 0;

        this._full_table.innerHTML = '<tr><th>date</th><th>amount</th><th>description</th><th>tags</th></tr>';
        this._small_table.innerHTML = '';

        var tags = {};

        for (var i=this._data.transactions.length-1; i>=0; i--) {
            if (this._data.transactions[i].date < period) {
                break;
            }
            if (this._data.transactions[i].date.slice(0, 7) == period) {
                this._full_table.innerHTML += '<tr><td class="data">' + this._data.transactions[i].date + '</td><td class="money min">' + this.formatMoney(-1*~~(this._data.transactions[i].amount / 100)) + ' <sup>' + this.padlen(Math.abs(this._data.transactions[i].amount % 100)) + '</sup></td><td>' + this._data.transactions[i].description + ' <span>' + this._data.transactions[i].type + '</span><td><mark>' + this._data.transactions[i].tags.join('</mark><mark>') + '</mark></td></tr>';
                this._small_table.innerHTML += '<tr><td class="data">' + this._data.transactions[i].date + '</td><td>' + this._data.transactions[i].description + '<span>' + this._data.transactions[i].type + '</span><span class="grey">' + this._data.transactions[i].tags.join(', ') + '</span></td><td class="money min">' + this.formatMoney(-1*~~(this._data.transactions[i].amount / 100)) + ' <sup>' + this.padlen(Math.abs(this._data.transactions[i].amount % 100)) + '</sup></td></tr>';
                if (this._data.transactions[i].tags.indexOf("transfer") == -1) {
                    for (var j=0; j<this._data.transactions[i].tags.length; j++) {
                        tags[this._data.transactions[i].tags[j]] = tags[this._data.transactions[i].tags[j]] || 0;
                        tags[this._data.transactions[i].tags[j]] += this._data.transactions[i].amount;
                    }
                    if (this._data.transactions[i].amount > 0) {
                        expense += this._data.transactions[i].amount;
                    } else {
                        income += Math.abs(this._data.transactions[i].amount);
                    }
                }
            }
        }

        this._tags.innerHTML = '<legend class="gr">tags</legend>';

        var sortObject = function(obj) {
            var arr = [];
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    arr.push({
                        'key': prop,
                        'value': obj[prop]
                    });
                }
            }
            arr.sort(function(a, b) {
                return a.value - b.value;
            });
            return arr;
        }

        var sorted = sortObject(tags);

        for(var i=sorted.length - 1; i>=0; i--) {
            if (sorted[i].key != '') {
                this._tags.innerHTML += '<div><span>' + sorted[i].key + '</span><span>' + this.formatMoney(~~(sorted[i].value / 100)) + ' <sup>' + this.padlen(sorted[i].value % 100) + '</sup>' + '</span></div>';
            }
        }

        this._income.innerHTML = this.formatMoney(~~(income / 100)) + ' <sup>' + this.padlen(income % 100) + '</sup>';
        this._expense.innerHTML = this.formatMoney(~~(-1*expense / 100)) + ' <sup class="red">' + this.padlen(expense % 100) + '</sup>';
    },

    sync: function() {
        if (!this._id) return false;
        var context = this;
        this.download(undefined, function() {context.upload()});
    },
    
    upload: function(callback) {
        if (!this._id) return false;
        ajax.post(this._url + '?id=' + this._id, {
            params: 'data=' + JSON.stringify(this._data) + '&password=' + this._password,
            callback: callback
        });
    },

    download: function(success_callback, error_callback) {
        if (!this._id) return false;
        var context = this;
        ajax.post(this._url + '?get=1&id=' + this._id, {
            params: 'password=' + this._password,
            callback: function(data) {
                if (data) {
                    try {
                        context._data = JSON.parse(data);
                        context.saveData();
                        context.updateUI();
                        if (typeof success_callback != 'undefined') {
                            success_callback();
                        }
                    } catch(err) {
                        console.log(err);
                        return false;
                    }
                } else {
                    if (typeof error_callback != 'undefined') {
                        error_callback();
                    }
                }
            }
        });
    },

    backup: function() {
        if (!confirm("Backup data?")) return false;
        if (!this._id) {
            this._id = prompt("Please enter your id");
            storage.set('monly_id', this._id);
        }
        if (!this._password) {
            this._password = prompt("Please enter your password");
            storage.set('monly_password', this._password);
        }
        this.upload(function() {alert('Your data is uploaded')});
    },

    restore: function() {
        if (!confirm("Restore data?")) return false;
        if (!this._id) {
            this._id = prompt("Please enter your id");
            storage.set('monly_id', this._id);
        }
        if (!this._password) {
            this._password = prompt("Please enter your password");
            storage.set('monly_password', this._password);
        }
        this.download(function() {alert('Your data is restored')}, function() {alert("Error during restoring your data")});
    },

    _initPeriods: function() {
        var today = new Date();
        this._periods.push(today.toISOString().slice(0, 7));
        today.setMonth(today.getMonth() - 1);
        this._periods.push(today.toISOString().slice(0, 7));
    },

    __init__: function() {
        this._transaction_form = document.querySelectorAll('.add_tran');
        this._net_worth = document.querySelector('.js-net_worth');
        this._accounts = document.querySelector('.js-accounts fieldset');
        this._full_table = document.querySelector('#full_table tbody');
        this._small_table = document.querySelector('#small_table tbody');
        this._expense = document.querySelector('.js-expense');
        this._income = document.querySelector('.js-income');
        this._period_select = document.querySelector('.js-period');
        this._menu = document.querySelector('.js-menu');
        this._tags = document.querySelector('.js-tags');

        var context = this;
        eyeless(document.querySelector('.js-add_button')).event('click', function() {context.showTransactionForm()});
        eyeless(this._period_select).event('change', function() {context.overviewPeriod(context._periods[this.value])});
        eyeless(document.querySelector('.js-menu-backup')).event('click', function() {context.backup(); context.toggleMenu()});
        eyeless(document.querySelector('.js-menu-restore')).event('click', function() {context.restore(); context.toggleMenu()});
        eyeless(document.querySelector('.js-logo')).event('click', function() {context.toggleMenu()});
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
        this._id = storage.get('monly_id');
        this._password = storage.get('monly_password');

        this._initPeriods();

        this.updateUI();
    }
}
