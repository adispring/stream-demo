// let http = require('http');

// let server = http.createServer((req, res) => {
//   // req is an http.IncomingMessage, which is a Readable Stream
//   // res is an http.ServerResponse, which is a Writable Stream

//   let body = '';
//   // Get the data as utf8 strings.
//   // If an encoding is not set, Buffer objects will be received.
//   req.setEncoding('utf8');

//   // Readable streams emit 'data' events once a listener is added
//   req.on('data', (chunk) => {
//     body += chunk;
//   });

//   // the end event indicates that the entire body has been received
//   req.on('end', () => {
//     try {
//       let data = JSON.parse(body);
//       // write back something interesting to the user:
//       res.write(typeof data);
//       res.end();
//     } catch (er) {
//       // uh oh! bad json!
//       res.statusCode = 400;
//       return res.end(`error: ${er.message}`);
//     }
//   });
// });

// server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token o in JSON at position 1

const Readable = require('stream').Readable;

// Stream 实现
class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  // 继承了 Readable 的类必须实现这个函数
  // 触发系统底层对流的读取
  _read() {
    const data = this.dataSource.makeData();
    this.push(data);
  }
}

// 模拟资源池
const dataSource = {
  data: new Array(10).fill('-'),
  // 每次读取时 pop 一个数据
  makeData() {
    if (!dataSource.data.length) return null;
    return dataSource.data.pop();
  }
};

const myReadable = new MyReadable(dataSource);
myReadable.setEncoding('utf8');
myReadable.on('data', (chunk) => {
  console.log(chunk);
});