import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "red-square-extension";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// 创建红色正方形的函数
function createRedSquare() {
  const redSquare = document.createElement('div');
  redSquare.id = 'red-square-extension';
  redSquare.style.width = '50px';
  redSquare.style.height = '50px';
  redSquare.style.backgroundColor = 'red';
  redSquare.style.position = 'fixed';
  redSquare.style.left = '10px';
  redSquare.style.top = '50%';
  redSquare.style.transform = 'translateY(-50%)';
  redSquare.style.zIndex = '1000';
  
  document.body.appendChild(redSquare);
}

// 移除红色正方形的函数
function removeRedSquare() {
  const redSquare = document.getElementById('red-square-extension');
  if (redSquare) {
    redSquare.remove();
  }
}

// 页面加载时调用的函数
jQuery(async () => {
  // 加载 HTML 内容
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
  $("#extensions_settings").append(settingsHtml);

  // 创建红色正方形
  createRedSquare();

  // 监听设置的变化（可选功能）
  $("#example_setting").on("input", (event) => {
    const value = $(event.target).prop("checked");
    if (value) {
      createRedSquare();
    } else {
      removeRedSquare();
    }
    saveSettingsDebounced();
  });
});
