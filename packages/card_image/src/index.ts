import { toCanvas, toPng } from 'html-to-image';
import './styles.css';

// 存储按钮与卡片的映射关系
const cardButtonMap = new WeakMap();

const waterMarkElement = (() => {
  const ret = document.createElement('span');
  ret.className = 'dh-card-watermark';

  const img = document.createElement('img');
  img.src = 'https://av.huijiwiki.com/site_avatar_daggerheart_l.png?1750202551';
  ret.appendChild(img);

  const text = document.createElement('span');
  text.innerText = '匕首之心中文维基';
  ret.appendChild(text);

  return ret;
})();

/**
 * 初始化 dh-card 元素的下载功能
 * @param {HTMLElement} element - 要初始化的 dh-card 元素
 */
function initSingleDhCard (element: HTMLElement) {
  // 检查是否已经有下载按钮
  if (cardButtonMap.has(element)) {
    return;
  }

  const name = (element.getElementsByClassName('dh-card-name')[0] as HTMLElement)?.innerText || `dh-card-${Date.now()}`;

  // 创建下载按钮
  const downloadBtn = document.createElement('button');
  downloadBtn.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>';
  downloadBtn.title = '下载为图片';
  downloadBtn.className = 'dh-card-download-btn';

  element.appendChild(downloadBtn);
  element.addEventListener('mouseenter', () => {
    downloadBtn.style.opacity = '1';
  });
  element.addEventListener('mouseleave', () => {
    downloadBtn.style.opacity = '0';
  });

  downloadBtn.addEventListener('click', async e => {
    e.stopPropagation();
    downloadBtn.style.display = 'none';

    try {
      element.appendChild(waterMarkElement);

      const pixelRatio = 2;
      // 使用 html-to-image 转换为 PNG
      const cCanvas = await toCanvas(element, {
        quality: 1.0,
        pixelRatio,
        skipFonts: true,
        preferredFontFormat: 'woff2',
        backgroundColor: 'transparent',
      });

      let canvas = document.createElement('canvas');
      canvas.width = cCanvas.width;
      canvas.height = cCanvas.height;
      const ctx = canvas.getContext('2d');

      // 在canvas上先画一个白色的，20px半径的圆角矩形，然后把cCanvas画上去
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(0, 0, cCanvas.width, cCanvas.height, 20 * pixelRatio);
      ctx.fill();
      // 将cCanvas绘制到canvas上
      ctx.drawImage(cCanvas, 0, 0);
      // 获取数据URL
      const dataUrl = canvas.toDataURL('image/png');
      // 清理水印元素
      waterMarkElement.remove();

      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载图片时出错:', error);
      alert('下载失败，请重试');
    }

    downloadBtn.style.display = 'block';
  });
}

// 为 dh-card 元素添加下载功能
function initDhCardDownload () {
  const dhCards = document.getElementsByClassName('dh-card');
  for (let i = 0; i < dhCards.length; i++) {
    initSingleDhCard(dhCards[i] as HTMLElement);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDhCardDownload();
  });
} else {
  initDhCardDownload();
}
