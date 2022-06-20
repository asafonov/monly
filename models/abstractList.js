class AbstractList {

  constructor (list) {
    this.list = this.getList() || {}

    if (list) this.list = {...list, ...this.list}
  }

  getList() {
    if (this.list === null || this.list === undefined) {
      this.list = JSON.parse(window.localStorage.getItem(this.constructor.name))
    }

    return this.list
  }

  length() {
    return Object.keys(this.list).length
  }

  getDefault() {
    return Object.keys(this.list)[0]
  }

  getItem (id) {
    if (this.list === null || this.list === undefined) {
      this.getList()
    }

    return this.list[id]
  }

  updateItem (id, item) {
    this.list[id] = item
    this.store()
  }

  updateId (id, newid) {
    this.list[newid] = this.list[id]
    this.deleteItem(id)
  }

  deleteItem (id) {
    delete this.list[id]
    this.store()
  }

  store() {
    window.localStorage.setItem(this.constructor.name, JSON.stringify(this.list))
  }
}
