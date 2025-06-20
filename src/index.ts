import { toPng } from 'html-to-image';

// 创建下载按钮的样式
const downloadButtonStyle = `
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

/**
 * 初始化 dh-card 元素的下载功能
 * @param {HTMLElement} element - 要初始化的 dh-card 元素
 */
function initDHCardDownloadFor (element: HTMLElement) {
  console.log('初始化 dh-card 下载功能:', element);
  const name = (element.getElementsByClassName('dh-card-name')[0] as HTMLElement)?.innerText || `dh-card-${Date.now()}`;

  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  const downloadBtn = document.createElement('button');
  downloadBtn.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>';
  downloadBtn.title = '下载为图片';
  downloadBtn.style.cssText = downloadButtonStyle;
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

    try {
      downloadBtn.style.display = 'none';

      // 使用 html-to-image 转换为 PNG
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      downloadBtn.style.display = 'block';

      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载图片时出错:', error);
      downloadBtn.style.display = 'block';
    }
  });
}

// 为 dh-card 元素添加下载功能
function initDhCardDownload () {
  const dhCards = document.getElementsByClassName('dh-card');
  for (let i = 0; i < dhCards.length; i++) {
    initDHCardDownloadFor(dhCards[i] as HTMLElement);
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