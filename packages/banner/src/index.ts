import { h } from './h';
import { huijiImageURL } from './huijiStatic';

const defaultBannerSrc = 'https://huiji-public.huijistatic.com/daggerheart/uploads/f/f1/Safehaven_resized.jpg';

interface BannerOptions {
  src: string;
}

function createBannerStyle ({ src }: BannerOptions) {
  const bannerStyle = document.createElement('style');
  bannerStyle.textContent = `
.dh-parallax-banner {
  background-image: url(${src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: 50%;
  background-position-y: 50%;
  width: 100%;
  padding-block-start: 12%;
  padding-block-end: 9%;
  position: relative;
}

.dh-parallax-banner .dh-parallax-banner-content {
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: normal;
  padding-inline-start: 5%;
  padding-inline-end: 5%;
}

.dh-parallax-banner-content .dh-parallax-banner-inner {
  position: relative;
  width: 45%;
  color: rgb(255, 255, 255);
}

.dh-parallax-banner::before {
  color: rgb(51,65,85);
  background-color: rgba(0, 0, 0, 0);
  background-image: linear-gradient(90deg, rgb(24, 47, 105) 30%, rgba(28, 8, 95, 0) 70%);
  content: "";
  position: absolute;
  display: flex;
  opacity: 0.8;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .dh-parallax-banner .dh-parallax-banner-content {
    justify-content: flex-end;
  }
  .dh-parallax-banner-content .dh-parallax-banner-inner {
    width: 100%;
  }
  .dh-parallax-banner::before {
    background-image: linear-gradient(0deg, rgb(24, 47, 105) 30%, rgba(28, 8, 95, 0) 75%);
  }
}
`;
  return bannerStyle;
}

function retriveBannerOptions (ele: HTMLElement): BannerOptions {
  const srcAttr = ele.getAttribute('data-banner-src');
  const src = (srcAttr && huijiImageURL(srcAttr)) || defaultBannerSrc;
  return { src };
}

function createBanner () {
  // 找到 id = dh-banner 元素
  const infoElement = document.getElementById('dh-banner');
  if (!infoElement) {
    return;
  }

  console.debug('使用infoElement构造横幅', infoElement);

  const innerHTML = infoElement.innerHTML || '';

  const option = retriveBannerOptions(infoElement);
  const bannerStyle = createBannerStyle(option);
  document.head.appendChild(bannerStyle);

  const bannerContainer = h(
    'div',
    { className: 'dh-parallax-banner' },
    h(
      'div',
      { className: 'dh-parallax-banner-content' },
      h('div', { className: 'dh-parallax-banner-inner', innerHTML: innerHTML })
    )
  );

  infoElement.remove();

  const body = document.getElementById('wiki-outer-body')!;
  body.prepend(bannerContainer);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBanner);
} else {
  createBanner();
}
