<?php
// 返回的响应就是一个JSON内容（返回的就是数据）
// 对于返回数据的地址一般我们称之为接口
$data = array(
  array(
    'id'=>1,
    'name'=>'张三',
    'age'=>18

  ),
  array(
    'id'=>2,
    'name'=>'李四',
    'age'=>19
  ),
  array(
    'id'=>3,
    'name'=>'王五',
    'age'=>20
  ),
  array(
    'id'=>4,
    'name'=>'赵六',
    'age'=>21
  )
);
if(empty($_GET['id'])){
  //没有id获取全部
  $json = json_encode($data);
  echo $json;
}else{
  foreach($data as $item){
    if($item['id']!=$_GET['id']) continue;
    $json = json_encode($item);
    echo $json;
  }
}
?>
