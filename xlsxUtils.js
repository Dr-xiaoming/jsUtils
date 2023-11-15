// const XLSX = require('xlsx');
import XLSX from "xlsx";
import data from './wenyi5.json' assert { type: 'json' };

// 对象数组去重函数
function arrDeduplication(objects) {
    const strings = objects.map((item) => JSON.stringify(item));
    const removeDupList = [...new Set(strings)];
    const results = removeDupList.map((item) => JSON.parse(item));
    return results
}


/**
 * 读取excel文件，并转换成js对象，提供去重选项
 * @param {*} filePath 
 * @param {boolean} removeDuplicates 
 * @returns {Array<object>} 对象的key为工作表栏目名，value为栏目值
 */
function readExcelFile(filePath, removeDuplicates = false) {
    // 读取Excel文件
    const workbook = XLSX.readFile(filePath);
    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // 将工作表转换为JSON对象数组
    const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    // 获取列名（第一行）
    const headers = data[0];
    // 创建对象数组
    let objects = data.slice(1).map(row => {
        const obj = {};
        row.forEach((value, index) => {
            // 使用列名作为键
            const key = headers[index];
            obj[key] = value;
        });
        return obj;
    });
    // 如果需要去重
    if (removeDuplicates) {
        objects = arrDeduplication(objects)
    }
    console.log(objects,'res');
    return objects;
}
// readExcelFile使用示例
// readExcelFile('./test.xlsx',true)


/**
 * 将js对象写入excel文件，提供覆盖还是继续添加操纵，对象的key为工作表栏目名，value为栏目值（即上下排列）
 * @param {Array<object>} data 
 * @param {*} readFileName 
 * @param {boolean} sheetName 如果工作表名重复则写入新的表
 * @param {boolean} overwrite  是否创建新文件，否则继续写如
 */
async function writeExcel(data, readFileName='output.xlsx', overwrite=true) {
    let workbook;
    let worksheet;
    let sheetName = 'Sheet1';

    if (overwrite) {
        workbook = XLSX.utils.book_new();
        worksheet = XLSX.utils.json_to_sheet(data);
    } else {
        try {
            workbook = XLSX.readFile(readFileName);
            if (workbook.SheetNames.includes(sheetName)) {
                // 如果工作簿中已经有一个名为"Sheet1"的工作表，我们就在它上面添加数据
                let originalData = await readExcelFile(readFileName, sheetName);
                let combinedData = originalData.concat(data);
                worksheet = XLSX.utils.json_to_sheet(combinedData);
            } else {
                // 否则，我们就创建一个新的工作表
                worksheet = XLSX.utils.json_to_sheet(data);
            }
        } catch (e) {
            workbook = XLSX.utils.book_new();
            worksheet = XLSX.utils.json_to_sheet(data);
        }
    }

    workbook.Sheets[sheetName] = worksheet;
    try {
        XLSX.writeFile(workbook, readFileName);
    } catch (e) {
        throw new Error(`Error writing file: ${e.message}`);
    }
}
// writeExcel使用示例
// writeExcel([{name: 'John', age: 30}, {name: 'Jane', age: 28}], 'output.xlsx', false);


/**
 * 
 * @param {*} data 
 * @param {*} readFileName 
 * @param {*} overwrite 
 * 对象的key为一列，value为一列（即左右排列）
 */
async function writeExcel2(data, readFileName = 'wenyi222.xlsx', overwrite = true) {
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
  


// 此处是对json数据的数据清洗
//   const regex = /从([^,]*)到([^,]*)/;
//   for(let i=0;i<data.length;i++){
//     const matches = data[i].value.match(regex);
//     if(i==0) console.log(matches);
//     if(matches)  {
//         if(matches[2]?.length>3) matches[2]=matches[2].slice(0,3)
//         data[i]['status']=`目的地：${matches[2]}，出发地：${matches[1]}`
//     }
//   }
//   for(let i=0;i<data.length;i++){
//     let obj = data[i]
//     obj[obj.status] = obj.value;
//     delete obj.value;
//     delete obj.status
//   }
  // 示例调用
  writeExcel2(data);
//   console.log(data);