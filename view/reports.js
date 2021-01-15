class ReportsView {

  constructor() {
    this.model = new Reports();
    this.circleLen = 30 * 0.42 * 2 * Math.pi;
    this.element = document.querySelector('.donut.chart svg');
  }

  show() {
    this.element.innerHTML = '';

    this.model.build();
    const data = this.model.getItem(0);
    const total = data.values().reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let i = 1;
    let offset = 0;

    for (let item in data) {
      const lineLen = data[item] / total * this.circleLen;
      const spaceLen = this.circleLen - lineLen;
      const circle = document.createElement('circle');
      circle.className = `slice_${i}`;
      circle.style.strokeDasharray = `${lineLen} ${spaceLen}`;
      circle.style.strokeDashoffset = offset;
      offset -= lineLen;
      ++i;
      this.element.appendChild(circle);
    }
  }
}
