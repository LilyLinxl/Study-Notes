//获取元素
var container = document.getElementById("container");
var gameCon = document.getElementById("game-con"); //游戏按钮显示box
var startCon = document.getElementById("start-con"); //游戏按钮显示box
var planes = document.getElementById("planes"); //游戏元素box
var endBoard = document.getElementById("end-board"); //结束页面
var suspendBoard = document.getElementById("suspend-board"); //暂停页面
var goOnBtn = document.getElementById("goOn"); //继续按钮
var reStartBtn = document.getElementsByClassName("reStart"); //重新开始按钮
var startBtn = document.getElementById("start"); //开始按钮
var stopBtn = document.getElementById("stop"); //重新开始按钮
var showScores = document.getElementById("score"); //分数显示
var endScore = document.getElementById("endScore"); //结束分数

var totalScore = 0;

//背景移动
var bPY = 0;
function moveBg() {
	bPY += 0.4;
	gameCon.style.backgroundPositionY = bPY + "px";
	if (bPY > 568) {
		bPY = 0;
	}
}

//飞机的构造函数
function Plane(width, height, flyImg, boomImg, placeX, placeY, deadEndTime, speed, score, bloodVolume) {
	this.planeObj = null; //飞机对象
	this.width = width; //飞机宽度
	this.height = height; //飞机高度
	this.boomImg = boomImg; //飞机爆炸图片
	this.flyImg = flyImg; //飞机飞行图片
	this.placeX = placeX || 0; //飞机X坐标
	this.placeY = placeY || 0; //飞机Y坐标
	this.deadEndTime = deadEndTime; //飞机死亡时间
	this.deadTime = 0; //飞机死亡count
	this.speed = speed || 1; //飞机速度；
	this.score = score || 0; //打此飞机获得的分数；
	this.bloodVolume = bloodVolume || 1; //敌机血量
	this.planeDie = false;
	this.init(); //创建实例对象时立即初始化
}

Plane.prototype.init = function() {
	this.planeObj = document.createElement("div");
	planes.appendChild(this.planeObj);
	this.planeObj.style.width = this.width + "px";
	this.planeObj.style.height = this.height + "px";
	this.planeObj.style.backgroundImage = "url(" + this.flyImg + ")";
	this.planeObj.style.position = "absolute";
	this.planeObj.style.left = this.placeX + "px";
	this.planeObj.style.top = this.placeY + "px";
}

Plane.prototype.move = function() {
	//高分加速
	if (totalScore <= 300) {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + "px";
	} else if (totalScore > 300 && totalScore <= 800) {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 1 + "px";
	} else if (totalScore > 800 && totalScore <= 1600) {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 2 + "px";
	} else if (totalScore > 1600 && totalScore <= 3000) {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 3 + "px";
	} else if (totalScore > 3000 && totalScore <= 5000) {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 4 + "px";
	} else {
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 5 + "px";
	}
}

//创建游戏飞机
var planeUser = new Plane(66, 80, "./image/my.gif", "./image/bz.gif", 127, 440);
planeUser.planeObj.setAttribute("id", "myPlane");
var myPlane = document.getElementById("myPlane");

//游戏飞机跟随鼠标移动
function planeMove(e) {
	var width = planeUser.width / 2;
	var height = planeUser.height / 2;
	var bgLeft = 500;
	myPlane.style.cursor = "pointer";
	var left = evt.getClientX(e) - bgLeft - width;//获取鼠标client的兼容代码在后面
	var top = evt.getClientY(e) - height;
	if (left < -33) {
		left = -33;
	} else if (left > 280) {
		left = 280;
	}
	if (top < 0) {
		top = 0;
	} else if (top > 528) {
		top = 528;
	}
	myPlane.style.left = left + "px";
	myPlane.style.top = top + "px";
}
document.addEventListener("mousemove", planeMove);

//子弹对象构造函数
function Bullet(pageX, pageY, width, height, img) {
	this.bulletObj = null; //子弹对象，以便用这个对象使用其他的方法
	this.pageX = pageX || 0; //子弹横坐标
	this.pageY = pageY || 0; //子弹纵坐标
	this.width = width; //子弹宽度
	this.height = height; //子弹高度
	this.img = img; //子弹背景图
	this.bulletStrike = 1;
	this.init(); //初始化时立即调用子弹init方法；
}
Bullet.prototype.init = function() {
	this.bulletObj = document.createElement("div");
	planes.appendChild(this.bulletObj);
	this.bulletObj.style.width = this.width + "px";
	this.bulletObj.style.height = this.height + "px";
	this.bulletObj.style.position = "absolute";
	this.bulletObj.style.backgroundImage = "url(" + this.img + ")";
	this.bulletObj.style.left = this.pageX + "px";
	this.bulletObj.style.top = this.pageY + "px";
}
Bullet.prototype.move = function() {
	this.bulletObj.style.top = this.bulletObj.offsetTop - 20 + "px"; //top=top-20
}

//不理解事例代码中为什么要多一个子弹构造函数 
//function oddBullet(pageX, pageY) {
//	Bullet.call(this, pageX, pageY, 6, 14, "image/bullet1.png");
//}

var bullets = []; //子弹数组
var enemies = []; //敌机数组
var bInitTime = 0; //创建子弹对象间隔时间
var eInitTime = 0; //创建敌机对象间隔时间

function start() {
	moveBg(); //背景移动
	bInitTime++;
	
	//创建子弹
	if (bInitTime % 5 == 0) { //间隔时间创建子弹 不然子弹会连成一线，没有快速移动的感觉
		var newBullet = new Bullet(parseInt(myPlane.offsetLeft) + 33, parseInt(myPlane.offsetTop) - 10, 6, 14,
			"image/bullet1.png");
		bullets.push(newBullet); //新子弹加入数组中方便操作删除
	}

	//子弹移动
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].move();
		if (bullets[i].bulletObj.offsetTop < 0) { //如果子弹移出界面，删除子弹
			planes.removeChild(bullets[i].bulletObj); //删除子弹对象
			bullets.splice(i, 1); //从数组中删除当前索引对应的子弹
		}
	}

	//创建敌机
	if (bInitTime == 20) { //出了几个子弹再创建敌机
		eInitTime++; //敌机计次开始
		if (eInitTime % 5 == 0) { //5次循环创建中敌机
			var mEnemy = new Plane(46, 60, "./image/enemy3_fly_1.png", "./image/zz.gif", random(0, 274), -100, 600, random(1, 2),
				50, 6);
			enemies.push(mEnemy);
		} else if (eInitTime % 2 == 0) {
			var sEnemy = new Plane(32, 24, "./image/enemy1_fly_1.png", "./image/xx.gif", random(0, 288), -100, 360, random(1, 3),
				10, 1);
			enemies.push(sEnemy);
		}
		if (eInitTime == 20) { //20次循环创建大敌机
			var bEnemy = new Plane(110, 164, "./image/enemy2_fly_1.png", "./image/dd.gif", random(0, 210), -100, 1200, 1, 100,
				12);
			enemies.push(bEnemy);
			eInitTime = 0;
		}
		bInitTime = 0; //子弹计次归零
	}

	//敌机移动
	for (var j = 0; j < enemies.length; j++) {
		if (enemies[j].planeDie == false) {
			enemies[j].move();
		}
		if (enemies[j].planeObj.offsetTop > 568) { //敌机出界删除
			planes.removeChild(enemies[j].planeObj);
			enemies.splice(j, 1);
		}
		if (enemies[j].planeDie == true) { //敌机死亡以后删除  
			enemies[j].deadTime += 20;
			if (enemies[j].deadTime == enemies[j].deadEndTime) {
				planes.removeChild(enemies[j].planeObj);
				enemies.splice(j, 1);
			};
		}
	}

	//碰撞检测
	for (var k = 0; k < bullets.length; k++) {
		for (var t = 0; t < enemies.length; t++) {
			//敌机存活时检测
			if (enemies[t].planeDie == false) {
				//敌机碰撞游戏飞机
				if (enemies[t].planeObj.offsetLeft + enemies[t].width >= myPlane.offsetLeft && myPlane.offsetLeft + myPlane.offsetWidth >=
					enemies[t].planeObj.offsetLeft) {
					if (enemies[t].planeObj.offsetTop + enemies[t].height >= myPlane.offsetTop + 40 && myPlane.offsetTop - 20 +
						myPlane.offsetHeight >= enemies[t].planeObj.offsetTop) {
						//碰撞后执行		
						clearInterval(bgTimeId);//停止飞机移动
						removeEventListener(document, "mousemove", planeMove);//停止飞机跟鼠标移动
						myPlane.style.backgroundImage = "url('" + planeUser.boomImg + "')"; //游戏飞机爆炸图片
						enemies[t].planeObj.style.backgroundImage = "url('" + enemies[t].boomImg + "')"; //敌机爆炸图片
						enemies[t].planeDie = true; //敌机死亡
						endBoard.style.display = "block";
						endScore.innerHTML=totalScore;
					}
				}
				//子弹碰撞敌机
				if (enemies[t].planeObj.offsetLeft + enemies[t].width >= bullets[k].bulletObj.offsetLeft && bullets[k].bulletObj.offsetLeft +
					bullets[k].bulletObj.offsetWidth >=
					enemies[t].planeObj.offsetLeft) {
					if (enemies[t].planeObj.offsetTop + enemies[t].height >= bullets[k].bulletObj.offsetTop && bullets[k].bulletObj.offsetTop +
						bullets[k].bulletObj.offsetHeight >= enemies[t].planeObj.offsetTop) {
						//碰撞后执行	
						enemies[t].bloodVolume = enemies[t].bloodVolume - bullets[k].bulletStrike; //敌机血量减去子弹攻击力
						if (enemies[t].bloodVolume == 0) { //血量为0 敌机死亡 换图片 改状态 加分数
						    totalScore+=enemies[t].score;
							showScores.innerText=totalScore;
							enemies[t].planeObj.style.backgroundImage = "url('" + enemies[t].boomImg + "')"; //敌机爆炸图片
							enemies[t].planeDie = true;
						}
						planes.removeChild(bullets[k].bulletObj); //删除子弹对象
						bullets.splice(k, 1);
						break;
					}
				}
			}
		}
	}
}

//为按钮们绑定事件
var inTheGame = true;
//暂停事件是循环的 停了开始，开始停止，所以添加到继续按钮上 可以继续游戏
function suspend() {
	if (inTheGame == true) {
		suspendBoard.style.display = "block";
		clearInterval(bgTimeId);//停止飞机移动
		removeEventListener(document, "mousemove", planeMove);//停止飞机跟鼠标移动
		inTheGame = false;
	} else {
		suspendBoard.style.display = "none";
		bgTimeId = setInterval(start, 20);//飞机继续移动
		addEventListener(document, "mousemove", planeMove);//飞机跟鼠标移动
		inTheGame = true;
	}
}

//停止游戏
function stop() {
	startCon.style.display = "block";
	gameCon.style.display = "none";
	planes.style.display = "none";
	suspendBoard.style.display = "none";
	clearInterval(bgTimeId);//停止飞机移动
	removeEventListener(document, "mousemove", planeMove);//停止飞机跟鼠标移动
}
//开始游戏
var bgTimeId;
function begin() {
	startCon.style.display = "none";
	suspendBoard.style.display = "none";
	gameCon.style.display = "block";
	planes.style.display = "block";
	bgTimeId = setInterval(start, 20);//飞机继续移动
	addEventListener(document, "mousemove", planeMove);//飞机跟鼠标移动
}
//重新开始游戏
function reStart() {
	location.reload(true);
}
//按钮事件
addEventListener(planes, "click", suspend);
addEventListener(goOnBtn, "click", suspend);
addEventListener(startBtn, "click", begin);
addEventListener(stopBtn, "click", stop);
for (var i = 0; i < reStartBtn.length; i++) {
	addEventListener(reStartBtn[i], "click", reStart);
}


////////兼容代码/////////
//鼠标移动获得坐标的兼容代码
var evt = {
	getEvent: function(evt) {
		return window.event || e;
	},
	getClientX: function(evt) {
		return this.getEvent(evt).clientX;
	},
	getClientY: function(evt) {
		return this.getEvent(evt).clientY;
	},
	getScrollLeft: function() {
		return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	},
	getScrollTop: function() {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	},
	getPageX: function(evt) {
		return this.getEvent(evt).pageX ? this.getEvent(evt).pageX : this.getClientX() + this.getScrollLeft();
	},
	getPageY: function(evt) {
		return this.getEvent(evt).pageY ? this.getEvent(evt).pageY : this.getClientX(evt) + this.getScrollTop();
	}
}

//max-min之间的随机数
function random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

//为任意一个元素绑定事件:元素,事件类型,事件处理函数
function addEventListener(element, type, fn) {
	if (element.addEventListener) { //支持
		element.addEventListener(type, fn, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + type, fn);
	} else {
		element["on" + type] = fn;
	}
}

//为任意的一个元素解绑某个事件:元素,事件类型,事件处理函数
function removeEventListener(element, type, fn) {
	if (element.removeEventListener) {
		element.removeEventListener(type, fn, false);
	} else if (element.detachEvent) {
		element.detachEvent("on" + type, fn);
	} else {
		element["on" + type] = null;
	}
}