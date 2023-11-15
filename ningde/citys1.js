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
  // 定义城市列表
  let cities = [
    "广州", "香港", "青岛", "南京", "武汉", 
    "长沙", "重庆", "洛阳", "丽江", "成都", 
    "拉萨","黄山", "婺源", "哈尔滨", "桂林", 
    "敦煌", "深圳", "三亚", "喀什", "白山市", 
    "西宁", "张家界","呼伦贝尔", "贵阳", "平遥", 
    "阿勒泰", "厦门", "天津", "杭州", "台北",
    "西安", "澳门","上海","北京"
  ];
  
  // 调用函数并打印结果
  // let travelPairs = generateAllTravelPairs(cities);
  // console.log(travelPairs);

  function generateCombinations() {
    var cities = ["北京", "上海", "广州", "青岛", "香港", "南京", "武汉", "长沙", "重庆", "成都", "澳门", "哈尔滨", "三亚", "深圳", "沈阳", "杭州", "厦门", "台北", "天津", "西安"];
    var destinations = ["长白山", "稻城亚丁", "敦煌", "贵州", "桂林", "呼伦贝尔", "黄山", "喀什", "拉萨", "丽江", "洛阳", "梅里雪山", "平遥", "婺源", "西宁", "阿勒泰", "张家界", "北京", "上海", "广州", "青岛", "南京", "武汉", "长沙", "重庆", "成都", "澳门", "哈尔滨", "三亚", "沈阳", "杭州", "厦门", "台北"];
    var combinations = [];

    for (var i = 0; i < cities.length; i++) {
        for (var j = 0; j < destinations.length; j++) {
            if (cities[i] !== destinations[j]) {
                combinations.push({ 出发地: cities[i], 目的地: destinations[j] });
            }
        }
    }
    console.log(combinations.length);
    return combinations;
}
generateCombinations()
  exports.cities=generateAllTravelPairs()