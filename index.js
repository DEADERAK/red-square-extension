import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";
import { eventSource, event_types } from "../../../../script.js";  // 导入事件监听器

const extensionName = "red-square-extension";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// 创建红色方块并显示服装状态
function createRedSquare(clothingStatus = "未知") {
  let redSquare = document.getElementById('red-square-extension');
  
  if (!redSquare) {
    redSquare = document.createElement('div');
    redSquare.id = 'red-square-extension';
    document.body.appendChild(redSquare);
  }

  // 设置红色方块的样式
  redSquare.style.width = '200px';  // 扩大方块
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
  redSquare.style.overflowY = 'auto';  // 如果文本过长，允许滚动

  // 更新方块内部内容为服装状态
  redSquare.innerText = `当前服装状态: ${clothingStatus}`;
}

// 从AI回复中提取服装状态的函数
function extractClothingStatus(reply) {
  const clothingRegex = /服装：(.+?)(?=姿势|$)/;  // 使用“服装：”到“姿势”作为边界
  const match = reply.match(clothingRegex);
  return match ? match[1].trim() : "未知";
}

// 监听AI回复的函数
function handleIncomingMessage(data) {
  const reply = data.message;  // 获取AI的回复内容
  const clothingStatus = extractClothingStatus(reply);  // 提取服装状态
  createRedSquare(clothingStatus);  // 更新红色方块中的服装状态
}

// 页面加载时调用的函数
jQuery(async () => {
  // 加载 HTML 内容
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
  $("#extensions_settings").append(settingsHtml);

  // 初始化红色方块
  createRedSquare();

  // 监听 MESSAGE_RECEIVED 事件，获取AI回复
  eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);
});
