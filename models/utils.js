class Utils {

  displayMoney (money) {
    money = parseInt(money, 10)
    const dollars = parseInt(money / 100, 10);
    const cents = this.padlen((Math.abs(money) % 100).toString(), 2, '0');
    return `${dollars}.${cents}`;
  }

  padlen (str, len, symbol) {
    for (let i = 0; i < len - str.length; ++i) {
      str = symbol + str;
    }

    return str;
  }
}
