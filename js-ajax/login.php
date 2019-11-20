<?php
if(empty($_POST["username"]) || empty($_POST["password"])){
  exit('请提交用户名或密码');
}
$username = $_POST['username'];
$password = $_POST["password"];

if($username=='admin' && $password=='123'){
  exit('登录成功');
  return;
}
exit('用户名或密码错误');


?>
