import { eventSource, event_types } from "../../../../script.js";

// 创建红色方块并显示服装状态
function createRedSquare(clothingStatus = "未知") {
  let redSquare = document.getElementById('red-square-extension');
  
  if (!redSquare) {
    redSquare = document.createElement('div');
    redSquare.id = 'red-square-extension';
    document.body.appendChild(redSquare);
  }

  redSquare.style.width = '200px';
  redSquare.style.height = '200px'; 
  redSquare.style.backgroundColor = 'red';
  redSquare.style.position = 'fixed';
  redSquare.style.left = '10px';
  redSquare.style.top = '50%';
  redSquare.style.transform = 'translateY(-50%)';
  redSquare.style.zIndex = '1000';
  redSquare.style.color = 'white';
  redSquare.style.padding = '10px';
  redSquare.style.fontSize = '14px';
  redSquare.style.overflowY = 'auto';

  // 更新方块内部内容为服装状态
  redSquare.innerText = `当前服装状态: ${clothingStatus}`;
}

// 从AI回复中提取服装状态的函数
function extractClothingStatus(reply) {
  const clothingRegex = /服装：(.+?)(?=姿势|$)/;
  const match = reply.match(clothingRegex);
  return match ? match[1].trim() : "未知";
}

// 处理AI的回复并更新红色方块
function handleAiReply(data) {
  const reply = data.message;
  const clothingStatus = extractClothingStatus(reply);
  createRedSquare(clothingStatus);
}

// 添加一个按钮，允许用户手动刷新状态
function createRefreshButton() {
  const button = document.createElement('button');
  button.innerText = '刷新状态';
  button.style.position = 'fixed';
  button.style.left = '220px';
  button.style.top = '50%';
  button.style.transform = 'translateY(-50%)';
  button.style.zIndex = '1000';
  button.style.padding = '10px';
  button.style.fontSize = '14px';
  
  button.onclick = function () {
    const lastReply = getLastAiReply();  
    const clothingStatus = extractClothingStatus(lastReply);
    createRedSquare(clothingStatus);
  };

  document.body.appendChild(button);
}

// 获取最后的AI回复
function getLastAiReply() {
  return window.lastAiReply || "未知";
}

// 页面加载时调用的函数
jQuery(async () => {
  createRedSquare();
  createRefreshButton();

  // 监听 MESSAGE_RECEIVED 事件
  eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
    window.lastAiReply = data.message;
    handleAiReply(data);
  });
});
