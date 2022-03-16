class Backup {
  clear() {
    window.localStorage.clear()
  }

  backup (hostname) {
    const list = {...window.localStorage}

    fetch('http://' + hostname + ':9092/monly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(list)
    })
    .then(() => {
      alert("Backup completed");
    })
    .catch(error => {
      alert(error.message);
    });
  }

  destroy() {
  }
}
