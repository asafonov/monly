class Accounts extends AbstractList {

  updateItem (id, item) {
    asafonov.messageBus.send(asafonov.events.ACCOUNT_UPDATED, {id: id, from: {...this.list[id]}, to: item});
    super.updateItem(id, item);
  }

}
