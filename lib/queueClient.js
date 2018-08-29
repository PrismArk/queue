
const queueClient = function (_queueObj, _inx) {
  this.no = _inx;
  this.canDel = true;
  this.queueObj = _queueObj;
  this.do();
};

queueClient.prototype.do = async function () {
  const data = this.queueObj.getData();
  if (data !== 'queue end') {
    try {
      await this.queueObj.queueDone(data);
      this.do();
    } catch (e) {
      console.error('queue error', e);
    };
  } else {
    this.queueObj.removeQueueClient(this.no);
  };
};

module.exports = queueClient;
