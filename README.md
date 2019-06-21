# 估时工具

敏捷流程中，需要对任务进行估时，每个人独立地给出自己的估时。
给出估时的形式可以是多样的，纸牌、卡片，甚至用计算器显示一个数字。

这个工具只是将给出估时的形式放到手机上，并以比较容易看到的样式展示。支持两种模式，离线或者聊天室。

## 离线模式

在登录页面，下方有「离线模式」按钮，点击即可进入离线模式。

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/login.png">
</p>

进入离线模式页面，即可选择需要的点数（小时数）

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/offline_numbers.png">
</p>

以卡片模式展示点数
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/offline_card.png">
</p>

## 聊天室模式

> 需要搭配 [EstimateServer](https://github.com/ltaoo/estimate-server) 使用。

首先需要登录，输入用户名（最好不要重名，是以名字作为唯一 id），登录后进入大厅，可在大厅页面加入房间或者自己创建房间。

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/hall.png">
</p>

在确定成员都加入房间后，即可点击开始估时。
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/room.png">
</p>
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/numbers.png">
</p>

在确定成员都给出估时后，即可点击「展示结果」，查看估时统计。
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/card.png">
</p>
<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/ltaoo/estimate/master/imgs/result.png">
</p>

然后可以选择开始新的估时或结束估时。

## 存在的问题

`src/index.html` 和 `src/constants.js` 中写死了服务端的地址，如果服务端先部署了，就不会有问题。但如果是本地开发，服务端也起在本地，在最后打包部署前，还需要将这两个地方的地址改掉。
`index.html` 中的地址应该通过 `webpack plugin` 写入，地址通过环境变量决定。
