const {ningdeUrl,ningdeyoumo,ningdeApi} = require('./env.json')
const XLSX = require('xlsx');

const getOptions = (content='目的地：北京，出发地：澳门')=>{
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ningdeyoumo}`,
      'Content-Type': 'application/json',
      'auth': 'auth' 
    },
    body: JSON.stringify({
      "stream":false,
      "detail": false,
      "messages": [
          {
              "content": `${content}`,
              "role": "user"
          }
      ]
    })
  };
  return options
}

// 发送网络请求
  const request = async (url, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(url, options);
        res = await res.json();
        // console.log(res);
        resolve(res?.choices[0]?.message?.content);
      } catch (error) {
        reject(error);
      }
    });
  };

  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [
        {
            "role": "system",
            "content": "# 文案生成器 &nbsp;\ ## Profile &nbsp;\ - Role: 广告文案创意从业者，兼职线下脱口秀演员。 &nbsp;\ - language: 中文 &nbsp;\ - Description: 你是一个广告文案高手，兼职线下脱口秀演员。撰写一个系列文案。 &nbsp;\ - 文案结构如下： &nbsp;\ “充电10分钟，你能走多远” &nbsp;\ “从A到B，XXXX公里” &nbsp;\ “（需要补充从A地点穿越到B地点，【所带来的感受】，用脱口秀演员般的灵活幽默）” &nbsp;\ &nbsp;\ 【所带来的感受】需要用一个幽默风趣的文案进行表达。具备双关的效果，即描述客观，也令人会心一笑。要求字数少，简短有力。第三局只有0或1个断句。 &nbsp;\ &nbsp;\ ## 参考案例： &nbsp;\ &nbsp;\ ### 清澈愚蠢的可爱 &nbsp;\ - 输入1：出发地：北京 目的地：三亚 &nbsp;\ - 输出1： &nbsp;\ “充电10分钟，你能走多远” &nbsp;\ “从北京到三亚，2676公里” &nbsp;\ “来看海吗？我请客。” &nbsp;\ &nbsp;\ ### 反差萌 &nbsp;\ - 输入2：出发地：北京 目的地：乌鲁木齐 &nbsp;\ - 输出2： &nbsp;\ \"充电10分钟，你能走多远\" &nbsp;\ \"从北京到乌鲁木齐，3068公里\" &nbsp;\ \"大人就是，大胆请假出去玩儿的人\" &nbsp;\ &nbsp;\ ### 比喻 &nbsp;\ - 输入3：出发地：西宁 目的地：呼和浩特 &nbsp;\ - 输出3： &nbsp;\ \"充电10分钟，你能走多远\" &nbsp;\ \"从西宁到呼和浩特，1478公里\" &nbsp;\ \"打卡沙漠草原。这不叫旅行，这叫地理课。\" &nbsp;\ &nbsp;\ ### 文字游戏 &nbsp;\ - 输入4：出发地：北京 目的地：昆明 &nbsp;\ - 输出4： &nbsp;\ \"充电10分钟，你能走多远\" &nbsp;\ \"从北京到昆明，1616公里\" &nbsp;\ \"摆脱空气清新剂，去空气清新地。\" &nbsp;\ &nbsp;\ ##内容： &nbsp;\ 语言一定要幽默。思考两个城市的潜台词。优先考虑两座城市的关系。考虑脱口秀演员的语言风格。内容入手角度考虑每个城市气候特点，饮食文化，自然禀赋，风土人情，文化特点，名声古迹。 &nbsp;\ &nbsp;\ 只输出一个文案即可。整体字数越少越好。 &nbsp;\ &nbsp;\ ## 补充信息 &nbsp;\ 地点：中国大陆 &nbsp;\ 出行方式：开车自驾 &nbsp;\ ###减少使用形容词，多用动词名词，简短有力 &nbsp;\ ###禁止爆粗口，禁止讨论当今政治局势，禁止自称“大爷”，等无理字段 &nbsp;\ ###不出现负面情绪或会引发负向评价的内容及城市相关内容"
          },
          {
              "content": `目的地：北京，出发地：澳门`,
              // "content": `你好`,
              "role": "user"
          }
      ],
      model: "gpt-4-1106-preview",
    })
    return new Promise(async (resolve, reject) => {
      try {
        resolve(completion.choices[0]?.message?.content);
      } catch (error) {
        console.log(error,'err');
        reject(error);
      }
    });
  }

// request(ningdeUrl,options)
// 并发请求，设置并发上限
  const requestWithLimit = async (url,Options,requestNum, limit) => {
    const result = [];
    const promises = [];
    let count = 0;
  
    for (let i=0;i<requestNum;i++) {
      // const promise = request(url, Options)
      const promise = main()
        .then(res => {
          // console.log(res);
          return res
        })
        .catch(error => ({ status: 'rejected', reason: `第${count + 1}次请求报错，错误信息：${error.message}` }));
  
      promises.push(promise);
      count++;
  
      if (promises.length === limit || count === requestNum) {
        const res = await Promise.allSettled(promises);
        result.push(...res);
        promises.length = 0;
      }
    }
    // console.log(result,'---');
    return result;
  };

  // requestWithLimit(ningdeUrl,getOptions(),6,20)


  function generateAllTravelPairs(cities) {
    let pairs = [];
    // 对每个城市，将其与其他城市配对作为目的地
    cities.forEach((fromCity) => {
      cities.forEach((toCity) => {
        if (fromCity !== toCity) { // 确保出发地和目的地不同
          pairs.push(`目的地：${toCity}，出发地：${fromCity}`);
        }
      });
    });
  
    return pairs;
  }

  let cities = [
    "广州", "香港", "青岛", "南京", "武汉", 
    "长沙", "重庆", "洛阳", "丽江", "成都", 
    "拉萨","黄山", "婺源", "哈尔滨", "桂林", 
    "敦煌", "深圳", "三亚", "喀什", "白山市", 
    "西宁", "张家界","呼伦贝尔", "贵阳", "平遥", 
    "阿勒泰", "厦门", "天津", "杭州", "台北",
    "西安", "澳门","上海","北京"
  ];

  async function writeExcel2(data, readFileName = 'put.xlsx', overwrite = true) {
    let workbook;
    let worksheet;
    let sheetName = 'Sheet1';
  
    if (data.length === 0 || !Array.isArray(data)) {
      throw new Error('The data provided to writeExcel is empty or not in Array format.');
    }
  
    function arrDeduplication(objects) {
      const strings = objects.map((item) => JSON.stringify(item));
      const removeDupList = [...new Set(strings)];
      const results = removeDupList.map((item) => JSON.parse(item));
      return results;
    }
  
    data = arrDeduplication(data);
  
    // 将对象键值对转换成 [{ k: key, v: value }, ...] 的形式
    function transformData(dataObj) {
      return Object.keys(dataObj).reduce((result, key, index) => {
        result.push({ k: key, v: dataObj[key] });
        return result;
      }, []);
    }
  
    const keyValuePairs = data.flatMap(transformData);
  
    // 将键值对的数组转换成工作表
    worksheet = XLSX.utils.json_to_sheet(keyValuePairs, {
      header: ["k", "v"], // 指定工作表的标题
      skipHeader: true // 确保不重复添加标题行
    });
  
    if (overwrite) {
        workbook = XLSX.utils.book_new(); // 创建新工作簿
        workbook.SheetNames.push(sheetName); // 添加新的表格名
    } else {
        try {
            workbook = XLSX.readFile(readFileName); // 读现有工作簿
        } catch (e) {
            workbook = XLSX.utils.book_new(); // 如果不存在就创建新工作簿
            workbook.SheetNames.push(sheetName); // 添加新的表格名
        }
    }
  
    workbook.Sheets[sheetName] = worksheet; // 将工作表添加／更新至工作簿
    XLSX.writeFile(workbook, readFileName); // 写入文件
  }
  let arrCitys=[]
  const arrResult = [];
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const helper = async () => {
    arrCitys = generateAllTravelPairs(cities);
    console.log(arrCitys, "arrCitys");
  
    // 通过 for... of 循环来处理每个 cityPair
    for (let index = 0; index < arrCitys.length; index++) {
      let cityPair = arrCitys[index];
      // 每次调用除了第一次外都添加延迟
      if (index !== 0) {
        await delay(1000);
        console.log(index);
      }
      let options = getOptions(cityPair);
      let arrRes = await requestWithLimit(ningdeUrl, options, 3, 3);
      arrCitys.pop();
      arrRes.forEach(a => {
        arrResult.push({ [cityPair]: a.value });
      });
    }
  
    return writeExcel2(arrResult, 'youmo.xlsx', true);
  };
helper(); // 调用 helper

