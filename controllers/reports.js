class ReportsController {

  constructor() {
  }

  buildOnDate (year, month, removeSource) {
    const reports = new Reports(year, month, removeSource);
    reports.build(removeSource);
    reports.destroy();
  }

  build() {
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.buildOnDate(d.getFullYear(), d.getMonth() + 1, true);
  }

}
