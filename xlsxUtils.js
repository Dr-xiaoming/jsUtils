const XLSX = require('xlsx');

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
 * 将js对象写入excel文件，提供覆盖还是继续添加操纵
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