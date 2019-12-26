function dateFormat(value, formartStr) {
    // 1.根据传入的毫秒创建时间对象
    var date = new Date(value);
    // 2.获取年月日
    var year = date.getFullYear();
    var month = date.getMonth() + 1 + "";
    var day = date.getDate() + "";
    var hours = date.getHours() + "";
    var min = date.getMinutes() + "";
    var sec = date.getSeconds() + "";
    // 3.判断需要格式化的格式
    if(formartStr && formartStr.toLowerCase() === 'yyyy-mm-dd'){
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }else{
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hours.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    }
}