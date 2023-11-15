
const OpenAI =require("openai");
const {ningdeUrl,ningdeyoumo,gpt4} = require('./env.json')

const openai = new OpenAI({
  baseURL:"https://sppiqbhg.cloud.sealos.io/v1",
  // timeout:6000,
  maxRetries: 5,
  apiKey:'sk-Y9Y24Ok5h69kKr5s3f63De7f1e924fC8B649DfBaEe441bFe',
});


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
  console.log(completion.choices[0]);
}

main();