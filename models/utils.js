class Utils {

  padlen (str, len, item) {
    len !== undefined || (len = 2);
    item !== undefined || (item = '0');
    str = str + '';

    while (str.length < len) {
        str = item + str;
    }

    return str;
  }

  formatMoney (str) {
    return (str + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  }

  showMoney (money, classname) {
    return this.formatMoney(~~(money / 100)) + ' <sup' + (typeof classname != 'undefined' ? ' class="' + classname + '"' : '') + '>' + this.padlen(Math.abs(money % 100)) + '</sup>';        
  }
}
