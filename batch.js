import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import XLSX from 'xlsx'
import { gpt4,agent } from "./env.json";


const agent = new HttpsProxyAgent(agent);

const openai = new OpenAI({
  apiKey: gpt4,
  httpAgent: agent
});

async function main(content) {
  return new Promise(async (resolve, reject) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    "content": `# 广告一句话文案生成器
                    ## Profile
                    - Role: 广告文案创意从业者
                    - language: 中文
                    - Description: 你是一个广告文案高手。我有一个系列文案需要撰写。 
                    - 文案结构如下：
                    “充电10分钟，你能走多远”
                    “从A到B，XXXX公里”
                    “（需要补充从A地点穿越到B地点，所带来的感受，不要直接用城市名称）”
                    
                    所带来的感受，需要用一个有中文作家文笔的文案进行表达。具备双关的效果，即描述客观，也令人会心一笑，有浪漫遐想的意象。要求字数少，简短有力。第三局只有0或1个断句。
                    
                    
                    ##内容：
                    充满一定要优雅。优先考虑两座城市的关系。考虑纪伯伦、泰戈尔，张爱玲，北岛的笔法。再考虑每个城市气候特点，饮食文化，自然禀赋，风土人情，文化特点，名声古迹。
                    
                    
                    只输出一个文案即可。整体字数越少越好。
                    ## 参考案例：
                    
                    ### 多重感官
                    - 输入1：出发地：哈尔滨 目的地：三亚
                    - 输出1：
                    “充电10分钟，你能走多远”
                    “从哈尔滨到三亚，4500公里”
                    “雪域穿越热带，冰火两重天。”
                    
                    ### 意境
                    - 输入2：出发地：天津 目的地：上海
                    - 输出2：
                    "充电10分钟，你能走多远"
                    "从天津到上海，1068公里"
                    "悠然秋色可向往"
                    
                    ### 通感&画面感
                    - 输入3：出发地：上海 目的地：香港
                    - 输出3：
                    "充电10分钟，你能走多远"
                    "从上海到香港，1216公里"
                    "豫园小笼，一口咬下，是尖沙咀的夜景。"
                    
                    
                    - 输入4：出发地：上海 目的地：重庆
                    - 输出4：
                    "充电10分钟，你能走多远"
                    "从上海到重庆，1700公里"
                    "黄浦江的波光，映照在洪崖洞的石壁上。"
                    
                    
                    
                    ## 补充信息
                    地点：中国大陆
                    出行方式：开车自驾
                    ###减少使用形容词，多用动词名词，简短有力
                    ###不出现负面情绪或会引发负向评价的内容及城市相关内容`
                  },
                  {
                      "content": `${content}`,
                      "role": "user"
                  }
              ],
              model: "gpt-4-1106-preview",
            temperature:0.8,
            max_tokens:4000,
          });
      resolve(completion.choices[0]?.message?.content);
    } catch (error) {
    //   console.log(error,'err');
      reject(error);
    }
  });
}

const requestWithLimit = async (cityPair,requestNum, limit) => {
    const result = [];
    const promises = [];
    let count = 0;
  
    for (let i=0;i<requestNum;i++) {
      // const promise = request(url, Options)
      const promise = main(cityPair)
        .then(res => {
          // console.log(res);
          return res
        })
        .catch(error => ({ status: 'rejected', reason: `第${count + 1}次请求报错，错误信息：${error.message}` }));
  
      promises.push(promise);
      count++;
  
      if (promises.length === limit || count === requestNum) {
        const res = await Promise.allSettled(promises);
        console.log(res,'res');
        result.push(...res);
        promises.length = 0;
      }
    }
    return result;
  };

  function generateCombinations() {
    var cities = ["北京", "上海", "广州", "青岛", "香港",
                  "南京", "武汉", "长沙", "重庆", "成都",
                  "澳门", "哈尔滨", "三亚", "深圳", "沈阳",
                   "杭州", "厦门", "台北", "天津", "西安"];
    var destinations = ["长白山", "稻城亚丁", "敦煌", "贵州", "桂林",
                       "呼伦贝尔", "黄山", "喀什", "拉萨", "丽江",
                        "洛阳", "梅里雪山", "平遥", "婺源", "西宁",
                         "阿勒泰", "张家界", "北京", "上海", "广州",
                          "青岛", "南京", "武汉", "长沙", "重庆",
                           "成都", "澳门", "哈尔滨", "三亚", "沈阳",
                            "杭州", "厦门", "台北"];
    var combinations = [];

    for (var i = 0; i < cities.length; i++) {
        for (var j = 0; j < destinations.length; j++) {
            if (cities[i] !== destinations[j]) {
                combinations.push(`出发地: ${cities[i]}, 目的地: ${destinations[j]}`);
            }
        }
    }

    return combinations;
}

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
    arrCitys = generateCombinations();
    console.log(arrCitys.length, "arrCitys");
    // let isfor = false
    let isfor = true

    // 通过 for... of 循环来处理每个 cityPair
    for (let index = 0; index < arrCitys.length; index++) {
      let cityPair = arrCitys[index];
      // if(cityPair=='出发地: 西安, 目的地: 厦门') {
        // isfor=true 
        // continue}
      if(isfor){
                      // 每次调用除了第一次外都添加延迟
                      // if (index !== 0) {
                      //   await delay(200);
                      //   console.log(index);
                      // }
                      let arrRes = await requestWithLimit(cityPair, 3, 3);
                      arrRes.forEach(a => {
                        arrResult.push({ [cityPair]: a.value });
                      });
      }
    }
    return writeExcel2(arrResult, 'wenyi1.xlsx');
  };
helper(); 


// 向openai批量发送网络请求，然后将获取数据写入excel文件中
// 防止代码运行到一半中断不会输出文件，还浪费tokens，可将运行输出到指定地方（如 node xxx > xxx.txt），事后手动清洗数据