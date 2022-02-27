// 将JSON形式的题目导入的数据库中

questions = 

{
  "云计算基础": [
    {
      "question": "下面哪个是软件代码版本控制软件？",
      "option": {
        "A": "project",
        "B": "SVN ",
        "C": "notepad++",
        "D": "Xshell "
      },
      "answer": "B",
      "type": 1,
      "weights": 20, 
      "checked": "false"
    },
    {
      "question": "为满足金融业务的监管和安全要求，平台不需要考虑下列哪个应用?",
      "option": {
        "A": "文档版本管理 ",
        "B": "防火墙策略",
        "C": "安全漏洞扫描",
        "D": "多租户安全隔离"
      },
      "answer": "A",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "子网掩码为255.255.255.0，下列哪个 IP地址和其余的不在同一网段中？",
      "option": {
        "A": "172.16.32.55",
        "B": "172.16.25.44",
        "C": "172.16.32.201",
        "D": "172.16.32.12"
      },
      "answer": "B",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "VLAN基本上可以看成是一个？",
      "option": {
        "A": "局域网",
        "B": "广播域",
        "C": "工作站",
        "D": "广域网"
      },
      "answer": "B",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "关于 rm -rf dirname 命令，说法正确的是?",
      "option": {
        "A": "删除 dirname 目录中的文件",
        "B": "删除 dirname 目录，删除时给予提示",
        "C": "只能删除空目录",
        "D": "递归强行删除 dirname 目录，及其目录下的所有文件"
      },
      "answer": "D",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "在主从数据库的哪种模式下，部分 slave 的数据同步不连接主节点，而是连接从节点？",
      "option": {
        "A": "级联复制",
        "B": "一主双从",
        "C": "双主双从",
        "D": "A、C"
      },
      "answer": "A",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "以下哪项是影响数据库速度的主要原因？",
      "option": {
        "A": "查询数据",
        "B": "写入数据",
        "C": "删除数据",
        "D": "修改数据"
      },
      "answer": "B",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "在使用命令上传一个glance镜像到 OpenStack平台的时候，需要配置镜像格式为 qcow2，使用的相应参数是？",
      "option": {
        "A": "--container-format",
        "B": "--containers-format",
        "C": "--disk-format",
        "D": "--disks-format",
      },
      "answer": "C",
      "type": 1,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "白盒技术主要包括？",
      "option": {
        "A": "语句覆盖",
        "B": "判定覆盖",
        "C": "条件覆盖",
        "D": "逻辑覆盖"
      },
      "answer": ["A", "B", "C", "D"],
      "type": 2,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "IP 地址中网络号的作用有？",
      "option": {
        "A": "指定了主机所属的网络",
        "B": "指定了网络上主机的标识",
        "C": "指定了设备能够进行通信的网络",

        "D": "指定被寻址的网中的某个节点"
      },
      "answer": ["A","C"],
      "type": 2,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "下列选项当中，哪些是云计算的特点？",
      "option": {
        "A": "虚拟化技术",
        "B": "动态可扩展",
        "C": "灵活性高",
        "D": "性价比高"
      },
      "answer": ["A", "B","C", "D"],
      "type": 2,
      "weights": 20,
      "checked": "false"
    },
    {
      "question": "关于 S3 的以下哪种 HTTP 方法最终具有一致性？",
      "option": {
        "A": "更新",
        "B": "删除",
        "C": "放置新对象",
        "D": "覆盖 PUT"
      },
      "answer": ["B","D"],
      "type": 2,
      "weights": 20,
      "checked": "false"
    }
  ]
}

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Ilovestudy2much',//请自行设置
  database : 'testdb_01'
});

connection.connect();
//将试题存入数据库
for (name in questions){
  console.log(name);
  //var sql = "select testname from test_info";
  var sql = "select testid from test_info where testname='" + name + "';";
  connection.query(sql,function (err, result) {
    console.log(result)
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }
    var testid = result[0].testid;
    //调整数据的类型
    for (q in questions[name]){
      question = questions[name][q]["question"];
      A = questions[name][q]["option"]["A"];
      B = questions[name][q]["option"]["B"];
      C = questions[name][q]["option"]["C"];
      D = questions[name][q]["option"]["D"];
      E = questions[name][q]["option"]["E"];
      F = questions[name][q]["option"]["F"];
      answer = questions[name][q]["answer"];
      question = quotes(question);
      choices = [A,B,C,D,E,F];
      for (i in choices){
        choices[i] = quotes(choices[i]);
      }
      answer = quotes(answer);
      choices = choices.join()
      types = questions[name][q]["type"];
      weights = questions[name][q]['weights'];
      checked = quotes(questions[name][q]['checked']);
      //插入
      //var sql = "insert item_poll value (" + [testid, 0, types, question].join() + "," + choices + "," + [answer, weights,checked].join() + ");";
      var sql = "insert item_poll value ("+[testid, 0, types].join()+","+question+","+choices+","+answer+","+""+weights+","+checked+");";


      connection.query(sql,function (err, result) {
        if(err){
          console.log(err.message);
          return;
        }
      });
    }
  });
 
}

//在内层添加引号 如果s是数组，可以直接将其转化为字符串（仅JS）
function quotes(s){
  if (s){
    return "'" + s + "'"; 
  }
  return "null";
}























