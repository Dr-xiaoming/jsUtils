const {url,apikey} = require('./env.json')

const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "stream":false,
      "detail": false,
      "messages": [
          {
              "content": `test`,
              "role": "user"
          }
      ]
    })
  };

// 发送网络请求
  const request = async (url, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(url, options);
        res = await res.json();
        resolve(res?.choices[0]?.message?.content);
      } catch (error) {
        reject(error);
      }
    });
  };

// 并发请求，设置并发上限
  const requestWithLimit = async (requestNum, limit) => {
    const result = [];
    const promises = [];
    let count = 0;
  
    for (let i=0;i<requestNum;i++) {
      const promise = request(url, options)
        .then(res => ({ status: 'fulfilled', value: res }))
        .catch(error => ({ status: 'rejected', reason: `第${count + 1}次请求报错，错误信息：${error.message}` }));
  
      promises.push(promise);
      count++;
  
      if (promises.length === limit || count === requestNum) {
        const res = await Promise.allSettled(promises);
        result.push(...res);
        promises.length = 0;
      }
    }
    console.log(result,'---');
    return result;
  };

  requestWithLimit(10,5)