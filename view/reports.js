class ReportsView {

  constructor() {
    this.model = new Reports();
    this.circleLen = 30 * 0.42 * 2 * Math.PI;
    this.element = document.querySelector('.monly-circle');
    this.circleElement = this.element.querySelector('.donut.chart svg');
    this.totalElement = this.element.querySelector('.number.big');
    this.donutElement = this.element.querySelector('.donut.chart');
  }

  clearExistingItems() {
    const items = this.element.querySelectorAll('.item');

    for (let i = 0; i < items.length; ++i) {
      this.element.removeChild(items[i]);
    }
  }

  show() {
    this.circleElement.innerHTML = '';
    this.clearExistingItems();

    this.model.build();
    const data = this.model.getItem(0);
    const total = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let i = 1;
    let offset = 0;
    this.totalElement.innerHTML = asafonov.utils.displayMoney(total);

    for (let item in data) {
      const lineLen = data[item] / total * this.circleLen;
      const spaceLen = this.circleLen - lineLen;
      const circle = document.createElement('circle');
      circle.className = `slice_${i}`;
      circle.style.strokeDasharray = `${lineLen} ${spaceLen}`;
      circle.style.strokeDashoffset = offset;
      this.circleElement.innerHTML += circle.outerHTML;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `<div><span class="bullet slice_${i}"></span>${item}</div>`;
      const displayMoney = asafonov.utils.displayMoney(data[item]);
      itemDiv.innerHTML += `<div class="number">${displayMoney}</div>`;
      this.donutElement.after(itemDiv);

      offset -= lineLen;
      ++i;
    }

    const circle = document.createElement('circle');
    circle.className = 'slice_f';
    this.circleElement.innerHTML += circle.outerHTML;
  }
}
