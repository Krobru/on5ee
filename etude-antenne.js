/* ON5EE — étude de rayonnement de l'antenne EFHW. Vanilla JS, aucun appel réseau. */
(function(){
'use strict';
var card=document.getElementById('card-efhw');
var dlg=document.getElementById('etude-efhw');
if(!card||!dlg)return;

var body=dlg.querySelector('.etude-body');
var lite=dlg.querySelector('.etude-lite');
var liteImg=dlg.querySelector('.etude-lite img');
var liteCap=dlg.querySelector('.etude-lite figcaption');
var shots=Array.prototype.slice.call(dlg.querySelectorAll('.etude-shot button'));
var liteIdx=0;
var liteOpen=false;

function openDlg(){
  if(dlg.open)return;
  if(typeof dlg.showModal==='function')dlg.showModal();
  else dlg.setAttribute('open','');
  card.setAttribute('aria-expanded','true');
  var closeBtn=dlg.querySelector('.etude-close');
  if(closeBtn)closeBtn.focus();
}
function closeLite(){
  if(!liteOpen)return;
  liteOpen=false;
  lite.hidden=true;
  liteImg.removeAttribute('src');
  liteCap.textContent='';
  if(shots[liteIdx])shots[liteIdx].focus();
}
function closeDlg(){
  closeLite();
  if(dlg.open)dlg.close();
}
function onClosed(){
  closeLite();
  card.setAttribute('aria-expanded','false');
}

card.addEventListener('click',function(e){e.preventDefault();openDlg()});
card.addEventListener('keydown',function(e){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();openDlg()}
});

dlg.querySelectorAll('[data-etude-close]').forEach(function(b){
  b.addEventListener('click',function(){if(liteOpen)closeLite();else closeDlg()});
});
dlg.addEventListener('click',function(e){
  if(e.target===dlg)closeDlg();
});
dlg.addEventListener('close',onClosed);
dlg.addEventListener('cancel',function(e){
  if(liteOpen){e.preventDefault();closeLite()}
});
dlg.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&liteOpen){e.preventDefault();e.stopPropagation();closeLite();return}
  if(liteOpen&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){
    e.preventDefault();showLite(liteIdx+(e.key==='ArrowRight'?1:-1));
  }
});

/* Pilules de bande */
var pills=dlg.querySelectorAll('[data-band]');
var panes=dlg.querySelectorAll('[data-band-panel]');
pills.forEach(function(p){
  p.addEventListener('click',function(){
    var id=p.getAttribute('data-band');
    pills.forEach(function(x){x.setAttribute('aria-pressed',x===p?'true':'false')});
    panes.forEach(function(x){x.hidden=x.getAttribute('data-band-panel')!==id});
  });
});

/* Lightbox */
function showLite(i){
  var n=shots.length;
  liteIdx=(i+n)%n;
  var btn=shots[liteIdx];
  var fig=btn.closest('figure');
  var img=btn.querySelector('img');
  liteImg.src=btn.getAttribute('data-full')||img.src;
  liteImg.alt=img.alt||'';
  liteCap.textContent=fig?fig.querySelector('figcaption').textContent:'';
  lite.hidden=false;
  liteOpen=true;
  var closeB=lite.querySelector('.etude-close');
  if(closeB)closeB.focus();
}
shots.forEach(function(btn,i){
  btn.addEventListener('click',function(){showLite(i)});
});
var prev=dlg.querySelector('.etude-lite-prev');
var next=dlg.querySelector('.etude-lite-next');
if(prev)prev.addEventListener('click',function(){showLite(liteIdx-1)});
if(next)next.addEventListener('click',function(){showLite(liteIdx+1)});
lite.addEventListener('click',function(e){if(e.target===lite)closeLite()});

/* Si la langue change alors que le lightbox est ouvert, rafraîchir la légende. */
if(window.I18N)I18N.on(function(){
  if(!liteOpen)return;
  var fig=shots[liteIdx]&&shots[liteIdx].closest('figure');
  if(fig)liteCap.textContent=fig.querySelector('figcaption').textContent;
});
})();
