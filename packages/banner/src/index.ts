import { h } from './h';
import { huijiImageURL } from './huijiStatic';

const defaultBannerSrc = 'https://huiji-public.huijistatic.com/daggerheart/uploads/f/f1/Safehaven_resized.jpg';

interface BannerOptions {
  src: string;
  parallax: boolean;
}

function createBannerStyle ({ src, parallax }: BannerOptions) {
  const bannerStyle = document.createElement('style');
  bannerStyle.textContent = `
.dh-banner {
  background-image: url(${src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
${parallax ? 'background-attachment: fixed; background-position: top;' : ''}
  width: 100%;
  padding-block-start: min(12%, 4em);
  padding-block-end: min(9%, 3em);
  position: relative;
}

.dh-banner::before {
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
  .dh-banner::before {
    background-image: linear-gradient(0deg, rgb(24, 47, 105) 30%, rgba(28, 8, 95, 0) 75%);
  }
}
`;
  return bannerStyle;
}

function retriveBannerOptions (ele: HTMLElement): BannerOptions {
  const srcAttr = ele.getAttribute('data-banner-src');
  const src = (srcAttr && huijiImageURL(srcAttr)) || defaultBannerSrc;
  return { src, parallax: ele.getAttribute('data-banner-parallax') === 'true' };
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
    { className: 'dh-banner' },
    h(
      'div',
      { classList: ['md:justify-normal', 'justify-end', 'self-center', 'flex', 'flex-col', 'ps-[5%]', 'pe-[5%]'] },
      h('div', { classList: ['relative', 'md:w-[45%]', 'w-[100%]', 'text-white'], innerHTML: innerHTML })
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
