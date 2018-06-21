const queue = function (_config) {
  Object.assign(this, {
    queue: [],
    maxqueue: 0,
    queueClientNo: 0,
    queueDone: () => { },
    queueCallBack: () => { },
    queueClientArray: [],
  }, _config);
};

queue.prototype.setData = function (_arr) {
  if (_arr instanceof Array) {
    this.queue = _arr;
  };
};

queue.prototype.setFunction = function (_func) {
  if (typeof _func === 'function') {
    this.queueDone = _func;
  };
};

queue.prototype.setCallBack = function (_func) {
  if (typeof _func === 'function') {
    this.queueCallBack = _func;
  };
};

queue.prototype.getData = function () {
  if (this.queue.length > 0) {
    return this.queue.splice(0, 1);
  } else {
    return 'queue end';
  };
};

queue.prototype.start = function () {
  if (this.maxqueue < 1) {
    console.error('maxqueue error');
    return;
  };
  for(let i = this.maxqueue;i--;){
    this.queueClientArray.push({
      no: this.queueClientNo,
      obj: new queueClient(this, this.queueClientNo),
    });
    this.queueClientNo++;
  };
};

queue.prototype.removeQueueClient = function (_no) {
  const len = this.queueClientArray.length;
  if (len === 1) {
    this.queueClientArray = [];
    this.queueCallBack();
  } else if (len > 1) {
    this.queueClientArray.forEach((_item, _inx) => {
      if (_item.no === _no) {
        this.queueClientArray.splice(_inx, 1);
      };
    });
  } else {
    this.queueCallBack();
  };
};






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
      console.info('queueClientNo start:', this.no);
      await this.queueObj.queueDone(data);
      console.info('queueClientNo end:', this.no);
      this.do();
    } catch (e) {
      console.error('queue error', e);
    };
  } else {
    this.queueObj.removeQueueClient(this.no);
  };
};





const queueObj = new queue({
  maxqueue: 5,
});
queueObj.setData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
queueObj.setFunction(async _item => {
  const data = new Promise((resolve) => {
    setTimeout(() => {
      console.error('print', _item);
      resolve('ok');
    }, parseInt(Math.random() * 100));
  });
  await data.then();
});
queueObj.setCallBack(() => {
  console.error(queueObj.queueClientArray);
});
queueObj.start();
