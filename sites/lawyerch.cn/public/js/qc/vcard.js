/* 存入通讯录：桌面上弹出小卡，可下载 .vcf；手机直接下载电子名片。 */
(function () {
  'use strict';
  var btn = document.getElementById('vcf');
  if (!btn) return;
  var d = btn.dataset;
  var touch = window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches;

  function T(zh, en) { return window.qcLang === 'en' ? en : zh; }
  function name() { return T(d.vcfName || '', d.vcfNameEn || d.vcfName || ''); }
  function title() { return T(d.vcfTitle || '', d.vcfTitleEn || d.vcfTitle || ''); }

  function vcard() {
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + (d.vcfFamily || '') + ';' + (d.vcfGiven || '') + ';;;',
      'FN:' + (d.vcfName || '')
    ];
    if (d.vcfTitle) lines.push('TITLE:' + d.vcfTitle);
    if (d.vcfTel) lines.push('TEL;TYPE=CELL:' + d.vcfTel);
    if (d.vcfMail) lines.push('EMAIL;TYPE=INTERNET:' + d.vcfMail);
    if (d.vcfUrl) lines.push('URL:' + d.vcfUrl);
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function download() {
    var blob = new Blob([vcard()], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (d.vcfName || 'contact') + '.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var box = null;
  function build() {
    box = document.createElement('div');
    box.className = 'vk';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'vk-title');
    box.setAttribute('data-noi18n', '');
    box.innerHTML = '<div class="vk__bg"></div>' +
      '<div class="vk__p">' +
        '<button type="button" class="vk__x" aria-label="关闭"><i></i><i></i></button>' +
        '<p class="vk__eyebrow">SAVE CONTACT</p>' +
        '<h3 class="vk__t" id="vk-title"></h3>' +
        '<p class="vk__d"></p>' +
        '<dl class="vk__list">' +
          '<div><dt>TEL</dt><dd><a class="vk__tel"></a></dd></div>' +
          '<div><dt>MAIL</dt><dd><a class="vk__mail"></a></dd></div>' +
        '</dl>' +
        '<div class="vk__act">' +
          '<button type="button" class="vk__b is-main" id="vk-dl"></button>' +
          '<a class="vk__b" id="vk-mail"></a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('.vk__bg').addEventListener('click', close);
    box.querySelector('.vk__x').addEventListener('click', close);
    box.querySelector('#vk-dl').addEventListener('click', download);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-on')) close();
    });
  }

  function text() {
    var tel = d.vcfTel || '', mail = d.vcfMail || '';
    box.querySelector('.vk__t').textContent = T('存入通讯录', 'Save contact');
    box.querySelector('.vk__d').textContent = name() + ' · ' + title();
    var telA = box.querySelector('.vk__tel');
    telA.textContent = tel;
    telA.href = 'tel:' + tel.replace(/[^\d+]/g, '');
    var mailA = box.querySelector('.vk__mail');
    mailA.textContent = mail;
    mailA.href = 'mailto:' + mail;
    box.querySelector('#vk-mail').textContent = T('发邮件', 'Email me');
    box.querySelector('#vk-mail').href = 'mailto:' + mail;
    box.querySelector('#vk-dl').textContent = T('下载电子名片', 'Download vCard');
  }

  function open() {
    if (!box) build();
    text();
    box.classList.add('is-on');
    box.querySelector('.vk__x').focus();
  }
  function close() {
    box.classList.remove('is-on');
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (touch) { download(); return; }
    open();
  });
})();
