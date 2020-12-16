class Utils {

  displayMoney (money) {
    const dollars = parseInt(money / 100, 10);
    const cents = money % 100;
    return `${dollars}.${cents}`;
  }

  padlen (str, len, symbol) {
    for (let i = 0; i < len - str.length; ++i) {
      str = symbol + str;
    }

    return str;
  }
}
