class Utils {

  displayMoney (money) {
    const dollars = parseInt(money / 100, 10);
    const cents = money % 100;
    return `${dollars}.${cents}`;
  }

}
