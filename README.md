# queue
nodejs 的简单队列实现

#### 使用示例
`
// 创建队列对象
const queueObj = new queue({
  maxqueue: 5,
});
// 设置队列数据源
queueObj.setData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
// 设置队列调用方法
queueObj.setFunction(async _item => {
  const data = new Promise((resolve) => {
    setTimeout(() => {
      console.error('print', _item);
      resolve('ok');
    }, parseInt(Math.random() * 100));
  });
  await data.then();
});
//  设置队列结束回调
queueObj.setCallBack(() => {
  console.error(queueObj.queueClientArray);
});
// 启动队列方法
queueObj.start();
`