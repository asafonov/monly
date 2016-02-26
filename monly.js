var monly = {

    _transaction_form: null,
    
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

    __init__: function() {
        this._transaction_form = document.querySelectorAll('.add_tran');
        var context = this;
        eyeless(document.querySelector('.js-add_button')).event('click', function() {context.showTransactionForm()});
    }
}
