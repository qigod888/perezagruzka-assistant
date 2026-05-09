// widget.js — плавающий виджет ассистента «Перезагрузка»
(function () {
  const script = document.currentScript;

  // Настройки по умолчанию
  const color = script?.dataset.color || '#1a73e8';           // цвет кнопки
  const brand = script?.dataset.brand || 'P';                 // буква внутри кружка
  const src = script?.dataset.src || window.location.origin;  // URL ассистента

  // Плавающая кнопка
  const bubble = document.createElement('div');
  bubble.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${color};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font: 700 18px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,.25);
    cursor: pointer;
    z-index: 2147483647;
    transition: transform .2s, box-shadow .2s, opacity .2s;
  `;
  bubble.textContent = (brand && brand[0]) ? brand[0].toUpperCase() : 'P';

  bubble.addEventListener('mouseenter', () => {
    bubble.style.transform = 'scale(1.08)';
    bubble.style.boxShadow = '0 14px 40px rgba(0,0,0,.3)';
  });

  bubble.addEventListener('mouseleave', () => {
    bubble.style.transform = 'scale(1)';
    bubble.style.boxShadow = '0 10px 30px rgba(0,0,0,.25)';
  });

  // Панель с ассистентом
  const panel = document.createElement('iframe');
  panel.src = src + '/';
  panel.title = 'AI-ассистент «Перезагрузка»';
  panel.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 88px;
    width: 380px;
    height: 640px;
    max-width: calc(100% - 32px);
    max-height: calc(100% - 120px);
    border: none;
    border-radius: 18px;
    box-shadow: 0 18px 50px rgba(0,0,0,.28);
    display: none;
    z-index: 2147483646;
    background: #fff;
    overflow: hidden;
  `;

  // Адаптация под узкие экраны
  function updatePanelSize() {
    const vw = window.innerWidth || document.documentElement.clientWidth;
    if (vw < 480) {
      panel.style.width = '100%';
      panel.style.right = '0';
      panel.style.bottom = '0';
      panel.style.borderRadius = '12px 12px 0 0';
      panel.style.maxHeight = '80%';
    } else {
      panel.style.width = '380px';
      panel.style.right = '20px';
      panel.style.bottom = '88px';
      panel.style.borderRadius = '18px';
      panel.style.maxHeight = 'calc(100% - 120px)';
    }
  }

  window.addEventListener('resize', updatePanelSize);
  updatePanelSize();

  // Открытие/закрытие
  let open = false;
  bubble.addEventListener('click', () => {
    open = !open;
    panel.style.display = open ? 'block' : 'none';
  });

  // Вставляем в DOM
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(panel);
    document.body.appendChild(bubble);
  });
})();