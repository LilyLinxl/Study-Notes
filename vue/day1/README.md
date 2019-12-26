# 1.vue：渐进式JavaScript框架
声明式渲染->组件系统->客户端路由->集中式状态管理->项目管理
# 2.vue基本使用
+ 1.Vue基本使用步骤
        1.需要提供标签用于填充数据
        2.引入vue.js库文件
        3.可以使用vue的语法做功能了
        4.把vue提供的数据填充到标签里面
```javascript
 var vm = new Vue({
     el:'#app',
     data:{
         msg:'Hello Vue'
     }
 });
 
 ```
 1.实例参数
 el:元素的挂载位置(css选择器或者dom元素)
 data:模型数据（值是一个对象)

 2.插值表达式
 + 1.数据填充到html标签中
 + 2.进行简单的计算
 
 3.vue代码运行原理分析
 + 1.概述编译过程的概念（Vue语法->原生语法）
 # 3.vue模板语法
 ## 3.1 概述
### 3.1.1 如何理解前端渲染
:数据填充到html标签中
### 3.1.2 前端渲染方式
+ + 1.原生js拼接字符串：不利于维护，不同程序员写的风格会不同
+ + 2.使用前端模板引擎:没有专门提供事件机制
+ + 3.使用vue特有的模板语法:
- 插值表达式
- 指令
- 事件绑定
- 属性绑定
- 样式绑定
- 分支循环结构
## 3.2 指令
### 3.2.1 什么是指令
+ 什么是自定义属性
+ 指令的本质就是自定义属性
+ 指令的格式：以v-开始
### 3.2.2 v-clock
解决插值表达式的闪动问题
原理：先通过样式隐藏内容，然后在内存中进行值的替换
替换好之后再显示最终的结果
### 3.2.3 数据绑定指令
+ 1.v-text 填充纯文本
代替插值表达式
相比插值表达式更简洁
+ 2.v-html 填充HTML片段
存在安全问题
本网站内部数据可以使用，来自第三方的数据不可以用
+ 3.v-pre 填充原始信息
显示原始信息，跳过编译过程(分析编译过程)

### 3.2.4 数据响应式
1.如何理解响应式
+ 1.html5中的响应式(屏幕尺寸的变化导致样式的变化)
+ 2.数据的响应式(数据的变化导致页面内容的变化)
2.什么是数据绑定
+ 将数据填充到标签中
v-once 只编译一次
使用场景：如果显示的信息后续不再需要修改可以使用
可以提高性能
3.显示内容之后不再具有响应式功能

## 3.3 双向数据绑定
### 3.3.1 什么是双向数据绑定
页面内容和数据互相影响
### 3.3.2 v-model
```javascript
<input type="text" name="" id=""  v-model='msg'>
```
底层原理
```javascript
 <input type="text" v-bind:value='msg' v-on:input="msg=$event.target.value">
```
### 3.3.3 MVVM设计思想
m model
v view
vm view-model 

## 3.4 事件绑定
### 3.4.1 vue如何处理事件
v-on
```javascript
<input type="button" v-on:click='num++' value="+">
<input type="button" @click='num++' value="+">
```
### 3.4.2 事件函数的调用方式
直接绑定函数名称
调用函数
```javascript
<input type="button" v-on:click='handle' value="+">
<input type="button" @click='handle()' value="+">
//vue实例的属性methods用于放置函数
methods:{
         handle:function(){
             this.num++;//this指的是vue的实例对象
         }
     }
```
### 3.4.3 事件函数参数传递
+ 1.普通函数和事件对象
```javascript
<button @click='say("hi",$event)'>SayHi</button>

//$event 是固定的
```
```
handle:function(p,p1,event){
             this.num++;
             console.log(p,p1)
             console.log(event.target.innerHTML)
         },
         handle1 :function(event){
             console.log(event.target.innerHTML)
         }
```
### 3.4.4 事件修饰符
+ .stop 阻止冒泡
```javascript
<a v-on:click.stop="handle">跳转</a>
```
+ .prevent 阻止默认行为
```javascript
<a v-on:click.prevent="handle" href="www.baidu.com">跳转</a>
```
### 3.4.5 按键修饰符
+ .enter 回车键
```javascript
<input v-on:keyup.enter='submit'>
```
+ .delete 删除键
```javascript
<input v-on:keyup.delete='handle'>
```
### 3.4.6 自定义按键修饰符
全局config.keyCodes对象
使用方法
```javascript
Vue.config.keyCodes.f1=112
v-on:keyup.f1
```
### 3.4.7 动态参数
```html
<a v-bind:[attributeName]="url"> ... </a>
<a v-on:[eventName]="doSomething"> ... </a>
```
## 3.5 属性绑定
### 3.5.1 vue如何动态处理属性?
+ 1.v-bind指令用法
```javascript
 <a v-bind:href='url'>跳转</a>
```
+ 2.简写
```javascript
 <a :href='url'>跳转</a>
```

## 3.6 样式绑定
### 3.6.1 class样式处理
+ 对象语法
```javascript
  <div v-bind:class="{active:isActive}"></div>
```
+ 数组语法
```javascript
   <div v-bind:class="[activeClass,errorClass]"></div>
```
+ 对象绑定和数组绑定可以结合使用
```javaScript
<div v-bind:class="[activeClass,errorClass,{redFont:isActive}]">2222</div>
```
+ class绑定的值可以简化操作
通过对象或者数组绑定给class，对象中是样式的键值对，数组则是样式名
```html
 <div v-bind:class="activeArr">2222</div>
        <div v-bind:class="activeObj">22222</div>
```
```javascript
 activeArr:['active','redFont'],
                activeObj:{
                    active:true,
                    redFont:true
                }
```
+ 默认的class如何处理?默认的class会保留
### 3.6.2 style样式处理
+ 对象语法
```html
  <div v-bind:style="{color:activeColor,fontSize:fontSize}"></div>
```
```javascript
activeColor:'red',
fontSize:'20px'
+ 数组语法
```html
   <div v-bind:style="[activeStyles,errorStyles]"></div>
```
```javascript
activeStyles:{
    color:red,
    width:'10px'
}
```
## 3.7 分支循环结构
### 3.7.1 分支结构
v-if
v-else
v-else-if
v-show
### 3.7.2 v-if与v-show的区别
v-if控制元素是否渲染到页面
v-show控制元素是否显示(已经渲染到页面上了)
### 3.7.3 循环结构
v-for 遍历数组
```html
 <li v-for="(item,index) of items">
              {{ item.message }}----{{index}}---{{parentMessage}}
            </li>
```
key的作用：帮助Vue区分不同的元素，从而提高性能
```html
<li :key='item.id' v-for='{item,index} in list'>
    {{item}}</li>
```

### 3.7.4 v-if和v-for结合使用
```html
<div v-if='value==12' v-for="(item,index) of items"></div>
```

# 5 vue常用特性
## 5.1 表单操作
input
textarea
select
radio
checkbox
```html
 <div id="app">
        <form action="">
           姓名: <input type="text" id="" v-model="uname">
           <br>
           性别: <input type="radio" id="" value="male" v-model="gender">男
           <input type="radio" id="" value="female" v-model="gender">女
           <br>

            爱好: <input type="checkbox" id="" value="basketball" v-model="hobbies">
            <input type="checkbox" id="" value="sing"  v-model="hobbies">
            <input type="checkbox" id="" value="code"  v-model="hobbies">
            <br>

            职业:<select v-model="selected" multiple>
                <option disabled value="">请选择职业</option>
                <option value="1">医生</option>
                <option value="2">教师</option>
                <option value="3">工程师</option>
            </select>
            <br>
            个人简介:<textarea v-model="textarea"></textarea>
        </form>
    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    ```
    ```javascript
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
               uname:'jack',
               gender:'male',
               hobbies:["basketball","sing"],
               selected:["1","2"],
               textarea:'lalalla'
            }
        });
    </script>
```
## 5.2 表单修饰符
.number
.lazy
.trim
```html
 <div id="app">
       <input type="text" id="" v-model.lazy="lazy">
       {{lazy}}
       <!-- 具体应用场景：输入用户名后，失去焦点后才开始判断用户名是否存在 -->
       <input type="text" id="" v-model.number="number">
       <input type="text" id="trim" v-model.trim="trim">
       <input type="button" value="test" @click="test">
    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                lazy:'lazy',
                number:123,
                trim:' 222'
            },
            methods:{
                test:function(){
                    console.log(this.trim.length)
                    console.log(this.number)

                }
            }
        });
    </script>
```
## 5.3 自定义指令
+ 1.为何使用？
+ 2.语法规则
+ 3.指令用法
+ 4.带参数指令用法
+ 5.局部指令
```html
<div id="app">
       <input type="text" name="" id="" v-focus v-color="color">
    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    <script>
        //全局指令
        Vue.directive('focus',{
            inserted:function(el){
                el.focus()
            }
        })
        var vm = new Vue({
            el: '#app',
            data: {
                color:'yellow'
            },
            //全部指令
            directives:{
                color:{
                    inserted:function(el,binding){
                        console.log(binding)
                        el.style.backgroundColor=binding.value
                    }
                }
            }
        });
    </script>
```
## 5.4 计算属性
+ 1.为何使用
+ 2.如何使用
+ 3.和方法的区别
计算属性是基于依赖（data中的数据）进行缓存的，而方法没有缓存
```html
  <div id="app">
        <span >{{str}}</span><br>
        <span >{{reverse}}</span><br>
        <span >{{reverse}}</span><br>
        <span >{{reverseFun()}}</span>
        <span >{{reverseFun()}}</span>


    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                str:'hello',
            },
            methods:{
                reverseFun:function(){
                    console.log("method")
                    return this.str.split('').reverse().join('')
                }
            },
            computed:{
                reverse:function(){
                    console.log("computed")
                    return this.str.split('').reverse().join('')
                }
            }
        });
    </script>
```
## 5.5 侦听器
+ 1.应用场景
数据变化时执行异步或开销较大的操作
数据一旦发生变化就通知侦听器所绑定方法
+ 2.使用方法
```html
  <div id="app">
       <input type="text" name="" id="" v-model="firstName">
       <input type="text" name="" id="" v-model="lastName">
       <div>{{fullName}}</div>
    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    <script>
        //全局指令
        Vue.directive('focus',{
            inserted:function(el){
                el.focus()
            }
        })
        var vm = new Vue({
            el: '#app',
            data: {
                firstName:'jim',
                lastName:'green',
                fullName:'jim green'
            },
            watch:{
                firstName:function(val){
                    this.fullName=val+' '+this.lastName;
                },
                lastName:function(val){
                    this.fullName=this.firstName+' '+ val;
                }
            }
        });
    </script>
```
### 5.5.1 验证用户名是否可用
需求：输入框输入姓名，失去焦点时验证是否存在，如果已经存在，提示
重新输入，如果不存在，提示可以使用
+ 1.通过v-model实现数据绑定
+ 2.需要提供提示信息
+ 3.需要侦听器监听输入信息的变化
+ 4.需要修改触发的事件
```html
    <div id="app">
       <input type="text" name="" id="" v-model.lazy="username">{{tip}}
    </div>
    <script src="../node_modules/vue/dist/vue.min.js"></script>
    <script>
       
        var vm = new Vue({
            el: '#app',
            data: {
                username:'',
                tip:''
            },
            methods:{
                checkName:function(username){
                    //调用接口，但是可以使用定时任务的方式模拟接口调用
                    var that = this;
                    setTimeout(() => {
                        if(username=='admin'){
                            that.tip='用户名已存在，请更换一个'
                        }else{
                            that.tip='用户名可以使用'
                        }
                    }, 2000);
                }
            },
            watch:{
               username:function(val){
                this.checkName(val);
                this.tip='正在验证中...'
               }
            }
        });
    </script>
```
## 5.6 过滤器
+ 1.作用：格式化数据
+ 2.自定义过滤器
+ 3.过滤器的使用
+ 4.局部过滤器
+ 5.带参数的过滤器
## 5.7 生命周期
有八个钩子函数
其中mounted用的最多
## 5.8 综合案例
+ 1.补充知识（数组相关API）
1.变异方法(修改原有数据)
push(),pop(),shift(),unshift(),splice(),sort(),reverse()
2.替换数组(生成新的数组)
filter(),concat(),slice()
+ 2.修改响应式数据
```javascript
Vue.set(vm.userProfile, 'age', 27);
vm.$set(vm.userProfile, 'age', 27);
```
### 5.8.1 图书列表
+ 1.实现静态列表效果
+ 2.基于数据实现模板效果
+ 3.处理每行的操作按钮
### 5.8.2 添加图书
+ 1.实现表单的静态效果
+ 2.添加图书表单域数据绑定
+ 3.添加按钮事件绑定
+ 4.实现添加业务逻辑
### 5.8.3 修改图书
+ 1.修改信息填充到表单
+ 2.修改后重新提交表单
+ 3.重用添加和修改的方法
### 5.8.4 删除图书
+ 1.删除按钮绑定事件处理方法
+ 2.实现删除业务逻辑
### 5.8.5 常用特性应用场景
+ 1.过滤器(格式化日期)
+ 2.自定义指令(获取表单焦点)
+ 3.计算属性（统计书目数量）
+ 4.侦听器(验证图书存在性)
+ 5.生命周期（图书数据处理）

# 4.组件化开发
目标：
## 4.1 组件化开发思想
## 4.2 组件注册
### 4.2.1 注意事项
+ 1.
+ 2.
+ 3.
+ 4.
### 4.2.2 局部组件注册
## 4.3 Vue调试工具用法
## 4.4 组件间数据交互
### 4.4.1
### 4.4.2
### 4.4.3 
### 4.4.4 props属性值类型
如果不用v-bind，都会输出字符串类型，用了才会输出原始类型

props传递数据原则：单向数据流，父组件向子组件传值