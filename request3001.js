let apiKey=""
let  baseURL= ''
let appid = ''

fetch(baseURL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}-${appid}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
        appId: appid,
        messages: [
            {
              "content": "用户名：安德玛用户\n题目一选项：A\n题目二选项：日出 ",
              "role": "user"
            }
          ],
       stream:false
  })
})
.then(response => response.json())
.then(res => console.log(res.choices[0].message.content))
.catch((error) => console.error('Error:', error));