class Accounts extends AbstractList {

  updateItem (id, item) {
    const from = this.list[id];
    super.updateItem(id, item);
    asafonov.messageBus.send(asafonov.events.ACCOUNT_UPDATED, {id: id, from: from, to: item});
  }

  updateId (id, newid) {
    super.updateId(id, newid);
    asafonov.messageBus.send(asafonov.events.ACCOUNT_RENAMED, {item: this.list[newid], from: id, to: newid});
  }

}
