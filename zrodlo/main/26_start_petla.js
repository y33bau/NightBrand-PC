// Accessible title presentation; existing checkbox change handler owns mode/save logic.
function syncTitleMode(){for(const [id,selected] of [['sFab',!$('storyTgl').checked],['sArc',$('storyTgl').checked]]){const b=$(id);b.setAttribute('aria-checked',String(selected));b.removeAttribute('aria-pressed');b.tabIndex=selected?0:-1}$('storyModeHint').textContent=$('storyTgl').checked?(EN?'All acts right away.':'Wszystkie rozdziały od razu.'):(EN?'You unlock acts one by one.':'Rozdziały odblokowujesz po kolei.')}
$('storyTgl').addEventListener('change',syncTitleMode);new MutationObserver(syncTitleMode).observe($('sFab'),{attributes:true,attributeFilter:['class']});syncTitleMode();
$('sFab').parentElement.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Enter',' '].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.repeat)return;const b=e.key==='ArrowLeft'?$('sFab'):e.key==='ArrowRight'?$('sArc'):e.target.closest('[role=radio]');if(b){b.click();b.focus()}});


// UI stage 1: shared palette, frame weights and states; no gameplay or HUD changes.
(()=>{
const sheet=document.createElement('style');sheet.id='nbUiSystem';
const scope='#orient'.repeat(13)+' :is(#title,#kap,#opts,#manual,#prep,#lvl,#pause,#shop,#end,#conf)';
const control=scope+' :is(button,summary)';
sheet.textContent=`
:root{
 --nb-ui-ink:#141416;--nb-ui-paper:#e8dcc5;--nb-ui-muted:#c4b69f;
 --nb-ui-gold:#bc9a62;--nb-ui-gold-soft:#bc9a6255;--nb-ui-focus:#f3dfaa;
 --nb-ui-action:#f6e6c7;--nb-ui-edge:#756047;
 --nb-ui-display:Grenze,Georgia,serif;--nb-ui-reading:Georgia,'Times New Roman',serif;
 --nb-ui-body:16px;--nb-ui-small:14px;--nb-ui-leading:1.5;
 --nb-ui-frame-option:8px;--nb-ui-frame-panel:14px;
 --nb-ui-idle-shadow:none;
 --nb-ui-selected-shadow:none;
 --nb-ui-action-shadow:none;
 --nb-ui-press-shadow:inset 0 4px 13px #000b;
}
/* One state vocabulary for every menu. Specificity matches the existing scoped layers. */
${control}{filter:none!important;transform:none!important;outline:0!important;box-shadow:var(--nb-ui-idle-shadow)!important;color:var(--nb-ui-paper)!important;transition:filter .12s ease,box-shadow .12s ease!important}
${scope} :is(.opt,.m2k-row,.card,.slot-tab){border-image-width:var(--nb-ui-frame-option)!important}
${scope} :is(.premium-banner,.premium-hero,.premium-page-content,.level-panel,.nbp-panel,#kapDet){border-image-width:var(--nb-ui-frame-panel)!important}
${scope} :is(#premiumPrepare,#prepGo,#kapBuy,#kronGo,#kronDay,#resumeBtn,#againBtn,#nextBtn,#confYes){--nb-ui-idle-shadow:var(--nb-ui-action-shadow);color:var(--nb-ui-action)!important}
${control}:is(.on,.premium-selected,.chosen,.selected-skill,[aria-checked=true],[aria-selected=true],[aria-pressed=true]),${scope} details[open]>summary{outline:0!important;box-shadow:none!important;filter:none!important;color:var(--nb-ui-action)!important}
@media(hover:hover){${control}:not(:disabled):not([aria-disabled=true]):hover{filter:brightness(1.12)!important}}
${control}:not(:disabled):not([aria-disabled=true]):is(:focus-visible,.pf){outline:0!important;box-shadow:none!important;filter:brightness(1.3)!important}
${control}:not(:disabled):not([aria-disabled=true]):active{filter:brightness(.96)!important;box-shadow:var(--nb-ui-press-shadow)!important}
${control}:is(:disabled,[aria-disabled=true]){opacity:.48!important;filter:saturate(.45)!important;box-shadow:none!important;outline-color:transparent!important;cursor:default!important}
${scope} .m2k-row.lk:not(.on){opacity:.7!important}
${scope} .m2k-row.on{opacity:1!important}
/* Banner states use the supplied lit artwork, never a rectangular CSS frame. */
${scope} :is(.premium-nav>button,.premium-journey,.premium-go,.modesw button,.premium-difficulty,#prepGo,#prepBack,#kapTabs .tab,.m2-b,.premium-page-layout>.tabs>.tab,.backar,button.go,.nbp-tab,#pauseKeys .stab){border:0!important;border-image:none!important;outline:0!important;box-shadow:none!important;background-image:url('assets/ui/42b2bf5e40f0b339e8de7ada0e7158c311f35714370b56a33b11e2586e0dc3ea.webp')!important;background-color:transparent!important;background-position:center!important;background-size:100% 100%!important;background-repeat:no-repeat!important}
${scope} :is(.premium-nav>button,.premium-journey,.premium-go,.modesw button,.premium-difficulty,#prepGo,#prepBack,#kapTabs .tab,.m2-b,.premium-page-layout>.tabs>.tab,.backar,button.go,.nbp-tab,#pauseKeys .stab):is(:focus-visible,.pf){background-image:url('assets/ui/44da471425989ffbef24568c4cf9f12a3564e57e612509e02fea0f63f871826b.webp')!important}
@media(hover:hover){${scope} :is(.premium-nav>button,.premium-journey,.premium-go,.modesw button,.premium-difficulty,#prepGo,#prepBack,#kapTabs .tab,.m2-b,.premium-page-layout>.tabs>.tab,.backar,button.go,.nbp-tab,#pauseKeys .stab):not(:disabled):hover{background-image:url('assets/ui/44da471425989ffbef24568c4cf9f12a3564e57e612509e02fea0f63f871826b.webp')!important}}
@media(hover:hover){
 ${scope}:has(:is(button,summary):hover) :is(button,summary):is(:focus-visible,.pf):not(:hover){filter:none!important}
 ${scope}:has(:is(button,summary):hover) :is(.premium-nav>button,.premium-journey,.premium-go,.modesw button,.premium-difficulty,#prepGo,#prepBack,#kapTabs .tab,.m2-b,.premium-page-layout>.tabs>.tab,.backar,button.go,.nbp-tab,#pauseKeys .stab):is(:focus-visible,.pf):not(:hover){background-image:url('assets/ui/42b2bf5e40f0b339e8de7ada0e7158c311f35714370b56a33b11e2586e0dc3ea.webp')!important}
}
${scope} #opts button.go{padding:16px 32px!important;min-height:54px!important;height:auto!important;max-width:100%!important;white-space:normal!important;font:700 18px/1.2 Grenze,Georgia,serif!important;text-align:center!important}
@media(max-height:550px){${scope} #opts button.go{font-size:16px!important}}
/* Persistent selection marks are distinct from the transient red hover banner. */
${scope} #diffSw .premium-difficulty.on:before{content:'✓'!important;position:static!important;display:inline-block!important;flex:none!important;margin:0 .45em 0 0!important;padding:0!important;background:none!important;border:0!important;transform:none!important;color:#ffe2a2!important;font:800 .9em/1 Georgia,serif!important}

${scope} .premium-map .m2-ch.premium-selected:before{content:'✓ ' attr(data-roman)!important;background:#211b12ed!important;color:#ffe2a2!important;padding:2px 7px!important;font-weight:800!important;text-shadow:0 2px 2px #000!important}
${scope} .premium-map .m2-ch.premium-selected:after{color:#ffe2a2!important;background:#211b12ed!important}
${scope} :is(#prepPerks,#prepCh,#prepCurseL) .opt.on{background:linear-gradient(115deg,#534025,#30271d 65%,#211c17)!important;position:relative!important}
${scope} :is(#prepPerks,#prepCh,#prepCurseL) .opt.on:after{content:none!important}
${scope} :is(#prepPerks,#prepCh,#prepCurseL) .opt.on>b{color:#ffe2a2!important}

/* Toggle inputs retain the original checkmark and interaction. */
${scope} .tgl input:checked+.sl{background:linear-gradient(135deg,#443824,#201c16)!important;border-color:var(--nb-ui-gold)!important;box-shadow:inset 0 0 0 2px #171512!important}
${scope} .tgl input:focus-visible+.sl,${scope} .tgl.pf .sl,${scope} .rng:is(:focus-within,.pf){outline:2px solid var(--nb-ui-focus)!important;outline-offset:2px!important;filter:none!important}
${scope} :is(input:not([type=checkbox]):not([type=range]),select):focus-visible{outline:2px solid var(--nb-ui-focus)!important;outline-offset:2px!important;box-shadow:none!important}
/* Display headings stay in Grenze; reading text becomes quieter and consistently left aligned. */
${scope} :is(.card .cd,.mbox p,.mbox li,.pane p,.pane .figcap,.m2k-d,.nbp-journal .nbp-jp,.nbp-journal li,.nbp-audio p,.loadout-copy small,#diffCap,#endText){font-family:var(--nb-ui-reading)!important;font-size:var(--nb-ui-body)!important;font-weight:400!important;line-height:var(--nb-ui-leading)!important;color:var(--nb-ui-paper)!important;text-align:left!important;letter-spacing:normal!important}
${scope} :is(.card .cd,.mbox p,.mbox li,.pane p,.pane .figcap,.m2k-d,.nbp-journal .nbp-jp,.nbp-journal li,.nbp-audio p,.loadout-copy small,#diffCap,#endText) *{font-family:inherit!important}
${scope} :is(.card .cd li,.card .nb-bl li){line-height:var(--nb-ui-leading)!important}
${scope} #prepChar .opt>span:not(.nb-rw){font-family:var(--nb-ui-reading)!important;font-size:var(--nb-ui-body)!important;line-height:var(--nb-ui-leading)!important;text-align:left!important}
${scope} :is(#prepPerks,#prepCh,#prepCurseL) .opt>span:not(.nb-rw){font-family:var(--nb-ui-reading)!important;font-size:var(--nb-ui-small)!important;line-height:1.45!important;text-align:left!important}
${scope} #kapDet p{font:400 17px/var(--nb-ui-leading) var(--nb-ui-reading)!important;text-align:left!important;color:var(--nb-ui-paper)!important;margin:.4em 0!important}
${scope} #kapDet small{font:400 var(--nb-ui-small)/1.45 var(--nb-ui-reading)!important;color:var(--nb-ui-muted)!important}
${scope} .m2k-row small{font:400 var(--nb-ui-small)/1.45 var(--nb-ui-reading)!important;color:var(--nb-ui-muted)!important}
/* Chronicle presentation moved out of renderKron's inline !important declarations. */
${scope} .m2k-row.nbui-kron-row{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:center!important;text-align:center!important;position:relative;padding-left:18px!important;padding-right:18px!important}
${scope} .m2k-row.nbui-kron-row.nbui-has-art{padding-left:76px!important;padding-right:76px!important}
${scope} .nbui-kron-row b{font-size:23px!important;line-height:1.2!important;text-align:center!important;margin:0!important}
${scope} .nbui-kron-row small{font-size:16px!important;text-align:center!important;margin-top:.35em!important}
${scope} .nbui-kron-row .premium-shrine-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);margin:0}
${scope} #kapDet:has(>.nbk-scroll){display:flex!important;flex-direction:column!important;overflow:hidden!important}
${scope} .nbk-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;width:100%}
${scope} #kapDet>.m2k-buy{flex:none;margin-top:.8em!important}
/* Stage 2: the left rail reserves space for both mode choices at every height. */
${scope} .premium-rail{display:flex;flex-direction:column;min-height:0;min-width:0;overflow:hidden}
${scope} .premium-rail>.premium-nav{flex:1 1 0;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}
${scope} .premium-rail>.premium-mode-dock{flex:0 0 auto;margin:8px 0 0!important;padding-right:18px;min-width:0}
${scope} .premium-mode-dock .m2-mode{min-height:0;margin:0!important}
${scope} .premium-mode-dock .nb-mode-select{margin:0!important}
@media(max-height:550px){
 ${scope} .premium-rail>.premium-mode-dock{margin-top:5px!important;padding-right:8px}
 ${scope} .premium-mode-dock .nb-mode{height:52px!important;min-height:52px!important;flex-direction:column!important;padding:3px 2px 7px!important;gap:2px!important}
 ${scope} .premium-mode-dock .nb-mode__title{font-size:12px!important;line-height:1.1!important}
 ${scope} .premium-mode-dock .nb-mode__icon{width:19px!important;height:19px!important;max-width:none!important}
}
/* Pause slots keep every label inside the painted banner's safe interior. */
${scope} #skillLoadout .slot-tab{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto 1fr!important;justify-items:center!important;align-items:center!important;gap:7px!important;min-height:144px!important;padding:32px 16% 30px!important;background-position:center!important;background-size:100% 100%!important;background-repeat:no-repeat!important}
${scope} #skillLoadout .slot-tab:not(:hover):not(:focus-visible):not(.pf){background-image:url('assets/ui/42b2bf5e40f0b339e8de7ada0e7158c311f35714370b56a33b11e2586e0dc3ea.webp')!important}
${scope} #skillLoadout .slot-tab .loadout-key{grid-column:1!important;grid-row:1!important;align-self:center!important;font-size:14px!important;line-height:1.25!important}
${scope} #skillLoadout .slot-tab .ic{grid-column:1!important;grid-row:2!important;width:32px!important;height:32px!important}
${scope} #skillLoadout .slot-tab .loadout-name{grid-column:1!important;grid-row:3!important;font-size:17px!important;line-height:1.2!important;text-align:center!important;overflow-wrap:anywhere!important}
${scope} #skillLoadout .slot-tab .empty-name{grid-row:2/4!important}
@media(max-height:550px){${scope} #skillLoadout .slot-tab{min-height:128px!important;padding:28px 16% 26px!important;gap:5px!important}${scope} #skillLoadout .slot-tab .loadout-key{font-size:12px!important}${scope} #skillLoadout .slot-tab .loadout-name{font-size:15px!important}}
/* Regression fixes: persistent loadout selection, painted inventory actions, agreed Chronicle type. */
${scope} #skillLoadout .slot-tab.chosen .loadout-key{color:#ffe2a2!important}
${scope} #skillLoadout .slot-tab.chosen .loadout-key:after{content:' ✓';color:#ffe2a2;font-size:19px;font-weight:800}
${scope} #skillLoadout .slot-inventory button.go{padding:26px 12%!important;min-height:116px!important;grid-template-columns:40px minmax(0,1fr)!important;background-position:center!important;background-size:100% 100%!important;background-repeat:no-repeat!important}
${scope} #skillLoadout .slot-inventory button.go .ic{width:40px!important;height:40px!important}
${scope} #skillLoadout .slot-inventory button.go:not(:hover):not(:focus-visible):not(.pf){background-image:url('assets/ui/42b2bf5e40f0b339e8de7ada0e7158c311f35714370b56a33b11e2586e0dc3ea.webp')!important}
${scope} #skillLoadout .slot-inventory button.selected-skill .loadout-copy{color:#ffe2a2!important;padding-right:25px!important}
${scope} #skillLoadout .slot-inventory button.selected-skill:after{content:'✓';position:absolute;right:12%;top:26px;color:#ffe2a2;font:800 22px/1 Georgia,serif;pointer-events:none}
${scope}:has(.nbui-kron-row) #kapDet p{font-size:19px!important}
${scope}:has(.nbui-kron-row) #kapDet small{font-size:16px!important}
${scope} #prepCurse>p,${scope} #prepCurse>h3{flex:none!important}
${scope} #prepCurse>h3>small{font:700 14px/1.1 Georgia,serif!important;opacity:1!important;letter-spacing:0!important;color:#bdeba5!important}
/* Stage 3: three independently scrolling choice columns and a fixed launch area. */
${scope} .premium-class-description,${scope} .premium-prep-summary{display:none}
${scope} .premium-prep-control-scroll{display:contents}
${scope} .nb-prep-class{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:.45em;text-align:center}
@media(orientation:landscape){
 ${scope} .premium-prep-body{grid-template-columns:minmax(0,1fr) clamp(190px,20vw,250px)!important;gap:12px!important}
 ${scope} .prepgrid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:auto minmax(0,1fr)!important;overflow:hidden!important;gap:8px!important;padding:0!important}
 ${scope} .prepgrid>#prepChar{grid-column:1/-1!important;min-height:0!important;padding:0!important;border:0!important}
 ${scope} #prepChar .premium-class-description{display:block;grid-column:1/-1;font:13px/1.3 Georgia,serif!important;color:var(--nb-ui-paper);text-align:left!important;margin:5px 0 0!important;padding:0 4px}
 ${scope} #prepChar>h3{margin:0 0 6px!important;font-size:24px!important;line-height:1.15!important;letter-spacing:.06em;text-transform:uppercase}
 ${scope} #prepChar>div{gap:6px!important}
 ${scope} #prepChar .opt{display:grid!important;grid-template-columns:clamp(88px,9vw,140px) minmax(0,1fr)!important;grid-template-rows:1fr!important;align-items:center!important;min-height:clamp(180px,24vh,280px)!important;gap:3px 6px!important;padding:9px!important}
 ${scope} #prepChar .premium-class-art{grid-column:1;grid-row:1;width:clamp(88px,9vw,140px)!important;height:calc(clamp(180px,24vh,280px) - 40px)!important;object-fit:contain!important;align-self:center!important}
 ${scope} #prepChar .opt b{grid-column:2;font-size:20px!important;line-height:1.15!important;text-align:left!important}
 ${scope} #prepChar .opt>span:not(.nb-rw){display:none!important;grid-column:2;font-size:13px!important;line-height:1.25!important;margin:0!important;padding:0!important;text-align:left!important}
 ${scope} .prepgrid>.prepbox:not(#prepChar){grid-column:auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;padding:6px!important;scroll-padding-top:50px;overscroll-behavior:contain}
 ${scope} .prepgrid>.prepbox:not(#prepChar)>h3{position:sticky!important;top:0!important;z-index:3;margin:0 0 6px!important;padding:7px 2px!important;background:#121113!important;font-size:22px!important;line-height:1.2!important}
 ${scope} :is(#prepPerks,#prepCh,#prepCurseL){display:grid!important;grid-template-columns:1fr!important;overflow:visible!important;min-height:0!important;height:max-content!important;max-height:none!important;grid-auto-rows:max-content!important;align-content:start!important;flex:none!important}
 ${scope} :is(#prepPerks,#prepCh,#prepCurseL)>.opt{height:auto!important;min-height:max-content!important;flex:none!important}
 ${scope} .premium-prep-controls{overflow:hidden!important;gap:8px!important;padding:10px!important}
 ${scope} .premium-difficulty-title,${scope} .premium-prep-controls #diffSw{flex:none!important}
 ${scope} .premium-prep-control-scroll{display:block;flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain}
 ${scope} .premium-prep-control-scroll #diffCap{margin:0 0 8px!important}
 ${scope} .premium-prep-summary{display:block;flex:none;white-space:pre-line;text-align:center;font:14px/1.35 Georgia,serif;color:#ffe2a2;padding:4px 0}
 ${scope} .premium-prep-controls>.btnrow{flex:none!important;margin:0!important;background:transparent!important;border:0!important;box-shadow:none!important}
 @media(max-height:550px){
  ${scope} .premium-prep-body{grid-template-columns:minmax(0,1fr) 190px!important;gap:8px!important}
  ${scope} #prepChar .opt{grid-template-columns:44px minmax(0,1fr)!important;min-height:88px!important;padding:6px!important;gap:2px 4px!important}
  ${scope} #prepChar .premium-class-art{width:44px!important;height:64px!important}
  ${scope} #prepChar .premium-class-description{font-size:12px!important;line-height:1.2!important;margin-top:3px!important}
  ${scope} #prepChar>h3{font-size:20px!important;line-height:1.1!important;margin-bottom:2px!important}
  ${scope} #prepChar .opt b{font-size:14px!important}
  ${scope} #prepChar .opt>span:not(.nb-rw){font-size:12px!important;line-height:1.15!important}
  ${scope} .premium-prep-controls{gap:4px!important;padding:6px!important}
  ${scope} .premium-difficulty-title{font-size:18px!important;margin:0!important}
  ${scope} .premium-prep-controls #diffSw{gap:3px!important}
  ${scope} .premium-prep-controls #diffSw .premium-difficulty{height:32px!important;min-height:32px!important;font-size:16px!important}
  ${scope} .premium-prep-controls #prepGo{height:44px!important;min-height:44px!important}
  ${scope} .premium-prep-summary{font-size:12px!important;line-height:1.2!important;padding:2px 0}
  ${scope} .prepgrid>.prepbox:not(#prepChar)>h3{font-size:18px!important;padding:5px 1px!important}
 }
}
/* Compact heights change type gently; stage 1 deliberately leaves the layouts intact. */
@media(max-height:550px){
 :root{--nb-ui-body:14px;--nb-ui-small:13px;--nb-ui-frame-option:6px;--nb-ui-frame-panel:9px;--nb-ui-leading:1.42}
 ${scope} #kapDet p{font-size:14px!important}
 
 ${scope} .nbui-kron-row.nbui-has-art{padding-left:48px!important;padding-right:48px!important}
 ${scope} .nbui-kron-row .premium-shrine-icon{left:8px}
}
@media(prefers-reduced-motion:reduce){${control}{transition:none!important}}
@media(forced-colors:active){${control}{border:1px solid ButtonText!important}${control}:is(.on,.premium-selected,.chosen,[aria-checked=true],[aria-selected=true],[aria-pressed=true]){outline:2px solid Highlight!important}${control}:is(:focus-visible,.pf){outline:3px double Highlight!important}}
`;
document.head.appendChild(sheet);
// 9.11.2026 (Claude, author's rule): text in banners and panels scales with the box it lives in.
// Boxes grow with the window, so type grows with min(vw,vh) from the 1280x720 design size, never below it, capped per role.
// Only landscape windows taller than 550 px; small/phone layouts keep their own tuned sizes. Selection/hover/focus rules untouched.
{const F=(px,cap=1.5)=>`clamp(${px}px,min(${+(px/12.8).toFixed(3)}vw,${+(px/7.2).toFixed(3)}vh),${Math.round(px*cap)}px)`;
 const Z='#orient'.repeat(14)+' ',K=Z+'#kap',fin=document.createElement('style');fin.id='nbFinalScale';
 fin.textContent=`@media (orientation:landscape) and (min-height:551px){
/* Shrine + Chronicle rows: one proportion system, text centred, icon centred on the left edge */
${K} .m2k-row{min-height:${F(132,1.45)}!important;padding:${F(14)} ${F(22)} ${F(14)} ${F(22)}!important;align-items:center!important;justify-content:center!important;text-align:center!important;gap:${F(5)}!important}
${K} .m2k-row:has(>.premium-shrine-icon){padding-left:${F(80)}!important;padding-right:${F(18)}!important}
${K} .m2k-row>:is(b,small,span){text-align:center!important;align-self:center!important;width:auto!important}
${K} .m2k-row>b{font-size:${F(22,1.38)}!important;line-height:1.18!important}
${K} .m2k-row>small{font-size:${F(15.5,1.4)}!important;line-height:1.4!important}
${K} .m2k-row .m2k-pips{font-size:${F(15)}!important}
${K} .m2k-row>.premium-shrine-icon{top:50%!important;left:${F(16)}!important;transform:translateY(-50%)!important;width:${F(56)}!important;height:${F(56)}!important;margin:0!important}
${K} .m2k-row.nbui-kron-row>b{font-size:${F(24,1.45)}!important}
${K} .m2k-row.nbui-kron-row>small{font-size:${F(17)}!important}
${K} .m2k-tier{font-size:${F(14)}!important}
/* Detail panel = reading: bigger, calm, generous */
${K} #kapDet{padding:${F(18)} ${F(26)}!important}
${K} #kapDet .m2k-head{font-size:${F(30,1.4)}!important;line-height:1.15!important;margin:${F(6)} 0 ${F(10)}!important}
${K} #kapDet p{font-size:${F(19)}!important;line-height:1.55!important;margin:${F(7)} 0!important}
${K} #kapDet small{font-size:${F(16)}!important}
${K} #kapDet .premium-shrine-detail{width:${F(104)}!important;height:${F(104)}!important}
${K} #kapDet .m2k-buy{font-size:${F(17,1.35)}!important;min-height:${F(56,1.35)}!important}
/* Guide: one reading size for paragraphs and lists */
${Z}#manual .mbox{font-size:${F(18)}!important;line-height:1.6!important}
${Z}#manual .mbox :is(p,li){font-size:${F(17)}!important;line-height:1.6!important}
${Z}#manual .mbox li{margin:${F(4)} 0!important}
${Z}#manual .mbox>h3{font-size:${F(23,1.4)}!important;margin-bottom:${F(8)}!important}
/* Options */
${Z}#opts .pane .sth{font-size:${F(22,1.4)}!important}
${Z}#opts .pane .figcap{font-size:${F(16)}!important;line-height:1.55!important}
${Z}#opts .pane :is(.tgl,.musrow)>span{font-size:${F(18)}!important}
${Z}#opts .pane :is(.qrow,.langrow) button.go{font-size:${F(17,1.6)}!important;padding:${F(10,1.6)} ${F(18,1.6)}!important;min-height:${F(42,1.6)}!important}
${Z}#opts .pane .subtabs .stab{font-size:${F(16)}!important}
/* Preparation */
${Z}#prep #prepChar .premium-class-description{font-size:${F(15)}!important;line-height:1.45!important}
${Z}#prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>b{font-size:${F(17,1.3)}!important}
${Z}#prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>span:not(.nb-rw){font-size:${F(14.5,1.3)}!important}
${Z}#prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>small{font-size:${F(13.5)}!important}
${Z}#prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>.nb-rw{font-size:${F(14.5)}!important}
${Z}#prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>.nb-rw i{width:${F(24)}!important;height:${F(24)}!important}
${Z}#prep #prepCurse>p{font-size:${F(15)}!important}
${Z}#prep .premium-prep-summary{font-size:${F(14.5)}!important}
${Z}#prep #diffCap{font-size:${F(16)}!important}
/* Pause */
${Z}#pause #skillLoadout>p{font-size:${F(16)}!important}
${Z}#pause #skillLoadout .loadout-key{font-size:${F(14)}!important}
${Z}#pause #skillLoadout .loadout-name{font-size:${F(17)}!important}
${Z}#pause #skillLoadout .slot-tab .ic{width:${F(32,1.6)}!important;height:${F(32,1.6)}!important}
${Z}#pause #skillLoadout .loadout-copy{font-size:${F(18)}!important}
${Z}#pause #skillLoadout .loadout-copy small{font-size:${F(14)}!important}
${Z}#pause :is(.nbp-journal li,.nbp-journal .nbp-jp,.nbp-audio>p){font-size:${F(16)}!important;line-height:1.55!important}
${Z}#pause .nbp-audio .nbp-scale span{font-size:${F(13)}!important}
/* Level-up: compact heading so the three cards fit without scrolling past the title */
${Z}#lvl .level-panel{row-gap:${F(9,1.3)}!important}
${Z}#lvl .level-heading{padding-bottom:${F(6)}!important}
${Z}#lvl #lvlTitle{font-size:${F(34,1.3)}!important;line-height:1.1!important}
${Z}#lvl #slots{font-size:${F(17,1.25)}!important;padding:${F(4)} 0!important}
${Z}#lvl #levelWait{font-size:${F(14,1.2)}!important;min-height:1.3em}
/* Marga's stall: centred cards, readable price pill at the bottom, bigger icons */
${Z}#shop .card{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;gap:${F(8)}!important;padding:${F(16)} ${F(18)}!important;min-height:${F(196,1.45)}!important}
${Z}#shop .card>.ck{order:1;font-size:${F(11)}!important;letter-spacing:.14em!important}
${Z}#shop .card>.cn{order:2;font-size:${F(27,1.4)}!important;gap:${F(8)}!important}
${Z}#shop .card>.cn>.ic{width:${F(58,1.5)}!important;height:${F(58,1.5)}!important;background-size:contain!important;-webkit-mask-size:contain!important;mask-size:contain!important}
${Z}#shop .card>.cd{order:3;font:400 ${F(16.5)}/1.45 Georgia,serif!important;color:#d8cab0!important;max-width:30em}
${Z}#shop .card>.cl{order:4;margin-top:${F(4)}!important;padding:${F(5)} ${F(14)}!important;border:1px solid #6b5638!important;border-radius:999px!important;background:#1a1612!important;font:700 ${F(17)}/1 Grenze,Georgia,serif!important;color:#ffe2a2!important}
${Z}#shop #shopCoins{font-size:${F(26)}!important}
${Z}#shop .card>.cd{text-align:center!important}
${Z}#shop{justify-content:flex-start!important}
${Z}#shop>:first-child{margin-top:auto!important}
${Z}#shop>:last-child{margin-bottom:auto!important}
/* Main menu small print, preparation class names */
${Z}#prep #prepChar .opt b{font-size:${F(20,1.45)}!important}
${Z}#prep #prepPerks .opt>.premium-perk-art{top:50%!important;transform:translateY(-50%)!important;width:${F(44,1.4)}!important;height:${F(44,1.4)}!important}
${Z}#title .premium-hero .premium-xp{font-size:${F(13)}!important}
${K} #kapDet p.nbk-lore{margin:${F(4)} 0 ${F(26)}!important;padding-bottom:${F(24)}!important;border-bottom:1px solid #5a4832!important}
@media (max-height:800px){${Z}#shop .card{min-height:0!important;padding:10px 14px!important;gap:5px!important}${Z}#shop .card>.cn{font-size:21px!important;gap:5px!important}${Z}#shop .card>.cn>.ic{width:44px!important;height:44px!important}${Z}#shop .card>.cd{font-size:14.5px!important}${Z}#shop .card>.cl{font-size:15px!important;padding:4px 12px!important}}
}
${K} #kapDet .m2k-head{line-height:1.12!important;height:auto!important;max-height:none!important;overflow:visible!important;flex:none!important}
${Z}#tsRow{display:flex!important;flex-wrap:wrap;gap:8px!important;justify-content:center}
${Z}#tsRow .mlab{padding:6px 14px!important}
${K} #kapDet table.nbk-st{width:100%;border-collapse:collapse;margin:.2em 0 .8em;text-align:left}
${K} #kapDet table.nbk-st td,${K} #kapDet table.nbk-st th{padding:.32em .4em;border-bottom:1px solid #3a3026;font-size:inherit}
${K} #kapDet table.nbk-st td:last-child{text-align:right;color:#f3e6c8}
${K} #kapDet table.nbk-st4 td,${K} #kapDet table.nbk-st4 th{text-align:center!important}
${K} #kapDet table.nbk-st th{color:#bda47b;font-weight:600;font-size:.85em;letter-spacing:.06em;text-transform:uppercase}
@media not ((orientation:landscape) and (min-height:551px)){${K} #kapDet p.nbk-lore{margin-bottom:16px!important;padding-bottom:12px!important;border-bottom:1px solid #5a4832!important}}`;fin.textContent=nbTs(fin.textContent);document.head.appendChild(fin)}
})();


// Premium menu: existing controls retain their handlers and save semantics.
// Legacy stylesheet repeats #orient up to six times. Scoped overrides below deliberately
// exceed that specificity; they affect menu screens only. Consolidate after removing
// legacy menu layers, rather than lowering specificity while both systems coexist.
const PREMIUM_ICONS={"perki-m_knot": "assets/ikony/f3dfb8e05433b0bbc8c2c8cc30e32c0eb08db66004bf8e50ee4ad8cab7383943.webp", "perki-m_grot": "assets/ikony/0ec9c1d4b539b60220a6780c90855e2ffc3f6550c1288d651e701ef5d705731b.webp", "perki-m_wosk": "assets/ikony/979dabefe0a09adf0a66d1cd565e4c7e996d57a7599f02253d55a560497b8c84.webp", "perki-m_odlew": "assets/ikony/ccb84cd5f326ba8b9df2c81659a3029df296e7ffc548ebff99973b486e65f961.webp", "perki-m_kregi": "assets/ikony/826557f40094fcdeba06664e4e63d3d654b639b0840b0b52481291ee0db48f02.webp", "perki-m_przewrot": "assets/ikony/f1a61f13bdf5bfc563d5df57dee99d699374f4807cd375b58f982135ff6f8f25.webp", "perki-m_piec": "assets/ikony/f795c4d8e18bf81b53325c8d1f49cfd126bdf8bba23add3eeca6d36021aa3a0d.webp", "perki-m_plomien": "assets/ikony/f9d40f7dfa17e17644fde85089e99b25e0e7ead4a73689924dc5ed0a08528d2b.webp", "wyzwania-m_parowania": "assets/ikony/4a17e50763607cb629330704317b424d6347d4efe0bd145b140e3a5ddc6b3ef1.webp", "wyzwania-m_ofiara": "assets/ikony/a98cae42ed47bf83b440b1f938e63517f8bc5a772e9f1a905f00df83b1b17851.webp", "wyzwania-m_egzekucja": "assets/ikony/427fe96528aa2dd1cafb3ddf0387e5d6412ae2b731fede37c349aae9d9ae44c5.webp", "wyzwania-m_slady": "assets/ikony/427556f6bc4d20e27fb2893724e9568225cf2f3a010e30031e0362717aec6d0c.webp", "wyzwania-m_oblicza": "assets/ikony/c44cda2fd6307d05c2a551a51198f767606e046b79596113aebadf254ed2291f.webp", "wyzwania-m_fala": "assets/ikony/67c4543511f21da7d4edcf52da4ead1b3f9eba342c8e6c81d642f8393c79cfc4.webp", "wyzwania-m_zalobnicy": "assets/ikony/a2d14665168601907ce9d7db5dadc227b0a53f463cddc4b814126f556a7c0e53.webp", "wyzwania-m_warta": "assets/ikony/1aa311cc77bf2b2ddb251833089aac1fd5a8637ff70ea0a9afbdb6bab72c2d10.webp", "wyzwania-m_oddech": "assets/ikony/10a663216ecfaf9f571e48a081c6f4fe4d404cbc96beaec17c822f5c61518f46.webp", "wyzwania-m_noc": "assets/ikony/465cd3f711cfef840fc9ac6b6b94e6bba78d5acd8d9b1eff0d02a4dce8d342ad.webp", "perki-d_spiz": "assets/ikony/78d2cef73aad01a5f0adbf070bd7bba8a3fc795c6303077698eb202a5f1449e0.webp", "perki-d_poglos": "assets/ikony/0fd6112329b34d7d3088c66b9f9f6a6ff64bc9f8d260e928cbfd2c1fdc9292a5.webp", "perki-d_lichwa": "assets/ikony/e9d44067c753b74e9633dadb512939b38c7b18ca10f60e1051ced79e66b3c8b2.webp", "perki-d_msza": "assets/ikony/3d924635b871a69d162a96c94e2ab2f204a63dcea5dd70a3c691e22a77594f95.webp", "perki-d_dzwon": "assets/ikony/baf3a22073893640dd91a9ab03c7d8bb6e971b28da953b0375a6308bfecc2d9b.webp", "perki-d_krag": "assets/ikony/43cf6cb31cd36baed48c8ae79d076cba07c3e8c0179f53b4b59c2f68ccf2d8fb.webp", "perki-d_oddech": "assets/ikony/1a3452372bb9a9097fe3082c9f32d15e86aa0d066d3f2b6a8d6e0bf5af0a9454.webp", "perki-d_braz": "assets/ikony/0568ccf2e9e7e0545db1f7463defa5995bd5747171646745bac685ee3ceee0f5.webp", "wyzwania-d_zniwo": "assets/ikony/100675adfd7938be907e6d4e6a64446213295e57f4f98aba7c769950e88cce1b.webp", "wyzwania-d_spiz": "assets/ikony/2a1720250e533101ec1fcf7c261cc065d20f008177f7ddb913ee4c7acfba5228.webp", "wyzwania-d_ton": "assets/ikony/2dfbdb4bd8a28635242e4d391b15e8c6a6365aaafbeff8ac1ad2c2fc55983a93.webp", "wyzwania-d_parafia": "assets/ikony/6c86055504a21451c7e68ee308003fc649621b7e8f4395d54f626105f155e218.webp", "wyzwania-d_echo": "assets/ikony/28c10afe8925c66573f44556b73fde36dbb41936ad1b959a42442d43ee7c7d2f.webp", "wyzwania-d_zastaw": "assets/ikony/50237491eb77d3f5a991ed908712acb5f4f3578ba1efb646db956649351a879a.webp", "wyzwania-d_serce": "assets/ikony/b4756ccf010e2e85d6d7b85e70e92b0891365968194652aca3c4d6eb570ae2d8.webp", "wyzwania-d_krok": "assets/ikony/8cecbc87b0c7488b17e893727d4baacd4002af36a8d076c7a1dff8f19a995b83.webp", "wyzwania-d_pancerz": "assets/ikony/dba5be3cf9e2b37f868349d96480a5fe8aa63390b80934bd8036a238be2da5c4.webp", "wyzwania-d_garda": "assets/ikony/05602e003250432648b6553a4f59b9594570506550ffddd01c2a34ded1b7b12f.webp", "kaplica-cos_seal": "assets/ikony/8f08bd944371bb357b2917aaa848ae7ecf7194a91030eeacdeb413f592fd653c.webp", "nawigacja-opcje": "assets/ui/d6ab3fb5cd9fb00c532f12892adf75e30386ff01ef550db235e2083c3f32e262.webp", "nawigacja-podroz": "assets/ui/bd1261a9273a03aa57eae224e5f1a03d71678113fbb77674518648bf13aff1c2.webp", "perki-berserk": "assets/ikony/3c5abde805ef72aba9c07ff64bb88de7dc61bd9c2df985f279405911bbc45db7.webp", "perki-cien": "assets/ikony/07588cb3113e46431f0ea792e63cba8f2105d5d064d7263f2e9fb98d87e6e68a.webp", "perki-fanatyk": "assets/ikony/26227810ae9a9cd0110a155516af07a2ab2b05c6f4a520112d168f835409c651.webp", "perki-klucznik": "assets/ikony/af84244812771fdade77ce658d0f39296880b0f5fab517391fe4527a171967dd.webp", "perki-k_kamien": "assets/ikony/f9c979d65fbf3822100d397c276991cdbb65d0e31e69ea6f67c748618a49d259.webp", "perki-k_rytm": "assets/ikony/67e88ecec3c3df0bb1c91dea2c1d982d9039a2afda417058a18db3e6cc52f9fa.webp", "perki-k_slowo": "assets/ikony/b317ca493de8bbafb24ff36f5254104ea3f71e1b316302a382ced3e9a5128710.webp", "perki-k_wyrok": "assets/ikony/59ccbe3ee8d7089245bd57b18814957a99aba5042936e262641f0c4ba599ac5f.webp", "perki-pancerz": "assets/ikony/7f9916982a17a397d677a2736442d8a10be7183b9182a25160edb20e3bf0ec69.webp", "perki-riposta": "assets/ikony/1e314da297cf9aeccc9b86075fe528aaf4e727b6fc9b4b1ea4fd92da49de6910.webp", "perki-szklana": "assets/ikony/a008195f254e3c8b5f1d42433d7ea95afdd915532c285027cf7521b615986765.webp", "perki-sztych": "assets/ikony/f42c2d0efa8b95af6cef678c7133dc422a6c378603fd6233a39b6aa5d164a243.webp", "perki-z_dobicie": "assets/ikony/3dc4966999f079a22e49e8c6168e9fe4ed7980675810477304ec49300d78f8e5.webp", "perki-z_gilotyna": "assets/ikony/84c8e4bff9cc36807f864388a2965cb1a04d60f1400f4f43e3e89fd22d0c47fd.webp", "perki-z_ped": "assets/ikony/95ed8ffa95c485328d941aefe058f1ee9769b0ae6695fb14025a0aaeb37e36e5.webp", "perki-z_przetrwanie": "assets/ikony/b207e19a3432312fcfa5ebb1923ed096f3ca8405838c9f575ef4bb5b023851bb.webp", "perki-z_riposta": "assets/ikony/d3df551f5f7809d4b891cfc385e54e77bcba4700db5b0a2f5c963e3b1f6f3822.webp", "perki-z_taniec": "assets/ikony/7fd00d3a012f62c16ad5749f49b55a2d9a78efbfb1ce337afa4facb94582fac7.webp", "perki-z_trucizna": "assets/ikony/d03c28c042c905ffabd4d815b06f7dec0e902869f5e51a5c9030822ce8449e19.webp", "perki-z_widmo": "assets/ikony/0a08f97557ade45832d907a9363a117f2e34543e1515a142d685efe587eb2430.webp", "tryby-arcade": "assets/ui/3f2514729ee49610152e610b8c235e03731fd103c038f9bb31585bcd08c9eea2.webp", "tryby-fabula": "assets/ui/6f8540fa904dea00456661a5c5133563862df081eb44f48098e0b257e38b8cc2.webp", "kaplica-bastion": "assets/ikony/ae2b3267b6155e75833a29408402bc4541faddead590aafd794b1694c8b132aa.webp", "kaplica-breath": "assets/ikony/122e88fcebc0badae21dccd629429434e7c18382aea9593e669bbe98562a6395.webp", "kaplica-cos_tr_blood": "assets/ikony/aee91b270e1696d840904a8957bd39700ed35a5d26be484b041e9a4850d99764.webp", "kaplica-cos_tr_fire": "assets/ikony/49d085a52645e6e3ca93cc653c8dda56e3df054042a5af0fba1248d5ac312cda.webp", "kaplica-cos_tr_ice": "assets/ikony/cdfca366cf83f3fb4b2367e8157b51638c9be04c815bda740e8d09ac224cffb4.webp", "kaplica-cos_tr_rot": "assets/ikony/147b4b9e9b7c4a728df023a01533b719b58164f7a9f178dba2cc992a2ae50918.webp", "kaplica-elite": "assets/ikony/672b4f94e9cef99cb2d4884926594702c8b717ebbfb77a7245f57f9f5171848b.webp", "kaplica-exec": "assets/ikony/ceacfb2a918abfc6b2a510bf98addd7896d8a18aeff452170917ee07029ace7d.webp", "kaplica-gaze": "assets/ikony/970fb30243fc4b4010da011af647336976210a6f097df98fecd5bb60c225d01d.webp", "kaplica-lastch": "assets/ikony/54624cf416934fe55fe1bc272b2bf5c3fe9ff62b7efab32c06200ef74c3473fb.webp", "kaplica-magnet": "assets/ikony/aed77d35dded0c1aef153ba9c7efeed566c22f8b89aa11af3dc9f092777bbc2b.webp", "kaplica-nimble": "assets/ikony/2825e3efad9a636a538a79b7672df0e35555a0fe82aa60fa7d6f96eb37b09dd2.webp", "kaplica-purse": "assets/ikony/81505b79a1320960074b128b6cb1ee8eb09bd82cda5801ce1494be985a41cf93.webp", "kaplica-raven": "assets/ikony/89fc589024cfafa4aa71b005b985f4147ec24a80a22ac7b77010bf42b7671571.webp", "kaplica-smelt": "assets/ikony/2e6e837b9208f49fc4db8959bfb28b87898c0deb33295b5171a66d48267e2aa2.webp", "kaplica-venge": "assets/ikony/381c7bc5e717920cb0b1b680ef2fdc9fd9c3001671e8306842ff0c1298e1c9a0.webp", "kaplica-vigor": "assets/ikony/5d1b464ce56d975fa61103f41c8df5c073fb7372e95b0a2e62c05b7f7d163bc3.webp", "skille-aard": "assets/ikony/cbae5f4b1d08b3014ece2eaf7abd8ad594167ce62936a2a62ab6c3712501d900.webp", "skille-bloodblade": "assets/ikony/ed70d7c939ae0b3a65682615f1d129ac151927add46df5b236ffd62a4d007cc0.webp", "skille-breach": "assets/ikony/bf2b2563ae276da021147fee4e703a83c82ece1890d8d85cc88c135fc2179439.webp", "skille-buty": "assets/ikony/7a8317330b22b08ee845b95484aa8eae3235566c2bf15b7dc872178202e14b2f.webp", "skille-cascade": "assets/ikony/7f3dcd2273af5498af798cfc21cdcfb30713cacab3e16916d1720bb022370c4f.webp", "skille-cisza": "assets/ikony/a6cd45c2f455c46c2d666689406bec7632278f224de4ebdfe641c5e695de4b24.webp", "skille-drugieja": "assets/ikony/8b8979ac828150cdb9120d8ce34fb13936ae095d96d3a95200996b89a61b7605.webp", "skille-earthcut": "assets/ikony/519c7125b259a609bc06ad763fc00514d8551f2d78e336efdd7e70d160ad6af9.webp", "skille-echo": "assets/ikony/dce22a47b676baa451a9e6b96caa9b40ab0030c091843e995c25b77c1dcb6bb3.webp", "skille-embershot": "assets/ikony/c5a24862c5c905ca56009ed40541d4c014a38dded64b4a71b5d824d4d82c4d22.webp", "skille-fala": "assets/ikony/60459a8381ab8dafd2242ea3cae9a0fec3f21be312685f33d831c29d9e871cca.webp", "skille-fan": "assets/ikony/b537f57ba2525baddc44667b99a5233663ca605ba32869e36fd221d84719a0a0.webp", "skille-fireblade": "assets/ikony/0e513e6d06ebd186c5cfa6dc01ea3a7bcf71bf71fc7ac02a422a9bff1289c4db.webp", "skille-frostshot": "assets/ikony/81e40dda194951541f8c8e6c4f1690f4f520ebc50b1ee972abf02633420886c1.webp", "skille-garda": "assets/ikony/7d1e330da2ca76320798608da6242f630fae5001f1bb0f82b7d28d651d2ee0af.webp", "skille-hook": "assets/ikony/70f6eb0d853d0e9828bcb2714e246aacffd8be45b8919b6c62a844eeee246f01.webp", "skille-iceblade": "assets/ikony/c2b6de18e72b39ce301fdf5e648847bb18130f0a8d76825b85f92d096b9c7144.webp", "skille-krew": "assets/ikony/e96fa13d52b186ae3ad76d8e58d72aefde25515430cbb9b47f0014ae962115d5.webp", "skille-ldance": "assets/ikony/179e7eda5693edfbb306c11c98ea3ad3c75dbf4b18fb4e38fe72655bf45cc6a5.webp", "skille-leap": "assets/ikony/453334a22f1c71bf3eb7b3e7f4229680b90f75b7875ec8c7637a6d189ff30b68.webp", "skille-odzysk": "assets/ikony/a39bb21d32707431e61f35b743291d5f484c14159d232dbeed66d93f55b2c60a.webp", "skille-ostrze": "assets/ikony/debc397135d3144545a79b48c3466cdaa399deb9ea2ecbf0f419faa4278c3278.webp", "skille-rend": "assets/ikony/71b7b61a694d04cc831fc8e4820cfac22fcef76d031c154c0ec577a9e88f9555.webp", "skille-retaliation": "assets/ikony/09ad43f0e69bfcb0ea0fb4e8241598ef351c28c1b4f3830a0740d524c140ad46.webp", "skille-riposta": "assets/ikony/03177df877945d79b6b9d5eb2ab31aef2b848a4758a36d1b0b976eb0f12716e6.webp", "skille-rytm": "assets/ikony/53542a31dc33c89fbcf900185de3d5a7240e71a0e3be77a9671d6c02543d4c70.webp", "skille-stoneguard": "assets/ikony/488d50cc6e4cd33b1887fd4791c9c7604adf78469d2e4bfc860c70f0927f5a38.webp", "skille-szklo": "assets/ikony/5a738819f31b0ee4c1bf6367bdefd570189e74342a35fdb9fddb5833674f196b.webp", "skille-taniec": "assets/ikony/8acc342cdf8eccfa5bc6d65dc4f90a5fbdf1d209c3abc105560d78a7ecda02f8.webp", "skille-venom": "assets/ikony/10a43ff02fde2679c22807203d94c458f84cabe6b37396c4842f4aef2a790f81.webp", "skille-whirl": "assets/ikony/c03247cdbd3bff2f21dd72654b2d6805234b9e69cf5fa4e0bb59f08063dcd5cd.webp", "skille-zasieg": "assets/ikony/83618241c5f4558b88f618a3a9e9854a9806d80e0d598b8f0428266325748b95.webp", "skille-zelazo": "assets/ikony/92cc830e2d41a7185b1bd053e4a61a074b355c4de75667688be36afb679a2873.webp", "skille-zryw": "assets/ikony/220eed3469a2725c22807e454c2bdf33d8f83aa4239d5b00b5195c987a87ccc0.webp", "skille-_dex": "assets/ikony/34d7af0d915de76960a9cacf782037ebfb11fb39cd8f418ccc993da79849b36c.webp", "skille-_int": "assets/ikony/74911f7129eae60e82d5e0d0e1d2e8c0624a0638b23b211b733edcfd2ce164b1.webp", "skille-_str": "assets/ikony/95169d90390e86a6ab85283a29e071e608c6fb4729b999a5fbb417c340dbceec.webp", "skille-_vit": "assets/ikony/d7c360c8a4a497785d8642439b88cf64338bc89732f3131961bd745dc2b0e848.webp", "ramka-komunikat": "assets/ui/7d83cfd5551a7070fafcd6ed3976599ba58c2dbab260abe10200cb3c966a86b6.webp", "perki-k_gilotyna": "assets/ikony/68995647b6cb75493b8439f02fa16270f63a2ca893c615f9671f6e44c06f5934.webp", "perki-k_pien": "assets/ikony/6cb52b0500d23e038e07e477d5b143ec2925bbf6f0f27212dbbf3ba47a1b3eef.webp", "perki-k_ostrze": "assets/ikony/226a309df98e0568daa40c5bf0d79f98ae7f94c8f5cf4097ad36c1c237b7a0fa.webp", "perki-k_kaptur": "assets/ikony/b26e905394bc9dead7acc90889ff427f8c5e771eac21b8e01b44dfe414e761a8.webp", "nawigacja-kronika": "assets/ui/c5e58478b523341349809e8a17319a52d10de9d09481a8e1ea08e08f69f975cf.webp"};
const PREMIUM_ASSETS={"portret-kat": "assets/ui/2e521529cc87cb038d6f06ceadb3fef8431247cbed184308960de67c5afadfcf.webp", "portret-rycerz": "assets/ui/91c4700ceb9c0dca74c84d386dcff7b5c6dc8f060d182c552b9ae6daac7fb1bd.webp", "portret-zabojczyni": "assets/ui/414e60085060f7eae50b7c0b5adc88b9cefc049dfcd7a9f460966299e6d63cc4.webp", "rozdzial-1-mini": "assets/tla/5801ed6484e00f6c4fa95cf122f3ec2f35e48c025427e1830a74bd54993e432c.webp", "rozdzial-1": "assets/tla/c8c3968edb367c7be327106c1fafd57e5edf67ba28a6181eda3bb585e73f84ef.webp", "rozdzial-2-mini": "assets/tla/7741f3f993a33117e2d442820141a94457f044da2a133730b2d96194032d3ac0.webp", "rozdzial-2": "assets/tla/7c2d199370c18c4f9538807b7ed4ea2710679c89c412cdfb964d73c229e04c11.webp", "rozdzial-3-mini": "assets/tla/0c904a9825b338d51a077a0303e6c3474fb7c1789efb752b49768e96d5dc7f1b.webp", "rozdzial-3": "assets/tla/3dc098a98d1294fe0047673365fdfb738239db093f7bdb89d526acf2c8d4f7ad.webp", "rozdzial-4-mini": "assets/tla/3a9b6cb323feb63bee29a69800385409696448d471243b935d7ea13d31eb1cec.webp", "rozdzial-4": "assets/tla/b5acdd84a065fd7fbd3dc0d51dda1175fd3a0551641b5bf02964dafd288473a7.webp", "rozdzial-5-mini": "assets/tla/0a2ff4f577b15f98d3eb10cd9ae1cfbfbf1061dbbaa6d69536fd32ac49804baa.webp", "rozdzial-5": "assets/tla/76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057.webp", "rozdzial-6-mini": "assets/tla/026b06c59a92bee9032b76a7eea43c8dd4e56176241f5de4a8b46f5e044cbadd.webp", "rozdzial-6": "assets/tla/d1fa360949a93c4762b2578a14cf8957aaeb8e64bbf3a69445d984fc7aaa7c93.webp", "przycisk-zwykly": "assets/ui/42b2bf5e40f0b339e8de7ada0e7158c311f35714370b56a33b11e2586e0dc3ea.webp", "ramka-okno": "assets/ui/30c8084840315d8a3bb933208205078da729fc040083c5a0e45496ef5aec5c49.webp", "ramka-karta": "assets/ui/048c2ac6d026d124c645a80a772763d1538993b99b6997a9c8e95538b76d966e.webp"};
(()=>{
const title=$('title'),logo=title.querySelector('.m2-logo'),chapters=title.querySelector('.m2-right');
const el=(tag,cls)=>{const n=document.createElement(tag);n.className=cls;return n};
const mast=el('header','premium-mast'),body=el('div','premium-body'),nav=el('nav','premium-nav'),map=el('section','premium-map'),banner=el('div','premium-banner'),hero=el('aside','premium-hero'),portrait=el('img','premium-portrait'),caption=el('h2','premium-caption'),ashes=el('div','premium-ashes'),name=el('b','premium-name'),go=el('button','premium-go');
go.type='button';go.id='premiumPrepare';go.textContent=EN?'PREPARE':'PRZYGOTUJ SIĘ';
let chosen=1;
title.classList.remove('m2');logo.style.backgroundImage='url(assets/ui/702ff214967aa716ea2d0daa9f67099929b12d3a46f35dad3e3ca018d13feb1a.webp)';mast.append(logo);banner.append(caption);map.append(banner,chapters);hero.append(ashes,portrait,name,$('charCard'),go);const xp=el('div','premium-xp');hero.insertBefore(xp,go);
const journey=el('button','premium-journey');journey.type='button';journey.textContent=EN?'Journey':'Podróż';nav.append(journey,$('kapBtn'),$('manBtn'),$('optsBtn'));
const kapLabel=el('span','premium-kap-label');kapLabel.textContent=EN?'Shrine':'Kaplica';nav.querySelector('#kapBtn').append(kapLabel);
const controls=el('div','premium-controls');controls.append(title.querySelector('.m2-assist'),title.querySelector('.m2-mode'));nav.append(controls);
// Stage 2: keep the mode selector outside the navigation's scroll area.
const rail=el('div','premium-rail'),modeDock=el('div','premium-controls premium-mode-dock');
modeDock.append(controls.querySelector('.m2-mode'));rail.append(nav,modeDock);
body.append(rail,map,hero);title.querySelector('.m2-body').remove();title.querySelector('.m2-bot').remove();title.append(mast,body);
const url=n=>'url("'+PREMIUM_ASSETS[n]+'")';
function refresh(){
 if(title.hidden){banner.style.backgroundImage='none';portrait.removeAttribute('src');for(const i of CAMPAIGN)$('start'+i).style.backgroundImage='none';return}
 const q=prog(),c=q.char||'r',p=PREMIUM_ASSETS['portret-'+HEROES[c].art];
 if(portrait.getAttribute('src')!==p)portrait.src=p;
 portrait.alt='';name.textContent=heroName(c,true);name.title=HEROES[c].cls;
 name.textContent+=' · '+(EN?'Level ':'Poziom ')+q.lv;xp.textContent=q.lv>=PMAX?(EN?'Max level':'Poziom maksymalny'):q.xp+' / '+PNEED(q.lv)+' XP';xp.style.setProperty('--xp',String(q.lv>=PMAX?1:q.xp/PNEED(q.lv)));ashes.textContent=EMB.e+' '+(EN?'Ashes':'Popiołów');caption.textContent=CHN[chosen-1];
 banner.style.backgroundImage='linear-gradient(0deg,#080808,transparent 65%),'+url('rozdzial-'+chosen);
 for(const i of CAMPAIGN){$('start'+i).style.backgroundImage=url('rozdzial-'+i+'-mini');$('start'+i).classList.toggle('premium-selected',chosen===i);$('start'+i).dataset.roman=CHR[i-1];$('start'+i).dataset.status=chLocked(i)?(EN?'Complete Act ':'Ukończ rozdział ')+chRoman(chPrev(i)):SETT.save['s'+i]?.win?(EN?'Completed':'Ukończony'):SETT.save['s'+i]?(EN?'Not completed':'Nieukończony'):'';$('start'+i).setAttribute('aria-label',CHN[i-1]+($('start'+i).dataset.status?' — '+$('start'+i).dataset.status:''))}
 go.disabled=$('start'+chosen).disabled;
}
for(const i of CAMPAIGN){const b=$('start'+i);b.addEventListener('pointerenter',e=>{if(e.isTrusted)return;chosen=i;refresh()});b.addEventListener('click',()=>{chosen=i;refresh()})}
go.addEventListener('click',()=>openPrep(chosen));journey.addEventListener('click',refresh);
new MutationObserver(refresh).observe(title,{attributes:true,attributeFilter:['hidden']});
new MutationObserver(()=>{if(!title.hidden)refresh()}).observe($('chN'),{childList:true,subtree:true,characterData:true});
for(const i of CAMPAIGN)new MutationObserver(()=>{if(!title.hidden)refresh()}).observe($('start'+i),{attributes:true,attributeFilter:['disabled']});
const style=el('style','premium-style');style.textContent=`
.premium-mast .m2-logo{background-repeat:no-repeat;background-position:center}.premium-nav #kapBtn .m2-kt{display:none}.premium-nav #kapBtn:after{content:"Kaplica"}.premium-hero .m2-chrow{display:none}.premium-controls #storyModeHint{display:none!important}.premium-map .m2-ch{overflow:hidden}.premium-map .m2-ch .recline{display:none}#title:not([hidden]){display:flex!important;flex-direction:column;position:absolute;inset:0;width:100%;height:100%;max-width:none;max-height:none;padding:12px 18px;gap:12px;background:#0b0c0e;color:#e3d6bc;overflow:hidden}
.premium-mast{height:26vh;flex:none;display:flex;justify-content:center}.premium-mast .m2-logo{width:min(1200px,76vw)!important;height:100%!important;max-width:none!important;background-size:contain!important;margin:0!important}
.premium-body{display:grid;grid-template-columns:200px minmax(0,1fr) 200px;gap:24px;flex:1;min-height:0}.premium-nav{display:flex;flex-direction:column;gap:12px;border-right:1px solid #574632;padding-right:18px;min-height:0}.premium-nav>button,.premium-go{background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;min-height:62px;color:#e3d6bc!important;padding:15px 24px!important;font:700 22px Grenze,Georgia,serif!important;box-shadow:none!important}
/* states: nbUiSystem */

.premium-nav #kapBtn{display:block;width:100%}.premium-nav #kapBtn small,.premium-nav #kapGo,.premium-nav #kapBtn .m2-ico{display:none}.premium-nav #kapBtn b{font:inherit}.premium-controls{margin-top:auto}.premium-controls .m2-mode,.premium-controls .m2-assist{display:flex;flex-direction:column;align-items:stretch}.premium-controls .m2-lab,.premium-controls #storyModeHint{display:none}.premium-controls .modesw{display:flex}.premium-controls .modesw button{min-width:0;flex:1;padding:12px 5px}
.premium-map{display:flex;flex-direction:column;gap:12px;min-height:0;min-width:0}.premium-banner{flex:1;min-height:0;position:relative;background-position:center;background-size:cover;border:8px solid transparent;border-image:${url('ramka-okno')} 35 fill / 8px}.premium-caption{position:absolute;left:22px;bottom:18px;color:#e3d6bc;font:700 34px Grenze,Georgia,serif;margin:0}.premium-map .m2-right{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;flex:none;height:90px;width:100%;padding:0}.premium-map .m2-ch{min-height:0!important;height:100%;padding:8px!important;background-size:cover!important;background-position:center!important;font-size:12px!important;text-shadow:0 2px 3px #000;border:2px solid #66553e!important}.premium-map .m2-ch small{font-size:14px}.premium-map .recline{font-size:10px!important}
/* states: nbUiSystem */

.premium-hero{display:flex;flex-direction:column;min-height:0;border:8px solid transparent;border-image:${url('ramka-karta')} 35 fill / 8px;text-align:center}.premium-ashes{padding:10px;border-bottom:1px solid #69503a;flex:none}.premium-portrait{width:100%;min-height:0;flex:1;object-fit:cover;object-position:top}.premium-name{font:700 24px Grenze,Georgia,serif}.premium-hero #charCard{margin:0!important;padding:8px!important;background:none!important;border:0!important}.premium-go{width:100%;min-height:80px;font-size:18px!important;padding:16px!important}.premium-hero .chxp{font-size:11px}
@media(max-height:550px){#title:not([hidden]){padding:4px 10px;gap:4px}.premium-mast{height:90px}.premium-body{grid-template-columns:130px minmax(0,1fr) 130px;gap:10px}.premium-nav{gap:4px;padding-right:8px}.premium-nav>button{min-height:36px;font-size:16px!important;padding:8px 16px!important}.premium-map{gap:5px}.premium-map .m2-right{height:48px;gap:3px}.premium-map .m2-ch{font-size:9px!important;padding:2px!important}.premium-map .recline{display:none}.premium-caption{font-size:22px;left:10px;bottom:8px}.premium-go{min-height:40px;font-size:13px!important;padding:8px!important}.premium-name{font-size:16px}.premium-ashes{padding:3px;font-size:12px}.premium-hero #charCard{padding:2px!important}.premium-controls{font-size:11px}.premium-controls .modesw button{font-size:11px;padding:5px}.premium-controls .tgl{font-size:10px}}

/* Journey owns its layout; legacy painted text remains outside this screen. */
#title .premium-nav #kapBtn:after{content:none!important}
#title .premium-nav #kapBtn .premium-kap-label{display:block;font:inherit;color:inherit}
#title .premium-hero #charCard{display:none!important}
#title .premium-mast .m2-logo{display:block;flex:none;min-height:0}
#title .premium-banner{border:12px solid transparent;border-image-slice:155;border-image-width:12px;border-image-repeat:stretch}
#title .premium-hero{border:13px solid transparent;border-image-slice:85;border-image-width:13px;border-image-repeat:stretch}
#title .premium-map .m2-ch{font-size:0!important;position:relative;border:7px solid transparent!important;border-image:${url('ramka-okno')} 155 /7px stretch!important;color:#e3d6bc;opacity:1;box-shadow:none;background-color:#151313!important}
#title .premium-map .m2-ch>*{display:none!important}
#title .premium-map .m2-ch:before{content:attr(data-roman);position:absolute;top:2px;left:4px;font:700 20px Grenze,Georgia,serif;color:#e3d6bc;background:none;inset:auto;top:2px;left:4px}
#title .premium-map .m2-ch:after{content:attr(data-status);position:absolute;bottom:2px;right:3px;top:auto;transform:none;font:700 12px Grenze,Georgia,serif;background:#080808c9;padding:1px 3px;color:#e3d6bc}
/* states: nbUiSystem */

#title .premium-xp{font:12px Grenze,Georgia,serif;padding:12px 0 4px;position:relative;margin:6px 8px}
#title .premium-xp:before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:#382e23;border:1px solid #8a6940}
#title .premium-xp:after{content:'';position:absolute;top:1px;left:1px;width:calc((100% - 2px)*var(--xp));height:3px;background:#b84020}
#title .premium-name{font-size:20px;line-height:1.15;padding:5px 0}
#title .premium-controls .modesw{border:0;background:none;box-shadow:none;gap:4px;padding:0}
#title .premium-controls .modesw button{border:0!important;border-image:none!important;background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;min-height:44px;padding:10px 14px;font:700 14px Grenze,Georgia,serif!important;min-width:0;overflow:hidden;color:#e3d6bc}
#title .premium-controls .modesw button>*{display:none!important}
/* states: nbUiSystem */

#title .premium-controls .m2-assist{gap:4px;margin-top:6px}
#title .premium-controls .tgl{font-size:12px;line-height:1.1;min-height:28px}
#title .premium-controls .tgl .sl{width:25px;height:25px;flex:none}
#title .premium-nav{overflow-y:auto;overflow-x:hidden;scrollbar-width:thin}
@media(max-height:550px){#title .premium-body{grid-template-columns:125px minmax(0,1fr) 125px;gap:8px}#title .premium-mast{height:86px}#title .premium-hero{border-width:8px;border-image-width:8px}#title .premium-banner{border-width:7px;border-image-width:7px}#title .premium-name{font-size:14px;padding:2px}#title .premium-xp{font-size:10px;margin:2px 4px;padding-top:8px}#title .premium-map .m2-ch:before{font-size:14px}#title .premium-map .m2-ch:after{font-size:9px}#title .premium-controls .modesw button{min-height:30px;padding:7px 8px}#title #sFab:after,#title #sArc:after{font-size:11px}#title .premium-controls .tgl{font-size:10px;min-height:20px}#title .premium-controls .tgl .sl{width:18px;height:18px}#title .premium-nav>button{flex-shrink:0}#title .premium-controls{flex-shrink:0}}
`;style.textContent+=`
#title .premium-body{width:100%;align-self:stretch}
#title .premium-banner{border-image-source:${url('ramka-okno')};border-image-slice:155}
#title .premium-hero{border-image-source:${url('ramka-karta')};border-image-slice:85}
#title .premium-nav #manBtn{font-size:0!important}#title .premium-nav #manBtn:after{content:'${EN?'Guide':'Instrukcja'}';font:700 22px Grenze,Georgia,serif}
#title .premium-controls .touchcorner{position:static!important;inset:auto!important}
@media(max-height:550px){#title .premium-nav #manBtn:after{font-size:16px}}
`;style.textContent=style.textContent.replaceAll('#title','#orient#orient#orient#orient#orient #title');document.head.append(style);

$('manBtn').setAttribute('aria-label',EN?'Guide':'Instrukcja');
// 8.11.2026: control diagrams match the four skill slots (Q E F R / LT+X Y B A); R rerolls only on the level-up screen
{const fix=(sel,old,html)=>{const e=[...document.querySelectorAll(sel)].find(x=>x.textContent.replace(/\s+/g,' ').trim().startsWith(old));if(e)e.innerHTML=html};
 fix('#sub-kb .lb, .fig .lb','Q E F',EN?'<b>Q E F R</b> Skills · <b>Enter</b> Talk':'<b>Q E F R</b> Skille · <b>Enter</b> Rozmowa');
 fix('#sub-kb .lb, .fig .lb','1 2 3',EN?'<b>1–4</b> Pick card · <b>R</b> Reroll':'<b>1–4</b> Wybór karty · <b>R</b> Przerzut');
 fix('.fig.pad .lb','LT',EN?'<b>LT</b> Skills + X / Y / B / A':'<b>LT</b> Umiejętności + X / Y / B / A')}
for(const [button,key] of [[journey,'nawigacja-podroz'],[$('kapBtn'),'kaplica-cos_seal'],[$('manBtn'),'tryby-fabula'],[$('optsBtn'),'nawigacja-opcje']]){
 const im=el('img','premium-nav-icon');im.src=PREMIUM_ICONS[key];im.alt='';im.width=28;im.height=28;button.prepend(im);
}
const prepStyle=el('style','premium-prep-style');prepStyle.textContent=`
#title .premium-nav>button{position:relative;padding-left:42px!important}
#title .premium-nav-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);width:25px;height:25px;object-fit:contain;pointer-events:none}
#title .premium-controls .modesw button{position:relative;min-height:56px;padding:28px 10px 10px!important}
#title .premium-controls .modesw button .premium-nav-icon{display:block!important;left:calc(50% - 9px);top:11px;transform:none;width:18px;height:18px}
#prep{padding:18px 28px!important;background:#101012!important;align-items:stretch!important;justify-content:flex-start!important;gap:10px!important}
#prep .prepth,#prep #prepNim,#prep .prepcard,#prep .prepsth{display:none!important}
#prep #prepK{font:700 28px Grenze,Georgia,serif;color:#e3d6bc;text-align:center;margin:0}
#prep .prepgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:none}
#prep #prepChar{padding:0;border:0;background:none}
#prep #prepChar>div{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px!important}
#prep #prepChar .opt{width:100%!important;min-width:0!important;flex:none!important;justify-content:flex-start!important;gap:6px!important;padding:10px!important;background:#151416!important;border:12px solid transparent!important;border-image:${url('ramka-karta')} 85 /12px stretch!important;box-shadow:none!important;overflow:hidden}
#prep #prepChar .premium-class-art{width:100%;height:200px;object-fit:cover;object-position:center 15%;flex:none;filter:none}
#prep #prepChar .opt b{font:700 22px Grenze,Georgia,serif!important;color:#e3d6bc!important;letter-spacing:0!important}
#prep #prepChar .opt span{font:16px/1.25 Grenze,Georgia,serif!important;text-align:center!important}
#prep .prepbox{background:#111012;border-color:#66503a;color:#e3d6bc;min-width:0}
#prep #prepPerks,#prep #prepCh,#prep #prepCurseL{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:0;padding:0}
#prep #prepPerks .opt,#prep #prepCh .opt,#prep #prepCurseL .opt{position:relative;margin:0;width:100%;min-width:0;border:1px solid #715b40!important;background:#191719!important;padding:12px!important;color:#e3d6bc;font:16px/1.25 Grenze,Georgia,serif;box-shadow:none!important}
#prep #prepPerks .opt{padding-left:64px!important;min-height:94px}
#prep .premium-perk-art{position:absolute;left:10px;top:12px;width:44px;height:44px;object-fit:contain}
/* states: nbUiSystem */

#prep .opt:disabled{opacity:.58}
#prep .btnrow{position:sticky;top:0;z-index:2;margin:0;padding:4px;background:#101012}
#prep #prepGo,#prep #prepBack{background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-image:none!important;color:#e3d6bc!important;font:700 22px Grenze,Georgia,serif!important;padding:14px 28px!important}
@media(max-height:550px){#title .premium-nav-icon{left:12px;width:19px;height:19px}#title .premium-nav>button{padding-left:29px!important}#title .premium-controls .modesw button{min-height:30px;padding:7px 8px!important}#title .premium-controls .modesw button .premium-nav-icon{display:none!important}#prep{padding:8px 14px!important;gap:6px!important}#prep #prepChar .premium-class-art{height:105px}#prep #prepChar .opt{padding:5px!important;border-width:8px!important;border-image-width:8px!important}#prep #prepChar .opt b{font-size:18px!important}#prep #prepChar .opt span{font-size:12px!important}#prep #prepPerks .opt,#prep #prepCh .opt,#prep #prepCurseL .opt{font-size:13px}#prep #prepGo,#prep #prepBack{font-size:16px!important;padding:9px 22px!important}#prep #prepK{font-size:22px}}
`;prepStyle.textContent=prepStyle.textContent.replaceAll('#title','#orient#orient#orient#orient#orient #title').replace(/#prep\b/g,'#orient#orient#orient#orient#orient#orient#orient#orient #prep');document.head.append(prepStyle);
new MutationObserver(()=>{if($('prep').hidden)for(const im of $('prep').querySelectorAll('img.premium-class-art,img.premium-perk-art'))im.removeAttribute('src')}).observe($('prep'),{attributes:true,attributeFilter:['hidden']});
const prep=$('prep'),prepHead=el('header','premium-prep-head'),prepBody=el('div','premium-prep-body'),prepControls=el('aside','premium-prep-controls');
prepHead.style.flexShrink='0';prepHead.append($('prepBack'),$('prepK'));
const difficultyTitle=el('h3','premium-difficulty-title');difficultyTitle.textContent=EN?'Difficulty':'Trudność';
prepControls.append(difficultyTitle,$('diffSw'),$('diffCap'),prep.querySelector('.prepassist'),prep.querySelector('.btnrow'));
prepBody.append(prep.querySelector('.prepgrid'),prepControls);prep.append(prepHead,prepBody);
// Stage 3: only explanatory controls scroll; difficulty, summary and launch stay in view.
const controlScroll=el('div','premium-prep-control-scroll'),prepSummary=el('div','premium-prep-summary');
controlScroll.append($('diffCap'),prepControls.querySelector('.prepassist'));
prepSummary.setAttribute('role','status');prepSummary.setAttribute('aria-live','polite');
prepControls.insertBefore(controlScroll,prepControls.querySelector('.btnrow'));
prepControls.insertBefore(prepSummary,prepControls.querySelector('.btnrow'));
function refreshPrepSummary(){if(prep.hidden)return;const pc=$('prepChar');if(pc){let info=pc.querySelector('.premium-class-description');if(!info){info=el('p','premium-class-description');pc.append(info)}const selected=pc.querySelector('.opt.on>span'),description=selected?.textContent||'';if(info.textContent!==description)info.textContent=description;for(const b of pc.querySelectorAll('.opt')){const text=b.querySelector('span')?.textContent||'';if(b.title!==text)b.title=text}}
const cls=heroName(charId()),counts=(EN?'Perks ':'Perki ')+PREP.perks.length+'/1 · '+(EN?'Challenges ':'Wyzwania ')+(PREP.chal?1:0)+' · '+(EN?'Curses ':'Klątwy ')+PREP.curses.length+'/3',text=cls+' · '+DF[DIFFK].n+'\n'+counts;
 if(prepSummary.textContent!==text)prepSummary.textContent=text;
 const detail=[...PERKS.filter(x=>PREP.perks.includes(x.id)).map(x=>x.n),...chalList().filter(x=>x.id===PREP.chal).map(x=>x.n),...CURSES.filter(x=>PREP.curses.includes(x.id)).map(x=>x.n)].join(' · ');if(prepSummary.title!==detail)prepSummary.title=detail;
}
new MutationObserver(refreshPrepSummary).observe(prep,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','aria-pressed']});

const layoutStyle=el('style','premium-prep-layout');layoutStyle.textContent=`
#prep:not([hidden]){display:flex!important;flex-direction:column!important;overflow:hidden!important}
#prep .premium-prep-head{display:flex;align-items:center;gap:24px;flex:none;width:100%}
#prep .premium-prep-head #prepBack{position:static!important;flex:none;min-width:100px;margin:0!important;height:44px!important}
#prep .premium-prep-head #prepK{display:block!important}
#prep .premium-prep-body{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:18px;width:100%;flex:1;min-height:0;height:0}
#prep .prepgrid{overflow:auto;min-height:0;align-content:start;padding:6px;scroll-padding-top:8px}
#prep .premium-prep-controls{display:flex;flex-direction:column;gap:14px;padding:14px;border:12px solid transparent;border-image:${url('ramka-karta')} 85 /12px stretch;min-height:0;overflow:auto}
#prep .premium-prep-controls .btnrow{position:static!important;padding:0;margin-top:auto}
#prep .premium-prep-controls #prepGo{width:100%!important;max-width:100%!important;min-width:0!important;min-height:54px!important;animation:none!important;font-size:19px!important}
#prep .premium-prep-controls #diffSw{display:flex;flex-direction:column;gap:6px;flex:none}
#prep .premium-prep-controls #diffCap{font:15px/1.3 Grenze,Georgia,serif}
#prep #prepChar .premium-class-art{height:150px}
#prep .prepgrid>.prepbox{border-image:none!important;border:1px solid #68553c!important;padding:10px;background:#121113!important}
@media(max-height:550px){#prep .premium-prep-body{grid-template-columns:minmax(0,1fr) 165px;gap:8px}#prep .premium-prep-head{gap:12px}#prep .premium-prep-controls{padding:7px;border-width:8px;border-image-width:8px;gap:6px}#prep .premium-prep-controls #diffCap{font-size:12px}#prep #prepChar .premium-class-art{height:95px}#prep #prepChar>div{gap:5px!important}#prep #prepChar .opt b{font-size:16px!important}#prep #prepPerks,#prep #prepCh,#prep #prepCurseL{grid-template-columns:1fr}#prep .premium-prep-controls #prepGo{font-size:15px!important;padding:9px 12px!important}}
`;layoutStyle.textContent=layoutStyle.textContent.replace(/#prep\b/g,'#orient#orient#orient#orient#orient#orient#orient#orient #prep');document.head.append(layoutStyle);

const shrineStyle=el('style','premium-shrine-style');shrineStyle.textContent=`
#kap:not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:14px!important;padding:20px 28px!important;background:#101012!important;overflow:hidden!important}
#kap .m2-top{display:flex!important;align-items:center;justify-content:space-between;gap:20px;flex:none;width:100%;margin:0!important;padding:0!important;border:0!important}
#kap #kapH{font:700 32px Grenze,Georgia,serif!important;color:#e3d6bc;margin:0!important;width:auto!important;max-width:none!important;height:auto!important;letter-spacing:1px;background:none!important}
#kap .m2-emb{position:static!important;flex:none;color:#e3d6bc;font:700 24px Grenze,Georgia,serif}
#kap #kapTabs{display:flex!important;flex-wrap:wrap;gap:8px;align-items:center;flex:none;width:100%;margin:0!important}
#kap #kapTabs .tab,#kap .m2-b{background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-image:none!important;padding:14px 25px!important;color:#e3d6bc!important;font:700 19px Grenze,Georgia,serif!important;min-height:48px!important;min-width:0!important;box-shadow:none!important;letter-spacing:0!important}
/* states: nbUiSystem */

#kap .m2k-tier{position:static!important;inset:auto!important;transform:none!important;font:15px Grenze,Georgia,serif;color:#bda47b;margin-left:auto;white-space:normal}
#kap .m2k-body{display:grid!important;grid-template-columns:minmax(0,1.4fr) minmax(260px,1fr);gap:22px;flex:1;min-height:0;width:100%;padding:0!important}
#kap #kapList{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:10px;overflow:auto;padding:5px;min-height:0}
#kap .m2k-row{position:relative;display:flex!important;flex-direction:column;align-items:flex-start;justify-content:center;gap:5px;width:100%;min-width:0;min-height:118px!important;padding:12px 12px 12px 76px!important;border:1px solid #715c41!important;border-image:none!important;background:#191719!important;color:#e3d6bc!important;box-shadow:none!important;text-align:left!important}
#kap .m2k-row b{font:700 21px Grenze,Georgia,serif!important;line-height:1.1}
#kap .m2k-row small,#kap .m2k-pips{position:static!important;inset:auto!important;transform:none!important;white-space:normal!important;width:auto!important;max-width:100%;font:14px/1.25 Grenze,Georgia,serif!important;color:#c4b398}
#kap .premium-shrine-icon{position:absolute;left:12px;top:16px;width:52px;height:52px;object-fit:contain}
/* states: nbUiSystem */

#kap .m2k-row.lk{opacity:.65}
#kap #kapDet{overflow:auto;min-height:0;border:16px solid transparent!important;border-image:${url('ramka-karta')} 85 /16px stretch!important;background:#121113!important;padding:18px!important;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;box-shadow:none!important}
#kap #kapHd{font:700 30px Grenze,Georgia,serif!important;line-height:1.1;color:#e3d6bc}
#kap .premium-shrine-detail{width:100px;height:100px;object-fit:contain;flex:none}
#kap #kapDet p{margin:0;font:18px/1.35 Grenze,Georgia,serif;color:#d8c9ae}
#kap #kapBuy,#kap #kapReset{width:100%!important;max-width:400px;flex:none;white-space:normal!important}
#kap #kapBuy{margin-top:auto!important}#kap .m2-b:disabled{opacity:.6;filter:grayscale(.7)!important}
#kap #kapImg:has(.m2k-seal){display:none}
@media(max-height:550px){#kap:not([hidden]){padding:8px 14px!important;gap:6px!important}#kap #kapH{font-size:24px!important}#kap #kapTabs .tab,#kap .m2-b{font-size:14px!important;min-height:34px!important;padding:8px 16px!important}#kap .m2k-tier{font-size:11px}#kap .m2k-body{grid-template-columns:minmax(0,1.4fr) minmax(230px,1fr);gap:10px}#kap #kapList{gap:6px}#kap .m2k-row{min-height:90px!important;padding:9px 8px 9px 47px!important;gap:3px}#kap .premium-shrine-icon{width:32px;height:32px;left:8px;top:12px}#kap .m2k-row b{font-size:16px!important}#kap .m2k-row small,#kap .m2k-pips{font-size:11px!important}#kap #kapDet{border-width:9px!important;border-image-width:9px!important;padding:9px!important;gap:6px}#kap #kapHd{font-size:22px!important}#kap #kapDet p{font-size:14px}#kap .premium-shrine-detail{width:56px;height:56px}}
`;shrineStyle.textContent=shrineStyle.textContent.replace(/#kap\b/g,'#orient#orient#orient#orient#orient#orient#orient#orient #kap');document.head.append(shrineStyle);
new MutationObserver(()=>{if($('kap').hidden)for(const im of $('kap').querySelectorAll('img.premium-shrine-icon,img.premium-shrine-detail'))im.removeAttribute('src')}).observe($('kap'),{attributes:true,attributeFilter:['hidden']});
// Reuse the existing controls and generated guide; only their containers change.
for(const [id,back,label] of [['opts','optsBack',EN?'Options':'Opcje'],['manual','manBack',EN?'Guide':'Instrukcja']]){
 const page=$(id),head=el('header','premium-page-head'),heading=el('h2','premium-page-heading'),layout=el('div','premium-page-layout'),content=el('div','premium-page-content'),tabs=page.querySelector('.tabs');
 heading.textContent=label;head.append($(back),heading);
 if(id==='opts'){for(const pane of [...page.querySelectorAll(':scope>.pane')])content.append(pane)}else content.append($('manBody'));
 layout.append(tabs,content);for(const old of [...page.children])old.hidden=true;page.append(head,layout);
 tabs.addEventListener('click',()=>{content.scrollTop=0});
}
const pageStyle=el('style','premium-pages-style');pageStyle.textContent=`
:is(#opts,#manual):not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;padding:18px 28px!important;gap:14px!important;background:#101012!important;overflow:hidden!important}
:is(#opts,#manual) .premium-page-head{display:flex;gap:26px;align-items:center;flex:none;width:100%}
:is(#opts,#manual) .premium-page-heading{font:700 32px Grenze,Georgia,serif;color:#e3d6bc;margin:0}
:is(#opts,#manual) .premium-page-head .backar{position:static!important;margin:0!important;width:120px!important;height:48px!important;flex:none}
:is(#opts,#manual) .premium-page-layout{display:grid;grid-template-columns:205px minmax(0,1fr);gap:22px;width:100%;flex:1;min-height:0;height:0}
:is(#opts,#manual) .premium-page-layout>.tabs{display:flex!important;flex-direction:column;justify-content:flex-start;gap:9px;flex-wrap:nowrap!important;width:100%;margin:0!important;padding:4px!important;overflow:auto;min-height:0;align-items:stretch!important;border:0!important}
:is(#opts,#manual) .premium-page-content{overflow:auto;min-width:0;min-height:0;padding:16px;border:18px solid transparent;border-image:${url('ramka-okno')} 155 /18px stretch;background:#121113;scrollbar-width:thin}
:is(#opts,#manual) .premium-page-layout>.tabs>.tab,:is(#opts,#manual) .backar{background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-image:none!important;box-shadow:none!important;padding:14px 22px!important;color:#e3d6bc!important;font:700 20px/1.15 Grenze,Georgia,serif!important;min-height:58px!important;white-space:normal!important;flex:none!important;letter-spacing:0!important}
/* states: nbUiSystem */

:is(#opts,#manual) .pane,:is(#opts,#manual) .mbox,:is(#opts,#manual) #manBody{border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;padding:0!important;margin:0!important;max-width:none!important;width:100%!important;overflow:visible!important}
#opts .pane:not([hidden]){display:block!important}
#manual .mbox{padding:14px 0!important;border-bottom:1px solid #665138!important}
#manual .mbox h3,#opts .sth{font:700 23px Grenze,Georgia,serif!important;color:#d3b584;margin:10px 0!important}
#opts .sth{border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;min-height:0!important;height:auto!important;padding:4px 0!important;text-align:left!important;letter-spacing:0!important;text-transform:none!important}
#opts .sth:before,#opts .sth:after{content:none!important}
#manual .mbox p,#manual .mbox li,#opts .figcap{font:17px/1.45 Grenze,Georgia,serif!important;color:#d4c8b3}
#opts .musrow,#opts .tgl{font:18px/1.3 Grenze,Georgia,serif;min-height:40px;margin:8px 0}
#opts .subtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
#opts .stab,#opts .qrow button,#opts .langrow button,#opts .pane button.go,#manual .msk summary{border:1px solid #715b40!important;border-image:none!important;background:#211c1c!important;color:#e3d6bc!important;box-shadow:none!important;padding:10px 16px!important;font:16px/1.2 Grenze,Georgia,serif!important;min-height:40px!important}
/* states: nbUiSystem */

#opts .qrow{display:flex;flex-wrap:wrap;gap:6px}#opts .opsep{margin:12px 0}
#manual .mlv{font:16px/1.4 Grenze,Georgia,serif;color:#d4c8b3}
@media(max-height:550px){:is(#opts,#manual):not([hidden]){padding:7px 14px!important;gap:7px!important}:is(#opts,#manual) .premium-page-layout{grid-template-columns:155px minmax(0,1fr);gap:10px}:is(#opts,#manual) .premium-page-heading{font-size:24px}:is(#opts,#manual) .premium-page-head .backar{height:34px!important;min-height:34px!important;width:100px!important}:is(#opts,#manual) .premium-page-layout>.tabs>.tab,:is(#opts,#manual) .backar{font-size:15px!important;min-height:40px!important;padding:9px 16px!important}:is(#opts,#manual) .premium-page-content{border-width:10px;border-image-width:10px;padding:9px}:is(#opts,#manual) .premium-page-layout>.tabs{gap:5px}#manual .mbox p,#manual .mbox li,#opts .figcap{font-size:14px!important}#opts .musrow,#opts .tgl{font-size:14px}#opts .stab,#opts .qrow button,#opts .langrow button,#opts .pane button.go{font-size:13px!important;min-height:34px!important;padding:8px 12px!important}}
`;pageStyle.textContent=pageStyle.textContent.replace(/:is\(#opts,#manual\)|#opts\b|#manual\b/g,m=>'#orient#orient#orient#orient#orient#orient#orient#orient '+m);document.head.append(pageStyle);

const pause=$('pause'),pauseTitle=el('h2','premium-pause-title'),pauseBody=el('div','premium-pause-body'),pauseActions=pause.querySelector('.btnrow');pauseTitle.textContent=EN?'Pause':'Pauza';for(const child of [...pause.children]){if(child===pauseActions)continue;if(child.matches('h1'))child.hidden=true;else pauseBody.append(child)}pause.append(pauseTitle,pauseBody,pauseActions);
const windowStyle=el('style','premium-windows-style');windowStyle.textContent=`
#pause:not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;overflow:hidden!important}
#pause .premium-pause-title{font:700 30px Grenze,Georgia,serif;margin:0;color:#e3d6bc;flex:none}
#pause .premium-pause-body{flex:1;min-height:0;overflow:auto;width:100%;display:flex;flex-direction:column;gap:12px}
#pause>.btnrow{position:static!important;inset:auto!important;transform:none!important;margin:0!important;padding:6px!important;flex:none;width:100%!important}
#pause .premium-pause-body h2{background:none!important;border:0!important;border-image:none!important;min-height:0!important;padding:5px!important;font:700 23px Grenze,Georgia,serif!important}
#lvl .level-panel,#lvl #cards,#lvl .card{box-sizing:border-box!important;min-width:0!important;max-width:100%!important}
#lvl .card{width:auto!important;margin:0!important}#lvl .level-panel{margin:0!important}
:is(#pause,#shop,#conf,#end):not([hidden]){background:#100f12f5!important;padding:20px 28px!important;gap:14px!important;color:#e3d6bc;overflow:auto!important}
:is(#pause,#shop,#conf,#end) :is(.pbox,.endbox,#pauseKeys),#lvl .level-panel{border:18px solid transparent!important;border-image:${url('ramka-okno')} 155 /18px stretch!important;background:#141214!important;box-shadow:none!important;padding:16px!important}
:is(#pause,#shop,#conf,#end,#lvl) button.go{background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-image:none!important;padding:14px 26px!important;font:700 20px/1.2 Grenze,Georgia,serif!important;letter-spacing:0!important;min-height:48px!important;color:#e3d6bc!important;box-shadow:none!important}
/* states: nbUiSystem */

#lvl{background:#08070bc9!important;padding:18px!important}
#lvl .level-panel{width:min(1120px,100%)!important;max-height:100%!important;overflow:auto!important}
#lvl #cards{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:14px!important;align-items:stretch}
#lvl #cards:has(>.card:nth-child(3):last-child){grid-template-columns:repeat(3,minmax(0,1fr))!important}
#lvl #cards:has(>.card:nth-child(2):last-child){grid-template-columns:repeat(2,minmax(0,1fr))!important}
:is(#lvl,#shop) .card{border:13px solid transparent!important;border-image:${url('ramka-karta')} 85 /13px stretch!important;background:#191619!important;padding:12px!important;box-shadow:none!important;min-width:0!important;color:#e3d6bc!important}
:is(#lvl,#shop) .card:before,:is(#lvl,#shop) .card:after{content:none!important}
/* states: nbUiSystem */

:is(#lvl,#shop) .card .cn{font:700 26px/1.1 Grenze,Georgia,serif!important;color:#e3d6bc!important;display:flex;flex-direction:column;align-items:center;gap:8px}
:is(#lvl,#shop) .card .cd{font:17px/1.3 Grenze,Georgia,serif!important;color:#d3c5ad!important}
#shop #shopCards{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;width:100%}
#pause #skillLoadout .slot-inventory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
#pause #skillLoadout button{min-width:0;white-space:normal}
#pause #skillLoadout .ic{flex:none}
#conf{align-items:center!important;justify-content:center!important}
#msg.on,#dialog,.noticebox{border:18px solid transparent!important;border-image:url('${PREMIUM_ICONS['ramka-komunikat']}') 85 160 /18px 26px stretch!important;background:#121013f2!important;padding:12px 18px!important;color:#e3d6bc!important;box-shadow:none!important}
:is(#dialog,#notice) :is(.chain-edge,.chain-side){display:none!important}
@media(max-height:550px){:is(#pause,#shop,#conf,#end):not([hidden]){padding:8px 14px!important;gap:7px!important}:is(#pause,#shop,#conf,#end) :is(.pbox,.endbox,#pauseKeys),#lvl .level-panel{border-width:10px!important;border-image-width:10px!important;padding:8px!important}#lvl{padding:7px!important}#lvl #cards{gap:6px!important}:is(#lvl,#shop) .card{border-width:8px!important;border-image-width:8px!important;padding:7px!important}:is(#lvl,#shop) .card .cn{font-size:19px!important;gap:4px}:is(#lvl,#shop) .card .cd{font-size:13px!important}:is(#pause,#shop,#conf,#end,#lvl) button.go{font-size:15px!important;min-height:36px!important;padding:9px 17px!important}#shop #shopCards{gap:7px}#msg.on,#dialog,.noticebox{border-width:12px!important;border-image-width:12px 18px!important;padding:7px 12px!important}}
`;
Object.assign(PREMIUM_ICONS,{'skille-wypad':'assets/ui/6bb9f71a3d9a0038ed0950e79ea7ec5102f6c839c89866ba6c3aacdff32b3a34.webp','skille-odlew':'assets/ikony/148dbad2e707a9efbdb5aef511a604645e7341b83f2194accb1c65516a732875.webp','skille-dogasanie':'assets/ikony/6391f4266dc0ac2019bc8d0224f01d06fd5a875066d8443a94ba66e6021ce3b2.webp','skille-zalecho':'assets/ikony/c0d65609c3a3e39d85f91394bc538e16b5b389a6f7f2367beecb5b48d9891f9d.webp','skille-zastaw':'assets/ikony/4b7d255e50cd79891dea0b5c6869179ffe234f86791eae7365c82d3c315886f1.webp'});windowStyle.textContent+=`#prep #prepChar .hero-ep{display:block!important;margin:0!important;text-align:center!important;color:#e8d6a8!important;font:600 1.05em Grenze,Georgia,serif!important;letter-spacing:.02em!important;line-height:1.2!important}#prep #prepChar .opt:not(.on) .hero-ep{display:none!important}`;for(const k of ['zalecho','zastaw','odlew','dogasanie'])windowStyle.textContent+=`.ic-${k}{background-image:url('${PREMIUM_ICONS['skille-'+k]}')!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important}`;
for(const [key,src] of Object.entries(PREMIUM_ICONS)){if(!key.startsWith('skille-'))continue;const k=key.slice(7);windowStyle.textContent+=`:is(#lvl,#pause,#manual) [data-premium-skill="${k}"]{background:url('${src}') center/contain no-repeat!important;width:64px!important;height:64px!important;display:inline-block!important;image-rendering:auto!important;filter:none!important;mask:none!important}:is(#lvl,#pause,#manual) [data-premium-skill="${k}"]:before,:is(#lvl,#pause,#manual) [data-premium-skill="${k}"]:after{content:none!important}@media(max-height:550px){:is(#lvl,#pause,#manual) [data-premium-skill="${k}"]{width:40px!important;height:40px!important}}`}
windowStyle.textContent=windowStyle.textContent.replace(/:is\(#[^)]*\)|#(?:pause|shop|conf|end|lvl|msg|dialog)\b/g,m=>'#orient#orient#orient#orient#orient#orient#orient#orient#orient '+m);document.head.append(windowStyle);
// Final sizing corrections requested after reviewing cache 432.
for(const b of $('diffSw').querySelectorAll('[data-d]')){b.classList.remove('mlab');b.classList.add('premium-difficulty');b.textContent=({e:EN?'Easy':'Łatwy',n:EN?'Normal':'Normalny',h:EN?'Hard':'Trudny'})[b.dataset.d]}
$('prepBack').classList.remove('backar');$('prepBack').classList.add('premium-back');
const corrections=el('style','premium-review-corrections');corrections.textContent=`
#prep .premium-prep-body{grid-template-columns:minmax(0,1fr) clamp(280px,23vw,360px)!important}
#prep .premium-prep-controls{padding:18px!important;gap:22px!important}
#prep .premium-difficulty-title{margin:4px 0!important;font:700 30px Grenze,Georgia,serif;color:#e3d6bc;text-align:center}
#prep #diffSw{width:100%!important;max-width:none!important;margin:0!important;padding:0!important;gap:14px!important;border:0!important;background:none!important;box-shadow:none!important}
#prep #diffSw .premium-difficulty{display:flex!important;align-items:center;justify-content:center;box-sizing:border-box!important;width:100%!important;height:clamp(62px,9vh,96px)!important;min-height:62px!important;margin:0!important;padding:15px 24px!important;background:${url('przycisk-zwykly')} center/100% 100% no-repeat!important;border:0!important;border-image:none!important;border-radius:0!important;font:700 26px/1 Grenze,Georgia,serif!important;letter-spacing:0!important;color:#eadcc4!important;text-shadow:0 2px 3px #000!important}
#prep #diffSw .premium-difficulty:before,#prep #diffSw .premium-difficulty:after,#prep #prepBack:before,#prep #prepBack:after{content:none!important}
/* states: nbUiSystem */

#prep #prepBack{display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:130px!important;height:54px!important;min-height:54px!important;padding:0 22px!important;margin:0!important;line-height:1!important;letter-spacing:0!important;font-size:22px!important}
#prep .premium-prep-controls .prepassist{margin:0!important;padding:0!important}
#prep .premium-prep-controls .prepassist .tgl{display:flex!important;align-items:center!important;justify-content:center;gap:10px!important;margin:0!important;font:20px/1.2 Grenze,Georgia,serif!important}
#prep .premium-prep-controls .prepassist .sl{width:24px!important;height:24px!important;min-width:24px!important;flex:none!important;background-size:contain!important}
#prep .premium-prep-controls #diffCap{font:18px/1.4 Grenze,Georgia,serif!important;text-align:center;margin:0!important}
#prep .premium-prep-controls #prepGo{height:96px!important;min-height:96px!important;font-size:28px!important;line-height:1!important;padding:20px!important}
#prep #prepChar .opt{gap:12px!important}
#prep #prepChar .opt b{font-size:24px!important;line-height:1.2!important}
#prep #prepChar .opt span{font-size:18px!important;line-height:1.45!important;max-width:42ch;margin:0 auto!important;padding:0 6px 8px;text-align:center!important;text-shadow:0 1px 2px #000!important}
#prep #prepPerks .opt,#prep #prepCh .opt,#kap .m2k-row,#prep #prepCurseL .opt{box-sizing:border-box!important;border:10px solid transparent!important;border-image:${url('ramka-okno')} 155 /10px stretch!important;background:#171518!important;overflow-wrap:anywhere}
#prep #prepPerks .opt{padding:12px 14px 12px 66px!important}
#prep #prepCh .opt,
#prep #prepCurseL .opt{padding:14px 16px!important}
#kap .m2k-row{padding:16px 16px 16px 76px!important;min-height:136px!important}
#kap .premium-shrine-icon{left:12px;top:18px}
#title .premium-controls{display:flex!important;flex-direction:column!important;gap:12px!important}
#opts .rng,#pause .rng{width:min(320px,46vw)!important;max-width:100%;height:44px!important;position:relative;box-sizing:border-box;border:0!important;background:none!important;filter:none!important}
#opts .rng .rk,#pause .rng .rk{position:absolute!important;inset:calc(50% - 5px) 9.5% auto 11.5%!important;height:10px!important;transform:none!important;border:1px solid #816343!important;border-image:none!important;border-radius:3px;background:linear-gradient(#080809,#242021)!important;box-shadow:inset 0 2px 4px #000,0 1px 0 #bd976033!important;mix-blend-mode:normal}
#opts .rng .rf,#pause .rng .rf{left:11.5%!important;top:calc(50% - 2px)!important;height:4px!important;width:calc(var(--v,.5)*78%)!important;background:linear-gradient(90deg,#7f251a,#df642d)!important;border-radius:2px;box-shadow:0 0 5px #bf321c55}
#opts .rng .rh,#pause .rng .rh{position:absolute;left:calc(11.5% + var(--v,.5)*78%)!important;top:50%!important;transform:translate(-50%,-50%)!important;width:22px!important;height:26px!important;border:2px solid #ad8754!important;border-radius:4px!important;background:linear-gradient(135deg,#584b3e,#171719 45%,#342522)!important;box-shadow:inset 0 0 0 2px #111,0 2px 5px #000!important;mix-blend-mode:normal}
#opts .rng .rh:after,#pause .rng .rh:after{content:'';position:absolute;inset:5px 7px;background:#e18443;box-shadow:0 0 5px #c74720}
#opts .rng:focus-within,#pause .rng:focus-within{outline:1px solid #eea565!important;outline-offset:1px;border-radius:4px}
#opts .tgl{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:12px!important;width:100%!important;min-height:40px!important;margin:10px 0!important}
#opts .tgl .sl,#pause .tgl .sl,#prep .tgl .sl,#title .tgl .sl{display:inline-block!important;position:relative!important;box-sizing:border-box!important;background:linear-gradient(135deg,#282426,#111013)!important;background-image:none!important;border:1px solid #8a6947!important;border-radius:3px!important;box-shadow:inset 0 0 0 3px #121113,0 1px 3px #000!important;transform:none!important;flex:none}
#opts .tgl input:checked+.sl,#pause .tgl input:checked+.sl,#prep .tgl input:checked+.sl,#title .tgl input:checked+.sl{background:linear-gradient(135deg,#57271d,#231615)!important;border-color:#da8a4e!important;box-shadow:inset 0 0 0 2px #201415,0 0 6px #d443233d!important}
#opts .tgl .sl:before,#pause .tgl .sl:before,#prep .tgl .sl:before,#title .tgl .sl:before{content:none!important}
#opts .tgl .sl:after,#pause .tgl .sl:after,#prep .tgl .sl:after,#title .tgl .sl:after{content:none!important}
#opts .tgl input:checked+.sl:after,#pause .tgl input:checked+.sl:after,#prep .tgl input:checked+.sl:after,#title .tgl input:checked+.sl:after{content:''!important;position:absolute;left:34%;top:15%;width:24%;height:46%;border:solid #f0cf98;border-width:0 2px 2px 0;transform:rotate(42deg);background:none!important;box-shadow:none!important}
/* states: nbUiSystem */

#opts .tgl input:checked+.sl:after,#pause .tgl input:checked+.sl:after,#prep .tgl input:checked+.sl:after,#title .tgl input:checked+.sl:after{display:block!important;border-radius:0!important;opacity:1!important;transform:rotate(42deg)!important}
#title .premium-mast{height:clamp(150px,20vh,230px)!important}
#title .premium-map .m2-right{height:clamp(100px,12vh,150px)!important}
/* Cover the entire border box once; default padding-box/repeat exposed a wrapped strip under the frame. */
#title .premium-banner,#title .premium-map .m2-ch{background-repeat:no-repeat!important;background-origin:border-box!important;background-clip:border-box!important;background-size:cover!important;background-position:center!important}
#opts .opsep,#manual .opsep{display:block!important;position:relative!important;box-sizing:border-box!important;width:min(82%,760px)!important;height:12px!important;min-height:12px!important;margin:18px auto!important;padding:0!important;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;transform:none!important;left:auto!important;right:auto!important}
#opts .opsep:before,#manual .opsep:before{content:''!important;position:absolute;inset:5px 0 auto;height:1px;background:linear-gradient(90deg,transparent,#776045 20%,#b08a54 50%,#776045 80%,transparent)!important;border:0!important;transform:none!important}
#opts .opsep:after,#manual .opsep:after{content:''!important;position:absolute;width:7px;height:7px;left:calc(50% - 4px);top:2px;inset-inline-end:auto;background:#b08a54;border:1px solid #dbc18c;transform:rotate(45deg)!important;box-shadow:0 0 5px #a34c2355}
#opts .opsep[hidden],#manual .opsep[hidden]{display:none!important}
#pause #skillLoadout .slot-pick{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;width:100%;margin:14px 0!important}
#pause #skillLoadout .slot-pick{grid-template-columns:repeat(4,minmax(0,1fr))!important}
#pause #skillLoadout .slot-pick:has(>button:nth-child(5)){grid-template-columns:repeat(5,minmax(0,1fr))!important}
#pause #skillLoadout button.go{box-sizing:border-box!important;min-width:0!important;width:100%!important;height:auto!important;min-height:108px!important;display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;align-items:center!important;justify-content:initial!important;gap:8px 12px!important;position:relative!important;padding:18px 20px!important;border:9px solid transparent!important;border-image:${url('ramka-okno')} 155 /9px stretch!important;background:#1a1618!important;text-align:left!important;font:700 21px/1.2 Grenze,Georgia,serif!important;white-space:normal!important}
#pause #skillLoadout .slot-tab{grid-template-rows:auto 1fr!important}
#pause #skillLoadout .loadout-key{grid-column:1/-1;grid-row:1;position:static!important;margin:0!important;padding:0!important;display:block;font:14px/1.2 Grenze,Georgia,serif!important;color:#c9b18c;white-space:normal!important;text-align:center}
#pause #skillLoadout .slot-tab .ic{grid-column:1;grid-row:2}
#pause #skillLoadout .loadout-name{grid-column:2;grid-row:2;min-width:0;overflow-wrap:anywhere;text-align:left}
#pause #skillLoadout .empty-name{grid-column:1/-1;text-align:center}
#pause #skillLoadout .ic{position:static!important;float:none!important;margin:0!important;width:48px!important;height:48px!important;align-self:center;transform:none!important}
#pause #skillLoadout .loadout-copy{display:block;min-width:0;overflow-wrap:anywhere}
#pause #skillLoadout .loadout-copy small{display:block!important;position:static!important;margin-top:5px!important;font:15px/1.3 Grenze,Georgia,serif!important;white-space:normal!important}
#pause #skillLoadout .slot-inventory{gap:12px!important}
#pause #skillLoadout button[data-equip=""]{display:flex!important;justify-content:center!important;text-align:center!important}
/* states: nbUiSystem */

@media(max-height:550px){#title .premium-mast{height:76px!important}#title .premium-map .m2-right{height:62px!important}#opts .opsep,#manual .opsep{margin:12px auto!important}#pause #skillLoadout button.go{min-height:86px!important;padding:10px!important;border-width:7px!important;border-image-width:7px!important;grid-template-columns:32px minmax(0,1fr)!important;font-size:15px!important;gap:5px 8px!important}#pause #skillLoadout .ic{width:32px!important;height:32px!important}#pause #skillLoadout .loadout-key{font-size:11px!important}#pause #skillLoadout .loadout-copy small{font-size:12px!important}#pause #skillLoadout .slot-pick,#pause #skillLoadout .slot-inventory{gap:6px!important}}
#title .premium-controls .m2-assist{margin:0!important;gap:8px!important}
#title .premium-controls .tgl{font-size:15px!important;min-height:32px!important;gap:8px}
#title .premium-controls .tgl .sl{width:28px!important;height:28px!important;min-width:28px!important;flex:none}
#title .premium-controls .modesw button{min-height:62px!important}
#title #sFab:after,#title #sArc:after{font-size:15px!important}
@media(max-height:550px){#title .premium-controls{gap:6px!important}#title .premium-controls .m2-assist{gap:4px!important}#title .premium-controls .tgl{font-size:11px!important;min-height:23px!important;gap:5px}#title .premium-controls .tgl .sl{width:20px!important;height:20px!important;min-width:20px!important}#title .premium-controls .modesw button{min-height:32px!important}#title #sFab:after,#title #sArc:after{font-size:12px!important}}
#kap .m2k-row{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;gap:7px!important}
#kap .m2k-row>b,#kap .m2k-row>span,#kap .m2k-row>small{flex:none!important;flex-basis:auto!important}
#kap .m2k-row b{order:1;min-width:0;white-space:normal!important}
#kap .m2k-row .m2k-pips{order:2;position:static!important;float:none!important;align-self:stretch!important;width:100%!important;text-align:left!important}
#kap .m2k-row small{order:3;position:static!important;inset:auto!important;float:none!important;transform:none!important;display:block!important;align-self:stretch!important;width:100%!important;max-width:100%!important;min-width:0!important;white-space:normal!important;text-align:left!important;overflow-wrap:anywhere;line-height:1.3!important}
@media(max-height:550px){#prep .premium-prep-body{grid-template-columns:minmax(0,1fr) 180px!important}#prep .premium-prep-controls{padding:8px!important;gap:9px!important}#prep .premium-difficulty-title{font-size:21px!important;margin:0!important}#prep #diffSw{gap:5px!important}#prep #diffSw .premium-difficulty{height:38px!important;min-height:38px!important;padding:7px 14px!important;font-size:18px!important}#prep #prepBack{width:100px!important;height:38px!important;min-height:38px!important;font-size:17px!important}#prep .premium-prep-controls #diffCap{font-size:12px!important;line-height:1.25!important}#prep .premium-prep-controls .prepassist .tgl{font-size:14px!important;gap:6px!important}#prep .premium-prep-controls .prepassist .sl{width:18px!important;height:18px!important;min-width:18px!important}#prep .premium-prep-controls #prepGo{height:52px!important;min-height:52px!important;font-size:20px!important;padding:10px!important}#prep #prepChar .opt b{font-size:17px!important}#prep #prepChar .opt span{font-size:13px!important;line-height:1.3!important;padding:0 2px 4px}#prep #prepChar .opt{gap:6px!important}#prep #prepPerks .opt,#prep #prepCh .opt,#kap .m2k-row,#prep #prepCurseL .opt{border-width:7px!important;border-image-width:7px!important}#kap .m2k-row{min-height:104px!important;padding:10px 8px 10px 44px!important}#prep #prepPerks .opt{padding-left:54px!important}}
`;corrections.textContent=corrections.textContent.replace(/#prep\b|#kap\b|#title\b|#opts\b|#manual\b|#pause\b/g,m=>'#orient#orient#orient#orient#orient#orient#orient#orient#orient#orient '+m);document.head.append(corrections);
refresh();
})();

applyAccess();
// ===== HUD premium, pauza i oprawa menu (wyglad zaakceptowany przez autora 4.11.2026) =====
// Wylacznie prezentacja. Wartosci pochodza ze stanu gry (pl, S) oraz z dotychczasowych elementow HUD,
// ktore nadal aktualizuje hud(); ich logika sie nie zmienia. Stare elementy wizualne sa ukryte.
// Tryb 2 graczy: lewa kolumna starego HUD-u wraca (jest w niej HUD drugiego gracza), nowe paski znikaja.
// Selektory celowo powtarzaja id: stary arkusz i warstwa menu maja bardzo silne reguly z !important.
const NBH_ASSETS={rama:'assets/ui/96033bd0bf62ef692cc8cc0f6511189e84b519137999108b718f0b25380a217d.webp',obrecz:'assets/ui/5b589d4d73f5e0d632886617fd64d25a19c4938f64a2636bfe802e59a2a70873.webp',ziarno:'assets/ui/6720a59db6893185cce6203616aa7d6e6bc1262e86ef41c8305330de8ed7d4fd.svg',chmury:'assets/tla/8b4dc4093fbac8f92d1a5f85eb5c252f5e9644632ed60ca874e422223141c9cf.webp'};
(()=>{
const scr=$('screen'),hudEl=$('hud'),ash=$('activeSkillHud'),T=(p,e)=>EN?e:p;
const mk=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!==undefined)n.innerHTML=h;return n};
const res=(c,lab)=>`<div class="nbh-res ${c}"><div class="nbh-tr"><i></i></div><div class="nbh-lab"><b>${lab}</b><span></span></div></div>`;
const root=mk('div','nbh',`<section class="nbh-vitals"><div class="nbh-id"><span class="nbh-lv"><span></span></span><strong>${T('Poziom Nocy','Night Level')}</strong></div>`+
 res('nbh-hp',T('ZDROWIE','HEALTH'))+res('nbh-st','STAMINA')+res('nbh-mn',T('MANA','MANA'))+
 `<div class="nbh-xp"><span>${T('DO AWANSU','NEXT LEVEL')}</span><div><i></i></div><span class="nbh-xpv"></span></div>`+
 `<div class="nbh-chal" hidden><small>${T('WYZWANIE NOCY','NIGHT CHALLENGE')}</small><span></span><i></i></div><div class="nbh-more"></div></section>`+
 `<section class="nbh-night"><small></small><strong></strong><span class="nbh-coins"><img alt="" src="${PREMIUM_ICONS['kaplica-purse']}"><b>0</b><small>${T('monet','coins')}</small></span></section>`+
 `<div class="nbh-radar"></div><div class="nbh-hint"></div>`+
 `<section class="nbh-boss" hidden><div class="nbh-bh"><small>${T('WŁADCA NOCY','LORD OF THE NIGHT')}</small><strong></strong><span></span></div><div class="nbh-btr"><i></i></div><div class="nbh-poise"><i></i></div></section>`);
root.id='nbHud';root.hidden=true;hudEl.after(root);
const q=s=>root.querySelector(s),V={lv:q('.nbh-lv span'),hp:q('.nbh-hp'),st:q('.nbh-st'),mn:q('.nbh-mn'),xp:q('.nbh-xp i'),xpv:q('.nbh-xpv'),chal:q('.nbh-chal'),more:q('.nbh-more'),
 ph:q('.nbh-night>small'),clk:q('.nbh-night>strong'),coin:q('.nbh-coins b'),radar:q('.nbh-radar'),hint:q('.nbh-hint'),boss:q('.nbh-boss'),bn:q('.nbh-bh strong'),bp:q('.nbh-bh span'),bf:q('.nbh-btr i'),pf:q('.nbh-poise i')};
V.radar.append($('mini'));ash.dataset.cap=T('AKTYWNE UMIEJĘTNOŚCI','ACTIVE SKILLS');
const setBar=(row,v,mx)=>{row.querySelector('.nbh-tr i').style.width=(Math.max(0,Math.min(1,v/mx))*100).toFixed(2)+'%';row.querySelector('.nbh-lab span').innerHTML=`${Math.max(0,Math.ceil(v))} <i>/ ${Math.round(mx)}</i>`};
// skale: PC liczony od 1280x720, dotyk od 844x390 (jak w makiecie)
let lastScale='';
function scale(){const t=!!coarse,W=innerWidth,H=innerHeight,s=t?Math.min(W/844,H/390):Math.min(W/1280,H/720),v=Math.max(t?.85:.8,Math.min(t?1.5:1.7,s));
 root.classList.toggle('touch',t);ash.classList.toggle('nbh-touch',t);scr.style.setProperty('--hs',v.toFixed(3));
 const b=$('btns'),r=b&&b.getBoundingClientRect(),sr=scr.getBoundingClientRect();if(t&&r&&r.height)scr.style.setProperty('--btns-top',Math.round(sr.bottom-r.top)+'px');lastScale=W+'x'+H+t}
addEventListener('resize',()=>requestAnimationFrame(scale));
// PC: pozioma os listwy bossa pokrywa sie z osia srodkow kol umiejetnosci
let alignT=0;
function alignBoss(){if(coarse||scr.classList.contains('pc-hud')||V.boss.hidden)return;const sk=ash.querySelector('.active-slot'),tr=V.boss.querySelector('.nbh-btr');if(!sk||ash.hidden)return;
 const a=tr.getBoundingClientRect(),b=sk.getBoundingClientRect();if(!a.height||!b.height)return;const cur=parseFloat(getComputedStyle(V.boss).bottom)||0,nb=cur+(a.top+a.height/2)-(b.top+b.height/2);
 if(Math.abs(nb-cur)>.5)V.boss.style.setProperty('--boss-bottom',nb.toFixed(1)+'px')}
let last='',lastB='',mp=null,shown=false;
function home(mpOn){const chal=$('chal');if(mpOn){chal.after($('buffs'));hudEl.append($('chips'))}else V.more.append($('buffs'),$('chips'))}
function upd(){const show=!!S&&!hudEl.hidden;root.hidden=!show;if(!show){shown=false;return}
 if(!shown||lastScale!==innerWidth+'x'+innerHeight+!!coarse){shown=true;scale()}
 const isMp=hudEl.classList.contains('mp2');if(isMp!==mp){mp=isMp;root.classList.toggle('mp2',mp);home(mp)}
 const mx=pl.max||1,hp=Math.max(0,pl.hp),sm=pl.staMax||1,mm=pl.manaMax||SL.mana.max||1,tt=$('time').textContent.trim(),ch=$('chal');
 const key=[S.lvl,Math.ceil(hp),mx,Math.floor(pl.sta),sm,Math.floor(pl.mana||0),mm,S.xp,S.need,S.coins,tt,ch.hidden?'':ch.textContent,PAD.on?1:0].join('|');
 if(key!==last){last=key;V.lv.textContent=S.lvl;setBar(V.hp,hp,mx);setBar(V.st,pl.sta||0,sm);setBar(V.mn,pl.mana||0,mm);root.classList.toggle('low',hp<mx*.3);{const fq=!!SETT.flash;V.hp.classList.toggle('q4',fq&&hp>0&&hp<=mx*.25);V.st.classList.toggle('q4',fq&&(pl.sta||0)<=sm*.25);V.mn.classList.toggle('q4',fq&&(pl.mana||0)<=mm*.25)}
  const xr=Math.max(0,Math.min(1,S.xp/(S.need||1)));V.xp.style.width=(xr*100).toFixed(1)+'%';V.xpv.textContent=Math.floor(xr*100)+'%';V.coin.textContent=S.coins;
  const m=tt.match(/^(.*?)\s+(\d+:\d\d)$/);if(m){V.ph.textContent=m[1];V.clk.textContent=m[2];V.clk.classList.remove('txt')}
  else{V.ph.textContent=S.dg?T('Krypta','Crypt'):S.stage==='break'?T('Przerwa','Break'):S.stage==='collector'?T('Zagrożenie','Threat'):T('Finał Nocy','Night\'s end');V.clk.textContent=tt.replace(/^[^·]*·\s*/,'').replace(/!$/,'');V.clk.classList.add('txt')}
  V.chal.hidden=ch.hidden;if(!ch.hidden){const t=ch.textContent,i=t.indexOf(': ');V.chal.querySelector('span').textContent=i>0?t.slice(0,i):t;V.chal.querySelector('i').textContent=i>0?t.slice(i+2):'';V.chal.classList.toggle('done',ch.classList.contains('done'))}
  V.hint.innerHTML='';V.hint.hidden=true}
 V.st.classList.toggle('flash',$('stam').classList.contains('flash'));V.mn.classList.toggle('flash',$('mana').classList.contains('flash'));
 const bh=$('boss').hidden;if(V.boss.hidden!==bh){V.boss.hidden=bh;root.classList.toggle('bossfight',!bh);alignT=0}
 if(!bh){const w=parseFloat($('bossHp').style.width)||0,bk=$('bossName').textContent.trim()+'|'+w.toFixed(1)+'|'+$('bossPoise').style.width+'|'+$('bossPoiseB').classList.contains('brk');
  if(bk!==lastB){lastB=bk;V.bn.textContent=$('bossName').textContent.trim();V.bp.textContent=Math.ceil(w)+'%';V.bf.style.width=w+'%';V.pf.style.width=$('bossPoise').style.width;V.boss.classList.toggle('brk',$('bossPoiseB').classList.contains('brk'))}
  if((alignT-=1/60)<=0){alignT=.5;requestAnimationFrame(alignBoss)}}}
const hud0=hud;hud=function(){hud0();upd()};
// ikony umiejetnosci z nowej oprawy takze na pasku w trakcie Nocy
const OR='#orient'.repeat(12);let icoCss='';for(const [key,src] of Object.entries(PREMIUM_ICONS)){if(!key.startsWith('skille-'))continue;const k=key.slice(7);icoCss+=`:is(${OR} #activeSkillHud,${OR} #chips,${OR} .mpk,body .mpk) [data-premium-skill="${k}"]{background:url('${src}') center/contain no-repeat!important;mask:none!important;-webkit-mask:none!important}:is(${OR} #activeSkillHud,${OR} #chips,${OR} .mpk,body .mpk) [data-premium-skill="${k}"]:before,:is(${OR} #activeSkillHud,${OR} #chips,${OR} .mpk,body .mpk) [data-premium-skill="${k}"]:after{content:none!important}`}
const A_=NBH_ASSETS,AS=OR+' #activeSkillHud',NB=OR+' #nbHud',SC='calc(var(--hs,1)*';
const style=mk('style','nbh-style');style.textContent=icoCss+`
${OR} #hud #xpbar,${OR} #hud #miniF,${OR} #hud .hud-row .right,${OR} #hud:not(.mp2) #lvlTag,${OR} #hud:not(.mp2) #hpbar,${OR} #hud:not(.mp2) #stam,${OR} #hud:not(.mp2) #mana,${OR} #hud #chal,${OR} #boss{display:none!important}
${NB}{position:absolute;inset:0;pointer-events:none;color:#ecdec5;font-family:Grenze,Georgia,serif;font-size:16px}
${NB}[hidden],${NB} [hidden]{display:none!important}
${NB}.mp2 .nbh-vitals{display:none}
${NB} .nbh-vitals{position:absolute;left:17px;top:17px;width:248px;padding:5px 8px 7px;background:linear-gradient(90deg,#08090ba6,transparent);text-shadow:0 1px 3px #000;transform:scale(var(--hs,1));transform-origin:0 0}
${NB} .nbh-id{display:flex;align-items:center;gap:7px;height:28px;margin-bottom:5px}
${NB} .nbh-id strong{font-size:13px;font-weight:500}
${NB} .nbh-lv{display:flex;align-items:center;justify-content:center;width:28px;height:30px;flex:none;border:1px solid #b19665;background:linear-gradient(135deg,#675848 0,#211e1d 42%,#151416 65%,#44382d);box-shadow:inset 0 0 0 2px #141315;clip-path:polygon(6px 0,calc(100% - 6px) 0,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0 calc(100% - 6px),0 6px);font:700 21px/1 Grenze,Georgia,serif;font-variant-numeric:tabular-nums}
${NB} .nbh-lv span{display:block;line-height:1;transform:translateY(-1px)}
${NB} .nbh-res{position:relative;margin-top:3px}
${NB} .nbh-tr{position:relative;height:25px;padding:6px 10%}
${NB} .nbh-hp .nbh-tr{height:31px}
${NB} .nbh-tr:before{content:'';position:absolute;inset:6px 10%;background:#07080c;z-index:0}
${NB} .nbh-tr:after{content:'';position:absolute;inset:0;background:url('${A_.rama}') center/100% 225% no-repeat,linear-gradient(90deg,transparent calc(25% - 1px),#0000008c calc(25% - 1px),#0000008c 25%,#ffe6aa30 25%,#ffe6aa30 calc(25% + 1px),transparent calc(25% + 1px),transparent calc(50% - 1px),#0000008c calc(50% - 1px),#0000008c 50%,#ffe6aa30 50%,#ffe6aa30 calc(50% + 1px),transparent calc(50% + 1px),transparent calc(75% - 1px),#0000008c calc(75% - 1px),#0000008c 75%,#ffe6aa30 75%,#ffe6aa30 calc(75% + 1px),transparent calc(75% + 1px)) center/80% calc(100% - 12px) no-repeat;z-index:3;pointer-events:none}
${NB} .nbh-tr i{position:relative;z-index:1;display:block;height:100%;max-width:100%;overflow:hidden;border-radius:1px;box-shadow:inset 0 1px 2px #ffbed766,inset 0 -3px 3px #0009,0 0 3px #57081e66;transition:width .12s linear}
${NB} .nbh-tr i:before,${NB} .nbh-btr i:before{content:'';position:absolute;inset:0;background:url('${A_.ziarno}') center/192px 48px repeat;opacity:.55;mix-blend-mode:soft-light}
${NB} .nbh-tr i:after,${NB} .nbh-btr i:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#ffffff38,transparent 28%,transparent 75%,#0006)}
${NB} .nbh-hp .nbh-tr i,${NB} .nbh-btr i{background:radial-gradient(ellipse at 23% 30%,#ef285170,transparent 38%),radial-gradient(ellipse at 70% 80%,#30000cbb,transparent 54%),linear-gradient(#dd1636,#9c0622 25%,#680318 72%,#b70b2a)}
${NB} .nbh-st .nbh-tr i{background:radial-gradient(ellipse at 25% 30%,#fff1a455,transparent 45%),linear-gradient(#d9b76b,#a3873f 30%,#69501c 80%,#b29548)}
${NB} .nbh-mn .nbh-tr i{background:radial-gradient(ellipse at 30% 25%,#5baeff8c,transparent 50%),radial-gradient(ellipse at 80% 80%,#02083fc9,transparent 60%),linear-gradient(#2475ef,#1146b6 30%,#081c77 78%,#2064ce)}
${NB} .nbh-lab{position:absolute;top:0;bottom:0;left:12%;right:12%;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:6px;font-variant-numeric:tabular-nums;text-shadow:0 1px 2px #000,0 0 4px #000}
${NB} .nbh-lab b{font-size:8px;font-weight:500;letter-spacing:1px;color:#f0dfc4}
${NB} .nbh-lab span{font-size:12px;font-weight:700;line-height:1}
${NB} .nbh-lab span i{font-weight:400;font-style:normal;color:#ded0bc}
${NB}.low .nbh-hp .nbh-tr{filter:drop-shadow(0 0 6px #eb3917aa)}
${NB}.low .nbh-hp .nbh-lab span{color:#ffb2a0}
${NB} .nbh-res.flash .nbh-tr{animation:nbhFlash .35s steps(2) infinite}
@keyframes nbhFlash{50%{filter:brightness(1.7) drop-shadow(0 0 5px #ff6b3d)}}
${NB} .nbh-res.q4 .nbh-tr i{animation:nbhQ4 1.1s ease-in-out infinite}@keyframes nbhQ4{0%,100%{opacity:1}50%{opacity:.6}}@media (prefers-reduced-motion:reduce){${NB} .nbh-res.q4 .nbh-tr i{animation:none}}
${NB} .nbh-xp{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:8px;color:#ad9f8a;letter-spacing:.6px}
${NB} .nbh-xp>div{flex:1;position:relative;height:8px;border:2px solid #a58b5a;background:#0a0a0c;box-shadow:inset 0 0 0 1px #151317;transform:skewX(-12deg)}
${NB} .nbh-xp i{display:block;position:relative;height:100%;overflow:hidden;background:linear-gradient(#f4e1a5,#c2a35c 45%,#8b713b)}
${NB} .nbh-chal{margin:12px 0 0 2px;padding-left:10px;border-left:2px solid #a27c48;max-width:240px}
${NB} .nbh-chal small{display:block;font-size:9px;letter-spacing:1.6px;color:#ceb68f}
${NB} .nbh-chal span{display:block;font-size:19px;line-height:1.15}
${NB} .nbh-chal i{display:block;font-size:13px;color:#c4b89f;font-style:normal}
${NB} .nbh-chal.done span:before{content:'✓ ';color:#d8c27a}
${NB} .nbh-more #buffs{position:static!important;margin:8px 0 0 2px!important;font-size:12px!important;line-height:1.35;max-width:240px}
${NB} .nbh-more #chips{position:static!important;margin:6px 0 0!important;flex-wrap:wrap}
${NB} .nbh-night{position:absolute;top:34px;right:calc(24px + 104px*var(--hs,1));text-align:right;transform:scale(var(--hs,1));transform-origin:100% 0;text-shadow:-1px 0 #050609,1px 0 #050609,0 -1px #050609,0 1px #050609,0 2px 3px #000}
${NB} .nbh-night>small{display:block;font-size:8px;letter-spacing:.8px;color:#b7a88d;text-transform:uppercase}
${NB} .nbh-night>strong{display:block;font-size:20px;font-weight:500;letter-spacing:.7px;line-height:1.05;font-variant-numeric:tabular-nums}
${NB} .nbh-night>strong.txt{font-size:15px;letter-spacing:.3px;max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${NB} .nbh-coins{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:5px;font-size:13px}
${NB} .nbh-coins img{width:14px;height:14px;object-fit:contain;filter:drop-shadow(0 1px 1px #000)}
${NB} .nbh-coins small{font-size:8px;color:#b7a88d}
${NB} .nbh-radar{position:absolute;top:20px;right:24px;width:92px;height:92px;transform:scale(var(--hs,1));transform-origin:100% 0;isolation:isolate}
${NB} .nbh-radar:after{content:'';position:absolute;inset:-3%;background:url('${A_.obrecz}') center/contain no-repeat;z-index:2;filter:drop-shadow(0 2px 3px #0009)}
${NB} .nbh-radar #mini{position:absolute!important;inset:7%!important;left:7%!important;top:7%!important;right:auto!important;width:86%!important;height:86%!important;border-radius:50%!important;margin:0!important;transform:none!important;background:#0b0c10!important;z-index:1}
${NB} .nbh-hint{position:absolute;right:25px;bottom:22px;color:#d0c0a4;font-size:13px;text-shadow:0 1px 3px #000;transform:scale(var(--hs,1));transform-origin:100% 100%}
${NB} .nbh-hint kbd{font:10px Georgia,serif;border:0;border-bottom:1px solid #958161;background:none;padding:2px;color:#e8d8bb}
${NB} .nbh-hint span{padding:0 7px;color:#9b7d50}
${NB}.bossfight .nbh-hint{bottom:100px}
${NB}.touch .nbh-hint{display:none}
${NB} .nbh-boss{position:absolute;left:50%;bottom:var(--boss-bottom,10px);width:min(530px,calc(100% - 650px));min-width:330px;padding:8px 12px;transform:translateX(-50%) scale(var(--hs,1));transform-origin:50% 100%;background:linear-gradient(90deg,transparent,#0c0b10bb 15%,#0c0b10bb 85%,transparent);text-shadow:0 2px 3px #000}
${NB} .nbh-bh{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:5px}
${NB} .nbh-bh small{font-size:9px;letter-spacing:1.5px;color:#b9a181;white-space:nowrap}
${NB} .nbh-bh strong{font-size:22px;letter-spacing:4px;font-weight:500;text-align:center;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}
${NB} .nbh-bh span{font-size:13px;font-variant-numeric:tabular-nums}
${NB} .nbh-btr{position:relative;height:25px;padding:5px 10%}
${NB} .nbh-btr:before{content:'';position:absolute;inset:5px 10%;background:#07080c;z-index:0}
${NB} .nbh-btr:after{content:'';position:absolute;inset:0;background:url('${A_.rama}') center/100% 225% no-repeat;z-index:2}
${NB} .nbh-btr i{position:relative;z-index:1;display:block;height:100%;overflow:hidden;box-shadow:inset 0 1px 2px #ffbfcf55,inset 0 -2px 3px #0009;transition:width .15s linear}
${NB} .nbh-poise{height:3px;background:#3e3933;margin:5px 40px 0}
${NB} .nbh-poise i{display:block;height:100%;background:#c2a771}
${NB} .nbh-boss.brk .nbh-poise i{background:#f0e2b0;box-shadow:0 0 6px #ffd27a}
${AS}{left:22px!important;right:auto!important;top:auto!important;bottom:20px!important;transform:scale(var(--hs,1))!important;transform-origin:0 100%!important;gap:9px!important;padding:12px 5px 18px!important;background:linear-gradient(90deg,#0e0f1280,transparent)!important;border:0!important;align-items:flex-start}
${AS}[hidden]{display:none!important}
${AS}:after{content:attr(data-cap);position:absolute;left:5px;bottom:2px;font:7px Grenze,Georgia,serif;letter-spacing:.8px;color:#bba989;text-shadow:0 1px 2px #000;white-space:nowrap}
${AS} .active-slot{position:relative!important;width:48px!important;height:48px!important;min-height:0!important;padding:7px!important;border-radius:50%!important;border:1px solid #b09165!important;border-image:none!important;background:radial-gradient(circle at 30% 25%,#39312be8,#151419f0)!important;box-shadow:inset 0 0 0 2px #101115ad,0 2px 5px #0007!important;overflow:visible!important;display:flex!important;align-items:center;justify-content:center}
${AS} .active-slot .ic{width:32px!important;height:32px!important;margin:0!important;border-radius:50%}
${AS} .active-slot kbd{position:absolute;left:50%;top:-9px;transform:translateX(-50%);min-width:17px;padding:1px 3px;border:1px solid #897352!important;border-radius:5px!important;background:#171619!important;font:8px/1.3 Georgia,serif!important;color:#f1dfbc!important;text-align:center;white-space:nowrap;z-index:3}
${AS} .active-slot small{position:absolute;left:50%;bottom:-10px;transform:translateX(-50%);min-width:29px;padding:1px 3px;border:1px solid #79603e88;border-radius:7px;background:#101115db;font:9px/1.2 Grenze,Georgia,serif!important;text-align:center;white-space:nowrap;color:#87c3df!important;z-index:3}
${AS} .active-slot small.res-stamina{color:#e1bd6d!important}
${AS} .active-slot .slot-cd{position:absolute;inset:4px;display:flex;align-items:center;justify-content:center;white-space:nowrap;border-radius:50%;background:radial-gradient(circle,#101015c9 58%,#cc965a66 62%,#101015c9 66%);box-shadow:inset 0 0 0 2px #d4955744;font:700 15px Grenze,Georgia,serif;color:#fff0d7;text-shadow:0 1px 5px #000;z-index:2}
${AS} .active-slot .slot-cd:after{content:' s';font-size:.6em;margin-left:1px}
${AS} .active-slot.empty{opacity:.5}
${AS} .active-slot.empty>span{color:#8d7f6b}
${AS}.lt-held .active-slot{border-color:#e2a258!important;box-shadow:inset 0 0 0 2px #101115ad,0 0 8px #e2a25877!important}
${AS}.nbh-touch:not([hidden]){left:0!important;top:0!important;right:0!important;bottom:0!important;transform:none!important;padding:0!important;background:none!important;display:block!important;pointer-events:none!important}
${AS}.nbh-touch:after{content:none}
${AS}.nbh-touch .active-slot{position:absolute!important;pointer-events:auto;width:56px!important;height:56px!important;transform:scale(var(--hs,1));box-shadow:inset 0 0 0 3px #1011158c,0 3px 8px #0006!important}
${AS}.nbh-touch .active-slot .ic{width:40px!important;height:40px!important}
${AS}.nbh-touch .active-slot:nth-child(1){left:${SC}24px);bottom:${SC}132px)}
${AS}.nbh-touch .active-slot:nth-child(2){left:${SC}90px);bottom:${SC}132px)}
${AS}.nbh-touch .active-slot:nth-child(3){right:${SC}84px);bottom:calc(var(--btns-top,170px) + 26px)}
${AS}.nbh-touch .active-slot:nth-child(4){right:${SC}18px);bottom:calc(var(--btns-top,170px) + 26px)}
${AS}.nbh-touch .active-slot:nth-child(5){right:${SC}150px);bottom:calc(var(--btns-top,170px) + 26px)}
${AS}.nbh-touch .active-slot:nth-child(6){left:${SC}156px);bottom:${SC}132px)}
${NB}.touch .nbh-vitals{left:8px;top:8px;width:205px;padding:3px 5px 5px}
${NB}.touch .nbh-id{height:24px}
${NB}.touch .nbh-lv{width:24px;height:26px;font-size:18px}
${NB}.touch .nbh-tr{height:22px;padding:5px 10%}
${NB}.touch .nbh-hp .nbh-tr{height:26px}
${NB}.touch .nbh-tr:before{inset:5px 10%}
${NB}.touch .nbh-res{margin-top:2px}
${NB}.touch .nbh-lab b{font-size:7px}
${NB}.touch .nbh-lab span{font-size:11px}
${NB}.touch .nbh-xp{font-size:7px}
${NB}.touch .nbh-xp>div{height:6px;border-width:1px}
${NB}.touch .nbh-chal{margin-top:8px;max-width:170px}
${NB}.touch .nbh-chal small{font-size:8px}
${NB}.touch .nbh-chal span{font-size:15px}
${NB}.touch .nbh-chal i{font-size:10px}
${NB}.touch .nbh-more #buffs{font-size:10px!important;max-width:180px}
${NB}.touch .nbh-radar{top:12px;right:12px;width:70px;height:70px}
${NB}.touch .nbh-night{top:20px;right:calc(12px + 80px*var(--hs,1))}
${NB}.touch .nbh-night>strong{font-size:18px;letter-spacing:.5px}
${NB}.touch .nbh-night>strong.txt{font-size:13px;max-width:150px}
${NB}.touch .nbh-night>small{font-size:7px}
${NB}.touch .nbh-coins{font-size:11px;gap:5px;margin-top:4px}
${NB}.touch .nbh-coins small{font-size:7px}
${NB}.touch .nbh-coins img{width:11px;height:11px}
${NB}.touch .nbh-boss{width:40%;min-width:0;bottom:10px;padding:4px 8px}
${NB}.touch .nbh-bh strong{font-size:16px;letter-spacing:3px}
${NB}.touch .nbh-bh small{font-size:7px}
${NB}.touch .nbh-bh span{font-size:10px}
${NB}.touch .nbh-btr{height:20px;padding:4px 10%}
${NB}.touch .nbh-btr:before{inset:4px 10%}
`;
document.head.append(style);
})();
// ===== Komunikaty: pasek #msg bez ramy (fabula / ostrzezenie), +monety przy liczniku, dziennik Nocy w pauzie =====
// Dziennik: historia biezacej Nocy tylko w pamieci (czyszczona przy nowym S), bez zmian w zapisie gry.
const NBJ={S:null,log:[],place(){const n=$('start'+CH);return n&&CH<=6?[...n.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('').trim():''}};
(()=>{
const T=(p,e)=>EN?e:p,msg=$('msg'),OR='#orient'.repeat(12),M=OR+' #screen:not(.port) #msg',gain=document.createElement('span');
gain.className='nbh-gain';gain.setAttribute('aria-live','polite');const night=document.querySelector('#nbHud .nbh-night');if(night)night.append(gain);
const say0=say;
say=function(t,kind='event'){
 const play=!!(S&&S.phase==='play');
 if(!play){delete msg.dataset.k;return say0(t,kind)}
 if(t&&kind!=='hint'){if(NBJ.S!==S){NBJ.S=S;NBJ.log=[]}if(!(NBJ.log[0]&&NBJ.log[0].text===t)){NBJ.log.unshift({text:String(t),kind:kind==='boss'?'boss':'story',place:NBJ.place()});if(NBJ.log.length>120)NBJ.log.length=120}}
 // ostrzezenie ma pierwszenstwo: fabula w trakcie ostrzezenia trafia tylko do dziennika
 if(kind==='story'&&S.banner&&S.banner.kind==='boss'&&S.banner.t>0)return;
 say0(t,kind);
 if(kind==='boss'){const q=S.noticeQueue||[],i=q.findIndex(n=>n.kind==='boss'&&n.text===t);if(i>0){const [x]=q.splice(i,1);q.unshift(x)}for(let j=q.length-1;j>=0;j--)if(q[j].kind==='story')q.splice(j,1);if(S.banner&&S.banner.kind!=='boss'&&S.banner.t>0)S.banner.t=0}
};
let gS=null,gC=0,gAcc=0,gT=0;
const bt0=bannerTick;
bannerTick=function(dt){
 bt0(dt);
 const b=S&&S.banner;
 if(b){const k=b.kind==='boss'?T('NIEBEZPIECZEŃSTWO','DANGER'):b.kind==='hint'?'':NBJ.place();if(msg.dataset.k!==k)msg.dataset.k=k}
 if(!S||S.phase!=='play'){gS=null;return}
 if(gS!==S){gS=S;gC=S.coins;gAcc=0;gT=0;gain.classList.remove('on')}
 const hold=!!(S.paused||S.choosing||S.shop||S.dialog||S.intro||S.witChoice);
 if(S.coins>gC){gAcc+=S.coins-gC;gain.textContent='+'+gAcc+' '+T('monet','coins');gain.classList.add('on');gT=1.8}
 gC=S.coins;
 if(gT>0&&!hold){gT-=dt;if(gT<=0){gain.classList.remove('on');gAcc=0}}
};
const st=document.createElement('style');st.className='nbmsg-style';
st.textContent=`
${M}{position:absolute!important;left:50%!important;right:auto!important;top:calc(24px*var(--hs,1))!important;transform:translate(-50%,calc(-6px*var(--hs,1)))!important;width:calc(100% - 650px*var(--hs,1))!important;max-width:calc(650px*var(--hs,1))!important;box-sizing:border-box!important;padding:calc(13px*var(--hs,1)) calc(20px*var(--hs,1)) calc(16px*var(--hs,1))!important;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;display:flex;flex-direction:column;align-items:center;text-align:center;font:500 calc(20px*var(--hs,1))/1.3 Grenze,Georgia,serif!important;color:#e8ddc8!important;text-shadow:-1px 0 #09090b,1px 0 #09090b,0 -1px #09090b,0 2px 4px #000!important;text-wrap:balance;isolation:isolate;opacity:0;pointer-events:none;transition:opacity .4s ease,transform .4s ease!important}
${M}.on{opacity:1;transform:translate(-50%,0)!important}
${M}:before{content:''!important;position:absolute!important;inset:calc(-12px*var(--hs,1)) calc(-30px*var(--hs,1))!important;z-index:-1;border:0!important;border-image:none!important;background:radial-gradient(ellipse,#08090be0 0%,#08090b9c 45%,transparent 72%)!important;opacity:1!important}
${M}[data-k]:not([data-k='']):after{content:attr(data-k);order:-1;display:block;color:#bca176;font-size:calc(9px*var(--hs,1));letter-spacing:calc(3px*var(--hs,1));margin-bottom:calc(5px*var(--hs,1));text-transform:uppercase;text-shadow:0 1px 3px #000}
${M}.boss{color:#f4d5ad!important;font-size:calc(23px*var(--hs,1))!important}
${M}.boss:before{background:radial-gradient(ellipse,#30110feb,#08090ba8 48%,transparent 73%)!important}
${M}.boss[data-k]:after{color:#de9760}
${OR} #screen.nbm-t:not(.port) #msg{top:calc(12px*var(--hs,1))!important;width:calc(100% - 450px*var(--hs,1))!important;max-width:calc(410px*var(--hs,1))!important;padding:calc(8px*var(--hs,1)) calc(10px*var(--hs,1))!important;font-size:calc(16px*var(--hs,1))!important;line-height:1.25!important}
${OR} #screen.nbm-t:not(.port) #msg.boss{font-size:calc(18px*var(--hs,1))!important}
${OR} #screen.nbm-t:not(.port) #msg[data-k]:after{font-size:calc(7px*var(--hs,1));letter-spacing:calc(2px*var(--hs,1))}
${OR} #nbHud .nbh-gain{position:absolute;right:0;top:100%;margin-top:3px;white-space:nowrap;font-size:13px;color:#edc477;text-shadow:0 2px 4px #000;opacity:0;transform:translateY(4px);transition:opacity .25s,transform .6s;pointer-events:none}
${OR} #nbHud .nbh-gain.on{opacity:1;transform:none}
${OR} #nbHud.touch .nbh-gain{font-size:11px}
@media(prefers-reduced-motion:reduce){${M},${OR} #nbHud .nbh-gain{transition:none!important}}`;
document.head.append(st);
const scr=$('screen'),sync=()=>scr.classList.toggle('nbm-t',!!coarse);sync();addEventListener('resize',sync);
})();
// ===== Pauza: zakladki Umiejetnosci / Sterowanie / Audio; istniejace kontrolki i ich obsluga zostaja =====
(()=>{
const pz=$('pause'),T=(p,e)=>EN?e:p,mk=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!==undefined)n.innerHTML=h;return n};
const pbox=pz.querySelector('.pbox'),load=$('skillLoadout'),keys=$('pauseKeys'),row=pz.querySelector('.btnrow'),head=pz.querySelector('.premium-pause-title')||pz.querySelector('.pauseh'),oldBody=pz.querySelector('.premium-pause-body');
const mus=pbox.querySelector('.musSl'),sfx=pbox.querySelector('.sfxSl'),fts=pbox.querySelector('.ftsSl'),dmg=pbox.querySelector('.dmgTgl');
const lab=i=>i.closest('label');
pz.classList.add('nbp');
const top=mk('header','nbp-head'),sub=mk('span','nbp-sub'),wrap=mk('div','nbp-layout'),nav=mk('nav','nbp-nav'),panel=mk('section','nbp-panel');
top.append(head,sub);nav.setAttribute('aria-label',T('Zakładki pauzy','Pause tabs'));
const TABS=[['skills',T('Umiejętności','Skills')],['controls',T('Sterowanie','Controls')],['audio','Audio'],['gfx',T('Grafika','Graphics')],['journal',T('Dziennik','Journal')],['map',T('Mapa','Map')]];
const panes={};
for(const [k,n] of TABS){const b=mk('button','nbp-tab',n);b.type='button';b.dataset.nbp=k;b.setAttribute('aria-pressed','false');nav.append(b);const d=mk('div','nbp-pane');d.dataset.pane=k;d.hidden=true;panes[k]=d;panel.append(d)}
nav.append(row);
panes.skills.append(load);panes.controls.append(keys);
const card=(inp,name,desc)=>{const a=mk('article','nbp-audio',`<div class="nbp-al"><span>${name}</span><output>0<span>%</span></output></div><p>${desc}</p>`);a.append(lab(inp));a.append(mk('div','nbp-scale',`<span>${T('Wycisz','Mute')}</span><span>100%</span>`));return a};
const aud=mk('div','nbp-audiogrid');
aud.append(mk('div','nbp-ah',`<small>${T('USTAWIENIA DŹWIĘKU','SOUND SETTINGS')}</small><h2>Audio</h2><p>${T('Dopasuj muzykę i odgłosy walki.','Adjust the music and the sounds of combat.')}</p>`),
 card(mus,T('Muzyka','Music'),T('Muzyka świata i walk z bossami.','Music of the world and boss fights.')),
 card(sfx,T('Efekty','Effects'),T('Ciosy, umiejętności i dźwięki otoczenia.','Blows, skills and ambient sounds.')));
const more=mk('article','nbp-audio nbp-more',`<div class="nbp-al"><span>${T('Napisy','Text')}</span></div>`);more.append(lab(fts),lab(dmg));aud.append(more);
panes.audio.append(aud);pbox.remove();
const jr=mk('div','nbp-journal');panes.journal.append(jr);
// 9.11.2026: pełna mapa rozdziału w pauzie (odkryte tereny, kapliczki, ogniska, kupiec, boss, zapiska, gracz)
const mp=mk('div','nbp-map',`<small>${T('PAUZA · MAPA','PAUSE · MAP')}</small><h2>${T('Mapa rozdziału','Act map')}</h2><canvas width="624" height="546"></canvas><ul class="nbp-leg"><li><i style="background:#fff"></i>${T('Ty','You')}</li><li><i style="background:#7fd0ff"></i>${T('Kapliczka','Shrine')}</li><li><i style="background:#ff8a2a"></i>${T('Ognisko','Campfire')}</li><li><i style="background:#e0b84a"></i>${T('Kupiec','Merchant')}</li><li><i style="background:#ff2a2a"></i>Boss</li><li><i style="background:#f3d38a;border-radius:2px"></i>${T('Zapiska','Note')}</li></ul>`);panes.map.append(mp);
function drawPauseMap(){const c=mp.querySelector('canvas');c.width=MW*6;c.height=MH*6;const g=c.getContext('2d'),k=6;g.imageSmoothingEnabled=false;g.fillStyle='#050407';g.fillRect(0,0,c.width,c.height);if(!S||!W||!W.mini)return;
 g.drawImage(W.mini,0,0,MW*k,MH*k);g.globalAlpha=.82;g.drawImage(MINI.fog,0,0,MW*k,MH*k);g.globalAlpha=1;
 const dot=(x,y,r,col,ring)=>{g.fillStyle=col;g.beginPath();g.arc(x*k,y*k,r,0,6.2832);g.fill();if(ring){g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.arc(x*k,y*k,r+5,0,6.2832);g.stroke()}};
 for(const p of (W.PROPS||[]))if(p.fire)dot(p.x,p.y,3.5,'#ff8a2a');
 for(const s of (SHRINES||[]))dot(s.x/16,s.y/16,5,'#7fd0ff',1);
 const M=S.merchant&&S.merchant.state==='here'?S.merchant:null;if(M)dot(M.x/16,M.y/16,6,'#e0b84a',1);
 if(S.note&&!S.note.got){g.fillStyle='#f3d38a';g.fillRect(S.note.x/16*k-5,S.note.y/16*k-4,10,8);g.strokeStyle='#6a4a2a';g.strokeRect(S.note.x/16*k-5,S.note.y/16*k-4,10,8)}
 for(const e of S.enemies)if(!e.dead&&(bossBar(e)||e.hunt))dot(e.x/16,e.y/16,7,e.hunt?'#ffd04a':'#ff2a2a',1);
 for(const p of [pl2,pl])if(p&&!p.dead){dot(p.x/16,p.y/16,9,'rgba(255,255,255,.25)');dot(p.x/16,p.y/16,5,p===pl?'#ffffff':'#9ad0ff')}}
function journal(){const L=NBJ.S===S?NBJ.log:[];jr.innerHTML=`<small>${STORYMODE?T('PAUZA · FABUŁA','PAUSE · STORY'):T('PAUZA · ARCADE','PAUSE · ARCADE')}</small><h2>${T('Dziennik Nocy','Night Journal')}</h2><p class="nbp-jp"></p><ol></ol>`;jr.querySelector('.nbp-jp').textContent=NBJ.place();const ol=jr.querySelector('ol');if(!L.length){const li=mk('li','');li.textContent=T('W tej Nocy nie ma jeszcze wiadomości.','No messages yet tonight.');ol.append(li)}for(const it of L){const li=mk('li',it.kind==='boss'?'warn':''),sm=mk('small');sm.textContent=it.kind==='boss'?T('OSTRZEŻENIE','WARNING'):(it.place||'');li.append(sm,document.createTextNode(it.text));ol.append(li)}}
wrap.append(nav,panel);pz.prepend(top);top.after(wrap);if(oldBody&&!oldBody.children.length)oldBody.remove();
// trener (tryb testera) wstawia sie za #pauseKeys; trzymamy go w zakladce Umiejetnosci
new MutationObserver(()=>{const t=$('trnBox');if(t&&t.parentElement!==panes.skills)panes.skills.append(t)}).observe(panes.controls,{childList:true});
const pct=i=>Math.round((+i.value-(+i.min||0))/((+i.max||100)-(+i.min||0))*100);
function outs(){for(const a of aud.querySelectorAll('.nbp-audio:not(.nbp-more)')){const i=a.querySelector('input[type=range]');a.querySelector('output').innerHTML=pct(i)+'<span>%</span>';i.setAttribute('aria-valuetext',pct(i)+'%')}}
for(const i of [mus,sfx])i.addEventListener('input',outs);
let tab='skills';
function show(k){tab=k;for(const b of nav.querySelectorAll('.nbp-tab'))b.setAttribute('aria-pressed',String(b.dataset.nbp===k));for(const [n,d] of Object.entries(panes))d.hidden=n!==k;if(k==='audio')outs();if(k==='journal')journal();if(k==='map')drawPauseMap()}
nav.addEventListener('click',e=>{const b=e.target.closest('.nbp-tab');if(b)show(b.dataset.nbp)});
new MutationObserver(()=>{if(pz.hidden)return;
 const nm=$('start'+CH),t=nm&&CH<=6?[...nm.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim():'';sub.textContent=t;
 show(load.hidden||!(S&&S.sk&&ACTIVE_SLASHER.some(k=>S.sk[k]))?'controls':'skills');outs();// bez żadnej aktywnej umiejętności pauza zaczyna od Sterowania
 if(!keys.querySelector('.stab.on'))pauseSub(coarse?'touch':PAD.on?'pad':'kb')}).observe(pz,{attributes:true,attributeFilter:['hidden']});
show('skills');
const R=PREMIUM_ASSETS,P='#orient'.repeat(12)+' #pause.nbp',st=mk('style','nbp-style');
st.textContent=`
${P}:not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:14px!important;padding:20px 3vw 18px!important;overflow:hidden!important}
${P} .nbp-head{display:flex;align-items:baseline;gap:22px;flex:none;margin-left:max(0px,calc(50% - 760px))}
${P} .nbp-head .premium-pause-title{margin:0;flex:none;font:600 40px Grenze,Georgia,serif;color:#eadbc0}
${P} .nbp-sub{font-size:18px;color:#b6a58a}
${P} .nbp-layout{flex:1 1 0;min-height:0;display:grid;grid-template-columns:210px minmax(0,1fr);gap:24px;width:100%;max-width:1520px;margin:0 auto}
${P} .nbp-nav{display:flex;flex-direction:column;gap:12px;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-width:none}
${P} .nbp-nav::-webkit-scrollbar{display:none}
${P} .nbp-nav>*{flex:none}
${P} .nbp-nav button{touch-action:pan-y}
${P} .nbp-map{display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;min-height:0;text-align:center}
${P} .nbp-map small{color:#bda47b;letter-spacing:.18em;font-size:12px}
${P} .nbp-map h2{margin:0;font:600 30px Grenze,Georgia,serif;color:#eadbc0}
${P} .nbp-map canvas{flex:1 1 auto;min-height:0;max-width:100%;max-height:100%;aspect-ratio:104/91;width:auto;height:auto;image-rendering:pixelated;border:1px solid #5a4a36;box-shadow:0 0 0 3px #0b0907,0 8px 24px rgba(0,0,0,.6)}
${P} .nbp-leg{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px;margin:0;padding:0;list-style:none;color:#d8cfb8;font:15px Georgia,serif}
${P} .nbp-leg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
${P} .nbp-tab{font:600 21px Grenze,Georgia,serif;color:#eadbc0;min-height:62px;padding:14px 22px;border:0;background:transparent url('${R['przycisk-zwykly']}') center/100% 100% no-repeat;text-shadow:0 2px 3px #000;cursor:pointer}
/* states: nbUiSystem */

/* states: nbUiSystem */

${P} .nbp-nav .btnrow{display:flex;flex-direction:column;gap:10px;margin-top:auto!important;padding:0!important}
${P} .nbp-nav .btnrow button{width:100%!important;margin:0!important;min-height:56px!important;font:600 18px Grenze,Georgia,serif!important;text-align:center!important;justify-content:center!important}
${P} .nbp-panel{min-height:0;overflow:auto;border:14px solid transparent;border-image:url('${R['ramka-okno']}') 155/14px stretch;background:radial-gradient(ellipse at top,#322c262b,transparent 65%),#151518;padding:26px 26px;scrollbar-width:thin}
${P} .nbp-pane>#skillLoadout,${P} .nbp-pane>#trnBox{margin:0 0 14px!important;max-width:none!important;width:auto!important;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;padding:0!important}
${P} #pauseKeys{margin:0!important;max-width:none!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
${P} #pauseKeys .subtabs{display:flex!important;justify-content:center;gap:16px!important;flex-wrap:nowrap}
${P} #pauseKeys .stab{flex:1;max-width:340px;min-width:0;min-height:92px;border:12px solid transparent!important;border-image:url('${PREMIUM_ICONS['ramka-komunikat']}') 110/12px stretch!important;background:#252422!important;padding:14px 16px!important;font:600 clamp(18px,1.65vw,28px)/1.1 Grenze,Georgia,serif!important;color:#eadbc0!important;text-shadow:0 2px 3px #000;box-shadow:none!important}
${P} #pauseKeys .stab.on{color:#ffe8bc!important;filter:drop-shadow(0 0 8px #ff4a1a99);background:radial-gradient(ellipse,#7a3a24aa,#2a2420)!important}
/* states: nbUiSystem */

${P} #pauseKeys .opsep{position:relative;height:28px!important;width:min(550px,70%)!important;margin:20px auto 28px!important;border:0!important;background:linear-gradient(transparent 45%,#8b7149 48%,#c2a46b 50%,#493b2b 54%,transparent 57%)!important;-webkit-mask:none!important;mask:none!important}
${P} #pauseKeys .opsep:before,${P} #pauseKeys .opsep:after{content:'';position:absolute;top:8px;width:12px;height:12px;border:1px solid #a48956;background:#282522;transform:rotate(45deg)}
${P} #pauseKeys .opsep:before{left:0}${P} #pauseKeys .opsep:after{right:0;left:auto}
${P} #pauseKeys .opsep{box-shadow:none!important;background:radial-gradient(circle at 50% 50%,#ea7866 0,#891c24 3px,#29080d 6px,#ad8852 7px,#5c4630 8px,#242221 9px,#242221 11px,transparent 12px) center/28px 28px no-repeat,linear-gradient(transparent 45%,#8b7149 48%,#c2a46b 50%,#493b2b 54%,transparent 57%)!important}
${P} #pauseKeys .stab,${P} #pauseKeys .stab.on{border:0!important;border-image:none!important;outline:0!important;box-shadow:none!important;background:transparent url('${R['przycisk-zwykly']}') center/100% 100% no-repeat!important;color:#eadbc0!important;text-shadow:0 2px 3px #000;padding:14px clamp(14px,1.6vw,34px)!important}
/* states: nbUiSystem */

/* states: nbUiSystem */

${P} #skillLoadout button.go{padding:12px clamp(10px,1.2vw,26px)!important;border-width:9px!important;border-image:url('${R['ramka-okno']}') 155/9px stretch!important;background:#1a1618!important;box-shadow:none!important}
${P} #skillLoadout button.go:disabled{opacity:.55}
${P} #skillLoadout>h2{font:500 34px Grenze,Georgia,serif!important;color:#eadbc0!important;text-align:center;margin:0 0 6px!important;padding:0!important;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;text-shadow:none}
${P} #skillLoadout>p{text-align:center}
${P} #skillLoadout{--ic:clamp(54px,4.6vw,80px)}
${P} #skillLoadout button.go{grid-template-columns:var(--ic) minmax(0,1fr)!important;min-height:clamp(96px,15vh,140px)!important;gap:6px 12px!important}
${P} #skillLoadout .slot-inventory button.go{min-height:clamp(72px,9.5vh,110px)!important}
${P} #skillLoadout .ic{width:var(--ic)!important;height:var(--ic)!important}
${P} #skillLoadout .loadout-name{font-size:clamp(16px,1.3vw,24px);overflow-wrap:break-word!important;hyphens:none}
${P} .nbp-journal{max-width:760px;margin:0 auto}
${P} .nbp-journal>small{color:#b79a6b;letter-spacing:2px;font-size:12px}
${P} .nbp-journal h2{font:500 34px Grenze,Georgia,serif;margin:4px 0 6px;color:#eadbc0}
${P} .nbp-journal .nbp-jp{font-size:19px;margin:0 0 14px;color:#d7c9af}
${P} .nbp-journal ol{margin:0;padding:0;list-style:none}
${P} .nbp-journal li{padding:14px 0;border-top:1px solid #735b3b66;color:#dfd1b9;font-size:19px;line-height:1.4}
${P} .nbp-journal li small{display:block;color:#ad926a;font-size:12px;letter-spacing:1.5px;margin-bottom:3px;text-transform:uppercase}
${P} .nbp-journal li.warn small{color:#de9760}
${P} .nbp-audiogrid{max-width:950px;margin:auto;display:grid;gap:22px}
${P} .nbp-ah{text-align:center;margin:4px auto 8px}
${P} .nbp-ah small{letter-spacing:3px;color:#b4945c;font-size:12px}
${P} .nbp-ah h2{font:500 36px Grenze,Georgia,serif;margin:2px 0;color:#eadbc0}
${P} .nbp-ah p{color:#b6a58a;font-size:18px;margin:4px 0 0}
${P} .nbp-audio{padding:24px 34px 20px;border:1px solid #7d654348;background:linear-gradient(110deg,#38302833,#161619);box-shadow:inset 0 1px #bea47419}
${P} .nbp-al{display:flex;align-items:baseline;justify-content:space-between}
${P} .nbp-al>span{font:600 29px Grenze,Georgia,serif;color:#eadbc0}
${P} .nbp-al output{font:32px Grenze,Georgia,serif;color:#f0d39d;font-variant-numeric:tabular-nums}
${P} .nbp-al output span{font-size:17px;margin-left:3px;color:#b6a58a}
${P} .nbp-audio p{color:#b6a58a;font-size:16px;margin:0 0 18px}
${P} .nbp-audio label.musrow{display:block!important;margin:0!important;padding:0!important;width:100%!important}
${P} .nbp-audio label.musrow>span:first-child{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
${P} .nbp-audio label.musrow .rng,${P} .nbp-audio label.musrow input[type=range]{width:100%!important;max-width:none!important;display:block!important;margin:6px 0 10px!important}
${P} .nbp-scale{display:flex;justify-content:space-between;color:#a99980;font-size:13px}
${P} .nbp-more{padding:18px 34px}
${P} .nbp-more .nbp-al>span{font-size:22px}
${P} .nbp-more label.musrow>span:first-child{position:static!important;width:auto;height:auto;clip:auto;font-size:16px;color:#b6a58a}
${P} .nbp-more label.tgl{margin-top:12px!important}
@media(max-height:560px){
${P}{padding:8px 10px 8px;gap:6px}
${P} .nbp-head{gap:12px;margin-left:4px}
${P} .nbp-head .premium-pause-title{font-size:24px}
${P} .nbp-sub{font-size:13px}
${P} .nbp-layout{grid-template-columns:150px minmax(0,1fr);gap:12px}
${P} .nbp-nav{gap:7px}
${P} .nbp-tab{font-size:16px;min-height:44px;padding:8px 10px}
${P} #skillLoadout{--ic:40px}
${P} .nbp-journal h2{font-size:24px}
${P} .nbp-journal li{font-size:15px;padding:9px 0}
${P} .nbp-journal .nbp-jp{font-size:15px}
${P} #skillLoadout button.go{min-height:70px!important;padding:6px 8px!important}
${P} #skillLoadout .slot-inventory button.go{min-height:56px!important}
${P} #skillLoadout .loadout-name{font-size:15px}
${P} .nbp-nav .btnrow{gap:6px}
${P} .nbp-panel{border-width:10px;border-image-width:10px;padding:12px 12px}
${P} #pauseKeys .subtabs{gap:7px!important}
${P} #pauseKeys .stab{font-size:16px!important;min-height:58px;padding:8px 8px!important;border-width:9px!important;border-image-width:9px!important}
${P} #pauseKeys .opsep{margin:10px auto 14px!important}
${P} .nbp-ah{display:none}
${P} .nbp-audiogrid{gap:10px}
${P} .nbp-audio{padding:12px 18px 10px}
${P} .nbp-al>span{font-size:21px}
${P} .nbp-al output{font-size:23px}
${P} .nbp-audio p{font-size:12px;margin-bottom:6px}
${P} .nbp-scale{font-size:11px}
}`;
document.head.append(st);
})();
// ===== Menu: rama wokol dolnego obszaru, tlo z chmur, nawigacja i panel bohatera (tylko ekrany menu) =====
(()=>{
const R=PREMIUM_ASSETS,C=NBH_ASSETS.chmury,OR='#orient'.repeat(12),Ti=OR+' #title',T=(p,e)=>EN?e:p,title=$('title'),cap=title.querySelector('.premium-caption'),go=$('premiumPrepare');
const ASH='assets/efekty/006aadc624b9900d15e477957db3177be645ac45c9879d6ba467df69253c5c74.webp';
if(go)go.textContent=T('GRAJ','PLAY');
// klik w miniature rozdzialu tylko ja zaznacza (jak najechanie); przygotowanie otwiera wylacznie przycisk GRAJ
title.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#start1,#start2,#start3,#start4,#start5,#start6');if(!b)return;e.stopImmediatePropagation();e.preventDefault();b.dispatchEvent(new Event('pointerenter'));try{preloadIntro(+b.id.slice(5))}catch(_){quietErr('preloadIntro',_)}},true);
// naglowek ROZDZIAL I nad nazwa rozdzialu (rzymska cyfra z zaznaczonej miniatury)
function kick(){if(!cap)return;const s=title.querySelector('.premium-selected');const k=T('ROZDZIAŁ ','ACT ')+(s&&s.dataset.roman||'I');if(cap.dataset.k!==k)cap.dataset.k=k}
if(cap)new MutationObserver(kick).observe(cap,{childList:true,characterData:true,subtree:true});kick();
const bg=`linear-gradient(#0a090b12,#08090b45),url('${C}') center/cover no-repeat #09090b`,st=document.createElement('style');st.className='nbm-style';
st.textContent=`
${Ti}:not([hidden]){background:${bg}!important}
${Ti} .premium-mast{position:relative;isolation:isolate;background:transparent!important}
${Ti} .premium-mast:before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at center,#07070935,transparent 65%)}
${Ti} .premium-body{position:relative;grid-template-columns:clamp(200px,15vw,300px) minmax(0,1fr) clamp(200px,13vw,270px)!important;border:17px solid transparent!important;border-image:url('${R['ramka-okno']}') 155/17px stretch!important;padding:16px 14px 10px!important;background:linear-gradient(90deg,#08090bb0,#08090b38 22%,#08090b45 80%,#08090b8c)!important;box-shadow:0 8px 36px #0008;box-sizing:border-box}
${Ti} .premium-nav{background:linear-gradient(90deg,#0c0b0d38,transparent);gap:14px!important}
${Ti} .premium-nav>button{flex:1 1 0;max-height:118px;min-height:54px!important;width:100%!important}
${Ti} .premium-nav>button:not(#manBtn),${Ti} .premium-nav #manBtn:after{font-size:clamp(22px,1.6vw,30px)!important}
/* states: nbUiSystem */

${Ti} .premium-controls{margin-top:12px!important;gap:12px!important;flex:none}
${Ti} .premium-controls .tgl{font-size:clamp(15px,1.05vw,19px)!important;min-height:38px!important;gap:10px}
${Ti} .premium-controls .tgl .sl{width:32px!important;height:32px!important;min-width:32px!important}
${Ti} .premium-controls .modesw{gap:10px}
${Ti} .premium-controls .modesw button{min-height:78px!important}
${Ti} .premium-caption{bottom:20px!important;line-height:1.1}
${Ti} .premium-caption:before{content:attr(data-k);display:block;font:600 13px Grenze,Georgia,serif;letter-spacing:4px;color:#c99a62;margin-bottom:6px}
${Ti} .premium-caption:after{content:'${T('Wybierz drogę. Przygotuj się na kolejną Noc.','Choose your road. Prepare for another Night.')}';display:block;font:400 17px Grenze,Georgia,serif;color:#d8cbb3;margin-top:6px}
${Ti} .premium-ashes{display:flex!important;align-items:center;justify-content:center;gap:8px;white-space:nowrap;font:600 18px Grenze,Georgia,serif!important;padding:10px 6px!important;line-height:1}
${Ti} .premium-ashes:before{content:'';width:24px;height:24px;flex:none;background:url('${ASH}') center/contain no-repeat;filter:drop-shadow(0 0 4px #ff5a1f88)}
${Ti} .premium-portrait{flex:1 1 0!important;min-height:60px!important;object-fit:cover!important;object-position:50% 12%!important}
${Ti} .premium-name{margin-top:8px}
${Ti} .premium-go{flex:0 0 auto!important;min-height:clamp(110px,24%,190px)!important;margin-top:8px!important;font:700 clamp(26px,2vw,38px) Grenze,Georgia,serif!important;letter-spacing:3px}
${Ti} .premium-nav>button .premium-nav-icon{left:14%!important;top:50%!important;width:16.5%!important;height:auto!important;aspect-ratio:1/1;transform:translateY(-50%)!important;object-fit:contain}
${Ti} .premium-controls .modesw{align-items:stretch}
${Ti} .premium-controls .modesw button{position:relative;display:flex!important;align-items:flex-end;justify-content:center;min-height:clamp(84px,13vh,150px)!important;padding:0 6px 14%!important}
${Ti} .premium-controls .modesw button .premium-nav-icon{display:block!important;position:absolute;left:50%!important;top:13%!important;transform:translateX(-50%)!important;width:clamp(34px,40%,60px)!important;height:auto!important;aspect-ratio:1/1;object-fit:contain}
${Ti} #sFab:after,${Ti} #sArc:after{font-size:clamp(17px,1.3vw,24px)!important}
${OR} #kap:not([hidden]),${OR} #opts:not([hidden]),${OR} #manual:not([hidden]),${OR} #prep:not([hidden]){background:linear-gradient(#08090ba8,#08090bd0),url('${C}') center/cover no-repeat #09090b!important}
@media(max-height:550px){
${Ti} .premium-body{border-width:10px!important;border-image-width:10px!important;padding:7px 6px 5px!important;grid-template-columns:140px minmax(0,1fr) 140px!important}
${Ti} .premium-nav{gap:6px!important}
${Ti} .premium-nav>button{min-height:36px!important;max-height:60px}
${Ti} .premium-nav>button:not(#manBtn),${Ti} .premium-nav #manBtn:after{font-size:16px!important}
${Ti} .premium-controls{margin-top:6px!important;gap:5px!important}
${Ti} .premium-controls .tgl{font-size:11px!important;min-height:22px!important;gap:5px}
${Ti} .premium-controls .tgl .sl{width:20px!important;height:20px!important;min-width:20px!important}
${Ti} .premium-controls .modesw button{min-height:60px!important;padding:0 4px 5px!important}
${Ti} .premium-controls .modesw button .premium-nav-icon{top:6%!important;width:clamp(18px,32%,30px)!important}
${Ti} #sFab:after,${Ti} #sArc:after{font-size:12px!important}
${Ti} .premium-caption:before{font-size:9px;letter-spacing:3px;margin-bottom:2px}
${Ti} .premium-caption:after{font-size:11px;margin-top:2px}
${Ti} .premium-ashes{font-size:13px!important;padding:4px!important}
${Ti} .premium-ashes:before{width:16px;height:16px}
${Ti} .premium-go{min-height:56px!important;font-size:20px!important;margin-top:4px!important}
}`;
document.head.append(st);
})();
// load sprite sheets, then start the loop
const imgs={},GROUP_STATE={},GROUP_ORDER=['core','r2','r6','r3','r4','r5'],IMAGE_PENDING=new Set();let imageWorkers=0;
function groupFor(ch){return ch>=2&&ch<=6?'r'+ch:'core'}
function groupReady(ch){return GROUP_STATE[groupFor(ch)]?.ready===true}
function tintAnims(part){const A=part;
  // a dead NPC no longer glows
  for(const k of ['elder','wit','izolda','ottokar'])if(A[k]&&A[k][3])A[k][3].n.emissive.setHex(0x000000);
  const TINT={madman:0xe0a890,hound:0xb89078,rotknight:0xa8b880,monk:0xffa060,izolda:0xc4b4ec,ottokar:0xf0d090,aurel:0xa8c8f0};
  if(A.chojrak&&!A.npcNew)for(const [k,c] of [['chojrak',0xfff4d0],['mila',0xd8b890],['heri',0xb8c4dc]])for(const f of A[k])f.n.color.setHex(c);
  for(const k in TINT){const a=A[k];if(!a)continue;if(a.sheet||(Array.isArray(a)&&imgs.zl_en_b))continue;for(const f of Array.isArray(a)?a:Object.values(a).flat())f.n.color.setHex(TINT[k])}

}
function groupProgress(g){const st=GROUP_STATE[g];return st.keys.length?st.keys.filter(k=>imgs[k]).length/st.keys.length:1}
function refreshGroup(g){const st=GROUP_STATE[g];for(const w of st.watchers)w(st.error?(EN?'Error — click to retry':'Błąd — kliknij, aby ponowić'):'Wczytywanie… '+Math.floor(groupProgress(g)*100)+'%');if(g==='core')window.NB_BOOT?.progress?.(groupProgress(g))}
function finishGroup(g){const st=GROUP_STATE[g];if(st.ready||st.error||!st.keys.every(k=>imgs[k]))return;if(g!=='core'){const part=buildAnims(imgs,g);tintAnims(part);Object.assign(A,part)}st.ready=true;refreshGroup(g);for(const w of st.waiters.splice(0))w.resolve();if(GROUP_ORDER.every(g=>GROUP_STATE[g].ready))window.NB_GROUPS_READY=true}
function pumpImages(){while(imageWorkers<2){const g=GROUP_ORDER.find(g=>{const s=GROUP_STATE[g];return s.enabled&&!s.ready&&!s.error&&s.keys.some(k=>!imgs[k]&&!IMAGE_PENDING.has(k))});if(!g)break;const st=GROUP_STATE[g],k=st.keys.find(k=>!imgs[k]&&!IMAGE_PENDING.has(k));st.loading.add(k);IMAGE_PENDING.add(k);imageWorkers++;const im=new Image();im.nbDensity=SPRITE_RES[k]||1;im.nbKey=k;im.onload=()=>{imgs[k]=im;imageWorkers--;st.loading.delete(k);IMAGE_PENDING.delete(k);for(const h of GROUP_ORDER){refreshGroup(h);if(GROUP_STATE[h].enabled)finishGroup(h)}pumpImages()};im.onerror=()=>{const backup=SPRITE_DATA[k+'_fallback'];if(backup&&!im.nbFallback){im.nbFallback=true;SPRITE_DATA[k]=backup;im.src=backup;return}imageWorkers--;st.loading.delete(k);IMAGE_PENDING.delete(k);st.error=true;refreshGroup(g);for(const w of st.waiters.splice(0))w.reject(Error((EN?'Cannot load image: ':'Nie można wczytać obrazu: ')+k));pumpImages()};im.src=SPRITE_DATA[k]}}
function loadGroup(ch,watch){const g=typeof ch==='string'?ch:groupFor(ch),st=GROUP_STATE[g];if(st.ready)return Promise.resolve();st.error=false;st.enabled=true;if(watch)st.watchers.add(watch);const p=new Promise((resolve,reject)=>st.waiters.push({resolve,reject}));const i=GROUP_ORDER.indexOf(g);if(g!=='core'){GROUP_ORDER.splice(i,1);GROUP_ORDER.splice(1,0,g)}refreshGroup(g);finishGroup(g);pumpImages();return p.finally(()=>{if(watch)st.watchers.delete(watch)})}
function waitChapter(ch,action,button){if(groupReady(ch))return action();const focused=document.activeElement,b=focused?.matches('#againBtn,#nextBtn,#prepGo')?focused:button||$('prepGo');if(b.nbWait)return b.nbWait;const label=b.innerHTML;b.nbWait=loadGroup(ch,t=>{b.textContent=t}).then(()=>{b.innerHTML=label;return action()},()=>{b.textContent=(EN?'Error — click to retry':'Błąd — kliknij, aby ponowić')}).finally(()=>{b.nbWait=null});return b.nbWait}
for(const g of GROUP_ORDER)GROUP_STATE[g]={keys:Object.keys(SPRITE_DATA).filter(k=>!/_fallback$/.test(k)&&!/^intro[1-6]$/.test(k)&&SPRITE_GROUPS[k].includes(g)&& (g==='core'||!SPRITE_GROUPS[k].includes('core'))),loading:new Set(),watchers:new Set(),waiters:[],ready:false,error:false,enabled:false};
loadGroup('core').then(()=>{
  A=buildAnims(imgs,'core');IMGS=imgs;tintAnims(A);try{trnFill()}catch(e){quietErr('trnFill',e)}initCombatEffects();initWhirlVisuals();decals(imgs);
  ensureWorld(1);
  ROOT=scene;useWorld(1);
  heroMesh=new THREE.Mesh(geo32,heroIdleMat());heroMesh.visible=false;scene.add(heroMesh);
  margaMesh=new THREE.Mesh(geo32,A.marga[0].n);margaMesh.customDistanceMaterial=A.marga[0].d;margaMesh.castShadow=true;margaMesh.visible=false;scene.add(margaMesh);
  for(const i of CAMPAIGN){$('start'+i).disabled=false;$('start'+i).innerHTML=(EN?'<small>Act ':'<small>Rozdział ')+CHR[i-1]+'</small>'+CHN[i-1]}renderRecords();window.NB_BOOT?.ready();
  for(const g of ['r2','r6','r3','r4','r5'])GROUP_STATE[g].enabled=true;for(const g of ['r2','r6','r3','r4','r5'])finishGroup(g);pumpImages();
}).catch(err=>{console.error(err);window.NB_BOOT?.fail(err);$('start1').textContent=(EN?'Failed to load graphics':'Nie udało się wczytać grafik')});
// 9.11.2026: author's control diagrams (PL and EN images replace the drawn keyboard / pad).
// The text lists stay in the DOM for screen readers; fillPauseKeys copies this markup into the pause, so both places change.
{const KB=EN?'assets/ui/dadca33542655c56e7c88a0c1be7394a6716a3250526dfb29db1df91c0144548.webp':'assets/ui/8d6f9789af7270abae2ecd0ed9a42e48b9466c82ccee7da597c97b51760300d0.webp',PD=EN?'assets/ui/1c380bccce9943755d604581e451da377ebaf3621aa56e9c67426c8fb8908b63.webp':'assets/ui/bfb4247af105e9a06e15632ae2b8c23925efd2f81ac29cc8ed6d8e160ed1dc69.webp';
 {const put=(box,src,alt,hide)=>{if(!box||box.querySelector('.nb-ctl-img'))return;const im=document.createElement('img');im.className='nb-ctl-img';im.src=src;im.alt=alt;im.loading='lazy';im.decoding='async';im.width=1672;im.height=941;box.prepend(im);for(const h of box.querySelectorAll(hide))h.classList.add('nb-ctl-old')};
  put($('sub-kb'),KB,EN?'Controls: keyboard and mouse':'Sterowanie: klawiatura i mysz','#figKb,#figMouse,.keys');put($('sub-pad'),PD,EN?'Controls: controller':'Sterowanie: kontroler','.fig.pad,.figcap,.keys');
  const st=document.createElement('style');st.textContent=`.nb-ctl-img{display:block;width:auto;max-width:min(100%,1400px);max-height:calc(100vh - 230px);height:auto;object-fit:contain;margin:0 auto;border-radius:4px;box-shadow:0 10px 30px #0008}
.nb-ctl-old{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}`;document.head.appendChild(st)}}
// 13.11.2026 (wcześniej 9.11 karty z kafelkami): Opcje > Audio jako dwa klasyczne, duże suwaki na całą szerokość:
// nazwa po lewej, suwak w środku, wartość po prawej. Suwak to ten sam .rng (pad: A chwyta, lewo/prawo zmienia).
{const pa=$('pane-aud'),T=(p,e)=>EN?e:p;if(pa&&!pa.querySelector('.nbo-aud')){const mus=pa.querySelector('.musSl'),sfx=pa.querySelector('.sfxSl');
 if(mus&&sfx){const mk=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!==undefined)n.innerHTML=h;return n};
  const pct=i=>Math.round((+i.value-(+i.min||0))/((+i.max||100)-(+i.min||0))*100);
  const row=(inp,name)=>{const r=mk('div','nbo-row');const lab=inp.closest('label');const sp=lab.querySelector(':scope>span:first-child');if(sp)sp.textContent=name;r.append(lab,mk('output','nbo-val','0'));const g=lab.querySelector('.rng');if(g)for(const [k,v] of [['font-size','clamp(30px,4.6vh,50px)'],['height','clamp(56px,8vh,84px)'],['width','100%'],['max-width','none']])g.style.setProperty(k,v,'important');const st2=(sel,props)=>{const e=g.querySelector(sel);if(e)for(const [k,v] of props)e.style.setProperty(k,v,'important')};if(g){st2('.rk',[['height','clamp(22px,3.2vh,34px)'],['top','50%'],['bottom','auto'],['transform','translateY(-50%)']]);st2('.rf',[['height','clamp(8px,1.2vh,13px)'],['top','50%'],['bottom','auto'],['transform','translateY(-50%)'],['margin','0']]);st2('.rh',[['width','clamp(34px,5vh,52px)'],['height','clamp(34px,5vh,52px)']])}return r};/* style w linii z !important: inne arkusze menu mają wyższą wagę dla .rng */
  const wrap=mk('div','nbo-aud');wrap.append(row(mus,T('Muzyka','Music')),mk('div','nbo-sep'),row(sfx,T('Efekty','Effects')));pa.prepend(wrap);
  const outs=()=>{for(const r of wrap.querySelectorAll('.nbo-row'))r.querySelector('output').textContent=pct(r.querySelector('input[type=range]'))};
  for(const i of [mus,sfx])i.addEventListener('input',outs);new MutationObserver(()=>{if(!pa.hidden)outs()}).observe(pa,{attributes:true,attributeFilter:['hidden']});outs();
  const Z='#orient'.repeat(40)+' #opts #pane-aud',st=document.createElement('style');st.textContent=`
${'#orient'.repeat(14)} #opts #pane-aud:not([hidden]){display:flex!important;flex-direction:column!important;justify-content:center!important;min-height:100%!important}
${Z} .nbo-aud{box-sizing:border-box;width:100%;max-width:1200px;margin:0 auto;padding:clamp(8px,3vh,40px) clamp(8px,3vw,48px);display:flex;flex-direction:column;gap:clamp(18px,4vh,48px)}
${Z} .nbo-row{display:grid;grid-template-columns:6.4em minmax(0,1fr) 3.2em;font-size:clamp(24px,3.6vh,38px);align-items:center;gap:clamp(14px,2.4vw,40px)}
${Z} .nbo-row label.musrow{display:contents!important}
${Z} .nbo-row label.musrow>span:first-child{text-align:left!important;font:600 clamp(24px,3.6vh,38px)/1.1 Cinzel,Georgia,serif!important;letter-spacing:.04em;color:#eadbc0!important;margin:0!important;padding:0!important;white-space:nowrap}
${Z} .nbo-row .rng{width:100%!important;max-width:none!important;height:clamp(52px,7vh,78px)!important;font-size:clamp(22px,3.2vh,36px)!important}
${Z} .nbo-row .rng .rf{background:linear-gradient(90deg,#6e1f24,#c0662a 70%,#e8a54a)!important;box-shadow:0 0 8px #c0662a66}
${Z} .nbo-val{text-align:right;font:600 clamp(28px,4.4vh,46px)/1 Cinzel,Georgia,serif;color:#f0d39d;font-variant-numeric:tabular-nums}
${Z} .nbo-sep{height:1px;background:linear-gradient(90deg,#0000,#b08a4a55,#0000)}
@media (max-width:820px){${Z} .nbo-row{grid-template-columns:1fr auto}${Z} .nbo-row .rng{grid-column:1/-1}}`;document.head.appendChild(st)}}}
// PC concept 2, whole-menu presentation. Reversible switch: ?pcmenu=0 / ?pcmenu=1.
(()=>{
 const root=$('orient'),title=$('title'),prep=$('prep');
 const enabled=new URLSearchParams(location.search).get('pcmenu')!=='0';
 root.classList.toggle('pc-menu',enabled);if(!enabled)return;
 Object.assign(PREMIUM_ASSETS,{'portret-woskownica':'assets/ui/f02195e1fb9431e1610f3b80209762e46e53a9d3cd82b94e357519012df9b20d.webp','portret-rycerz':'assets/ui/5b34b85844e657eca2c40af65c5a8744f7175b81ebe8b37e9614215ef8cda24e.png','portret-kat':'assets/ui/5496889094dbd50b342769c840ab925bcac7c6da2bea4b64307a20dce787cffa.png','portret-zabojczyni':'assets/ui/3a7c4c89940259420bcc50b5647ff9d712a117a9d5f3ea4915a67034db1f5df3.png','portret-dzwonnik':'assets/ui/5857e9efd70536997aa98e905aec4855bc6b8912b04a498e662ff7370327f36f.webp'});
 const T=(pl,en)=>EN?en:pl,make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e};
 const home=make('button','pc-home-button',T('Menu główne','Main menu'));home.type='button';
 const nav=title.querySelector('.premium-nav'),journey=nav.querySelector('.premium-journey');nav.append(home);journey.textContent=T('Graj','Play');journey.classList.add('pc-play');
 const lang=make('button','pc-language','PL / EN');lang.type='button';lang.addEventListener('click',()=>{$('lang').hidden=false;$('lang').querySelector('button')?.focus()});title.append(lang);const guideLabel=make('span','pc-guide-label',T('Instrukcja','Guide'));$('manBtn').append(guideLabel);
 title.classList.add('pc-home');
 const showJourney=()=>{title.classList.remove('pc-home');const ch=chLocked(last)?1:last;$('start'+ch)?.focus()};
 journey.addEventListener('click',showJourney);home.addEventListener('click',()=>{title.classList.add('pc-home');journey.focus()});
 let last=1;try{last=Number(localStorage.getItem('nb_pc_last_chapter'))||1}catch(e){}last=Math.max(1,Math.min(5,Math.floor(last)));
 new MutationObserver(()=>{if(!prep.hidden){last=PREP.ch||1;try{localStorage.setItem('nb_pc_last_chapter',String(last))}catch(e){}}}).observe(prep,{attributes:true,attributeFilter:['hidden']});
 // Existing lists and handlers stay intact; only panel visibility and contextual copy change.
 const grid=prep.querySelector('.prepgrid'),tabs=make('nav','pc-prep-tabs'),detail=make('aside','pc-perk-detail');
 tabs.setAttribute('aria-label',T('Przygotowanie','Preparation'));detail.setAttribute('aria-live','polite');grid.append(tabs,detail);
 const panels=[['prepPerks',T('Perki','Perks')],['prepCh',T('Wyzwania','Challenges')],['prepCurseL',T('Klątwy','Curses')]];let active='prepPerks';const observed=new WeakSet();
 const setPanel=id=>{active=id;sync()};
 for(const [id,label] of panels){const b=make('button','pc-prep-tab',label);b.type='button';b.dataset.panel=id;b.addEventListener('click',()=>setPanel(id));tabs.append(b)}
 function describe(b){
  if(!b)return;
  const content=make('div','pc-detail-copy'),kind=panels.find(([id])=>b.closest('#'+id));
  if(kind)content.append(make('small','pc-detail-kicker',kind[1]));
  for(const child of b.children){
   if(child.matches('img')){const im=child.cloneNode(true);im.className='pc-detail-icon';content.append(im)}
   else if(child.matches('.nb-rw')){
    // Keep the original reward amounts and icon classes; textContent loses currency identity.
    const rewards=make('section','pc-detail-rewards'),row=make('div','pc-reward-row');
    rewards.append(make('h4','',T('Nagroda','Reward')));
    for(const icon of child.querySelectorAll(':scope > i')){
     const ash=icon.classList.contains('nb-ash'),label=T(ash?'Popioły':'Monety',ash?'Ashes':'Coins');
     const item=make('span','pc-reward'),im=icon.cloneNode(true);
     im.setAttribute('aria-hidden','true');item.append(im,make('strong','pc-reward-value',icon.nextSibling?.textContent.trim()||''),make('small','pc-reward-name',label));row.append(item);
    }
    rewards.append(row);const note=child.querySelector('small');if(note)rewards.append(make('p','pc-reward-note',note.textContent));content.append(rewards);
   }else if(!child.matches('i')&&child.textContent.trim()){
    content.append(make(child.matches('b')?'h3':'p',child.matches('small')?'pc-lock-note':'',child.textContent.replace(/^✓\s*/,'')));
   }
  }
  detail.replaceChildren(content);
 }
 function sync(){for(const [id] of panels){const list=$(id);if(list&&!observed.has(list)){new MutationObserver(sync).observe(list,{childList:true});observed.add(list)}const box=list?.closest('.prepgrid>.prepbox');if(box)box.classList.toggle('pc-panel-hidden',id!==active)}for(const b of tabs.children){b.hidden=!$(b.dataset.panel);b.setAttribute('aria-pressed',String(b.dataset.panel===active))}const list=$(active);describe(list?.querySelector('.opt.on')||list?.querySelector('.opt'));}
  // 13.11.2026: opis po prawej zmienia sie tylko po KLIKNIECIU opcji (nie po najechaniu ani przesunieciu zaznaczenia padem)
 prep.addEventListener('click',e=>{const b=e.target.closest('.opt');if(b&&b.closest('#prepPerks,#prepCh,#prepCurseL'))describe(b)});
 // Renderers replace children, not list containers. Observe those containers only.
 new MutationObserver(sync).observe(grid,{childList:true});sync();

 // Concept typography is a separate layer; original headings remain available in legacy mode.
 const ph=make('h2','pc-prep-title',T('Przygotowanie do nocy','Before Nightfall'));prep.querySelector('.premium-prep-head').append(ph);
 const controls=prep.querySelector('.premium-prep-controls'),info=make('div','pc-footer-info');
 info.append($('prepK'),prep.querySelector('.premium-prep-summary'));controls.prepend(info);
 const difficulty=make('details','pc-popover'),ds=make('summary','',T('Trudność','Difficulty')),db=make('div','');db.append($('diffSw'));difficulty.append(ds,db);controls.prepend(difficulty);
 const assists=make('details','pc-popover'),as=make('summary','',T('Ustawienia','Settings')),ab=make('div','');ab.append(prep.querySelector('.premium-prep-control-scroll'));assists.append(as,ab);controls.insertBefore(assists,info);
 for(const pop of [difficulty,assists])pop.addEventListener('keydown',e=>{if(e.key==='Escape'&&pop.open){e.stopImmediatePropagation();pop.open=false;pop.querySelector('summary').focus()}});
 const kap=$('kap'),markKron=()=>kap.classList.toggle('pc-chronicle',KAPMODE==='kron');new MutationObserver(markKron).observe(kap,{attributes:true,attributeFilter:['hidden']});new MutationObserver(markKron).observe($('kapH'),{childList:true,subtree:true});markKron();
 const badgeLabel=()=>{const b=$('kronBtn')?.querySelector('.nbk-new');if(b){const label=T('Nowe wpisy','New entries')+': '+b.textContent;b.setAttribute('aria-label',label);b.title=label}};
 new MutationObserver(badgeLabel).observe(nav,{childList:true,subtree:true,characterData:true});badgeLabel();
 for(const head of document.querySelectorAll('#opts .premium-page-head,#manual .premium-page-head,#kap .m2-top,#pause .nbp-head')){const rule=make('span','pc-heading-rule');rule.setAttribute('aria-hidden','true');head.append(rule)}
 for(const heading of document.querySelectorAll('.premium-page-heading,#kapH,.premium-pause-title,.pc-prep-title'))heading.classList.add('pc-fantasy-title');
 for(const id of ['pane-set','pane-gfx']){const pane=$(id);if(!pane)continue;let section=null;for(const child of [...pane.children]){if(child.matches('.opsep')){child.classList.add('pc-section-separator');continue}if(child.matches('.nbts-wrap')){child.classList.add('pc-option-section');section=null;continue}if(child.matches('h3')){section=make('section','pc-option-section');child.before(section)}if(section)section.append(child)}}
 const loadout=$('skillLoadout'),polishLoadout=()=>{const inv=loadout?.querySelector('.slot-inventory');if(inv?.querySelector('[data-equip]:not([data-equip=""])')&&!loadout.querySelector('.pc-loadout-reserve')){const focused=document.activeElement,restore=inv.contains(focused),reserve=make('section','pc-loadout-reserve');inv.before(reserve);reserve.append(make('h3','pc-reserve-title',T('Zdobyte umiejętności','Learned skills')),inv);if(restore)focused.focus({preventScroll:true})}};
 if(loadout){new MutationObserver(polishLoadout).observe(loadout,{childList:true});polishLoadout()}
 // PC Journey is a chapter hub. Reuse the real chapter buttons and their existing handlers.
 const map=title.querySelector('.premium-map'),banner=title.querySelector('.premium-banner'),chapterList=map.querySelector('.m2-right'),caption=map.querySelector('.premium-caption'),oldAshes=title.querySelector('.premium-ashes');
 const journeyHead=make('header','pc-journey-head'),journeyTitle=make('h2','pc-fantasy-title',T('Wybór rozdziału','Act selection'));
 journeyHead.append(home,journeyTitle);title.prepend(journeyHead);map.prepend(chapterList);
 const profile=make('aside','pc-profile'),ashIcon=make('img','pc-profile-ash'),ashBlock=make('div','pc-profile-stat'),ashValue=make('strong','',String(EMB.e)),levelBlock=make('div','pc-profile-stat'),levelValue=make('strong','',String(prog().lv));
 ashIcon.src='assets/efekty/006aadc624b9900d15e477957db3177be645ac45c9879d6ba467df69253c5c74.webp';ashIcon.alt='';
 ashBlock.append(make('small','',T('Popioły','Ashes')),ashValue);levelBlock.append(make('small','',T('Poziom','Level')),levelValue);profile.append(ashIcon,ashBlock,levelBlock);title.append(profile);
 const facts=make('div','pc-destination-facts'),factValues=[];
 for(const label of [T('Dostępność','Availability'),T('Najdłuższa noc','Longest night'),T('Rekord zabójstw','Most kills')]){const cell=make('div',''),value=make('strong','','—');cell.append(make('small','',label),value);facts.append(cell);factValues.push(value)}banner.append(facts);
 const journeyFooter=make('footer','pc-journey-footer'),modeInfo=make('div','pc-journey-mode'),modeName=make('strong','','');modeInfo.append(make('small','',T('Tryb gry','Game mode')),modeName);
 const prepare=$('premiumPrepare');prepare.textContent=T('Przygotuj się','Prepare');journeyFooter.append(modeInfo,prepare);title.append(journeyFooter);
 const opts=$('optsBtn'),gear=make('img','pc-journey-gear');gear.src=PREMIUM_ICONS['nawigacja-opcje'];gear.alt='';gear.setAttribute('aria-hidden','true');opts.append(gear);opts.setAttribute('aria-label',T('Opcje','Options'));opts.title=T('Opcje','Options');
 // The original multiplayer checkbox belongs with preparation, not the chapter atlas.
 const multiplayer=$('mpTglL');if(multiplayer)ab.append(multiplayer);
 for(const [id,note] of [['sFab',T('Rozdziały po kolei','Acts in order')],['sArc',T('Wszystkie rozdziały','All acts available')]]){const b=$(id),n=make('small','pc-mode-note',note),check=make('span','pc-mode-check','◆');check.setAttribute('aria-hidden','true');b.append(n,check)}
 const put=(el,text)=>{if(el.textContent!==text)el.textContent=text};
 function refreshJourney(){
  if(title.hidden)return;
  put(ashValue,String(EMB.e));put(levelValue,String(prog().lv));levelBlock.title=prog().lv>=PMAX?T('Poziom maksymalny','Max level'):prog().xp+' / '+PNEED(prog().lv)+' XP';
  put(modeName,STORYMODE?T('Fabularny','Story'):'Arcade');
  for(const i of CAMPAIGN){
   const b=$('start'+i);let label=b.querySelector('.pc-chapter-label');
   if(!label){label=make('span','pc-chapter-label');label.append(make('small','',T('Rozdział ','Act ')+CHR[i-1]),make('strong','',CHN[i-1]));b.append(label)}
  }
  const chosen=title.querySelector('.premium-selected'),ch=Number(chosen?.id.slice(5))||1,r=SETT.save['s'+ch];
  if(!title.classList.contains('pc-home')){last=ch;try{localStorage.setItem('nb_pc_last_chapter',String(ch))}catch(e){}}
  put(factValues[0],chosen?.dataset.status||T('Dostępny','Available'));put(factValues[1],r?.t?mmss(r.t):'—');put(factValues[2],r?String(r.kills||0):'—');
 }
 new MutationObserver(refreshJourney).observe(chapterList,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-status']});
 new MutationObserver(refreshJourney).observe(oldAshes,{childList:true,subtree:true,characterData:true});
 new MutationObserver(refreshJourney).observe(title,{attributes:true,attributeFilter:['hidden','class']});
 $('storyTgl').addEventListener('change',refreshJourney);refreshJourney();
 // The same menu hierarchy serves Escape, controller B and visible Back buttons.
 const backOrigins={},backScreens=['lang','conf','opts','manual','kap','prep','pause','lvl','shop','end'];let forwardingBack=false,backTicket=0;
 const currentBackScreen=()=>{for(const id of backScreens)if(!$(id).hidden)return id;return !title.hidden?(title.classList.contains('pc-home')?'home':'chapters'):null};
 function nativeBack(id){forwardingBack=true;try{$(id).click()}finally{forwardingBack=false}}
 function focusBack(el,screen){const ticket=++backTicket;setTimeout(()=>{if(ticket!==backTicket||currentBackScreen()!==screen)return;const parent=screen==='home'||screen==='chapters'?title:$(screen),target=el&&el.offsetParent!==null?el:[...parent.querySelectorAll('button,input,summary')].find(b=>!b.disabled&&b.offsetParent!==null);target?.focus({preventScroll:true})},70)}
 function restoreBackOrigin(id){const origin=backOrigins[id]||{screen:title.classList.contains('pc-home')?'home':'chapters'};if(origin.screen==='home'||origin.screen==='chapters'){title.hidden=false;title.classList.toggle('pc-home',origin.screen==='home')}else if($(origin.screen)){title.hidden=true;$(origin.screen).hidden=false}focusBack(origin.focus,origin.screen)}
 const backOpeners=[['#optsBtn','opts'],['#manBtn','manual'],['#kapBtn','kap'],['#kronBtn','kap'],['.pc-language','lang']];
 title.addEventListener('click',e=>{for(const [selector,id] of backOpeners){const button=e.target.closest?.(selector);if(!button)continue;const screen=currentBackScreen();if(screen&&screen!==id)backOrigins[id]={screen,focus:button};break}},true);
 title.addEventListener('click',e=>{for(const [selector,id] of backOpeners){if(!e.target.closest?.(selector))continue;const from=backOrigins[id]?.screen;if(from&&from!=='home'&&from!=='chapters'&&from!==id&&$(from))$(from).hidden=true;break}});
 pcMenuBack=()=>{
  if(recoveryActive||!$('finale').hidden||S?.intro)return false;
  const screen=currentBackScreen();if(!screen)return false;
  const parent=screen==='home'||screen==='chapters'?title:$(screen);
  if(PAD.grab&&parent.contains(PAD.grab)){const input=PAD.grab;PAD.grab=null;for(const r of parent.querySelectorAll('.rng.grab'))r.classList.remove('grab');input.focus();return true}
  const expanded=[...parent.querySelectorAll('details[open]')].filter(e=>e.offsetParent!==null).reverse();
  if(expanded.length){const d=expanded.find(d=>d.contains(document.activeElement))||expanded[0];d.open=false;d.querySelector('summary')?.focus();return true}
  const record=parent.querySelector('#datInfo .ban.open');if(record){record.click();return true}
  if(screen==='lang'){$('lang').hidden=true;restoreBackOrigin('lang');return true}
  if(screen==='conf'){nativeBack('confNo');return true}
  if(screen==='opts'){nativeBack('optsBack');restoreBackOrigin('opts');return true}
  if(screen==='manual'){nativeBack('manBack');restoreBackOrigin('manual');return true}
  if(screen==='kap'){nativeBack('kapBack');restoreBackOrigin('kap');return true}
  if(screen==='prep'){nativeBack('prepBack');title.classList.remove('pc-home');focusBack($('start'+(PREP.ch||1)),'chapters');return true}
  if(screen==='chapters'){nativeBack(home.id);return true}
  if(screen==='pause'){togglePause(false);return true}
  if(screen==='shop'){closeShop();return true}
  if(screen==='end'){nativeBack('menuBtn');return true}
  return false; // Compulsory level choices and in-game dialogs keep their original rules.
 };
 home.id='pcMainMenuBack';
 for(const button of [home,$('prepBack'),$('optsBack'),$('manBack'),$('kapBack'),$('confNo')])button.addEventListener('click',e=>{if(forwardingBack)return;if(pcMenuBack()){e.preventDefault();e.stopImmediatePropagation()}},true);
 addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(e.repeat&&currentBackScreen()){e.preventDefault();e.stopImmediatePropagation();return}if(!e.repeat&&pcMenuBack()){e.preventDefault();e.stopImmediatePropagation()}},true);

 const s=make('style','');s.id='pc-menu-design';const Z='#orient'.repeat(20)+'.pc-menu',P=Z+' :is(#title,#prep,#kap,#manual,#opts,#pause,#lvl,#shop,#end,#conf)',J=Z+' #title:not(.pc-home)';
 s.textContent=`
/* PC concept 2: material, rhythm and typography. All rules stay inside .pc-menu. */
${Z}{--pc-u:min(.05981vw,.10627vh);--pc-paper:#eadcc4;--pc-muted:#b4a58f;--pc-line:#a4895e55;--pc-cloth:url('assets/ui/bae550b007bbde68fdd77839e6acb93db400b5495fb63bdb9a0767d695475275.png')}
${P}{box-sizing:border-box!important;color:var(--pc-paper)!important;font:400 calc(22 * var(--pc-u))/1.5 Georgia,'Times New Roman',serif!important;text-shadow:none!important;background:radial-gradient(ellipse at 50% 42%,#09090bef 0%,#09090bd9 35%,#09090b99 90%),url('assets/tla/aa9137b4e8b6741498c9d2e4e3780f7ca8080c2993b1af28628d3f93165037d4.webp') center/cover,url('${PREMIUM_ASSETS['rozdzial-1']}') center/cover!important;background-blend-mode:normal,screen,normal!important;border:0!important;border-image:none!important;border-radius:0!important;box-shadow:none!important;max-width:none!important;max-height:none!important;width:100%!important;height:100%!important;inset:0!important;padding:calc(34 * var(--pc-u)) calc(70 * var(--pc-u))!important;gap:calc(24 * var(--pc-u))!important;overflow:hidden!important}
${P} *{box-sizing:border-box!important;text-shadow:none!important;scrollbar-width:thin;scrollbar-color:#8b704b #171312}
${P} :is(button,summary,span,b,strong,small,p,h1,h2,h3,h4,label,li,td,th,output){font-family:Georgia,'Times New Roman',serif!important;letter-spacing:normal!important}
${P} :is(button,summary){position:relative;color:var(--pc-paper)!important;border:0!important;border-image:none!important;box-shadow:none!important;border-radius:0!important;background:none!important;font:400 calc(26 * var(--pc-u))/1.25 Georgia,serif!important;text-transform:none!important;transform:none!important;filter:none!important;min-width:0!important;cursor:pointer;transition:color .16s ease,filter .16s ease!important}
${P} :is(button,summary):not(:disabled):is(:hover,:focus-visible,.pf),${P} :is(.tab.on,.nbp-tab[aria-pressed=true]){background:var(--pc-cloth) center/100% 190% no-repeat!important;outline:0!important;color:#fff0d7!important;filter:brightness(1.12)!important}
${P} button:disabled{opacity:.45!important;filter:saturate(.5)!important;cursor:default!important}
${P} :is(.chain-edge,.chain-side,.level-ornament,.m2-ico){display:none!important}
${P} :is(.premium-page-content,.m2k-row,#kapDet,.level-panel,.card,.pbox,.endbox,.nbp-panel,.mbox,.nbp-audio,.nbo-card,.premium-hero){border:0!important;border-image:none!important;border-radius:0!important;box-shadow:none!important;background:none!important}
${P} :is(h1,h2,h3,.premium-page-heading,:where(#kapH),.premium-pause-title){font-weight:400!important;color:var(--pc-paper)!important;line-height:1.2!important}
${P} :is(.premium-page-heading,:where(#kapH),.premium-pause-title){font-size:calc(46 * var(--pc-u))!important;margin:0!important}
${P} :is(p,.mbox li,.m2k-d,.figcap,.nbp-jp,.pc-detail-copy p){font:400 calc(21 * var(--pc-u))/1.6 Georgia,serif!important;color:#d2c3aa!important;overflow-wrap:anywhere!important}
${P} :is(.premium-page-head,.m2-top,.nbp-head){height:calc(72 * var(--pc-u))!important;min-height:0!important;flex:none!important;margin:0!important;padding:0!important;border:0!important;display:flex!important;justify-content:center!important;align-items:center!important;position:relative!important}
${P} :is(.backar,#kapBack,#prepBack){position:absolute!important;left:0!important;top:calc(16 * var(--pc-u))!important;inset-inline-start:0!important;transform:none!important;font:400 calc(20 * var(--pc-u))/1.2 Georgia!important;padding:calc(12 * var(--pc-u)) calc(20 * var(--pc-u))!important;height:auto!important;min-height:0!important;width:auto!important;max-width:none!important}
${P} .tabs .tab,${P} .nbp-tab{padding:calc(16 * var(--pc-u)) calc(28 * var(--pc-u))!important;min-height:calc(58 * var(--pc-u))!important;height:auto!important;font-size:calc(26 * var(--pc-u))!important;flex:none!important}
${P} :is(.btnrow button,.m2k-buy,.pc-primary){padding:calc(18 * var(--pc-u)) calc(38 * var(--pc-u))!important;font-size:calc(29 * var(--pc-u))!important;min-height:calc(65 * var(--pc-u))!important;line-height:1.2!important}
${P} :is(#prepGo,#kapBuy,#resumeBtn,#againBtn,#nextBtn,#premiumPrepare,#confYes){background:var(--pc-cloth) center/100% 190% no-repeat!important}
${P} .tgl{font:400 calc(20 * var(--pc-u))/1.4 Georgia!important;gap:calc(12 * var(--pc-u))!important}
${P} .tgl .sl{width:calc(27 * var(--pc-u))!important;height:calc(27 * var(--pc-u))!important;min-width:calc(27 * var(--pc-u))!important;border:1px solid #92754e!important;background:#171310!important;box-shadow:none!important}
${P} .musrow{font:400 calc(24 * var(--pc-u))/1.5 Georgia!important;padding:calc(12 * var(--pc-u)) 0!important;border-bottom:1px solid #a4895e22!important}
${P} :is(.opsep,.nbp-sub){opacity:.65!important}
/* Title: the same visual coordinates as the approved widescreen composition. */
${Z} #title.pc-home{display:flex!important;flex-direction:column!important;align-items:center!important;padding:calc(25 * var(--pc-u)) calc(70 * var(--pc-u))!important;gap:0!important}
${Z} #title.pc-home .premium-mast{width:100%!important;height:calc(230 * var(--pc-u))!important;min-height:0!important;flex:none!important;display:flex!important;justify-content:center!important}
${Z} #title.pc-home .m2-logo{width:calc(660 * var(--pc-u))!important;height:100%!important;max-width:none!important;min-height:0!important;background-size:contain!important;margin:0!important}
${Z} #title.pc-home .premium-body{display:flex!important;flex:1!important;width:100%!important;min-height:0!important;justify-content:center!important;gap:0!important;border:0!important;background:none!important;box-shadow:none!important}
${Z} #title.pc-home .premium-rail{display:flex!important;flex-direction:column!important;width:calc(460 * var(--pc-u))!important;max-width:none!important;min-width:0!important;gap:0!important;border:0!important}
${Z} #title.pc-home .premium-nav{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:stretch!important;flex:1!important;gap:calc(8 * var(--pc-u))!important;border:0!important;padding:0!important;overflow:visible!important}
${Z} #title.pc-home .premium-nav>button{width:100%!important;height:calc(66 * var(--pc-u))!important;min-height:0!important;max-height:none!important;padding:calc(9 * var(--pc-u)) calc(42 * var(--pc-u))!important;flex:none!important;text-align:center!important;font:400 calc(36 * var(--pc-u))/1.3 Georgia!important}
${Z} #title.pc-home .premium-nav>button *{font:inherit!important;color:inherit!important}
${Z} #title.pc-home :is(.premium-map,.premium-hero,.premium-nav-icon,.pc-home-button,.premium-controls:not(.premium-mode-dock)){display:none!important}
${Z} #title.pc-home #kapBtn>:not(.premium-kap-label),${Z} #title.pc-home #manBtn>:not(.pc-guide-label){display:none!important}
${Z} #title.pc-home #manBtn{font-size:0!important}
${Z} #title.pc-home #manBtn .pc-guide-label{font:400 calc(36 * var(--pc-u))/1.3 Georgia!important}
${Z} #title.pc-home :is(#manBtn,#kapBtn):after{content:none!important}
${Z} #title.pc-home .premium-mode-dock{flex:none!important;background:none!important;border:0!important;padding:0!important;margin:calc(45 * var(--pc-u)) 0 calc(22 * var(--pc-u))!important;min-height:0!important}
${Z} #title.pc-home :is(.m2-mode,.modesw,.nb-mode-select){display:flex!important;justify-content:center!important;align-items:center!important;flex-direction:row!important;gap:calc(35 * var(--pc-u))!important;border:0!important;background:none!important}
${Z} #title.pc-home .nb-mode{width:auto!important;height:auto!important;min-height:0!important;min-width:0!important;position:static!important;padding:calc(12 * var(--pc-u))!important;flex:none!important;font:400 calc(24 * var(--pc-u))/1.3 Georgia!important;background:none!important}
${Z} #title.pc-home .nb-mode.on{color:#f1d9a5!important;border-bottom:1px solid #b99659!important}
${Z} #title.pc-home .nb-mode__title{font:inherit!important;color:inherit!important}
${Z} #title.pc-home .nb-mode :is(img,.nb-mode__marker),${Z} #title.pc-home .m2-lab,${Z} #title.pc-home #storyModeHint{display:none!important}
${Z} #title.pc-home .nb-mode:before,${Z} #title.pc-home .nb-mode:after{content:none!important}
${Z} #title .pc-language{position:absolute!important;right:calc(65 * var(--pc-u))!important;bottom:calc(42 * var(--pc-u))!important;padding:12px!important;font-size:calc(23 * var(--pc-u))!important;z-index:5}
${Z} #title:not(.pc-home) :is(.pc-continue,.pc-language){display:none!important}
/* Journey retains the existing chapter controls, with a panoramic rather than boxed hierarchy. */
${Z} #title:not(.pc-home) .premium-mast{height:calc(155 * var(--pc-u))!important;flex:none!important}
${Z} #title:not(.pc-home) .premium-body{display:grid!important;grid-template-columns:calc(210 * var(--pc-u)) minmax(0,1fr) calc(250 * var(--pc-u))!important;gap:calc(32 * var(--pc-u))!important;flex:1!important;min-height:0!important;border:0!important}
${Z} #title:not(.pc-home) .premium-nav{border:0!important;gap:calc(12 * var(--pc-u))!important}
${Z} #title:not(.pc-home) .premium-nav>button{padding:calc(18 * var(--pc-u))!important;min-height:calc(58 * var(--pc-u))!important;font-size:calc(24 * var(--pc-u))!important}
${Z} #title:not(.pc-home) .premium-banner{border:0!important;mask-image:linear-gradient(#000 80%,transparent)!important}
${Z} #title:not(.pc-home) .premium-map .m2-right{height:calc(105 * var(--pc-u))!important;gap:calc(12 * var(--pc-u))!important}
${Z} #title:not(.pc-home) .premium-map .m2-ch{border:1px solid #a4895e55!important;border-image:none!important;background-size:cover!important}
${Z} #title .premium-caption{font:400 calc(40 * var(--pc-u))/1.2 Georgia!important}
${Z} #title .premium-portrait{mask-image:linear-gradient(#000 75%,transparent)!important}
${Z} #title .premium-hero{border-left:1px solid var(--pc-line)!important;padding-left:calc(24 * var(--pc-u))!important}
/* Preparation: one baseline for the three columns, one footer, clear text measures. */
${Z} #prep{display:flex;flex-direction:column!important;gap:calc(16 * var(--pc-u))!important}
${Z} #prep .premium-prep-head{height:calc(155 * var(--pc-u))!important;min-height:0!important;display:flex!important;justify-content:center!important;align-items:flex-end!important;flex:none!important;position:relative!important;padding-bottom:calc(12 * var(--pc-u))!important}
${Z} #prep .premium-prep-head:before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:calc(360 * var(--pc-u));height:calc(86 * var(--pc-u));background:url('assets/ui/702ff214967aa716ea2d0daa9f67099929b12d3a46f35dad3e3ca018d13feb1a.webp') center/contain no-repeat}
${Z} #prep .pc-prep-title{font:400 calc(44 * var(--pc-u))/1.2 Georgia!important;margin:0!important}
${Z} #prep .premium-prep-body{display:flex!important;flex-direction:column!important;flex:1!important;min-height:0!important;height:0!important;gap:calc(26 * var(--pc-u))!important}
${Z} #prep .prepgrid{display:grid!important;grid-template-columns:minmax(0,29fr) minmax(0,43fr) minmax(0,28fr)!important;grid-template-rows:calc(72 * var(--pc-u)) minmax(0,1fr)!important;column-gap:calc(38 * var(--pc-u))!important;row-gap:calc(20 * var(--pc-u))!important;flex:1!important;min-height:0!important;overflow:hidden!important;padding:0!important}
${Z} #prep .prepgrid>#prepChar{grid-column:1!important;grid-row:1/3!important;display:flex!important;flex-direction:column!important;min-height:0!important;overflow:auto!important;background:none!important;border:0!important;padding:0!important}
${Z} #prep #prepChar>h3{display:none!important}
${Z} #prep #prepChar>div{display:flex!important;flex-direction:column!important;gap:calc(5 * var(--pc-u))!important;padding:0!important;flex:none!important}
${Z} #prep #prepChar .opt{display:flex!important;flex-direction:column!important;align-items:center!important;gap:0!important;width:100%!important;flex:none!important;min-height:0!important;height:auto!important;padding:calc(10 * var(--pc-u)) calc(18 * var(--pc-u))!important;background:none!important;border:0!important}
${Z} #prep #prepChar .opt.on{order:-1!important;padding:0 0 calc(16 * var(--pc-u))!important}
${Z} #prep #prepChar .opt:not(.on) .premium-class-art{display:none!important}
${Z} #prep #prepChar .on .premium-class-art{display:block!important;height:calc(355 * var(--pc-u))!important;width:100%!important;object-fit:cover!important;object-position:center 18%!important;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent),linear-gradient(#000 75%,transparent)!important;mask-composite:intersect!important}
${Z} #prep #prepChar .opt b{font:400 calc(26 * var(--pc-u))/1.25 Georgia!important;color:var(--pc-paper)!important}
${Z} #prep #prepChar .on b{font-size:calc(34 * var(--pc-u))!important}
${Z} #prep #prepChar .opt>span{display:none!important}
${Z} #prep .premium-class-description{display:block!important;font:400 calc(19 * var(--pc-u))/1.5 Georgia!important;color:var(--pc-muted)!important;text-align:left!important;margin:calc(18 * var(--pc-u)) calc(20 * var(--pc-u)) 0!important;padding:calc(15 * var(--pc-u)) 0 0!important;border-top:1px solid var(--pc-line)!important}
${Z} #prep .pc-prep-tabs{grid-column:2/4!important;grid-row:1!important;display:flex!important;align-items:center!important;gap:calc(25 * var(--pc-u))!important;min-width:0!important;border-bottom:1px solid var(--pc-line)!important}
${Z} #prep .pc-prep-tab{font-size:calc(30 * var(--pc-u))!important;padding:calc(16 * var(--pc-u)) calc(26 * var(--pc-u))!important;min-height:0!important}
${Z} #prep .pc-prep-tab[aria-pressed=true]{color:#f2deb7!important;border-bottom:2px solid #803c32!important}
${Z} #prep .prepgrid>.prepbox:not(#prepChar){grid-column:2!important;grid-row:2!important;display:block!important;min-height:0!important;overflow:auto!important;padding:0!important;background:none!important;border:0!important}
${Z} #prep .prepgrid>.prepbox.pc-panel-hidden:not(#prepChar){display:none!important}
${Z} #prep .prepgrid>.prepbox:not(#prepChar)>h3{display:none!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL){display:flex!important;flex-direction:column!important;gap:calc(7 * var(--pc-u))!important;background:none!important;border:0!important;padding:0!important;overflow:visible!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;position:relative!important;min-height:calc(78 * var(--pc-u))!important;height:auto!important;width:100%!important;flex:none!important;margin:0!important;padding:calc(15 * var(--pc-u)) calc(26 * var(--pc-u)) calc(15 * var(--pc-u)) calc(88 * var(--pc-u))!important;border:0!important;border-image:none!important;border-bottom:1px solid #a4895e25!important;background:none!important;text-align:left!important;overflow-wrap:anywhere!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:is(:hover,:focus-visible,.pf){background:var(--pc-cloth) center/100% 190% no-repeat!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt.on:not(:hover):not(:focus-visible):not(.pf){background:#b5944e0a!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt b{font:400 calc(27 * var(--pc-u))/1.25 Georgia!important;display:block!important;position:static!important;margin:0!important;white-space:normal!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>span{display:none!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt small{display:block!important;position:static!important;font:400 calc(16 * var(--pc-u))/1.3 Georgia!important;color:#a89a85!important;margin:calc(7 * var(--pc-u)) 0 0!important}
${Z} #prep .premium-perk-art{position:absolute!important;left:calc(16 * var(--pc-u))!important;top:50%!important;transform:translateY(-50%)!important;width:calc(56 * var(--pc-u))!important;height:calc(56 * var(--pc-u))!important;object-fit:contain!important}
${Z} #prep .pc-perk-detail{grid-column:3!important;grid-row:2!important;min-width:0!important;min-height:0!important;overflow:auto!important;border-left:1px solid var(--pc-line)!important;padding:calc(32 * var(--pc-u)) 0 calc(30 * var(--pc-u)) calc(38 * var(--pc-u))!important;text-align:left!important}
${Z} #prep .pc-detail-icon{display:none!important}
${Z} #prep .pc-detail-copy h3{font:400 calc(34 * var(--pc-u))/1.25 Georgia!important;margin:0 0 calc(32 * var(--pc-u))!important;text-align:left!important}
${Z} #prep .pc-detail-copy p{font-size:calc(22 * var(--pc-u))!important;margin:0 0 calc(22 * var(--pc-u))!important;text-align:left!important}
${Z} #prep .pc-detail-copy *{max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important}
${Z} #prep .premium-prep-controls{display:flex!important;flex-direction:row!important;align-items:center!important;gap:calc(25 * var(--pc-u))!important;flex:none!important;height:calc(94 * var(--pc-u))!important;min-height:0!important;max-height:none!important;border:0!important;border-top:1px solid var(--pc-line)!important;background:none!important;padding:calc(15 * var(--pc-u)) 0 0!important;overflow:visible!important}
${Z} #prep .premium-difficulty-title{display:none!important}
${Z} #prep .pc-footer-info{flex:1!important;min-width:0!important}
${Z} #prep #prepK{display:block!important;position:static!important;font:400 calc(21 * var(--pc-u))/1.2 Georgia!important;letter-spacing:0!important;text-align:left!important;margin:0 0 calc(6 * var(--pc-u))!important;height:auto!important;background:none!important}
${Z} #prep .premium-prep-summary{display:block!important;font:400 calc(17 * var(--pc-u))/1.4 Georgia!important;color:var(--pc-muted)!important;white-space:normal!important;margin:0!important;min-width:0!important;max-width:none!important}
${Z} #prep .premium-prep-controls>.btnrow{margin:0!important;flex:none!important;width:auto!important}
${Z} #prep #prepGo{width:calc(300 * var(--pc-u))!important;min-height:calc(70 * var(--pc-u))!important;height:auto!important;font:400 calc(34 * var(--pc-u))/1.2 Georgia!important;padding:calc(18 * var(--pc-u)) calc(28 * var(--pc-u))!important;background:var(--pc-cloth) center/100% 190% no-repeat!important}
${Z} #prep .pc-popover{position:relative!important;flex:none!important;font-size:calc(20 * var(--pc-u))!important;min-width:calc(170 * var(--pc-u))!important}
${Z} #prep .pc-popover>summary{padding:calc(16 * var(--pc-u))!important;font-size:calc(20 * var(--pc-u))!important}
${Z} #prep .pc-popover>div{position:absolute!important;bottom:100%!important;left:0!important;width:calc(340 * var(--pc-u))!important;max-height:calc(350 * var(--pc-u))!important;overflow:auto!important;background:#151211fa!important;border:1px solid #7e6544!important;padding:calc(20 * var(--pc-u))!important;box-shadow:0 12px 40px #000!important;z-index:20!important}
${Z} #prep .premium-prep-controls #diffSw{position:static!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;height:auto!important;gap:calc(8 * var(--pc-u))!important}
${Z} #prep .premium-prep-controls #diffSw button{position:static!important;inset:auto!important;display:block!important;width:100%!important;min-width:0!important;min-height:calc(48 * var(--pc-u))!important;height:auto!important;padding:calc(12 * var(--pc-u))!important;font-size:calc(22 * var(--pc-u))!important}
${Z} #prep .premium-prep-control-scroll{display:block!important;position:static!important;width:100%!important;max-width:none!important;max-height:none!important;overflow:visible!important}
/* Shrine and Chronicle share a consistent heading, tabs and master/detail baseline. */
${Z} #kap{display:flex;flex-direction:column!important}
${Z} #kap .m2-emb{position:absolute!important;right:0!important;top:calc(18 * var(--pc-u))!important;font:400 calc(27 * var(--pc-u)) Georgia!important}
${Z} #kap #kapTabs{display:flex!important;flex-wrap:wrap!important;gap:calc(8 * var(--pc-u))!important;width:100%!important;margin:0!important;padding:0 0 calc(18 * var(--pc-u))!important;min-height:0!important;align-items:center!important;flex:none!important;border-bottom:1px solid var(--pc-line)!important}
${Z} #kap #kapTabs .tab{font-size:calc(24 * var(--pc-u))!important;min-height:calc(52 * var(--pc-u))!important;padding:calc(12 * var(--pc-u)) calc(23 * var(--pc-u))!important}
${Z} #kap .m2k-tier{position:static!important;font:400 calc(16 * var(--pc-u)) Georgia!important;color:var(--pc-muted)!important;margin-left:auto!important}
${Z} #kap .m2k-body{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,.75fr)!important;gap:calc(45 * var(--pc-u))!important;width:100%!important;flex:1!important;min-height:0!important;padding:0!important}
${Z} #kap:not(.pc-chronicle) .m2k-body{margin-left:26%!important;width:74%!important}
${Z} #kap:not(.pc-chronicle):before{content:'';position:absolute;left:0;bottom:0;top:calc(190 * var(--pc-u));width:30%;background:url('assets/tla/7a06226b13595ae657baf802e50d3a3216056b366b61e3e4cf4db5b2e5142872.webp') center/cover no-repeat;mask-image:linear-gradient(90deg,#000 65%,transparent);pointer-events:none}
${Z} #kap #kapList{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:calc(18 * var(--pc-u))!important;align-content:start!important;overflow:auto!important;padding:0!important;min-height:0!important}
${Z} #kap .m2k-row{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-height:calc(190 * var(--pc-u))!important;height:auto!important;gap:calc(10 * var(--pc-u))!important;padding:calc(15 * var(--pc-u))!important;border-bottom:1px solid #a4895e25!important;text-align:center!important}
${Z} #kap .m2k-row.on{background:var(--pc-cloth) center/100% 165% no-repeat!important}
${Z} #kap .premium-shrine-icon{position:static!important;inset:auto!important;transform:none!important;width:calc(85 * var(--pc-u))!important;height:calc(85 * var(--pc-u))!important;object-fit:contain!important}
${Z} #kap .m2k-row b{font:400 calc(23 * var(--pc-u))/1.25 Georgia!important}
${Z} #kap .m2k-row :is(small,.m2k-pips){font:400 calc(16 * var(--pc-u))/1.4 Georgia!important;color:var(--pc-muted)!important;position:static!important;white-space:normal!important}
${Z} #kap #kapDet{padding:calc(22 * var(--pc-u)) 0 calc(15 * var(--pc-u)) calc(36 * var(--pc-u))!important;border-left:1px solid var(--pc-line)!important;overflow:hidden!important;min-width:0!important;gap:calc(20 * var(--pc-u))!important;text-align:left!important}
${Z} #kap .nbk-scroll{overflow:auto!important;min-height:0!important;width:100%!important;padding:0!important;text-align:left!important}
${Z} #kap #kapHd{font:400 calc(38 * var(--pc-u))/1.2 Georgia!important;text-align:left!important;margin:calc(18 * var(--pc-u)) 0 calc(25 * var(--pc-u))!important}
${Z} #kap #kapDet p{font:400 calc(21 * var(--pc-u))/1.65 Georgia!important;margin:calc(14 * var(--pc-u)) 0!important;text-align:left!important}
${Z} #kap .premium-shrine-detail{width:calc(130 * var(--pc-u))!important;height:calc(130 * var(--pc-u))!important;object-fit:contain!important}
${Z} #kap #kapBuy{height:auto!important;width:100%!important;max-width:none!important;min-height:calc(72 * var(--pc-u))!important;font-size:calc(28 * var(--pc-u))!important;margin-top:auto!important;flex:none!important}
${Z} #kap.pc-chronicle .m2k-body{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
${Z} #kap.pc-chronicle #kapList{grid-template-columns:1fr!important;gap:calc(12 * var(--pc-u))!important}
${Z} #kap.pc-chronicle .m2k-row{align-items:flex-start!important;text-align:left!important;min-height:calc(108 * var(--pc-u))!important;padding:calc(18 * var(--pc-u)) calc(20 * var(--pc-u)) calc(18 * var(--pc-u)) calc(105 * var(--pc-u))!important;position:relative!important}
${Z} #kap.pc-chronicle .premium-shrine-icon{position:absolute!important;left:calc(16 * var(--pc-u))!important;top:calc(20 * var(--pc-u))!important;width:calc(65 * var(--pc-u))!important;height:calc(65 * var(--pc-u))!important}
/* Guide and Options: same rhythm, different reading/navigation needs. */
${Z} :is(#manual,#opts){display:flex;flex-direction:column!important}
${Z} :is(#manual,#opts) .premium-page-layout{display:grid!important;grid-template-columns:calc(285 * var(--pc-u)) minmax(0,1fr)!important;gap:calc(45 * var(--pc-u))!important;flex:1!important;min-height:0!important;width:100%!important;height:0!important}
${Z} :is(#manual,#opts) .premium-page-layout>.tabs{display:flex!important;flex-direction:column!important;gap:calc(8 * var(--pc-u))!important;padding:calc(15 * var(--pc-u)) 0!important;margin:0!important;overflow:auto!important;border:0!important}
${Z} :is(#manual,#opts) .premium-page-layout>.tabs>.tab{text-align:left!important;padding:calc(18 * var(--pc-u)) calc(22 * var(--pc-u))!important;font-size:calc(24 * var(--pc-u))!important;white-space:normal!important}
${Z} :is(#manual,#opts) .premium-page-content{min-width:0!important;min-height:0!important;overflow:auto!important;padding:calc(24 * var(--pc-u)) calc(30 * var(--pc-u))!important;border-left:1px solid var(--pc-line)!important;background:#10101155!important}
${Z} #manual :is(.mbox,.man){width:100%!important;max-width:none!important;margin:0 0 calc(30 * var(--pc-u))!important;padding:0!important}
${Z} #manual .mbox h2{font:400 calc(33 * var(--pc-u))/1.25 Georgia!important;margin:0 0 calc(18 * var(--pc-u))!important;padding:0 0 calc(14 * var(--pc-u))!important;border-bottom:1px solid var(--pc-line)!important;background:none!important}
${Z} #manual .mbox h3{font-size:calc(27 * var(--pc-u))!important}
${Z} #opts .premium-page-layout{grid-template-columns:1fr!important;grid-template-rows:auto minmax(0,1fr)!important;gap:calc(15 * var(--pc-u))!important}
${Z} #opts .premium-page-layout>.tabs{flex-direction:row!important;justify-content:center!important;flex-wrap:wrap!important;overflow:visible!important;padding:0 0 calc(14 * var(--pc-u))!important;border-bottom:1px solid var(--pc-line)!important}
${Z} #opts .premium-page-content{width:100%!important;border:0!important;padding:calc(18 * var(--pc-u)) calc(75 * var(--pc-u))!important;background:none!important}
${Z} #opts :is(.subtabs,.qrow,.langrow){display:flex!important;flex-wrap:wrap!important;gap:calc(14 * var(--pc-u))!important;align-items:center!important;justify-content:center!important;margin:calc(12 * var(--pc-u)) 0 calc(22 * var(--pc-u))!important}
${Z} #opts :is(.stab,.qrow button,.langrow button){font-size:calc(22 * var(--pc-u))!important;padding:calc(12 * var(--pc-u)) calc(22 * var(--pc-u))!important;min-height:0!important}
${Z} #opts :is(.nbo-grid,.nbp-audiogrid){gap:calc(35 * var(--pc-u))!important}
${Z} #opts .nbo-card{padding:calc(30 * var(--pc-u))!important;border-top:1px solid var(--pc-line)!important}
${Z} #opts .nbo-name b{font-size:calc(30 * var(--pc-u))!important;font-weight:400!important}
${Z} #opts .nbo-name small{font-size:calc(18 * var(--pc-u))!important}
${Z} #opts .nbo-top output{font-size:calc(40 * var(--pc-u))!important;font-weight:400!important}
${Z} #opts .nbo-ico{display:none!important}
${Z} #opts .pane :is(h2,h3){font-size:calc(31 * var(--pc-u))!important;background:none!important}
${Z} #opts .fig{max-width:100%!important}
${Z} #opts .keys{font-size:calc(19 * var(--pc-u))!important;line-height:1.5!important}
/* Pause: horizontal tabs above a clear, unframed panel, actions always accessible. */
${Z} #pause{display:flex;flex-direction:column!important;padding-bottom:calc(125 * var(--pc-u))!important}
${Z} #pause .nbp-layout{display:flex!important;flex-direction:column!important;gap:calc(25 * var(--pc-u))!important;flex:1!important;width:100%!important;max-width:none!important;min-height:0!important;margin:0!important}
${Z} #pause .nbp-nav{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;justify-content:center!important;gap:calc(18 * var(--pc-u))!important;flex:none!important;padding:0 0 calc(15 * var(--pc-u))!important;border-bottom:1px solid var(--pc-line)!important}
${Z} #pause .nbp-nav>.btnrow{position:absolute!important;bottom:calc(32 * var(--pc-u))!important;left:calc(70 * var(--pc-u))!important;right:calc(70 * var(--pc-u))!important;margin:0!important;padding:calc(20 * var(--pc-u)) 0 0!important;display:flex!important;justify-content:center!important;flex-direction:row!important;gap:calc(60 * var(--pc-u))!important;border-top:1px solid var(--pc-line)!important;width:auto!important}
${Z} #pause .nbp-panel{width:100%!important;min-width:0!important;min-height:0!important;flex:1!important;overflow:auto!important;padding:calc(24 * var(--pc-u)) calc(70 * var(--pc-u))!important}
${Z} #pause .nbp-pane{max-width:100%!important}
${Z} #pause :is(.loadout-copy,.nbp-audio){font:400 calc(21 * var(--pc-u))/1.5 Georgia!important;background:none!important;border:0!important;padding:calc(25 * var(--pc-u))!important}
${Z} #pause #skillLoadout{border:0!important;padding:0!important;background:none!important}
${Z} #pause :is(.slot-tab,.loadout-pick){border:0!important;border-image:none!important;background:none!important;font-size:calc(23 * var(--pc-u))!important;padding:calc(14 * var(--pc-u)) calc(20 * var(--pc-u))!important}
${Z} #pause :is(.slot-tab,.loadout-pick):is(.on,.pf,:hover,:focus-visible){background:var(--pc-cloth) center/100% 190% no-repeat!important}
${Z} #pause .nbp-journal{padding:0!important;max-width:calc(1100 * var(--pc-u))!important;margin:auto!important}
${Z} #pause .nbp-journal li{padding:calc(18 * var(--pc-u)) 0!important;border-bottom:1px solid #a4895e22!important;font:400 calc(22 * var(--pc-u))/1.6 Georgia!important}
${Z} #pause .nbp-map canvas{max-width:100%!important;max-height:calc(460 * var(--pc-u))!important;width:auto!important;height:auto!important;object-fit:contain!important}
/* Choices, shop, results and confirmation use the same materials, not screen-sized images. */
${Z} :is(#lvl,#shop,#end,#conf){display:flex;flex-direction:column!important;align-items:stretch!important;justify-content:center!important}
${Z} #lvl .level-panel{width:100%!important;max-width:none!important;max-height:100%!important;overflow:auto!important;padding:calc(30 * var(--pc-u))!important;zoom:1!important}
${Z} #lvl #cards{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:calc(35 * var(--pc-u))!important;padding:calc(20 * var(--pc-u)) 0!important}
${Z} #lvl #cards:has(>.card:nth-child(3):last-child){grid-template-columns:repeat(3,minmax(0,1fr))!important}
${Z} #lvl #cards:has(>.card:nth-child(2):last-child){grid-template-columns:repeat(2,minmax(0,1fr))!important}
${Z} :is(#lvl,#shop) .card{padding:calc(30 * var(--pc-u)) calc(24 * var(--pc-u))!important;border-bottom:1px solid var(--pc-line)!important;min-width:0!important;height:auto!important;background:none!important}
${Z} :is(#lvl,#shop) .card:is(:hover,:focus-visible,.pf){background:var(--pc-cloth) center/100% 190% no-repeat!important}
${Z} :is(#lvl,#shop) .card :is(.cn,.ct){font:400 calc(30 * var(--pc-u))/1.3 Georgia!important;white-space:normal!important;overflow-wrap:anywhere!important}
${Z} :is(#lvl,#shop) .card .cd{font:400 calc(20 * var(--pc-u))/1.6 Georgia!important;color:#cabb9f!important}
${Z} #shop .shopc{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:calc(20 * var(--pc-u)) calc(40 * var(--pc-u))!important;overflow:auto!important;min-height:0!important}
${Z} #shop .lvlhead{display:flex!important;justify-content:space-between!important;align-items:center!important;border-bottom:1px solid var(--pc-line)!important;padding-bottom:calc(20 * var(--pc-u))!important}
${Z} #end .endbox{width:min(100%,calc(1100 * var(--pc-u)))!important;max-height:60%!important;overflow:auto!important;margin:0 auto!important;padding:calc(22 * var(--pc-u))!important}
${Z} #end :is(#endTitle,#endKicker){text-align:center!important;font-weight:400!important}
${Z} #end #endKicker{font:400 calc(19 * var(--pc-u))/1.2 Georgia!important;letter-spacing:.18em!important;margin:0!important}
${Z} #end .btnrow{justify-content:center!important;gap:calc(40 * var(--pc-u))!important}
${Z} #conf{align-items:center!important;text-align:center!important;background:#09080bf2!important}
${Z} #conf>*{max-width:calc(850 * var(--pc-u))!important}
${Z} #conf .btnrow{display:flex!important;flex-direction:row!important;gap:calc(40 * var(--pc-u))!important;justify-content:center!important}
${Z} #dialog{border:0!important;border-image:none!important;border-top:1px solid var(--pc-line)!important;background:linear-gradient(#0c0b0ae8,#0c0b0afa)!important;box-shadow:none!important;padding:calc(24 * var(--pc-u)) calc(60 * var(--pc-u))!important;font:400 calc(24 * var(--pc-u))/1.5 Georgia!important}
${Z} #dialog button{background:none!important;border:0!important;border-image:none!important;color:var(--pc-paper)!important;font:400 calc(23 * var(--pc-u))/1.4 Georgia!important;padding:calc(12 * var(--pc-u)) calc(28 * var(--pc-u))!important}
${Z} #dialog button:is(:hover,:focus-visible,.pf){background:var(--pc-cloth) center/100% 190% no-repeat!important}
${Z} #lang{background:radial-gradient(ellipse,#111014fa,#0b0a0be8),url('${PREMIUM_ASSETS['rozdzial-1']}') center/cover!important;border:0!important;font:400 calc(27 * var(--pc-u)) Georgia!important}
@media(prefers-reduced-motion:reduce){${P} *{transition:none!important;animation:none!important}}

${Z} #prep #prepChar .opt:before,${Z} #prep #prepChar .opt:after{content:none!important;display:none!important}
${Z} #prep #prepChar .on .premium-class-art{mask-image:linear-gradient(#000 80%,transparent)!important;mask-composite:add!important;object-fit:cover!important}
${Z} #prep #prepChar .opt:not(.on){font-size:calc(21 * var(--pc-u))!important;padding:calc(6 * var(--pc-u))!important}
${Z} #prep #prepChar .opt:not(.on) b{font-size:calc(21 * var(--pc-u))!important}
${Z} #prep #prepChar .premium-class-description{font-size:calc(17 * var(--pc-u))!important;margin:calc(12 * var(--pc-u)) calc(20 * var(--pc-u)) 0!important;flex:none!important}
${Z} #prep .premium-prep-controls .premium-prep-summary{font-size:calc(17 * var(--pc-u))!important;line-height:1.5!important}
${Z} #prep .pc-footer-info #prepK{text-align:left!important}
${Z} #title:not(.pc-home) #manBtn{font-size:0!important}
${Z} #title:not(.pc-home) #manBtn>:not(.pc-guide-label){display:none!important}
${Z} #title:not(.pc-home) #manBtn:after{content:none!important}
${Z} #title:not(.pc-home) #manBtn .pc-guide-label{font:400 calc(24 * var(--pc-u))/1.25 Georgia!important}
${P} :is(.m2k-row.on,.tab.on,.nbp-tab[aria-pressed=true]){background-color:transparent!important}
${P} button:is(:hover,:focus-visible,.pf):not(:disabled){isolation:isolate!important;background:none!important;outline:0!important}
${P} button:is(:hover,:focus-visible,.pf):not(:disabled):after{content:''!important;display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;transform:none!important;background:var(--pc-cloth) center/100% 190% no-repeat!important;filter:brightness(.68) saturate(.6)!important;z-index:-1!important;pointer-events:none!important;border:0!important;box-shadow:none!important}

${Z} #kap.pc-chronicle .m2k-row b{display:block!important;width:100%!important;text-align:left!important}
${Z} #kap.pc-chronicle .m2k-row:not(:has(img)){padding-left:calc(24 * var(--pc-u))!important}
${Z} #kap.pc-chronicle .m2k-row small{text-align:left!important;width:100%!important}
${Z} #kap #kapTabs .tab{white-space:normal!important;text-align:center!important}
${Z} #manual .premium-page-content{max-width:calc(1100 * var(--pc-u))!important;padding-right:calc(45 * var(--pc-u))!important}
${Z} #manual .mbox :is(p,li){max-width:75ch!important}

${P} :is(h1:not(:where(#endTitle)),h2,h3){border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;min-height:0!important;height:auto!important;max-width:100%!important;padding:0!important}
${Z} #kap :is(#kapH,#kapHd){text-transform:none!important}
${Z} #opts .nbo-ah h3{border:0!important;border-image:none!important;background:none!important;padding:0!important;height:auto!important;min-height:0!important}
${Z} #title .premium-banner{background-size:cover!important;background-position:center!important;border:0!important;border-image:none!important}
${Z} #title .premium-hero{background:none!important;box-shadow:none!important}
${Z} #title .premium-map #start1{background-image:url('${PREMIUM_ASSETS['rozdzial-1-mini']}')!important}
${Z} #title .premium-map #start2{background-image:url('${PREMIUM_ASSETS['rozdzial-2-mini']}')!important}
${Z} #title .premium-map #start3{background-image:url('${PREMIUM_ASSETS['rozdzial-3-mini']}')!important}
${Z} #title .premium-map #start4{background-image:url('${PREMIUM_ASSETS['rozdzial-4-mini']}')!important}
${Z} #title .premium-map #start5{background-image:url('${PREMIUM_ASSETS['rozdzial-5-mini']}')!important}
${Z} #title .premium-map #start6{background-image:url('${PREMIUM_ASSETS['rozdzial-6-mini']}')!important}
${Z} #title .premium-map .m2-ch{background-size:cover!important;background-position:center!important}
${Z} #title:not(.pc-home) .premium-go{min-height:calc(70 * var(--pc-u))!important;height:auto!important;flex:none!important;font-size:calc(29 * var(--pc-u))!important}
${Z} #title.pc-home .premium-nav>button:is(:hover,:focus-visible,.pf):before{content:'▸'!important;position:absolute!important;left:calc(18 * var(--pc-u))!important;top:50%!important;transform:translateY(-50%)!important;display:block!important;color:#d6b578!important;font:400 calc(28 * var(--pc-u)) Georgia!important;background:none!important;width:auto!important;height:auto!important}
${Z} #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt.on>b{color:#eed09a!important}

${Z} :is(#title,#prep,#kap,#manual,#opts,#pause,#lvl,#shop,#end,#conf,#dialog,#lang)[hidden]{display:none!important}
${Z} #pause .nbp-nav{overflow:visible!important;position:static!important}
${Z} #pause .nbp-nav .btnrow{flex-wrap:nowrap!important;align-items:center!important;height:calc(90 * var(--pc-u))!important;min-height:0!important;max-height:none!important}
${Z} #pause .nbp-nav .btnrow button{width:calc(340 * var(--pc-u))!important;min-width:0!important;height:calc(65 * var(--pc-u))!important;min-height:0!important;flex:0 1 calc(340 * var(--pc-u))!important;margin:0!important;font:400 calc(27 * var(--pc-u))/1.2 Georgia!important}
${Z} #pause .nbp-audiogrid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:calc(30 * var(--pc-u))!important}
${Z} #pause .nbp-ah{grid-column:1/-1!important}
${Z} #pause .nbp-audio{padding:calc(20 * var(--pc-u))!important}
${Z} #end #endTitle{display:block!important;position:static!important;transform:none!important;width:calc(520 * var(--pc-u))!important;max-width:70%!important;height:calc(135 * var(--pc-u))!important;min-height:0!important;max-height:none!important;background-position:center!important;background-size:contain!important;opacity:1!important;filter:none!important;margin:0 auto!important}
${Z} #end .nbs-t{background:none!important;border:0!important;border-bottom:1px solid var(--pc-line)!important;border-radius:0!important;box-shadow:none!important;padding:calc(16 * var(--pc-u)) calc(8 * var(--pc-u))!important}
${Z} #end .nbs-t small{font:400 calc(15 * var(--pc-u))/1.3 Georgia!important;letter-spacing:.02em!important}
${Z} #end .nbs-t b{font:400 calc(36 * var(--pc-u))/1.2 Georgia!important;text-shadow:none!important}
${Z} #end>.btnrow{position:static!important;background:none!important;padding:calc(18 * var(--pc-u)) 0!important;margin:0!important;flex:none!important}

${Z} #lvl #cards .card{font:400 calc(19 * var(--pc-u))/1.5 Georgia!important;padding:calc(26 * var(--pc-u)) calc(24 * var(--pc-u))!important}
${Z} #lvl #cards .card :is(span,b,small,p,li,div){font:400 calc(19 * var(--pc-u))/1.5 Georgia!important;letter-spacing:0!important}
${Z} #lvl #cards .card .cn,${Z} #lvl #cards .card .cn *{font:400 calc(29 * var(--pc-u))/1.3 Georgia!important}
${Z} #lvl #cards .card :is(.ck,.ct){font:400 calc(15 * var(--pc-u))/1.4 Georgia!important;color:#b9a787!important}
${Z} #lvl #cards .card .cl,${Z} #lvl #cards .card .cl *{font:400 calc(18 * var(--pc-u))/1.4 Georgia!important;color:#c9ad78!important}
${Z} #lvl #cards .card .cd,${Z} #lvl #cards .card .cd *{font:400 calc(19 * var(--pc-u))/1.55 Georgia!important;color:#d6c8af!important}
${Z} #lvl #cards .card .ic{width:calc(100 * var(--pc-u))!important;height:calc(100 * var(--pc-u))!important;min-width:0!important;flex:none!important}
${Z} #lvl #lvlTitle{font:400 calc(50 * var(--pc-u))/1.2 Georgia!important}
${Z} #lvl .level-panel .btnrow{display:flex!important;justify-content:center!important;flex:none!important}
${Z} #shop .card .ic{width:calc(105 * var(--pc-u))!important;height:calc(105 * var(--pc-u))!important;flex:none!important}
${Z} #shop .card .ck{font:400 calc(14 * var(--pc-u))/1.3 Georgia!important;color:#ad9674!important}
${Z} #kap .m2-emb:before{content:'${T('Popioły','Ashes')} ·';display:inline!important;position:static!important;width:auto!important;height:auto!important;background:none!important;font:400 calc(18 * var(--pc-u)) Georgia!important;color:var(--pc-muted)!important;margin-right:.5em!important}
${Z} #kap .m2k-row.on{background:none!important}
${Z} #kap .m2k-row.on:before{content:'◆'!important;display:block!important;position:absolute!important;left:calc(8 * var(--pc-u))!important;top:calc(12 * var(--pc-u))!important;right:auto!important;bottom:auto!important;width:auto!important;height:auto!important;background:none!important;color:#d6b578!important;font:400 calc(15 * var(--pc-u)) Georgia!important;transform:none!important;border:0!important;pointer-events:none!important}
${Z} #end #endKicker{width:100%!important;max-width:none!important;align-self:center!important;text-align:center!important}
${Z} #end .nbs-t{padding:calc(8 * var(--pc-u))!important;gap:calc(4 * var(--pc-u))!important}
${Z} #end .nbs-t i{min-height:0!important;font-size:calc(13 * var(--pc-u))!important}
${Z} #end .nbs-t i:empty{display:none!important}
${Z} #end .endbox{min-height:0!important;flex:0 1 auto!important;max-height:none!important}
body.contrast ${Z}{--pc-paper:#fff3da;--pc-muted:#d7c9b0;--pc-line:#d9b77e88}

/* Finishing pass: a clear heading hierarchy, currency identity and bounded loadout slots. */
${P} :is(.premium-page-heading,:where(#kapH),.premium-pause-title,.pc-prep-title){font-weight:600!important;color:#f1d4a1!important;letter-spacing:.035em!important}
${P} .pc-heading-rule{position:absolute!important;bottom:calc(-7 * var(--pc-u))!important;left:50%!important;transform:translateX(-50%)!important;display:block!important;width:calc(260 * var(--pc-u))!important;height:1px!important;background:linear-gradient(90deg,transparent,#ac8655 35%,#ac8655 65%,transparent)!important;pointer-events:none!important}
${P} .pc-heading-rule:after{content:'';display:block;position:absolute;left:50%;top:50%;width:calc(6 * var(--pc-u));height:calc(6 * var(--pc-u));background:#bd965e;box-shadow:0 0 0 calc(5 * var(--pc-u)) #111013;transform:translate(-50%,-50%) rotate(45deg)}
${Z} #opts .pane :is(h2,h3),${Z} #manual .mbox :is(h2,h3),${Z} #pause #skillLoadout>h2{font:600 calc(31 * var(--pc-u))/1.25 Georgia!important;color:#e6c58e!important;letter-spacing:.025em!important;text-align:left!important;margin:0 0 calc(16 * var(--pc-u))!important;padding:0 0 calc(16 * var(--pc-u))!important;border:0!important;border-bottom:1px solid var(--pc-line)!important;background:none!important}
${Z} #opts .pane :is(p,.figcap),${Z} #manual .mbox :is(p,li){font-size:calc(19 * var(--pc-u))!important;line-height:1.65!important;color:#c5b69e!important}
${Z} #opts .tgl{font-size:calc(19 * var(--pc-u))!important;line-height:1.45!important;padding:calc(9 * var(--pc-u)) 0!important}
${Z} #opts .opsep{height:1px!important;background:linear-gradient(90deg,transparent,#9f7f4b66,transparent)!important;margin:calc(26 * var(--pc-u)) auto!important;width:100%!important}
${Z} #prep :is(#prepCh,#prepCurseL) .opt{padding-left:calc(26 * var(--pc-u))!important;min-height:calc(90 * var(--pc-u))!important;gap:calc(10 * var(--pc-u))!important}
${Z} #prep :is(#prepCh,#prepCurseL) .opt>.nb-rw{display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap!important;gap:calc(7 * var(--pc-u))!important;font:400 calc(17 * var(--pc-u))/1.2 Georgia!important;color:#c7ae7c!important;margin:0!important}
${Z} #prep :is(.nb-rw,.pc-reward) i{display:inline-block!important;position:static!important;flex:none!important;width:calc(25 * var(--pc-u))!important;height:calc(25 * var(--pc-u))!important;margin:0!important;background-position:center!important;background-size:contain!important;background-repeat:no-repeat!important}
${Z} #prep :is(.nb-rw,.pc-reward) .nb-ash{background-image:var(--ash-ic)!important}
${Z} #prep :is(.nb-rw,.pc-reward) .nb-coin{background-image:var(--nb-coin-ic)!important;margin-left:calc(14 * var(--pc-u))!important}
${Z} #prep .pc-perk-detail{padding:calc(12 * var(--pc-u)) 0 calc(12 * var(--pc-u)) calc(28 * var(--pc-u))!important}
${Z} #prep .pc-detail-copy{position:relative!important;padding:calc(26 * var(--pc-u)) calc(24 * var(--pc-u))!important;background:linear-gradient(145deg,#131116c9,#0b0a0e70)!important;border-top:1px solid #b18a5355!important;border-bottom:1px solid #b18a5333!important;min-height:calc(340 * var(--pc-u))!important}
${Z} #prep .pc-detail-kicker{display:block!important;font:400 calc(13 * var(--pc-u))/1.4 Georgia!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:#a78a5e!important;margin-bottom:calc(18 * var(--pc-u))!important}
${Z} #prep .pc-detail-copy h3{font:600 calc(31 * var(--pc-u))/1.3 Georgia!important;color:#efcf99!important;margin:0 0 calc(26 * var(--pc-u))!important;padding:0 0 calc(22 * var(--pc-u))!important;border-bottom:1px solid var(--pc-line)!important}
${Z} #prep .pc-detail-copy p{font:400 calc(19 * var(--pc-u))/1.7 Georgia!important;color:#d6c8b1!important;margin:0 0 calc(17 * var(--pc-u))!important}
${Z} #prep .pc-detail-copy .pc-lock-note{font-size:calc(16 * var(--pc-u))!important;color:#a89880!important;border-top:1px solid #a4895e25!important;padding-top:calc(18 * var(--pc-u))!important}
${Z} #prep .pc-detail-rewards{margin-top:calc(32 * var(--pc-u))!important;padding-top:calc(22 * var(--pc-u))!important;border-top:1px solid var(--pc-line)!important}
${Z} #prep .pc-detail-rewards h4{font:400 calc(13 * var(--pc-u))/1.3 Georgia!important;color:#ad9369!important;text-transform:uppercase!important;letter-spacing:.16em!important;margin:0 0 calc(20 * var(--pc-u))!important}
${Z} #prep .pc-reward-row{display:flex!important;flex-wrap:wrap!important;gap:calc(24 * var(--pc-u))!important}
${Z} #prep .pc-reward{display:grid!important;grid-template-columns:auto auto!important;grid-template-rows:auto auto!important;align-items:center!important;justify-content:start!important;gap:calc(6 * var(--pc-u)) calc(10 * var(--pc-u))!important}
${Z} #prep .pc-reward i{grid-column:1!important;grid-row:1!important;width:calc(36 * var(--pc-u))!important;height:calc(36 * var(--pc-u))!important;margin:0!important}
${Z} #prep .pc-reward-value{font:400 calc(29 * var(--pc-u))/1.2 Georgia!important;color:#f1d7a2!important;grid-column:2!important;grid-row:1!important}
${Z} #prep .pc-reward-name{font:400 calc(15 * var(--pc-u))/1.3 Georgia!important;color:#c0ac89!important;grid-column:1/3!important;grid-row:2!important;text-align:center!important}
${Z} #prep .pc-detail-copy .pc-reward-note{font-size:calc(14 * var(--pc-u))!important;margin:calc(16 * var(--pc-u)) 0 0!important;color:#ad9c81!important}
${Z} #title #kronBtn .nbk-new{display:inline-grid!important;place-items:center!important;position:absolute!important;top:50%!important;right:calc(26 * var(--pc-u))!important;transform:translateY(-50%)!important;width:calc(27 * var(--pc-u))!important;height:calc(27 * var(--pc-u))!important;min-width:0!important;margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;font-size:0!important;line-height:0!important;color:#e9c584!important}
${Z} #title #kronBtn .nbk-new:before{content:'✦'!important;font:400 calc(23 * var(--pc-u))/1 Georgia!important;color:#dfb76e!important;display:block!important}
${Z} #pause .nbp-sub{font:400 calc(15 * var(--pc-u))/1.3 Georgia!important;margin-left:calc(18 * var(--pc-u))!important;color:#b09971!important}
${Z} #pause #skillLoadout{max-width:calc(1250 * var(--pc-u))!important;margin:0 auto!important;padding:calc(24 * var(--pc-u)) calc(34 * var(--pc-u))!important;background:linear-gradient(145deg,#121015a8,#0b0a0e55)!important;border-top:1px solid #a4895e44!important;border-bottom:1px solid #a4895e33!important;text-align:left!important}
${Z} #pause #skillLoadout>p{font:400 calc(18 * var(--pc-u))/1.65 Georgia!important;color:#b9aa91!important;text-align:left!important;margin:0 0 calc(23 * var(--pc-u))!important;max-width:82ch!important}
${Z} #pause #skillLoadout .slot-pick{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(0,1fr)!important;grid-template-columns:none!important;gap:calc(18 * var(--pc-u))!important;margin:calc(28 * var(--pc-u)) 0!important}
${Z} #pause #skillLoadout .slot-tab{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr) auto!important;align-items:center!important;justify-items:center!important;gap:calc(12 * var(--pc-u))!important;min-height:calc(165 * var(--pc-u))!important;height:auto!important;padding:calc(18 * var(--pc-u)) calc(15 * var(--pc-u))!important;border:1px solid #8c724744!important;background:linear-gradient(155deg,#2a211d80,#0c0b0d55)!important;box-shadow:inset 0 1px #d0ac6a0c!important}
${Z} #pause #skillLoadout .slot-tab.chosen{border-color:#aa814a!important;box-shadow:inset 0 -2px #ac854e!important}
${Z} #pause #skillLoadout .loadout-key{grid-column:1!important;grid-row:1!important;font:400 calc(14 * var(--pc-u))/1.2 Georgia!important;color:#bba17a!important}
${Z} #pause #skillLoadout .loadout-name{grid-column:1!important;grid-row:3!important;font:400 calc(20 * var(--pc-u))/1.3 Georgia!important;color:#dfceb0!important;text-align:center!important}
${Z} #pause #skillLoadout .slot-tab .ic{grid-column:1!important;grid-row:2!important;width:calc(52 * var(--pc-u))!important;height:calc(52 * var(--pc-u))!important;margin:0!important}
${Z} #pause #skillLoadout .empty-name{grid-row:2/4!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:calc(12 * var(--pc-u))!important;color:#aa9a81!important;font-size:calc(18 * var(--pc-u))!important}
${Z} #pause #skillLoadout .empty-name:before{content:'+';display:block;color:#98794e88;font:400 calc(38 * var(--pc-u))/1 Georgia}
${Z} #pause #skillLoadout .loadout-state{border-left:2px solid #99744766!important;padding:calc(8 * var(--pc-u)) calc(18 * var(--pc-u))!important;margin:0 0 calc(18 * var(--pc-u))!important;font-size:calc(16 * var(--pc-u))!important}
${Z} #pause #skillLoadout .loadout-state+.loadout-state{border:0!important;padding:calc(20 * var(--pc-u)) calc(24 * var(--pc-u))!important;background:#08070966!important;color:#d4c1a0!important;font-size:calc(18 * var(--pc-u))!important;max-width:none!important}
${Z} #pause #skillLoadout .pc-reserve-title{font:600 calc(23 * var(--pc-u))/1.3 Georgia!important;color:#dfc18a!important;text-align:left!important;margin:calc(30 * var(--pc-u)) 0 calc(16 * var(--pc-u))!important;padding-top:calc(22 * var(--pc-u))!important;border-top:1px solid var(--pc-line)!important}
${Z} #pause #skillLoadout .slot-inventory{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:calc(12 * var(--pc-u))!important}
${Z} #pause #skillLoadout .slot-inventory button.go{min-height:calc(85 * var(--pc-u))!important;grid-template-columns:calc(48 * var(--pc-u)) minmax(0,1fr)!important;gap:calc(16 * var(--pc-u))!important;padding:calc(15 * var(--pc-u)) calc(18 * var(--pc-u))!important;border:0!important;border-bottom:1px solid #a4895e33!important;background:none!important}
${Z} #pause #skillLoadout .slot-inventory button.go .ic{width:calc(48 * var(--pc-u))!important;height:calc(48 * var(--pc-u))!important}
${Z} #pause #skillLoadout .loadout-copy{font:400 calc(22 * var(--pc-u))/1.4 Georgia!important;color:#e3ceb0!important;text-align:left!important;padding:0!important}
${Z} #pause #skillLoadout .loadout-copy small{font:400 calc(14 * var(--pc-u))/1.45 Georgia!important;color:#ac9b80!important;margin-top:calc(7 * var(--pc-u))!important}
${Z} #pause #skillLoadout .slot-inventory>[data-equip=""]{grid-column:1/-1!important;display:block!important;min-height:calc(40 * var(--pc-u))!important;font-size:calc(17 * var(--pc-u))!important;text-align:left!important;padding:calc(10 * var(--pc-u)) 0!important}
${Z} #pause #skillLoadout .slot-inventory>[data-equip=""]:only-child:disabled{display:none!important}
/* Page titles use the game's medieval face on the same torn burgundy cloth. */
${P} .pc-fantasy-title{font:600 calc(52 * var(--pc-u))/1.05 Grenze,Georgia,serif!important;letter-spacing:.045em!important;color:#efd8ae!important;background:var(--pc-cloth) center/100% 190% no-repeat!important;padding:calc(10 * var(--pc-u)) calc(52 * var(--pc-u)) calc(15 * var(--pc-u))!important;width:fit-content!important;max-width:80%!important;text-align:center!important;text-shadow:0 2px 2px #070506!important}
${Z} #prep .pc-fantasy-title{font-size:calc(46 * var(--pc-u))!important;line-height:1.05!important;padding:calc(8 * var(--pc-u)) calc(50 * var(--pc-u)) calc(12 * var(--pc-u))!important}
${P} .pc-heading-rule{width:calc(200 * var(--pc-u))!important;bottom:calc(-9 * var(--pc-u))!important;opacity:.8!important}
${Z} #prep .pc-detail-copy h3,${Z} #kap #kapHd{font-family:Grenze,Georgia,serif!important;font-weight:600!important;font-size:calc(36 * var(--pc-u))!important;line-height:1.2!important;color:#e8c995!important}
${Z} #opts .pane :is(h2,h3),${Z} #manual .mbox :is(h2,h3),${Z} #pause #skillLoadout>h2{font-family:Grenze,Georgia,serif!important;font-weight:600!important;font-size:calc(30 * var(--pc-u))!important}
/* Settings are grouped by their real headings; all controls and listeners stay on the same elements. */
${Z} #opts :is(#pane-set,#pane-gfx):not([hidden]){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:calc(24 * var(--pc-u)) calc(34 * var(--pc-u))!important;align-items:start!important}
${Z} #opts .pc-section-separator,${Z} #opts .pc-option-section .opsep{display:none!important}
${Z} #opts .pc-option-section{min-width:0!important;padding:calc(20 * var(--pc-u)) calc(24 * var(--pc-u))!important;background:linear-gradient(145deg,#161218bb,#0c0b0e55)!important;border-top:1px solid #a4895e55!important}
${Z} #opts .pc-option-section h3.sth{font:600 calc(29 * var(--pc-u))/1.2 Grenze,Georgia,serif!important;color:#e8c995!important;text-align:left!important;margin:0 0 calc(16 * var(--pc-u))!important;padding:0 0 calc(13 * var(--pc-u))!important;border-bottom:1px solid #a4895e44!important}
${Z} #opts .pc-option-section .figcap{font:400 calc(16 * var(--pc-u))/1.6 Georgia!important;text-align:left!important;margin:calc(12 * var(--pc-u)) 0!important;color:#b7a78b!important}
${Z} #opts .pc-option-section :is(.qrow,.langrow,.modesw){justify-content:flex-start!important;flex-wrap:wrap!important;gap:calc(6 * var(--pc-u))!important;margin:calc(10 * var(--pc-u)) 0!important}
${Z} #opts .pc-option-section button.go,${Z} #opts .pc-option-section #tsRow button{font-size:calc(19 * var(--pc-u))!important;min-height:calc(42 * var(--pc-u))!important;padding:calc(9 * var(--pc-u)) calc(13 * var(--pc-u))!important}
${Z} #opts .pc-option-section .musrow{font-size:calc(19 * var(--pc-u))!important;gap:calc(10 * var(--pc-u))!important;padding:calc(8 * var(--pc-u)) 0!important}
${Z} #opts .pc-option-section .tgl{font-size:calc(17 * var(--pc-u))!important;min-height:calc(34 * var(--pc-u))!important;padding:calc(5 * var(--pc-u)) 0!important;margin:calc(5 * var(--pc-u)) 0!important}
${Z} #opts #pane-gfx>.pc-option-section:last-child{grid-column:1/-1!important}
/* With learned skills, slots and reserve sit side by side instead of pushing the reserve below the fold. */
${Z} #pause #skillLoadout:has(.pc-loadout-reserve){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;column-gap:calc(30 * var(--pc-u))!important;row-gap:calc(14 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve)>h2{grid-column:1/-1!important;margin-bottom:0!important;padding-bottom:calc(12 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve)>p:not(.loadout-state){grid-column:1/-1!important;margin-bottom:calc(6 * var(--pc-u))!important;font-size:calc(17 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve) .slot-pick{grid-column:1!important;grid-row:3!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:calc(12 * var(--pc-u))!important;margin:0!important;align-self:start!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve) .slot-tab{min-height:calc(120 * var(--pc-u))!important;padding:calc(12 * var(--pc-u))!important;gap:calc(8 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve) .slot-tab .ic{width:calc(42 * var(--pc-u))!important;height:calc(42 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve) .loadout-name{font-size:calc(18 * var(--pc-u))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve)>.loadout-state{grid-column:1!important;grid-row:4!important;align-self:start!important;font-size:calc(15 * var(--pc-u))!important;margin:0!important}
${Z} #pause .pc-loadout-reserve{grid-column:2!important;grid-row:3/5!important;border-left:1px solid var(--pc-line)!important;padding-left:calc(26 * var(--pc-u))!important;min-width:0!important}
${Z} #pause #skillLoadout .pc-reserve-title{font:600 calc(26 * var(--pc-u))/1.2 Grenze,Georgia,serif!important;margin:0 0 calc(12 * var(--pc-u))!important;padding:0 0 calc(12 * var(--pc-u))!important;border:0!important;border-bottom:1px solid #a4895e44!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory{grid-template-columns:1fr!important;gap:calc(7 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory button.go{min-height:calc(65 * var(--pc-u))!important;padding:calc(8 * var(--pc-u)) calc(10 * var(--pc-u))!important;grid-template-columns:calc(36 * var(--pc-u)) minmax(0,1fr)!important;gap:calc(12 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory .ic{width:calc(36 * var(--pc-u))!important;height:calc(36 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .loadout-copy{font-size:calc(19 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .loadout-copy small{font-size:calc(13 * var(--pc-u))!important;margin-top:calc(3 * var(--pc-u))!important}
${Z} #prep .premium-prep-head:before{content:none!important;display:none!important}
${Z} #prep .premium-prep-head{height:calc(100 * var(--pc-u))!important;align-items:center!important;padding-bottom:0!important}
${P} .pc-fantasy-title{font-family:'Grenze Gotisch',Georgia,serif!important;font-weight:600!important;letter-spacing:.025em!important}
${Z} #prep .pc-detail-copy h3,${Z} #kap #kapHd,${Z} #opts .pane :is(h2,h3),${Z} #opts .pc-option-section h3.sth,${Z} #manual .mbox :is(h2,h3),${Z} #pause #skillLoadout>h2,${Z} #pause #skillLoadout .pc-reserve-title{font-family:'Grenze Gotisch',Georgia,serif!important;font-weight:600!important;letter-spacing:.015em!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory{gap:calc(5 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory button.go{min-height:calc(54 * var(--pc-u))!important;padding:calc(6 * var(--pc-u)) calc(10 * var(--pc-u))!important;grid-template-columns:calc(34 * var(--pc-u)) minmax(0,1fr)!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .slot-inventory button.go .ic{width:calc(34 * var(--pc-u))!important;height:calc(34 * var(--pc-u))!important}
${Z} #pause #skillLoadout .pc-loadout-reserve .loadout-copy small{font-size:max(12px,calc(13 * var(--pc-u) * var(--nbts,1)))!important}
${Z} #pause #skillLoadout:has(.pc-loadout-reserve){padding-top:calc(18 * var(--pc-u))!important;padding-bottom:calc(18 * var(--pc-u))!important;row-gap:calc(10 * var(--pc-u))!important}

/* PC chapter atlas: a single destination, a readable chapter rail, no duplicate mobile sidebar. */
${Z} #title .pc-profile{position:absolute!important;right:calc(70 * var(--pc-u))!important;top:calc(38 * var(--pc-u))!important;display:flex!important;align-items:center!important;gap:calc(16 * var(--pc-u))!important;padding:calc(12 * var(--pc-u)) calc(20 * var(--pc-u))!important;border-top:1px solid #a4895e55!important;border-bottom:1px solid #a4895e33!important;background:linear-gradient(110deg,#141014bb,#09090b44)!important;z-index:3!important}
${Z} #title .pc-profile-ash{width:calc(42 * var(--pc-u))!important;height:calc(42 * var(--pc-u))!important;object-fit:contain!important}
${Z} #title .pc-profile-stat{display:flex!important;flex-direction:column!important;gap:calc(4 * var(--pc-u))!important;min-width:calc(62 * var(--pc-u))!important;text-align:left!important}
${Z} #title .pc-profile-stat:last-child{border-left:1px solid var(--pc-line)!important;padding-left:calc(22 * var(--pc-u))!important;margin-left:calc(10 * var(--pc-u))!important}
${Z} #title .pc-profile-stat small{font:400 calc(13 * var(--pc-u))/1.2 Georgia!important;color:#bca177!important}
${Z} #title .pc-profile-stat strong{font:400 calc(29 * var(--pc-u))/1 Georgia!important;color:#f0dbb3!important;font-variant-numeric:tabular-nums!important}
${Z} #title.pc-home :is(.pc-journey-head,.pc-journey-footer,.pc-journey-gear){display:none!important}
${J}{gap:calc(22 * var(--pc-u))!important;padding-top:calc(30 * var(--pc-u))!important;padding-bottom:calc(30 * var(--pc-u))!important}
${J} .pc-profile{right:calc(135 * var(--pc-u))!important;top:calc(31 * var(--pc-u))!important}
${J} .premium-mast,${J} .premium-hero,${J} .premium-mode-dock,${J} .premium-controls{display:none!important}
${J} .pc-journey-head{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;height:calc(100 * var(--pc-u))!important;min-height:0!important;flex:none!important;width:100%!important}
${J} .pc-journey-head .pc-fantasy-title{font-size:calc(50 * var(--pc-u))!important;padding:calc(10 * var(--pc-u)) calc(55 * var(--pc-u)) calc(14 * var(--pc-u))!important;margin:0!important}
${J} .pc-home-button{position:absolute!important;left:0!important;top:calc(22 * var(--pc-u))!important;width:auto!important;height:auto!important;min-height:0!important;padding:calc(13 * var(--pc-u)) calc(18 * var(--pc-u))!important;font:400 calc(20 * var(--pc-u))/1.2 Georgia!important}
${J} .premium-body{display:flex!important;position:static!important;transform:none!important;filter:none!important;contain:none!important;flex:1!important;min-height:0!important;gap:0!important;width:100%!important;padding:0!important;background:none!important;box-shadow:none!important}
${J} .premium-rail,${J} .premium-nav{display:contents!important}
${J} .premium-nav>button:not(:is(#kapBtn,#kronBtn,#optsBtn)){display:none!important}
${J} .premium-nav :is(.premium-nav-icon,.m2-ico){display:none!important}
${J} #kapBtn,${J} #kronBtn{position:absolute!important;bottom:calc(45 * var(--pc-u))!important;left:calc(70 * var(--pc-u))!important;width:calc(175 * var(--pc-u))!important;height:calc(60 * var(--pc-u))!important;min-height:0!important;padding:calc(15 * var(--pc-u)) calc(20 * var(--pc-u))!important;font:400 calc(25 * var(--pc-u))/1.2 Georgia!important;text-align:left!important;z-index:2!important}
${J} #kronBtn{left:calc(265 * var(--pc-u))!important}
${J} #kapBtn>:not(.premium-kap-label){display:none!important}
${J} #kapBtn .premium-kap-label{display:block!important;font:inherit!important}
${J} #kapBtn:after{content:''!important;font-size:0!important}
${J} #optsBtn{position:absolute!important;right:calc(70 * var(--pc-u))!important;top:calc(45 * var(--pc-u))!important;display:grid!important;place-items:center!important;padding:0!important;width:calc(48 * var(--pc-u))!important;height:calc(48 * var(--pc-u))!important;min-height:0!important;font-size:0!important;border:1px solid #a4895e55!important;z-index:4!important}
${J} #optsBtn .pc-journey-gear{display:block!important;width:calc(32 * var(--pc-u))!important;height:calc(32 * var(--pc-u))!important;object-fit:contain!important}
${J} .premium-map{display:grid!important;grid-template-columns:calc(340 * var(--pc-u)) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:calc(28 * var(--pc-u))!important;flex:1!important;min-width:0!important;min-height:0!important;height:100%!important}
${J} .premium-map .m2-right{display:flex!important;flex-direction:column!important;gap:calc(12 * var(--pc-u))!important;grid-column:1!important;grid-row:1!important;min-height:0!important;height:100%!important;max-height:none!important;width:100%!important;overflow:auto!important;padding:0!important}
${J} .premium-map .m2-ch{display:flex!important;align-items:center!important;position:relative!important;min-height:calc(104 * var(--pc-u))!important;height:auto!important;flex:1 0 calc(104 * var(--pc-u))!important;width:100%!important;max-width:none!important;padding:calc(14 * var(--pc-u)) calc(14 * var(--pc-u)) calc(25 * var(--pc-u)) calc(117 * var(--pc-u))!important;border:1px solid #a4895e44!important;border-image:none!important;border-radius:0!important;font-size:0!important;text-shadow:none!important;overflow:hidden!important;background-position:center!important;background-size:cover!important;filter:none!important;opacity:1!important;box-shadow:none!important}
${J} .premium-map .m2-ch.lk{opacity:.55!important}
${J} .premium-map .m2-ch.premium-selected{border-color:#c4a16a!important;box-shadow:inset calc(3 * var(--pc-u)) 0 #c4a16a!important}
${J} .premium-map .m2-ch:before{content:attr(data-roman)!important;position:absolute!important;left:calc(14 * var(--pc-u))!important;top:calc(13 * var(--pc-u))!important;bottom:auto!important;right:auto!important;padding:0!important;background:none!important;color:#f0d3a0!important;font:400 calc(19 * var(--pc-u))/1 Georgia!important}
${J} .premium-map .m2-ch.premium-selected:before{content:'◆'!important;font-size:calc(14 * var(--pc-u))!important}
${J} .premium-map .m2-ch:after{content:attr(data-status)!important;position:absolute!important;left:calc(117 * var(--pc-u))!important;right:calc(10 * var(--pc-u))!important;bottom:calc(10 * var(--pc-u))!important;top:auto!important;width:auto!important;height:auto!important;background:none!important;padding:0!important;color:#b69e74!important;font:400 calc(12 * var(--pc-u))/1.1 Georgia!important;filter:none!important;transform:none!important;z-index:0!important;text-align:left!important}
${J} .premium-map .m2-ch .pc-chapter-label{display:flex!important;position:relative!important;flex-direction:column!important;align-items:flex-start!important;gap:calc(7 * var(--pc-u))!important;width:100%!important;z-index:1!important}
${J} .pc-chapter-label small{display:block!important;font:400 calc(11 * var(--pc-u))/1.2 Georgia!important;letter-spacing:.12em!important;color:#a98a5b!important;text-transform:uppercase!important}
${J} .pc-chapter-label strong{display:block!important;font:400 calc(22 * var(--pc-u))/1.2 Georgia!important;color:#e9d9bc!important;white-space:normal!important;text-align:left!important;overflow-wrap:normal!important}
${J} .premium-map .premium-banner{grid-column:2!important;grid-row:1!important;min-height:0!important;width:100%!important;height:100%!important;position:relative!important;border:1px solid #a4895e44!important;border-image:none!important;mask-image:none!important;overflow:hidden!important;background-size:cover!important;background-position:center!important;box-shadow:inset 0 0 calc(65 * var(--pc-u)) #08070a55!important}
${J} .premium-caption{position:absolute!important;left:calc(42 * var(--pc-u))!important;right:calc(30 * var(--pc-u))!important;bottom:calc(153 * var(--pc-u))!important;font:500 calc(52 * var(--pc-u))/1.1 'Grenze Gotisch',Georgia,serif!important;color:#f2d9af!important;margin:0!important;padding:0!important;text-align:left!important;text-shadow:0 2px 3px #000!important;max-width:none!important}
${J} .premium-caption:before{content:attr(data-k)!important;display:block!important;margin:0 0 calc(17 * var(--pc-u))!important;font:400 calc(14 * var(--pc-u))/1.1 Georgia!important;letter-spacing:.2em!important;color:#c4a06c!important}
${J} .premium-caption:after{content:none!important;display:none!important}
${J} .pc-destination-facts{position:absolute!important;left:calc(42 * var(--pc-u))!important;right:calc(42 * var(--pc-u))!important;bottom:calc(35 * var(--pc-u))!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:calc(22 * var(--pc-u))!important;padding-top:calc(20 * var(--pc-u))!important;border-top:1px solid #a4895e77!important}
${J} .pc-destination-facts>div{display:flex!important;flex-direction:column!important;gap:calc(12 * var(--pc-u))!important;min-width:0!important}
${J} .pc-destination-facts small{font:400 calc(13 * var(--pc-u))/1.3 Georgia!important;color:#c0aa85!important}
${J} .pc-destination-facts strong{font:400 calc(24 * var(--pc-u))/1.2 Georgia!important;color:#e7d7b9!important}
${J} .pc-journey-footer{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:calc(32 * var(--pc-u))!important;width:100%!important;height:calc(90 * var(--pc-u))!important;min-height:0!important;flex:none!important;padding:calc(18 * var(--pc-u)) 0 0 calc(410 * var(--pc-u))!important;border-top:1px solid var(--pc-line)!important}
${J} .pc-journey-mode{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:calc(7 * var(--pc-u))!important;margin-right:auto!important}
${J} .pc-journey-mode small{font:400 calc(13 * var(--pc-u))/1.2 Georgia!important;color:#a78f69!important}
${J} .pc-journey-mode strong{font:400 calc(23 * var(--pc-u))/1.2 Georgia!important;color:#ddc8a6!important}
${J} #premiumPrepare{width:calc(305 * var(--pc-u))!important;height:calc(65 * var(--pc-u))!important;min-height:0!important;margin:0!important;flex:none!important;padding:calc(16 * var(--pc-u)) calc(28 * var(--pc-u))!important;font:400 calc(29 * var(--pc-u))/1.2 Georgia!important;letter-spacing:0!important}
${Z} #title.pc-home .premium-mode-dock{margin-top:calc(20 * var(--pc-u))!important}
${Z} #title.pc-home .nb-mode-select{gap:calc(16 * var(--pc-u))!important}
${Z} #title.pc-home .nb-mode{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;gap:calc(5 * var(--pc-u))!important;position:relative!important;width:calc(222 * var(--pc-u))!important;height:calc(82 * var(--pc-u))!important;min-height:0!important;padding:calc(12 * var(--pc-u)) calc(16 * var(--pc-u)) calc(12 * var(--pc-u)) calc(68 * var(--pc-u))!important;border:1px solid #94744855!important;background:linear-gradient(120deg,#19141bcc,#0c0b0d55)!important;text-align:left!important}
${Z} #title.pc-home .nb-mode[aria-checked=true]{border-color:#b18c51!important;box-shadow:inset 0 -2px #ad874b!important;background:linear-gradient(110deg,#50232a88,#1c151a88)!important}
${Z} #title.pc-home .nb-mode>.nb-mode__icon{display:block!important;position:absolute!important;width:calc(34 * var(--pc-u))!important;height:calc(34 * var(--pc-u))!important;left:calc(18 * var(--pc-u))!important;top:50%!important;transform:translateY(-50%)!important;object-fit:contain!important}
${Z} #title.pc-home .nb-mode .nb-mode__title{font:500 calc(26 * var(--pc-u))/1.1 'Grenze Gotisch',Georgia,serif!important;color:#ead7b4!important}
${Z} #title.pc-home .nb-mode .pc-mode-note{display:block!important;font:400 max(11px,calc(12 * var(--pc-u) * var(--nbts,1)))/1.3 Georgia!important;color:#b9a17c!important;white-space:normal!important}
${Z} #title.pc-home .nb-mode .pc-mode-check{display:none!important;position:absolute!important;right:calc(10 * var(--pc-u))!important;top:calc(10 * var(--pc-u))!important;font:400 calc(10 * var(--pc-u))/1 Georgia!important;color:#d7b476!important}
${Z} #title.pc-home .nb-mode[aria-checked=true] .pc-mode-check{display:block!important}
${J} .premium-map .m2-ch{min-height:calc(104 * var(--pc-u) * var(--nbts,1))!important;flex-basis:calc(104 * var(--pc-u) * var(--nbts,1))!important}
${Z} #title.pc-home .nb-mode{height:auto!important;min-height:calc(82 * var(--pc-u))!important}
${Z} #title .pc-profile-stat small,${J} .pc-destination-facts small{font-size:max(12px,calc(13 * var(--pc-u) * var(--nbts,1)))!important}
${J} .premium-map .m2-ch:after{font-size:max(11px,calc(12 * var(--pc-u) * var(--nbts,1)))!important}
${J} .pc-chapter-label{isolation:isolate!important}
${J} .premium-map .m2-ch:not(:disabled):is(:hover,:focus-visible,.pf) .pc-chapter-label:before{content:'';position:absolute;inset:calc(-12 * var(--pc-u));background:var(--pc-cloth) center/100% 190% no-repeat;z-index:-1;pointer-events:none;filter:brightness(.7) saturate(.65)}

`;
 for(const i of CAMPAIGN)s.textContent+=`${J} .premium-map #start${i}{background-image:linear-gradient(90deg,#09090b18 0%,#0d0b10a6 25%,#0d0b10f5 38%,#0d0b10dc 100%),url('${PREMIUM_ASSETS['rozdzial-'+i+'-mini']}')!important}`;
 // The original accessibility switch continues to scale text, without scaling artwork twice.
 s.textContent=s.textContent.replace(/(font(?:-size)?\s*:[^;{}]*?)calc\((\d+) \* var\(--pc-u\)\)/g,'$1calc($2 * var(--pc-u) * var(--nbts,1))');
 document.head.append(s);
 // Approved graphical family. Original PNG atlases stay intact; CSS selects their alpha bounds.
 if(new URLSearchParams(location.search).get('pcgfx')==='0')return;
 root.classList.add('pc-gfx');
 const unifiedType=new URLSearchParams(location.search).get('pctype')!=='0';
 root.classList.toggle('pc-type',unifiedType);
 const GF={play:'assets/ui/fcd1dc2f86b4932e3c706c70e446b7554315edfeaf6c00d3455c3da0c7b64d84.png',menu:'assets/ui/312d55c97b1cf9d5b855da5b159a1c08ba4a94da86e03eefe20e382c6302cea2.png',heads:'assets/ui/0feb5f7b6fa5faf685551209ad13e7e268c3a89afed074de179287851d767fff.png',panel:'assets/ui/2e6c2d60621704b366ab4a96a93626d10a2e0b040841f03d4833a890d54f3203.png',idle:'assets/ui/270f1ffe61905a5191c71634cd1a3b723502a1ace335d0607a6b07dc3f71a33a.png',selected:'assets/ui/bb4b3cd2510833299ef03f2c59686902263bbe6a4fa9a9906b974d3c3a167fd8.png',divider:'assets/ui/a1ab25049eefdca890c62690c24911780f5d4f5105719bca27640107f13fd44f.png'};
 const GM=[[[159,63,441,122],[224,238,319,120],[208,409,342,119],[201,575,360,109],[154,733,450,128],[249,901,263,139]],[[875,62,397,113],[892,240,367,125],[922,403,304,118],[865,574,418,117],[937,736,274,114],[884,899,377,144]]][EN?1:0];
 const GH=[[[51,61,564,86],[94,218,488,93],[241,368,199,85],[142,518,396,90],[140,664,401,92],[224,811,234,91],[184,951,316,97],[223,1102,235,90]],[[726,59,461,92],[723,217,467,86],[844,368,196,86],[736,518,436,90],[824,664,252,92],[849,809,198,93],[851,951,190,95],[831,1102,231,89]]][EN?1:0];
 const GP=[[[316,170,278,186],[48,558,801,170]],[[1181,170,284,186],[1024,558,652,149]]][EN?1:0];
 GF.flow='assets/ui/6b815f425dabd30ab5e49be218020322005e78942fd7257f551ddb3c8209d62b.png';
 const GN=[[[92,161,727,183],[188,538,519,204]],[[991,163,678,174],[1009,548,656,191]]][EN?1:0];
 function glyph(el,atlas,index,text,kind){
  if(!el)return;
  const box=(atlas==='menu'?GM:atlas==='play'?GP:atlas==='flow'?GN:GH)[index],key=atlas+':'+index;
  let im=el.querySelector(':scope>.pcg-glyph');
  if(!im){im=make('span','pcg-glyph');im.setAttribute('aria-hidden','true');el.append(im)}
  if(im.dataset.copy!==text)im.dataset.copy=text;
  if(im.dataset.key!==key){const [x,y,w,h]=box,W=atlas==='menu'?1448:['play','flow'].includes(atlas)?1774:1254,H=atlas==='menu'?1086:['play','flow'].includes(atlas)?887:1254;im.dataset.key=key;im.style.backgroundImage=`url('${atlas==='menu'?GF.menu:atlas==='play'?GF.play:atlas==='flow'?GF.flow:GF.heads}')`;for(const [n,v] of Object.entries({r:w/h,bw:W/h,bh:H/h,bx:-x/h,by:-y/h}))im.style.setProperty('--pcg-'+n,String(v))}
  if(!el.classList.contains('pcg-'+kind))el.classList.add('pcg-'+kind);
  const extra=kind==='menu'&&el.id==='kronBtn'?el.querySelector('.nbk-new')?.getAttribute('aria-label'):kind==='mode'?el.querySelector('.pc-mode-note')?.textContent:'';
  const label=text+(extra?' · '+extra:'');if(el.getAttribute('aria-label')!==label)el.setAttribute('aria-label',label);
 }
 const panelSelector='#title .premium-banner,#title .pc-profile,#prep .pc-detail-copy,#kap #kapDet,#opts .pc-option-section,#opts .nbo-card,#manual .premium-page-content,#pause #skillLoadout,#pause .slot-tab,#pause .nbp-audio,#lvl .level-panel,#shop .shopc,#end .nbs-grid,#conf';
 let gfxScheduled=false;
 function decorateGraphics(){
  gfxScheduled=false;
  const menu=[['.premium-journey',0,T('Graj','Play')],['#kapBtn',2,T('Kaplica','Shrine')],['#kronBtn',3,T('Kronika','Chronicle')],['#manBtn',4,T('Instrukcja','Guide')],['#optsBtn',5,T('Opcje','Options')]];
  for(const [sel,n,text] of menu)glyph(title.querySelector(sel),sel==='.premium-journey'?'play':'menu',n,text,'menu');
  for(const [el,a,n,text] of [
   [prep.querySelector('.pc-prep-title'),'heads',0,T('Przygotowanie do nocy','Before Nightfall')],
   [$('kapH'),KAPMODE==='kron'?'menu':'heads',KAPMODE==='kron'?3:1,KAPMODE==='kron'?T('Kronika','Chronicle'):T('Kaplica Popiołów','Shrine of Ashes')],
   [$('manual').querySelector('.premium-page-heading'),'menu',4,T('Instrukcja','Guide')],
   [$('opts').querySelector('.premium-page-heading'),'menu',5,T('Opcje','Options')],
   [$('pause').querySelector('.premium-pause-title'),'heads',2,T('Pauza','Pause')],
   [$('shop').querySelector('.lvlhead h2'),'heads',3,T('Kram Margi',"Marga’s Stall")],
   [journeyTitle,'play',1,T('Wybór rozdziału','Act selection')]
  ])glyph(el,a,n,text,'heading');
  glyph($('sFab'),'heads',6,T('Fabularny','Story'),'mode');glyph($('sArc'),'heads',7,'Arcade','mode');
  glyph(home,'flow',0,T('Menu główne','Main menu'),'action');
  glyph(modeInfo.querySelector('small'),'flow',1,T('Tryb gry','Game mode'),'action');
  glyph(modeInfo.querySelector('strong'),'heads',STORYMODE?6:7,STORYMODE?T('Fabularny','Story'):'Arcade','action');
  for(const [el,n,text] of [[prepare,4,T('Przygotuj się','Prepare')],[$('prepGo'),5,T('Gotowy','Ready')]]){
   // Loading/error feedback remains live text, with the original handler and timing.
   if(el.textContent.trim()===text)glyph(el,'heads',n,text,'action');else{el.classList.remove('pcg-action');el.querySelector(':scope>.pcg-glyph')?.remove();el.setAttribute('aria-label',el.textContent.trim())}
  }
  for(const el of root.querySelectorAll(panelSelector)){
   if(!el.classList.contains('pcg-panel'))el.classList.add('pcg-panel');if(!el.querySelector(':scope>.pcg-edge')){const edge=make('span','pcg-edge');edge.setAttribute('aria-hidden','true');el.append(edge)}
  }
 }
 function scheduleGraphics(){if(gfxScheduled)return;gfxScheduled=true;requestAnimationFrame(decorateGraphics)}
 for(const id of ['title','prep','kap','manual','opts','pause','lvl','shop','end','conf','lang'])new MutationObserver(scheduleGraphics).observe($(id),{childList:true,subtree:true,characterData:true});
 decorateGraphics();
 const gs=make('style','');gs.id='pc-graphic-standard';const G='#orient'.repeat(24)+'.pc-menu.pc-gfx',SG=G+' :is(#title,#prep,#kap,#manual,#opts,#pause,#lvl,#shop,#end,#conf,#lang)';
 gs.textContent=`
${G}{--pc-cloth:url('${GF.selected}');--pcg-idle:url('${GF.idle}');--pcg-selected:url('${GF.selected}');--pc-line:#a68b5e44;--pc-paper:#e6d6b8}
${SG} .pcg-glyph{--pcg-h:calc(44 * var(--pc-u) * var(--nbts,1));display:inline-block!important;position:relative!important;width:calc(var(--pcg-h) * var(--pcg-r))!important;max-width:none!important;height:var(--pcg-h)!important;min-height:0!important;flex:none!important;background-repeat:no-repeat!important;background-size:calc(var(--pcg-h) * var(--pcg-bw)) calc(var(--pcg-h) * var(--pcg-bh))!important;background-position:calc(var(--pcg-h) * var(--pcg-bx)) calc(var(--pcg-h) * var(--pcg-by))!important;pointer-events:none!important;filter:brightness(1.18) saturate(.65)!important;vertical-align:middle!important;padding:0!important;margin:0!important;border:0!important;box-shadow:none!important}
${G} #title .pcg-menu{font-size:0!important;color:transparent!important}
${G} #title :is(#kapBtn,#manBtn).pcg-menu>:not(.pcg-glyph):not(.nbk-new){display:none!important}
${G} #title .pcg-menu>.premium-nav-icon{display:none!important}
${G} #title.pc-home .pcg-menu .pcg-glyph{--pcg-h:calc(40 * var(--pc-u) * var(--nbts,1))}
${G} #title.pc-home .premium-nav>.pcg-menu{background:var(--pcg-idle) center/100% 180% no-repeat!important;padding:calc(8 * var(--pc-u)) calc(42 * var(--pc-u))!important;display:flex!important;align-items:center!important;justify-content:center!important}
${G} #title.pc-home .premium-nav>.pcg-menu:is(:hover,:focus-visible,.pf){background:var(--pcg-selected) center/100% 180% no-repeat!important}
${G} #title.pc-home .premium-nav>.pcg-menu:after{content:none!important;display:none!important}
${G} #title:not(.pc-home) .pcg-menu .pcg-glyph{--pcg-h:calc(27 * var(--pc-u) * var(--nbts,1))}
${G} #title:not(.pc-home) #optsBtn.pcg-menu>.pcg-glyph{display:none!important}
${G} #title:not(.pc-home) #optsBtn.pcg-menu>.pc-journey-gear{display:block!important}
${G} #title:not(.pc-home) :is(#kapBtn,#kronBtn){display:flex!important;align-items:center!important}
${SG} .pcg-heading{display:flex!important;align-items:center!important;justify-content:center!important;gap:0!important;font-size:0!important;line-height:0!important;color:transparent!important;background:var(--pcg-idle) center/100% 180% no-repeat!important;border:0!important;border-image:none!important;box-shadow:none!important;min-height:0!important;height:auto!important;width:fit-content!important;max-width:88%!important;margin:0!important;padding:calc(16 * var(--pc-u)) calc(48 * var(--pc-u))!important;text-indent:0!important;text-shadow:none!important}
${SG} .pcg-heading>:not(.pcg-glyph){display:none!important}
${SG} .pcg-heading .pcg-glyph{--pcg-h:calc(46 * var(--pc-u) * var(--nbts,1))}
${G} #prep .pcg-heading .pcg-glyph{--pcg-h:calc(43 * var(--pc-u) * var(--nbts,1))}
${G} #title .pc-journey-head .pcg-heading .pcg-glyph{--pcg-h:calc(47 * var(--pc-u) * var(--nbts,1))}
${G} #shop .pcg-heading .pcg-glyph{--pcg-h:calc(39 * var(--pc-u) * var(--nbts,1))}
${SG} .pcg-action{font-size:0!important;line-height:0!important;color:transparent!important;background:var(--pcg-selected) center/100% 180% no-repeat!important;display:flex!important;align-items:center!important;justify-content:center!important}
${SG} .pcg-action .pcg-glyph{--pcg-h:calc(29 * var(--pc-u) * var(--nbts,1))}
${SG} .pcg-action:after{content:none!important;display:none!important}
${G} #title .pcg-mode>.nb-mode__title{display:none!important}
${G} #title .pcg-mode>.pcg-glyph{--pcg-h:calc(26 * var(--pc-u) * var(--nbts,1));order:-1!important}
${G} #title .pcg-mode .pc-mode-note{font-family:Georgia,serif!important}
${SG} .pcg-panel:not(.pc-profile):not(#conf){position:relative!important}
${SG} .pcg-panel{border:0!important;border-image:none!important;border-radius:0!important}
${SG} .pcg-edge{display:block!important;position:absolute!important;inset:0!important;width:auto!important;height:auto!important;max-width:none!important;min-height:0!important;pointer-events:none!important;box-sizing:border-box!important;border:calc(19 * var(--pc-u)) solid transparent!important;border-image:url('${GF.panel}') 128 /calc(19 * var(--pc-u)) stretch!important;background:none!important;box-shadow:none!important;opacity:.9!important;filter:brightness(1.3) saturate(.65)!important;z-index:2!important;margin:0!important;padding:0!important}
${G} #title .pc-profile{background:#0e0c10a6!important}
${G} #title .pc-profile .pcg-edge{border-width:calc(11 * var(--pc-u))!important;border-image-width:calc(11 * var(--pc-u))!important}
${SG} :is(.tabs .tab,.nbp-tab,.stab,.pc-prep-tab){background:var(--pcg-idle) center/100% 180% no-repeat!important;border:0!important;border-image:none!important}
${SG} :is(.tab.on,.nbp-tab[aria-pressed=true],.pc-prep-tab[aria-pressed=true],.stab.on){background:var(--pcg-selected) center/100% 180% no-repeat!important;color:#f0d9ac!important}
${SG} button:is(:hover,:focus-visible,.pf):not(:disabled):after{background-image:var(--pcg-selected)!important;filter:brightness(.9) saturate(.75)!important}
${G} #prep .pc-prep-tab{border-bottom:0!important}
${G} #prep .pc-detail-copy{background:#100d12a6!important;padding:calc(27 * var(--pc-u)) calc(26 * var(--pc-u))!important}
${G} #opts :is(.pc-option-section,.nbo-card){background:#100d12a6!important}
${G} #pause #skillLoadout{background:linear-gradient(140deg,#121015a6,#0b0a0d66)!important}
${G} #pause .slot-tab{background:#110e1466!important}
${G} #pause .slot-tab.chosen{background:linear-gradient(135deg,#3f1a21a6,#160e1499)!important;box-shadow:none!important}
${G} #pause .slot-tab:after{content:none!important;display:none!important}
${G} #pause .slot-tab:is(.chosen,:focus-visible,.pf)>.pcg-edge{filter:brightness(1.8) saturate(.65)!important}
${G} #lvl .level-panel{background:linear-gradient(120deg,#100e1288,#100e1244)!important}
${G} #shop .shopc{padding:calc(22 * var(--pc-u))!important;background:#100d1266!important}
${G} #end .nbs-grid{padding:calc(16 * var(--pc-u))!important;background:#100d1255!important}
${SG} :is(table,.pcg-table){border-collapse:collapse!important;border:0!important;background:#0e0c1044!important}
${SG} th{font-family:'Grenze Gotisch',Georgia,serif!important;font-weight:500!important;color:#d6bc8f!important;border-bottom:1px solid #a68b5e55!important}
${SG} td{border-bottom:1px solid #a68b5e25!important;padding:.6em .8em!important}
${SG} :is(.pc-heading-rule,.opsep){display:block!important;height:calc(10 * var(--pc-u))!important;min-height:0!important;border:0!important;background:url('${GF.divider}') center/115% 872% no-repeat!important;opacity:.85!important;box-shadow:none!important}
${SG} .pc-heading-rule{width:calc(235 * var(--pc-u))!important;bottom:calc(-12 * var(--pc-u))!important}
${SG} :is(.pc-heading-rule,.opsep):before,${SG} :is(.pc-heading-rule,.opsep):after{content:none!important;display:none!important}
${SG} .pc-section-separator,${SG} .pc-option-section .opsep,${SG} .opsep[hidden]{display:none!important}
${SG} .pcg-heading{min-width:calc(320 * var(--pc-u))!important;flex:0 0 auto!important}
${SG} .pcg-glyph[data-key^="heads:"]{filter:brightness(1.5) saturate(.65)!important}
${SG} :is(.tabs .tab,.nbp-tab,.stab,.pc-prep-tab){background-size:100% 170%!important;font-family:'Grenze Gotisch',Georgia,serif!important;font-weight:500!important;letter-spacing:.015em!important}
${SG} button:is(:hover,:focus-visible,.pf):not(:disabled):after{background-size:100% 170%!important}
${G} #lvl #lvlTitle,${G} #conf h1{font-family:'Grenze Gotisch',Georgia,serif!important;font-weight:500!important;color:#e6d2aa!important}
`;
 document.head.append(gs);
 // PC refinement: one tile contour, symmetric groups, and distinct focus/selection states.
 root.classList.add('pc-tiles');
 const settingGroup=make('div','pc-prep-settings');controls.prepend(settingGroup);settingGroup.append(difficulty,assists);
 const runStatus=make('div','pc-run-status'),identity=make('div','pc-run-identity'),counts=make('div','pc-run-counts');
 runStatus.setAttribute('role','status');runStatus.setAttribute('aria-live','polite');runStatus.append(identity,counts);info.append(runStatus);
 const sourceSummary=info.querySelector('.premium-prep-summary');
 const destination=make('section','pc-prep-destination');destination.append($('prepK'));controls.append(destination,runStatus,controls.querySelector(':scope>.btnrow'));info.hidden=true;prep.querySelector('.premium-prep-head').append(settingGroup);
 function refreshTileSummary(){
  if(prep.hidden)return;
  const cls=heroName(charId());
  put(identity,cls+' · '+DF[DIFFK].n);
  const values=[[T('Perki','Perks'),PREP.perks.length+'/1'],[T('Wyzwania','Challenges'),String(PREP.chal?1:0)],[T('Klątwy','Curses'),PREP.curses.length+'/3']];
  for(let i=0;i<values.length;i++){let cell=counts.children[i];if(!cell){cell=make('span','');cell.append(make('small',''),make('strong',''));counts.append(cell)}put(cell.firstChild,values[i][0]);put(cell.lastChild,values[i][1])}
 }
 new MutationObserver(refreshTileSummary).observe(sourceSummary,{childList:true,characterData:true,subtree:true});
 new MutationObserver(refreshTileSummary).observe(prep,{attributes:true,attributeFilter:['hidden']});refreshTileSummary();
 // Move the existing slider with its listeners and explanation, without changing its value.
 const brightness=$('briSl')?.closest('.pc-option-section');if(brightness){brightness.classList.add('pc-brightness-tile');$('pane-gfx').prepend(brightness);$('briSl').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')e.stopPropagation()})}
 function tileFrame(el){
  if(!el.classList.contains('pc-tile'))el.classList.add('pc-tile');
  if(!el.querySelector(':scope>.pcg-edge')){const edge=make('span','pcg-edge');edge.setAttribute('aria-hidden','true');el.append(edge)}
 }
 function polishTiles(){
  for(const card of $('cards').querySelectorAll(':scope>.card')){
   const icon=card.querySelector('.cn>.ic');if(icon){icon.classList.add('pc-card-icon');card.querySelector('.cn').before(icon)}tileFrame(card);
  }
  for(const card of root.querySelectorAll('#shop .card,#title .m2-ch'))tileFrame(card);
  tileFrame(destination);tileFrame(runStatus);tileFrame($('prepGo'));
 }
 for(const box of [$('cards'),$('shop').querySelector('.shopc'),chapterList,$('prepGo')])if(box)new MutationObserver(polishTiles).observe(box,{childList:true,subtree:true});polishTiles();
 const ts=make('style','');ts.id='pc-tile-refinement';const U='#orient'.repeat(28)+'.pc-menu.pc-gfx.pc-tiles',V=U+' :is(#title,#prep,#kap,#opts,#manual,#pause,#lvl,#shop,#end,#conf,#lang)',F=n=>`calc(${n} * var(--pc-u) * var(--nbts,1))`,D=n=>`calc(${n} * var(--pc-u))`;
 ts.textContent=`
${V} button:is(:hover,:focus-visible,.pf):not(:disabled){filter:none!important;outline:1px solid #b89b6877!important;outline-offset:${D(2)}!important;background-color:transparent!important}
${V} button:is(:hover,:focus-visible,.pf):not(:disabled):after{content:none!important;display:none!important;background:none!important}
${V} :is(.tab,.nbp-tab,.stab,.pc-prep-tab,.pcg-action,.btnrow>button,.lvbtns>button),${U} #title.pc-home .premium-nav>.pcg-menu,${U} #prep .pc-popover>summary{background:var(--pcg-idle) center/100% 170% no-repeat!important;filter:none!important}
${V} :is(.tab.on,.nbp-tab[aria-pressed=true],.stab.on,.pc-prep-tab[aria-pressed=true]),${V} button:active:not(:disabled):not(.pc-tile){background:var(--pcg-selected) center/100% 170% no-repeat!important}
${V} :is(.tab,.nbp-tab,.stab,.pc-prep-tab):is(:hover,:focus-visible,.pf){filter:brightness(1.16)!important}
${V} :is(.pcg-action,.pcg-menu):is(:hover,:focus-visible,.pf):not(:disabled){outline:0!important;filter:brightness(1.3)!important}
${V} .pcg-heading{background:var(--pcg-idle) center/100% 170% no-repeat!important;filter:none!important}
${V} .pc-tile{position:relative!important;box-shadow:none!important;border:0!important;border-image:none!important;border-radius:0!important;isolation:isolate!important}
${V} .pc-tile:not(.m2-ch){background:linear-gradient(145deg,#19131bec,#0d0b10d9)!important}
${V} .pc-tile>.pcg-edge{border-image-width:${D(15)}!important;opacity:.85!important}
${V} .pc-tile:is(:hover,:focus-visible,.pf)>.pcg-edge{filter:brightness(1.7) saturate(.6)!important}
${V} .pc-tile:active{outline:2px solid #8d3548!important;outline-offset:-2px!important}
${U} #title:not(.pc-home) :is(#kapBtn,#kronBtn){width:${D(175)}!important;height:${D(66)}!important;display:flex!important;justify-content:center!important;align-items:center!important;text-align:center!important;background:var(--pcg-idle) center/100% 170% no-repeat!important;padding:${D(12)} ${D(16)}!important}
${U} #title:not(.pc-home) :is(#kapBtn,#kronBtn) .pcg-glyph{--pcg-h:${D(33)};filter:brightness(1.5) saturate(.55)!important}
${U} #title .premium-map .m2-ch{border:0!important;outline:0!important;box-shadow:none!important;background-color:#100d13!important}
${U} #title .premium-map .m2-ch:is(:hover,:focus-visible,.pf){outline:1px solid #bd9b6677!important;outline-offset:-1px!important}
${U} #title .premium-map .m2-ch.premium-selected{outline:2px solid #783039!important;outline-offset:-2px!important;box-shadow:inset 0 0 ${D(18)} #77213944!important}
${U} #title .premium-map .m2-ch.premium-selected>.pcg-edge{filter:sepia(1) saturate(4) hue-rotate(315deg) brightness(.9)!important}
${U} #title .premium-map .m2-ch:after{content:attr(data-status)!important;display:block!important;background:none!important}
${U} #title .pc-chapter-label:before{content:none!important;display:none!important}
${U} #title .pc-chapter-label{background:none!important;border:0!important;box-shadow:none!important}
${U} #prep .pc-prep-title .pcg-glyph{--pcg-h:${F(52)}}
${U} #prep .pc-prep-tabs{grid-column:1/-1!important;justify-content:center!important;gap:${D(18)}!important}
${U} #prep .prepgrid>#prepChar{grid-row:2!important}
${U} #prep #prepChar .on .premium-class-art{height:calc(270 * var(--pc-u) / var(--nbts,1))!important}
${U} #prep .pc-perk-detail{padding-top:0!important}
${U} #prep .pc-prep-tab{flex:1 1 0!important;max-width:${D(200)}!important;min-width:0!important;text-align:center!important;font-family:'Grenze Gotisch',Georgia,serif!important;font-size:${F(24)}!important;font-weight:500!important;line-height:1.15!important;padding:${D(16)} ${D(12)}!important}
${U} #prep .premium-prep-controls{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr)!important;gap:${D(28)}!important;height:${D(128)}!important;padding:${D(15)} 0 0!important;align-items:center!important}
${U} #prep .pc-prep-settings{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:${D(12)}!important;min-width:0!important}
${U} #prep .pc-popover{min-width:0!important;width:100%!important}
${U} #prep .pc-popover>summary{display:flex!important;align-items:center!important;justify-content:center!important;list-style:none!important;text-align:center!important;min-height:${D(66)}!important;padding:${D(14)} ${D(10)}!important;font:500 ${F(21)}/1.2 'Grenze Gotisch',Georgia,serif!important}
${U} #prep .pc-popover>summary::-webkit-details-marker{display:none!important}
${U} #prep .pc-popover[open]>summary{background:var(--pcg-selected) center/100% 170% no-repeat!important}
${U} #prep .pc-popover>summary:is(:hover,:focus-visible){outline:1px solid #b89b6877!important;outline-offset:${D(2)}!important;filter:brightness(1.14)!important}
${U} #prep .pc-footer-info{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:${D(5)}!important;padding:0 ${D(20)}!important;border-inline:1px solid #a68b5e33!important;text-align:center!important}
${U} #prep .pc-footer-info #prepK{font:500 ${F(24)}/1.15 'Grenze Gotisch',Georgia,serif!important;text-transform:none!important;text-align:center!important;color:#ead7b3!important;margin:0!important;white-space:normal!important}
${U} #prep .premium-prep-summary{display:none!important}
${U} #prep .pc-run-status{display:flex!important;flex-direction:column!important;align-items:center!important;gap:${D(6)}!important;width:100%!important}
${U} #prep .pc-run-identity{font:400 ${F(16)}/1.25 Georgia,serif!important;color:#c9bba4!important;text-align:center!important}
${U} #prep .pc-run-counts{display:flex!important;justify-content:center!important;gap:${D(18)}!important;width:100%!important}
${U} #prep .pc-run-counts>span{display:flex!important;align-items:baseline!important;gap:${D(7)}!important}
${U} #prep .pc-run-counts small{font:400 ${F(14)}/1.2 Georgia,serif!important;color:#af9a79!important}
${U} #prep .pc-run-counts strong{font:400 ${F(16)}/1.2 Georgia,serif!important;color:#ebd7af!important;font-variant-numeric:tabular-nums!important}
${U} #prep .premium-prep-controls>.btnrow{width:100%!important;min-width:0!important}
${U} #prep #prepGo{width:100%!important;min-height:${D(70)}!important}
${U} #pause .nbp-pane[data-pane=controls]{width:100%!important;margin-inline:auto!important}
${U} #pause #pauseKeys{width:min(100%,${D(1120)})!important;max-width:none!important;margin:0 auto!important}
${U} #pause #pauseKeys .subtabs{justify-content:center!important;margin-inline:auto!important;width:100%!important}
${U} #pause #pauseKeys .nb-ctl-img{width:auto!important;max-width:100%!important;max-height:calc(100vh - 540 * var(--pc-u))!important;height:auto!important;object-fit:contain!important;margin:0 auto!important}
${U} #opts #pane-gfx>.pc-option-section:has(#fpsRow){grid-column:1/-1!important}
${U} #opts .pc-option-section>h3{font-family:'Grenze Gotisch',Georgia,serif!important;text-align:center!important}
${U} #lvl .level-panel{display:flex!important;flex-direction:column!important;gap:${D(12)}!important;height:100%!important;min-height:0!important;overflow:auto!important;padding:${D(24)}!important}
${U} #lvl :is(.level-heading,#slots,#levelWait,.level-build,.lvbtns){flex:none!important;margin:0!important;text-align:center!important}
${U} #lvl .level-heading{padding:0!important}
${U} #lvl .level-heading .kicker{font-size:${F(13)}!important;letter-spacing:.2em!important;margin:0 0 ${D(5)}!important}
${U} #lvl #lvlTitle{font:500 ${F(42)}/1.12 'Grenze Gotisch',Georgia,serif!important;margin:0!important}
${U} #lvl #slots{font:400 ${F(17)}/1.4 Georgia,serif!important;padding:0 0 ${D(12)}!important;border-bottom:1px solid #a68b5e33!important}
${U} #lvl #levelWait:empty{display:none!important}
${U} #lvl #cards{flex:1 0 ${D(380)}!important;min-height:${D(380)}!important;grid-auto-rows:minmax(0,1fr)!important;gap:${D(20)}!important;padding:0!important;margin:0!important;align-items:stretch!important}
${U} #lvl #cards .card{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:${D(10)}!important;height:100%!important;min-height:0!important;max-height:none!important;padding:${D(22)}!important;text-align:center!important;overflow:visible!important}
${U} #lvl #cards .card>:not(.pcg-edge):not(.num){position:static!important;transform:none!important;inset:auto!important;order:5;flex:none;max-width:100%!important;margin:0!important;white-space:normal!important}
${U} #lvl #cards .card .num{position:absolute!important;right:${D(13)}!important;top:${D(13)}!important;left:auto!important;bottom:auto!important;width:${D(25)}!important;height:${D(25)}!important;display:grid!important;place-items:center!important;font:400 ${F(13)}/1 Georgia,serif!important;color:#a98d64!important;border:1px solid #a68b5e33!important;background:#0d0b10!important;z-index:3!important}
${U} #lvl #cards .card .ck{order:0!important;font:400 ${F(12)}/1.3 Georgia,serif!important;min-height:${D(24)}!important;padding:0 ${D(20)}!important;text-align:center!important;letter-spacing:.05em!important}
${U} #lvl #cards .card .pc-card-icon{order:1!important;display:block!important;align-self:center!important;width:${D(76)}!important;height:${D(76)}!important;margin:${D(3)} auto!important;min-width:0!important}
${U} #lvl #cards .card .cn{order:2!important;display:flex!important;align-items:center!important;justify-content:center!important;font:500 ${F(27)}/1.15 'Grenze Gotisch',Georgia,serif!important;min-height:${D(60)}!important;text-align:center!important}
${U} #lvl #cards .card .cl{order:3!important;display:block!important;min-height:${D(28)}!important;font:400 ${F(15)}/1.3 Georgia,serif!important;text-align:center!important;color:#bda47b!important}
${U} #lvl #cards .card .cd{order:4!important;display:block!important;flex:1 1 auto!important;min-height:${D(60)}!important;overflow:auto!important;padding:${D(10)} ${D(3)} 0!important;border-top:1px solid #a68b5e33!important;font:400 ${F(17)}/1.5 Georgia,serif!important;text-align:left!important;scrollbar-gutter:stable!important}
${U} #lvl #cards .card .cd :is(ul,li){font:400 ${F(17)}/1.5 Georgia,serif!important}
${U} #lvl #cards .card .fx{order:5!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important;align-items:center!important;gap:${D(6)}!important;padding:${D(9)}!important;border-block:1px solid #a68b5e33!important;background:#08070b88!important;text-align:center!important}
${U} #lvl #cards .card .fx em{display:block!important;flex-basis:100%!important;font:400 ${F(12)}/1.3 Georgia,serif!important}
${U} #lvl #cards .card .fx :is(b,s){font:400 ${F(18)}/1.2 Georgia,serif!important}
${U} #lvl .level-build>summary{font:500 ${F(19)}/1.3 'Grenze Gotisch',Georgia,serif!important;padding:${D(10)}!important}
${U} #lvl .lvbtns{display:flex!important;flex-direction:column!important;align-items:center!important;gap:${D(6)}!important;padding-top:${D(6)}!important}
${U} #lvl .lvbtns #rerollBtn{font:500 ${F(21)}/1.25 'Grenze Gotisch',Georgia,serif!important;padding:${D(14)} ${D(30)}!important;min-height:${D(52)}!important}
${U} #lvl .lvbtns .hint{font-size:${F(13)}!important}
${U} #shop .shopc{gap:${D(20)}!important;background:none!important;padding:${D(5)}!important}
${U} #shop .shopc>.pcg-edge{display:none!important}
${U} #shop .card{padding:${D(24)}!important}
${U} #prep .pc-prep-tabs{width:100%!important;border-bottom:1px solid #a68b5e55!important}
${U} #prep .premium-prep-head{z-index:10!important}
${U} #prep .premium-prep-head .pc-prep-settings{display:contents!important}
${U} #prep .premium-prep-head .pc-popover{position:absolute!important;top:50%!important;transform:translateY(-50%)!important;width:${D(190)}!important}
${U} #prep .premium-prep-head .pc-popover:first-child{left:${D(85)}!important}
${U} #prep .premium-prep-head .pc-popover:last-child{right:${D(85)}!important}
${U} #prep .premium-prep-head .pc-popover>div{top:100%!important;bottom:auto!important}
${U} #prep .premium-prep-head .pc-popover:last-child>div{left:auto!important;right:0!important}
${U} #prep #prepBack{top:${D(-16)}!important}
${U} #prep .prepgrid>:is(#prepChar,.prepbox:not(.pc-panel-hidden),.pc-perk-detail){border:${D(12)} solid transparent!important;border-image:url('${GF.panel}') 128 /${D(12)} stretch!important;padding:${D(14)}!important;background:#0c0b1066!important}
${U} #prep .pc-perk-detail{border-left-width:${D(12)}!important}
${U} #prep .pc-detail-copy{background:none!important;min-height:100%!important;padding:${D(12)}!important}
${U} #prep .pc-detail-copy>.pcg-edge{display:none!important}
${U} #prep .pc-detail-copy :is(h3,.pc-detail-kicker){display:block!important;width:100%!important;text-align:center!important}
${U} #prep .premium-prep-controls{grid-template-columns:repeat(3,minmax(0,1fr))!important;height:${D(105)}!important}
${U} #prep .pc-footer-info[hidden]{display:none!important}
${U} #prep :is(.pc-prep-destination,.pc-run-status){height:${D(80)}!important;padding:${D(12)} ${D(18)}!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:${D(7)}!important;min-width:0!important}
${U} #prep .pc-prep-destination #prepK{font:500 ${F(26)}/1.15 'Grenze Gotisch',Georgia,serif!important;text-transform:none!important;text-align:center!important;margin:0!important;color:#ead7b3!important}
${U} #prep .pc-run-identity{font:500 ${F(20)}/1.2 'Grenze Gotisch',Georgia,serif!important;color:#ead7b3!important}
${U} #prep #prepGo{height:${D(80)}!important;min-height:${D(80)}!important}
${U} #pause .nbp-head .nbp-sub{position:absolute!important;left:50%!important;top:calc(100% + 2 * var(--pc-u))!important;transform:translateX(-50%)!important;font:400 ${F(13)}/1.2 Georgia,serif!important;white-space:nowrap!important}
${U} #pause .nbp-head>.pc-heading-rule{display:none!important}
${U} #shop .lvlhead{position:relative!important;justify-content:center!important;text-align:center!important}
${U} #shop #shopCoins{position:absolute!important;right:0!important;top:50%!important;transform:translateY(-50%)!important}
`;
 document.head.append(ts);
 // One Play entry, a centered mode field, and only the full chapter contour selected.
 root.classList.add('pc-flow');home.textContent=T('← Menu główne','← Main menu');
 const shortcutSpace=make('span','pc-shortcuts-space');shortcutSpace.setAttribute('aria-hidden','true');journeyFooter.prepend(shortcutSpace);
 function routeFrame(el){if(!el)return;if(!el.querySelector(':scope>.pc-route-edge')){const edge=make('span','pc-route-edge');edge.setAttribute('aria-hidden','true');el.append(edge)}}
 function refreshRouteFrames(){for(const el of [home,$('kapBtn'),$('kronBtn'),prepare,modeInfo])routeFrame(el)}
 for(const el of [home,nav,prepare,modeInfo])new MutationObserver(refreshRouteFrames).observe(el,{childList:true,subtree:true});refreshRouteFrames();
 const fs=make('style','');fs.id='pc-play-navigation';const W='#orient'.repeat(32)+'.pc-menu.pc-gfx.pc-flow',CJ=W+' #title:not(.pc-home)',SU=n=>`calc(${n} * var(--pc-u))`,ST=n=>`calc(${n} * var(--pc-u) * var(--nbts,1))`;
 fs.textContent=`
${W} #title.pc-home .pc-play .pcg-glyph{--pcg-h:${ST(46)}}
${W} #title.pc-home .pc-play{height:${SU(76)}!important}
${W} #title.pc-home .pc-route-edge{display:none!important}
${CJ} .pc-journey-head .pcg-heading .pcg-glyph{--pcg-h:${ST(50)}}
${CJ} .pc-route-edge{display:block!important;position:absolute!important;inset:0!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;background:none!important;pointer-events:none!important;box-sizing:border-box!important;border:${SU(15)} solid transparent!important;border-image:url('${GF.panel}') 128 /${SU(15)} stretch!important;opacity:.95!important;filter:brightness(1.55) saturate(.65)!important;z-index:2!important}
${CJ} .pc-home-button{display:flex!important;align-items:center!important;justify-content:center!important;left:0!important;top:50%!important;transform:translateY(-50%)!important;width:${SU(230)}!important;height:${SU(70)}!important;padding:${SU(12)} ${SU(20)}!important;font:500 ${ST(23)}/1.2 'Grenze Gotisch',Georgia,serif!important;color:#ead9bc!important;background:linear-gradient(140deg,#19131ae8,#0d0b10bb)!important;border:0!important;border-image:none!important;outline:0!important;box-shadow:none!important}
${CJ} .pc-home-button:is(:hover,:focus-visible,.pf){filter:brightness(1.22)!important;outline:0!important}
${CJ} .pc-home-button:after{content:none!important;display:none!important}
${CJ} .pc-home-button.pcg-action{font-size:0!important;color:transparent!important}
${CJ} .pc-home-button.pcg-action .pcg-glyph{--pcg-h:${ST(27)}}
${CJ} .pc-home-button.pcg-action:before{content:'←'!important;display:block!important;position:absolute!important;left:${SU(16)}!important;top:50%!important;transform:translateY(-50%)!important;font:400 ${ST(19)}/1 Georgia,serif!important;color:#cfb98e!important;background:none!important;width:auto!important;height:auto!important}
${CJ} .pc-profile{right:${SU(175)}!important}
${CJ} #optsBtn,${CJ} #optsBtn:is(:hover,:focus-visible,.pf,:active){display:grid!important;place-items:center!important;right:${SU(70)}!important;top:${SU(27)}!important;width:${SU(80)}!important;height:${SU(80)}!important;min-width:0!important;min-height:0!important;padding:${SU(12)}!important;margin:0!important;border:0!important;border-image:none!important;border-radius:0!important;background:none!important;background-image:none!important;box-shadow:none!important;outline:0!important;filter:none!important}
${CJ} #optsBtn:before,${CJ} #optsBtn:after{content:none!important;display:none!important;background:none!important}
${CJ} #optsBtn .pc-journey-gear{display:block!important;width:${SU(52)}!important;height:${SU(52)}!important;object-fit:contain!important;filter:brightness(1.18)!important}
${CJ} #optsBtn:is(:hover,:focus-visible,.pf) .pc-journey-gear{filter:brightness(1.65) drop-shadow(0 0 ${SU(4)} #d2a96a33)!important}
${CJ} .pc-journey-footer{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:${SU(28)}!important;align-items:center!important;height:${SU(100)}!important;min-height:0!important;padding:${SU(15)} 0 0!important;margin:0!important;width:100%!important;border-top:1px solid #a68b5e55!important}
${CJ} .pc-shortcuts-space{display:block!important;grid-column:1!important;height:${SU(70)}!important;min-width:0!important}
${CJ} .pc-journey-mode{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:${SU(4)}!important;grid-column:2!important;min-width:0!important;width:100%!important;height:${SU(70)}!important;padding:${SU(10)} ${SU(20)}!important;text-align:center!important;background:linear-gradient(140deg,#19131ae8,#0d0b10bb)!important;border:0!important;box-shadow:none!important}
${CJ} .pc-journey-mode small{font:400 ${ST(13)}/1.2 Georgia,serif!important;text-align:center!important;color:#bda780!important}
${CJ} .pc-journey-mode strong{font:500 ${ST(28)}/1.15 'Grenze Gotisch',Georgia,serif!important;text-align:center!important;color:#ead9bc!important}
${CJ} .pc-journey-mode{padding:${SU(5)} ${SU(20)}!important}
${CJ} .pc-journey-mode :is(small,strong).pcg-action{display:flex!important;align-items:center!important;justify-content:center!important;font-size:0!important;color:transparent!important;padding:0!important;background:none!important;border:0!important;min-height:0!important}
${CJ} .pc-journey-mode small .pcg-glyph{--pcg-h:${ST(14)}}
${CJ} .pc-journey-mode strong .pcg-glyph{--pcg-h:${ST(28)};filter:brightness(1.65) saturate(.5)!important}
${CJ} #premiumPrepare{grid-column:3!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;height:${SU(70)}!important;min-height:0!important;position:relative!important;margin:0!important;padding:${SU(12)} ${SU(20)}!important;border:0!important;border-image:none!important;background:linear-gradient(140deg,#19131ae8,#0d0b10bb)!important;outline:0!important;box-shadow:none!important}
${CJ} #premiumPrepare .pcg-glyph{--pcg-h:${ST(33)}}
${CJ} :is(#kapBtn,#kronBtn){display:flex!important;align-items:center!important;justify-content:center!important;position:absolute!important;top:auto!important;bottom:calc(37.5 * var(--pc-u) - .5px)!important;height:${SU(70)}!important;width:calc((100% - 196 * var(--pc-u)) / 6 - 9 * var(--pc-u))!important;min-width:0!important;min-height:0!important;left:${SU(70)}!important;padding:${SU(12)} ${SU(20)}!important;background:linear-gradient(140deg,#19131ae8,#0d0b10bb)!important;border:0!important;border-image:none!important;box-shadow:none!important;outline:0!important;text-align:center!important}
${CJ} #kronBtn{left:calc(70 * var(--pc-u) + (100% - 196 * var(--pc-u)) / 6 + 9 * var(--pc-u))!important}
${CJ} :is(#kapBtn,#kronBtn) .pcg-glyph{--pcg-h:${ST(33)}}
${CJ} :is(#kapBtn,#kronBtn,#premiumPrepare):is(:hover,:focus-visible,.pf){filter:brightness(1.22)!important;outline:0!important;background:linear-gradient(140deg,#19131ae8,#0d0b10bb)!important}
${CJ} #premiumPrepare{background:radial-gradient(ellipse at 50% 0,#82364544,transparent 80%),linear-gradient(140deg,#51232ee8,#281219ed)!important;box-shadow:inset 0 0 0 1px #a0566355,0 0 ${SU(18)} #63243122!important}
${CJ} #premiumPrepare>.pc-route-edge{filter:sepia(1) saturate(2.4) hue-rotate(308deg) brightness(1.4)!important}
${CJ} #premiumPrepare .pcg-glyph{filter:brightness(2.15) saturate(.4) drop-shadow(0 1px 1px #000)!important;opacity:1!important}
${CJ} #premiumPrepare:is(:hover,:focus-visible,.pf){background:linear-gradient(140deg,#6a2b3a,#35151f)!important;filter:none!important;box-shadow:inset 0 0 0 1px #ce7a8788,0 0 ${SU(20)} #8d314133!important}
${CJ} :is(#kapBtn,#kronBtn,#premiumPrepare):after{content:none!important;display:none!important}
${CJ} .premium-map .m2-ch{border:0!important;border-image:none!important;outline:0!important;box-shadow:none!important}
${CJ} .premium-map .m2-ch:is(:hover,:focus-visible,.pf){outline:0!important;box-shadow:none!important}
${CJ} .premium-map .m2-ch.premium-selected{outline:2px solid #783039!important;outline-offset:-2px!important;border:0!important;box-shadow:inset 0 0 ${SU(20)} #69233233!important}
${CJ} .premium-map .m2-ch.premium-selected>.pcg-edge{filter:sepia(1) saturate(3) hue-rotate(315deg) brightness(.92)!important;opacity:1!important}
${CJ} .premium-map .m2-ch:after{content:attr(data-status)!important;display:block!important;background:none!important;border:0!important;box-shadow:none!important}
${CJ} .premium-map .m2-ch.premium-selected:before{background:none!important;border:0!important;box-shadow:none!important}
${CJ} .premium-map .pc-chapter-label{background:none!important;border:0!important;border-image:none!important;box-shadow:none!important;outline:0!important}
${CJ} .premium-map .pc-chapter-label:before,${CJ} .premium-map .pc-chapter-label:after{content:none!important;display:none!important;background:none!important;border:0!important;box-shadow:none!important}
`;
 document.head.append(fs);

 // Cinzel dla naglowkow i akcji; szeryf dla informacji i danych.
 // Pseudoelement czyta etykiete, bez duplikowania tekstu DOM ani zmiany komunikatow ladowania.
 const ty=make('style','');ty.id='pc-unified-typography';
 const UT='#orient'.repeat(36)+'.pc-menu.pc-gfx.pc-type',UP=UT+' :is(#title,#prep,#kap,#opts,#manual,#pause,#lvl,#shop,#end,#conf,#lang)',UJ=UT+' #title:not(.pc-home)',TF=n=>`calc(${n} * var(--pc-u) * var(--nbts,1))`;
 ty.textContent=`
${UT} #screen :is(#dialog,#msg,#nbHud,#activeSkillHud,#intro,#prompt,#notice,#tut,#hud,#boss,#end,#lvl,#pause,#manual,#prep,#opts,#kap,#shop,#title) :is(p,li,kbd,small,output),${UT} #screen :is(#dialog,#msg,#prompt,#notice,#tut),${UT} #screen #nbHud :is(strong,b,span),${UT} #screen #activeSkillHud kbd{font-family:Georgia,serif!important}
${UP} :is(button,summary,.cn,.nbp-tab,.pc-prep-tab),${UT} #screen :is(#intro,#dialog,#notice) :is(h1,h2,h3){font-family:var(--pc-display)!important;font-weight:450!important}
@font-face{font-family:'Cinzel';font-style:normal;font-weight:400 900;font-display:swap;src:url('assets/czcionki/f4d83d34d1f6c741193e4acf4b3dff9531e5a67b6aa65228d00a7db72a4e0f34.ttf') format('truetype')}
${UT}{--pc-display:'Cinzel',Georgia,serif;--pc-reading:Georgia,'Times New Roman',serif;--pc-type-bone:#edddbd;--pc-type-copy:#d7c9b1}
${UP} .pcg-glyph{width:auto!important;max-width:100%!important;height:auto!important;min-height:0!important;flex:0 1 auto!important;background:none!important;background-image:none!important;filter:none!important;overflow:visible!important;font:450 calc(var(--pcg-h)*1.02)/1.15 var(--pc-display)!important;font-synthesis:none!important;font-kerning:normal!important;letter-spacing:0!important;color:var(--pc-type-bone)!important;text-shadow:0 1px 2px #0009!important;text-align:center!important}
${UP} .pcg-glyph:before{content:attr(data-copy)!important;display:block!important;font:inherit!important;line-height:inherit!important;letter-spacing:inherit!important;color:inherit!important;background:none!important;border:0!important;position:static!important;transform:none!important;text-indent:0!important}
${UP} .pcg-glyph:after{content:none!important;display:none!important}
${UP} .pcg-heading{padding:calc(10 * var(--pc-u)) calc(36 * var(--pc-u))!important}
${UP} :is(h1,h2,h3,.pc-fantasy-title,.tab,.stab,.nbp-tab,.pc-prep-tab,.pc-popover>summary,.pc-run-identity,.card .cn,#rerollBtn){font-family:var(--pc-display)!important;font-weight:450!important;font-synthesis:none!important;letter-spacing:0!important}
${UT} #title.pc-home .pc-play .pcg-glyph{--pcg-h:${TF(46)}}
${UT} #title.pc-home .pcg-mode .pcg-glyph{--pcg-h:${TF(28)}}
${UJ} .premium-caption{font:450 ${TF(47)}/1.12 var(--pc-display)!important;color:var(--pc-type-bone)!important;letter-spacing:0!important;font-synthesis:none!important;text-wrap:balance!important}
${UJ} .pc-journey-head .pcg-heading .pcg-glyph{--pcg-h:${TF(48)}}
${UJ} :is(#kapBtn,#kronBtn) .pcg-glyph{--pcg-h:${TF(32)};filter:none!important}
${UJ} #premiumPrepare .pcg-glyph{--pcg-h:${TF(36)};color:#fff0cf!important;filter:none!important;opacity:1!important}
${UJ} .pc-home-button{width:calc(295 * var(--pc-u))!important;padding-inline:calc(34 * var(--pc-u)) calc(10 * var(--pc-u))!important}
${UJ} .pc-home-button .pcg-glyph{--pcg-h:${TF(22)};white-space:nowrap!important}
${UJ} .pc-journey-mode{gap:calc(2 * var(--pc-u))!important;padding:calc(3 * var(--pc-u)) calc(20 * var(--pc-u))!important}
${UJ} .pc-journey-mode small .pcg-glyph{font:400 max(13px,${TF(14)})/1.2 var(--pc-reading)!important;color:#c3ae89!important;letter-spacing:.025em!important;filter:none!important}
${UJ} .pc-journey-mode strong .pcg-glyph{--pcg-h:${TF(28)};filter:none!important}
${UJ} :is(.pc-chapter-label strong,.pc-chapter-label small,.pc-destination-facts strong,.pc-destination-facts small,.pc-profile-stat strong,.pc-profile-stat small){font-family:var(--pc-reading)!important;font-weight:400!important;font-synthesis:none!important}
${UJ} .premium-caption:before{font:400 max(12px,${TF(14)})/1.2 var(--pc-reading)!important;color:#c4a26d!important;letter-spacing:.15em!important}
${UJ} .premium-map .m2-ch.lk{opacity:1!important;filter:none!important;background-color:#77716b!important;background-blend-mode:multiply!important}
${UJ} .premium-map .m2-ch.lk .pc-chapter-label strong{color:#cbbda6!important}
${UJ} .premium-map .m2-ch.lk .pc-chapter-label small{color:#ac946f!important}
${UJ} .premium-map .m2-ch.lk:after{color:#baa381!important;opacity:1!important}
${UJ} .premium-map .m2-ch.lk>.pcg-edge{opacity:.55!important}
${UJ} .premium-map .pc-chapter-label strong{line-height:1.22!important}
${UJ} .pc-destination-facts small,${UJ} .pc-profile-stat small{font-size:max(13px,${TF(14)})!important;color:#c5ad83!important}
${UJ} .pc-destination-facts strong{font-size:${TF(25)}!important;color:#e5d3b2!important}
${UP} :is(.pc-detail-copy p,.pc-option-section p,.loadout-state,.loadout-copy,.card .cd,.card .fx,.nbs-grid small){font-family:var(--pc-reading)!important}
`;
 document.head.append(ty);

 // Wspólna oprawa paneli i akcji. Osobne stany dla wyboru i wskazania.
 const polish = make('style','');
 const ui = '#orient'.repeat(40)+'.pc-menu.pc-gfx';
 const menus = ui+' :is(#title,#prep,#opts,#kap,#manual,#pause,#lvl,#shop,#end,#conf,#intro,#dialog)';
 polish.textContent = `
${menus}{--frame-paper:linear-gradient(145deg,#201a20ed,#100f12ed);--frame-wine:linear-gradient(145deg,#572632,#2b161c);--frame-line:#a58a60}
${menus} :is(.pcg-heading,.tab,.stab,.nbp-tab,.pc-prep-tab,.pc-popover>summary,.btnrow>button,.lvbtns>button,#iskip),${ui} #title.pc-home .premium-nav>.pcg-menu{
 box-sizing:border-box!important;border:6px solid transparent!important;border-image:url('${GF.panel}') 128 / 10px stretch!important;border-radius:0!important;background:var(--frame-paper)!important}
${menus} :is(.tab.on,.stab.on,.nbp-tab[aria-pressed=true],.pc-prep-tab[aria-pressed=true],.btnrow>button:focus-visible,.lvbtns>button:focus-visible),${ui} #title.pc-home .premium-nav>.pcg-menu:is(:hover,:focus-visible,.pf){background:var(--frame-wine)!important}
${menus} :is(.pcg-edge,.pc-route-edge){border-image-source:url('${GF.panel}')!important}
${ui} #title.pc-home .nb-mode{box-sizing:border-box!important;width:calc(275 * var(--pc-u) * var(--nbts,1))!important;padding:calc(9 * var(--pc-u)) calc(22 * var(--pc-u)) calc(9 * var(--pc-u)) calc(57 * var(--pc-u))!important;align-items:center!important;border:6px solid transparent!important;border-image:url('${GF.panel}') 128 / 10px stretch!important;background:var(--frame-paper)!important}
${ui} #title.pc-home .nb-mode[aria-checked=true]{background:var(--frame-wine)!important}
${ui} #title.pc-home .nb-mode .pcg-glyph{--pcg-h:${TF(25)};white-space:nowrap!important}
${ui} #title:not(.pc-home) .pc-journey-head .pcg-heading{width:min(53vw,calc(660 * var(--pc-u) * var(--nbts,1)))!important;max-width:56vw!important;padding:calc(8 * var(--pc-u)) calc(22 * var(--pc-u))!important}
${ui} #opts button:is([aria-pressed],[role=radio]){border:1px solid #806c504d!important;background:#151317bb!important;border-radius:0!important}
${ui} #opts button:is([aria-pressed=true],[aria-checked=true]){background:var(--frame-wine)!important;border-color:#c29e69!important;box-shadow:inset 0 -2px #dbb779!important;color:#fff0cf!important}
${ui} #opts button:is([aria-pressed],[role=radio]):is(:focus-visible,.pf){outline:2px solid #e2c898!important;outline-offset:2px!important}
${ui} #intro #iskip{font:450 max(16px,${TF(21)})/1.25 Cinzel,Georgia,serif!important;text-transform:none!important;letter-spacing:.025em!important;color:#f2dfbb!important;padding:.35em 1em!important;min-height:40px!important}
${ui} #intro #iskip:is(:hover,:focus-visible,.pf){background:var(--frame-wine)!important}
${ui} #lvl #cards .card:hover,${ui} #lvl #cards:not(:has(.card:hover)) .card:is(:focus,.pf){background:linear-gradient(150deg,#502330f5,#261920f2)!important;outline:2px solid #e3bb78!important;outline-offset:-2px!important;box-shadow:inset 0 0 18px #9f4d4933!important}
${ui} #lvl #cards .card:hover .cn,${ui} #lvl #cards:not(:has(.card:hover)) .card:is(:focus,.pf) .cn{color:#fff1cc!important}
${ui} #lang :is(.lgpick,button[data-lang],.lgfr){border:0!important;border-image:none!important;border-radius:0!important;background:none!important;box-shadow:none!important;outline:0!important}
${ui} #lang :is(button[data-lang],.lgfr):before,${ui} #lang :is(button[data-lang],.lgfr):after{content:none!important}
${ui} #lang .lglb{position:absolute!important;clip-path:inset(50%)!important;width:1px!important;height:1px!important;overflow:hidden!important}
${ui} #lang button[data-lang]:is(:hover,:focus-visible,.pf) .lgfr{filter:brightness(1.2) drop-shadow(0 0 5px #f5d38d)!important}
${ui} #screen.pc-hud .pch-health .pch-liquid{filter:brightness(1.27) saturate(1.55)}
${ui} #screen.pc-hud .pch-mana .pch-liquid{filter:brightness(1.85) saturate(2.7)}
${ui}.pc-type #prep :is(#prepK,.opt b,.opt strong,.pc-run-identity,.pc-detail-copy h3,.pc-popover summary,#prepBack),
${ui}.pc-type #kap :is(#kapHd,.m2k-head,.m2k-row b,.m2k-row strong,.m2k-buy){font-family:var(--pc-display)!important;font-weight:450!important;letter-spacing:0!important}
${ui}.pc-type #prep :is(.opt small,.opt .pl,.opt .mi,.pc-detail-copy p,.pc-run-status small),
${ui}.pc-type #kap #kapDet :is(p,small,td,b){font-family:var(--pc-reading)!important}
${ui} #prep .premium-prep-head #prepBack{position:absolute!important;left:0!important;top:50%!important;transform:translateY(-50%)!important;width:calc(112 * var(--pc-u))!important;padding:0!important;margin:0!important}
${ui} #prep .premium-prep-head .pc-popover:first-child{left:calc(134 * var(--pc-u))!important}
${ui} #prep .premium-prep-head .pc-popover:last-child{right:calc(134 * var(--pc-u))!important}
${ui} #title.pc-home .nb-mode-select{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;width:min(80vw,calc(530 * var(--pc-u) * var(--nbts,1)))!important}
${ui} #title.pc-home .nb-mode{width:100%!important;padding:calc(10 * var(--pc-u)) calc(16 * var(--pc-u))!important;align-items:center!important;justify-content:center!important;text-align:center!important;box-shadow:none!important}
${ui} #title.pc-home .nb-mode :is(img,.nb-mode__icon,.premium-nav-icon,.nb-mode__marker){display:none!important}
${ui} #title.pc-home .nb-mode::before,${ui} #title.pc-home .nb-mode::after{content:none!important}
${ui} #title.pc-home .nb-mode .pc-mode-note{margin-inline:0!important;text-align:center!important}
/* Aktywna zakladka: staly bordowy kontur, niezalezny od wskazania kursorem. */
${menus} :is(.tab.on,.stab.on,.nbp-tab[aria-pressed=true],.pc-prep-tab[aria-pressed=true]):not(#pc-tab-unused){background:linear-gradient(145deg,#61303bea,#351c25f5)!important;outline:2px solid #b45b6c!important;outline-offset:-2px!important;box-shadow:inset 0 0 0 4px #6e303e,inset 0 0 22px #7f344533!important;color:#fff0d5!important}
${menus} :is(.tab,.stab,.nbp-tab,.pc-prep-tab):is(:focus-visible,.pf):not(#pc-tab-unused){outline:2px solid #efd09b!important;outline-offset:2px!important}
/* Hover PC: bez ponownego rastrowania ramek i starych nakladek bitmapowych. */
${menus} :is(button,summary):is(:hover,:focus-visible,.pf){--pc-cloth:linear-gradient(145deg,#42232e,#21171e);--pcg-idle:linear-gradient(145deg,#201a20ed,#100f12ed);--pcg-selected:linear-gradient(145deg,#42232e,#21171e);filter:none!important}
${menus} :is(button,summary):is(:hover,:focus-visible,.pf)>:is(.pcg-edge,.pc-journey-gear){filter:none!important}
${menus} :is(.tab,.stab,.nbp-tab,.pc-prep-tab):hover:not(.on):not([aria-pressed=true]):not(#pc-tab-unused){background:linear-gradient(145deg,#38212be8,#20171def)!important}
`;document.head.append(polish);



})();

// ===== PC HUD: osobna, odwracalna oprawa wedlug referencji autora =====
// Wylacznie odczyt stanu i prezentacja; natywne przyciski slotow zachowuja zdarzenia.
// ?pchud=0 przywraca poprzednia oprawe. Dotyk i drugi gracz zachowuja swoj HUD.
(()=>{
 const scr=$('screen'),old=$('nbHud'),active=$('activeSkillHud'),T=(p,e)=>EN?e:p;
 const enabled=new URLSearchParams(location.search).get('pchud')!=='0';
 const A={orb:'assets/ui/aa1a0ab45685e4e1031a4d181294d8b33586e462b5a09757e88163a0aa71e9dc.png',glass:'assets/ui/1241cdaa75462141414601587b061d6014bc6784a1d3565147cb57cdb0c71eec.png',rail:'assets/ui/816505b27574c9f151a4e0de1484ea111bc11e1fbd3397f5e9503b16f8c6fc3b.png',slot:'assets/ui/3a4a3c72472c165554dca7d22f74a4836fd5c5eb886bcade73fe7837e9e5df6d.png',clock:'assets/ui/a14509e55193f2cedca6747eea48dbaca03f3b176a219684b95f57c66f745d1e.png',map:'assets/ui/636940933215ef7f5db551f320db8f87a6b628a6063ac51f854904eeb253cdd4.png'};
 const make=(tag,c,h)=>{const e=document.createElement(tag);e.className=c;if(h!==undefined)e.innerHTML=h;return e};
 const orb=(c,label)=>`<div class="pch-orb pch-${c}" role="meter" aria-label="${label}" aria-valuemin="0"><div class="pch-glass"><img class="pch-liquid" alt="" src="${A.glass}"></div><i class="pch-thorns"></i><strong></strong></div>`;
 const root=make('div','pch',orb('health',T('Zdrowie','Health'))+orb('mana','Mana')+
 `<div class="pch-wallet"><span class="pch-cell pch-coins" title="${T('Monety','Coins')}"><img alt="" src="${PREMIUM_ICONS['kaplica-purse']}"><b></b></span><span class="pch-cell pch-ashes" title="${T('Popioły','Ashes')}"><img alt="" src="assets/efekty/006aadc624b9900d15e477957db3177be645ac45c9879d6ba467df69253c5c74.webp"><b></b></span></div>`+
 `<div class="pch-dock"><i class="pch-rail"></i><div class="pch-level"><small>${T('POZIOM NOCY','NIGHT LEVEL')}</small><strong></strong></div><div class="pch-enchants"></div><div class="pch-actions"><span class="pch-cell pch-attack"><i></i><kbd></kbd></span><span class="pch-cell pch-block"><i></i><kbd></kbd></span></div><div class="pch-stamina" role="meter" aria-label="Stamina" aria-valuemin="0"><i></i><small></small></div><div class="pch-experience" role="meter" aria-label="${T('Doświadczenie','Experience')}" aria-valuemin="0"><i></i></div></div><div class="pch-effects"></div><div class="pch-challenge"></div>`);
 old.append(root);const q=s=>root.querySelector(s),health=q('.pch-health'),mana=q('.pch-mana'),stamina=q('.pch-stamina'),xp=q('.pch-experience');
 // Zloty luk staminy biegnie po wewnetrznej stronie kuli many; EXP zostaje na listwie.
 stamina.innerHTML='<svg viewBox="0 0 156 156" aria-hidden="true"><defs><linearGradient id="pch-st-gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4d77a"/><stop offset=".5" stop-color="#cfac48"/><stop offset="1" stop-color="#9e7730"/></linearGradient></defs><path class="pch-st-track" d="M80.3 20 A59.7 59.7 0 0 0 80.3 139.4"/><path class="pch-st-fill" pathLength="100" d="M80.3 20 A59.7 59.7 0 0 0 80.3 139.4"/></svg><small></small>';mana.append(stamina);
 const text=(e,v)=>{v=String(v);if(e.textContent!==v)e.textContent=v};
 const meter=(e,v,m)=>{v=Math.max(0,Math.min(m,v));const n=String(Math.ceil(v)),mx=String(m),fill=(100*v/(m||1)).toFixed(2)+'%';if(e.getAttribute('aria-valuenow')!==n)e.setAttribute('aria-valuenow',n);if(e.getAttribute('aria-valuemax')!==mx)e.setAttribute('aria-valuemax',mx);if(e.style.getPropertyValue('--fill')!==fill)e.style.setProperty('--fill',fill);return n+' / '+Math.round(m)};
 const gain=old.querySelector('.nbh-gain'),night=old.querySelector('.nbh-night'),wallet=q('.pch-wallet');
 // Kooperacja: osobne zasoby postaci, wspolne dane Nocy. Bez zmian mechaniki.
 const co=make('div','pch pcmp');co.hidden=true;
 const coPanels=[0,1].map(i=>{const el=make('section','pcmp-player pcmp-p'+(i+1));el.setAttribute('aria-label',T('Gracz ','Player ')+(i+1));
  const hp=health.cloneNode(true),mp=mana.cloneNode(true),arc=mp.querySelector('.pch-stamina');arc.innerHTML=arc.innerHTML.replaceAll('pch-st-gold','pcmp-st-gold-'+i);arc.querySelector('.pch-st-fill').style.stroke="url('#pcmp-st-gold-"+i+"')";
  const tag=make('div','pcmp-tag'),state=make('div','pcmp-state'),skills=make('div','pcmp-skills'),heading=make('small','pcmp-skills-title');tag.textContent=T('Gracz ','Player ')+(i+1);heading.textContent=T('Zdobyte','Acquired');
  el.append(tag,state,hp,mp,heading,skills);co.append(el);return{el,hp,mp,arc,state,skills,signature:''}});
 const centre=make('div','pcmp-centre'),coLevel=q('.pch-level').cloneNode(true),coXp=xp.cloneNode(true),coWallet=wallet.cloneNode(true),coRevive=make('div','pcmp-revive');
 coWallet.setAttribute('aria-label',T('Wspólne zasoby','Shared resources'));centre.append(coLevel,coXp,coWallet,coRevive);co.append(centre);old.append(co);
 co.addEventListener('click',e=>{const b=e.target.closest('[data-coop-slot]');if(!b||b.disabled)return;const use=()=>activateSlot(+b.dataset.coopSlot);if(b.dataset.player==='2')asP2(use);else use()});
 co.addEventListener('keydown',e=>{if(e.target.closest('[data-coop-slot]')&&['Enter',' '].includes(e.key)){e.stopPropagation();if(e.repeat)e.preventDefault()}});
 function coopHud(){
  for(const [i,v] of coPanels.entries()){const p=i?pl2:pl1;if(!p)continue;
   text(v.hp.querySelector('strong'),meter(v.hp,p.dead?0:p.hp,p.max||1));text(v.mp.querySelector('strong'),meter(v.mp,p.mana||0,p.manaMax||SL.mana.max));
   const st=meter(v.arc,p.sta||0,p.staMax||1);v.arc.title='Stamina · '+st;text(v.arc.querySelector('small'),'STA · '+Math.round(p.sta||0));v.arc.querySelector('.pch-st-fill').style.strokeDasharray=parseFloat(v.arc.style.getPropertyValue('--fill'))+' 100';
   v.hp.setAttribute('aria-label',T('Zdrowie gracza ','Player health ')+(i+1));v.mp.setAttribute('aria-label',T('Mana gracza ','Player mana ')+(i+1));v.arc.setAttribute('aria-label',T('Stamina gracza ','Player stamina ')+(i+1));
   v.el.classList.toggle('pcmp-dead',!!p.dead);v.hp.classList.toggle('pch-low',!!SETT.flash&&!p.dead&&p.hp/p.max<=.25);
   const rb=i?p.rbF:S.rebirth,used=i?p.rbU:S.rebirthUsed;
   text(v.state,p.dead?T('Poległ · czeka na wskrzeszenie','Fallen · awaiting revival'):rb?(used?T('Odrodzenie zużyte','Revival used'):T('Odrodzenie gotowe','Revival ready')):'');
   const state=i?p.actives:S,labels=i||PAD.on?['LT+X','LT+Y','LT+B','LT+A']:[KB.map.s1,KB.map.s2,KB.map.s3,KB.map.s4].map(kbName);
   const markup=state.activeSlots.map((k,j)=>{const c=ACTIVE_CFG[k],cd=c?Math.ceil(state[c.cd]||0):0,low=c&&(c.resource==='stamina'?p.sta:p.mana)<c.cost,nm=k?SK[k].name:T('Wolny slot','Empty slot');return `<button type="button" data-player="${i+1}" data-coop-slot="${j}" class="pch-cell pcmp-slot${low?' no-mana':''}${cd?' cooling':''}" title="${nm}" aria-label="${T('Gracz ','Player ')}${i+1}: ${labels[j]} · ${nm}" ${!k||p.dead?'disabled':''}>${k?`<img alt="" src="${PREMIUM_ICONS['skille-'+k]}">`:''}<kbd>${labels[j]}</kbd>${cd?`<b>${cd}</b>`:''}</button>`}).join('');
   if(markup!==v.signature){v.signature=markup;v.skills.innerHTML=markup}v.skills.previousElementSibling.hidden=true;
  }
  meter(coXp,S.xp,S.need||1);coXp.title=T('Wspólne doświadczenie: ','Shared experience: ')+S.xp+' / '+S.need;text(coLevel.querySelector('strong'),S.lvl);text(coWallet.querySelector('.pch-coins b'),S.coins);text(coWallet.querySelector('.pch-ashes b'),EMB.e);
  text(coRevive,mpTotTxt());
 }
 const oldHud=hud;let key='',buffKey='',scaleKey='';
 hud=function(){oldHud();const on=enabled&&!coarse&&innerWidth>=innerHeight*1.3,coop=!!(S&&pl2&&S.phase==='play');scr.classList.toggle('pc-hud',on);scr.classList.toggle('pc-coop',on&&coop);const gainHome=on?(coop?coWallet:wallet):night;if(gain&&gain.parentElement!==gainHome)gainHome.append(gain);const show=on&&!!S&&S.phase==='play'&&!S.paused&&!S.choosing&&!S.shop&&!S.dialog&&!S.intro&&!S.notice&&(coop||!pl.dead);root.hidden=!show||coop;co.hidden=!show||!coop;scr.classList.toggle('pc-hud-visible',show);if(!show)return;
  const sk=innerWidth+'x'+innerHeight;if(sk!==scaleKey){scaleKey=sk;const r=scr.getBoundingClientRect();scr.style.setProperty('--hu',Math.min(r.width/1040,r.height/577)+'px')}
  if(coop){coopHud();return}
  text(health.querySelector('strong'),meter(health,pl.hp,pl.max||1));text(mana.querySelector('strong'),meter(mana,pl.mana||0,pl.manaMax||SL.mana.max));
  const st=meter(stamina,pl.sta||0,pl.staMax||1);stamina.title='Stamina · '+st;text(stamina.querySelector('small'),'STA · '+st);const dash=parseFloat(stamina.style.getPropertyValue('--fill'))+' 100';if(stamina._dash!==dash){stamina._dash=dash;stamina.querySelector('.pch-st-fill').style.strokeDasharray=dash}
  meter(xp,S.xp,S.need||1);xp.title=T('Doświadczenie','Experience')+' · '+S.xp+' / '+S.need;
  for(const [e,id] of [[health,'hpbar'],[stamina,'stam'],[mana,'mana']]){e.classList.toggle('pch-flash',!!SETT.flash&&$(id).classList.contains('flash'));e.classList.toggle('pch-low',!!SETT.flash&&parseFloat(e.style.getPropertyValue('--fill'))<=25)}
  text(q('.pch-level strong'),S.lvl);text(q('.pch-coins b'),S.coins);text(q('.pch-ashes b'),EMB.e);
  q('.pch-coins').setAttribute('aria-label',T('Monety: ','Coins: ')+S.coins);q('.pch-ashes').setAttribute('aria-label',T('Popioły: ','Ashes: ')+EMB.e);
  const en=ENCH.filter(k=>S.sk[k]).sort((a,b)=>(b===S.mainEnchant)-(a===S.mainEnchant));
  const k=en.map(k=>k+S.sk[k]).join('|')+'|'+PAD.on+'|'+S.activeSlots.length;
  if(k!==key){key=k;q('.pch-enchants').innerHTML=[0,1].map(i=>{const k=en[i],label=k?SK[k].name+' · '+S.sk[k]:T('Wolne zaklęcie ostrza','Empty blade spell');return `<span class="pch-cell" title="${label}" aria-label="${label}">${k?`<img alt="" src="${PREMIUM_ICONS['skille-'+k]}"><b>${S.sk[k]}</b>`:''}</span>`}).join('');
   text(q('.pch-attack kbd'),PAD.on?'RT':T('LPM','LMB'));text(q('.pch-block kbd'),PAD.on?'LB':T('PPM','RMB'));q('.pch-attack').title=T('Szybki atak · przytrzymaj: silny atak','Quick attack · hold: strong attack');q('.pch-block').title=T('Blok i parowanie','Block and parry');active.classList.toggle('pch-five',S.activeSlots.length>4)}
  for(const e of active.querySelectorAll('.active-slot.empty')){e.title=T('Wolny slot — wyposaż w pauzie','Empty slot — equip in pause');e.setAttribute('aria-label',e.querySelector('kbd').textContent+': '+T('wolny slot','empty slot'))}
  // Statusy zachowuja pelne opisy i pozostaly czas w podpowiedziach.
  const b=$('buffs').innerHTML,c=$('chal'),bk=b+'|'+c.hidden+'|'+c.textContent+'|'+(S.sk.aard||0);
  if(bk!==buffKey){buffKey=bk;const temp=make('div','');temp.innerHTML=b.replace(/<br\s*\/?\s*>/gi,'\n');const labels=temp.textContent.split('\n').filter(Boolean),icons=['kaplica-lastch','kaplica-elite','kaplica-vigor','kaplica-venge','kaplica-breath','skille-bloodblade','skille-retaliation','skille-stoneguard','perki-riposta','skille-garda','kaplica-vigor','skille-iceblade','skille-aard'];
   const flags=[S.rebirth,S.trial,S.bless,S.fury>0,S.heri>0,S.bloodPrimed>0,S.swordGuardian,pl.riposte>0,pl.broken>0,S.herb>0,S.slowT>0,S.snare>0];let i=0;const effects=q('.pch-effects');effects.replaceChildren();flags.forEach((v,j)=>{if(!v)return;const e=make('span','pch-cell');e.title=labels[i]||'';e.setAttribute('aria-label',labels[i++]||'');const im=make('img','');im.alt='';im.src=PREMIUM_ICONS[icons[j]];e.append(im);effects.append(e)});
   if(S.sk.aard){const e=make('span','pch-cell');e.title=SK.aard.name+' · '+S.sk.aard;e.setAttribute('aria-label',e.title);const im=make('img','');im.src=PREMIUM_ICONS['skille-aard'];im.alt='';e.append(im);effects.append(e)}
   const ch=q('.pch-challenge');ch.hidden=c.hidden;text(ch,c.textContent);ch.classList.toggle('done',c.classList.contains('done'))}
 };
 const O='#orient'.repeat(14)+' #screen.pc-hud',N=O+' #nbHud',H=O+' .pch',AS=O+' #activeSkillHud',u=n=>`calc(var(--hu,1px)*${n})`;
 const style=make('style','pc-hud-style');style.textContent=`
${O}{--hu:1px}
${H}{position:absolute;inset:0;pointer-events:none;font-family:Grenze,Georgia,serif;color:#e7dfd1;text-shadow:0 1px 3px #000,0 0 4px #000;font-variant-numeric:tabular-nums}
${H}[hidden],${H} [hidden]{display:none!important}
${N} .nbh-vitals,${N} .nbh-coins{display:none!important}
${O}:not(.pc-hud-visible) #nbHud .nbh-night,${O}:not(.pc-hud-visible) #nbHud .nbh-radar,${O}:not(.pc-hud-visible) #nbHud .nbh-boss{visibility:hidden!important}
${H}:before{content:'';position:absolute;inset:auto 0 0;height:${u(125)};background:linear-gradient(0deg,#07090ccc,transparent);pointer-events:none}
${H} .pch-orb{position:absolute;bottom:${u(-13)};width:${u(156)};height:${u(156)};pointer-events:auto}
${H} .pch-health{left:${u(-9)}}${H} .pch-mana{right:${u(-9)}}
${H} .pch-thorns{position:absolute;inset:0;background:url('${A.orb}') center/100% 100% no-repeat;filter:drop-shadow(0 2px 2px #000c);z-index:2}
${H} .pch-mana .pch-thorns{transform:scaleX(-1)}
${H} .pch-glass{position:absolute;left:13.9%;top:16%;width:69.2%;height:70.2%;overflow:hidden;border-radius:50%;background:radial-gradient(circle at 28% 24%,#3e434e,#0a0b11 45%,#030509 80%);box-shadow:inset 0 0 ${u(8)} #000}
${H} .pch-mana .pch-glass{left:16.9%}
${H} .pch-glass:after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 ${u(5)} #000a,inset 0 ${u(-2)} ${u(4)} #ffffff12;background:radial-gradient(ellipse at 29% 24%,#ffffff1c,transparent 16%);pointer-events:none}
${H} .pch-liquid{position:absolute!important;max-width:none!important;width:250.56%!important;height:122.34%!important;left:-11.86%;top:-11.31%;object-fit:fill!important;clip-path:inset(calc(9.24% + (100% - var(--fill,100%))*.8174) 0 0);transition:clip-path .12s linear}
${H} .pch-mana .pch-liquid{left:-137.71%}
${H} .pch-orb strong{position:absolute;z-index:3;top:51.1%;left:48.5%;transform:translate(-50%,-50%);font:500 ${u(13)}/1 Grenze,Georgia,serif;white-space:nowrap;color:#f5eadd}
${H} .pch-mana strong{left:51.5%}
${H} .pch-orb.pch-low .pch-glass{box-shadow:0 0 ${u(9)} #951c3644,inset 0 0 ${u(8)} #000}
${H} .pch-cell{position:relative;display:flex;align-items:center;justify-content:center;width:${u(36)};height:${u(36)};box-sizing:border-box;pointer-events:auto;background:url('${A.slot}') center/120% 120% no-repeat}
${H} .pch-cell img{position:absolute;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 1px 2px #000)}
${H} .pch-cell b{position:absolute;right:${u(4)};bottom:${u(2)};font:500 ${u(10)}/1 Grenze,Georgia,serif;color:#ede4cd}
${H} .pch-wallet{position:absolute;left:${u(137)};bottom:${u(18)};display:flex;gap:${u(4)}}
${H} .pch-wallet .pch-cell{width:${u(32)};height:${u(34)}}
${H} .pch-wallet img{width:65%;height:65%;top:7%}
${H} .pch-wallet b{left:0;right:0;bottom:${u(1)};text-align:center;background:#08090bac;line-height:1.1;font-size:${u(10)}}
${H} .pch-dock{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:${u(450)};height:${u(96)}}
${H} .pch-rail{position:absolute;left:${u(-10)};bottom:${u(-29)};width:${u(470)};height:${u(156.67)};background:url('${A.rail}') center/100% 100% no-repeat;mask-image:linear-gradient(#000 0 54%,transparent 54%),radial-gradient(ellipse ${u(35)} ${u(45)} at 50% 52%,#000 98%,transparent);pointer-events:none}
${H} .pch-level{position:absolute;left:50%;bottom:${u(30)};width:${u(55)};height:${u(42)};transform:translateX(-50%);display:flex;align-items:center;justify-content:center;text-align:center}
${H} .pch-level strong{font:500 ${u(24)}/1 Grenze,Georgia,serif;color:#efe7d8}
${H} .pch-level small{position:absolute;bottom:${u(52)};left:50%;transform:translateX(-50%);font:${u(8)}/1 Grenze,Georgia,serif;color:#c5bda4;white-space:nowrap;letter-spacing:${u(.5)}}
${H} .pch-enchants,${H} .pch-actions{position:absolute;bottom:${u(24)};display:flex;gap:${u(3)}}
${H} .pch-enchants{left:${u(257)}}${H} .pch-actions{right:${u(1)}}
${H} .pch-actions kbd{position:absolute;bottom:${u(-3)};font:${u(8)}/1 Grenze,Georgia,serif;color:#c8bda7;padding:0 ${u(2)};background:#0a0c0ddd;border:0}
${H} .pch-actions i{width:65%;height:65%;opacity:.72;background:center/contain no-repeat}
${H} .pch-attack i{background-image:url('${PREMIUM_ICONS['skille-ostrze']}')}${H} .pch-block i{background-image:url('${PREMIUM_ICONS['skille-garda']}')}
${H} .pch-experience{position:absolute;left:${u(5)};right:${u(5)};height:${u(4)};bottom:${u(4)};border:1px solid #8b754b;box-shadow:0 1px 2px #000,inset 0 0 0 1px #080a0c;background:#0b0e10;pointer-events:auto}
${H} .pch-experience i{display:block;height:100%;width:var(--fill,0%);background:linear-gradient(#e6c987,#9b7940);transition:width .1s linear}
${H} .pch-stamina{position:absolute;inset:0;z-index:4;background:none;border:0;box-shadow:none;pointer-events:none}
${H} .pch-stamina svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;fill:none;stroke-linecap:round}
${H} .pch-st-track{stroke:#171a1dd9;stroke-width:5}
${H} .pch-st-fill{stroke:url('#pch-st-gold');stroke-width:2.6;filter:drop-shadow(0 0 ${u(1)} #e0b74155)}
${H} .pch-stamina small{position:absolute;left:51.5%;top:65%;transform:translateX(-50%);font:${u(8)}/1 Grenze,Georgia,serif;color:#dfc878;white-space:nowrap}
${AS}{left:calc(50% - ${u(185)})!important;right:auto!important;bottom:${u(24)}!important;top:auto!important;transform:none!important;zoom:1!important;transform-origin:50% 100%!important;padding:0!important;gap:${u(3)}!important;background:none!important;border:0!important;display:flex!important;align-items:center!important;z-index:6}
${AS}[hidden]{display:none!important}${AS}:after{content:none!important}
${AS} .active-slot{position:relative!important;flex:none!important;width:${u(36)}!important;height:${u(36)}!important;padding:${u(4)}!important;min-width:0!important;min-height:0!important;aspect-ratio:1!important;border:0!important;border-radius:0!important;border-image:none!important;box-shadow:none!important;background:url('${A.slot}') center/120% 120% no-repeat!important;overflow:visible!important;opacity:1!important}
${AS} .active-slot:before,${AS} .active-slot:after{content:none!important}
${AS} .active-slot .ic{width:${u(27)}!important;height:${u(27)}!important;border-radius:0!important;opacity:1}
${AS} .active-slot.empty>span{display:none!important}
${AS} .active-slot.empty{opacity:.3!important}${AS} .active-slot.empty kbd{display:none!important}${H} .pch-enchants .pch-cell:not(:has(img)){opacity:.3}
${AS} .active-slot kbd{top:auto!important;bottom:${u(-3)}!important;left:50%!important;padding:0 ${u(2)}!important;min-width:0!important;font:500 ${u(8)}/1 Grenze,Georgia,serif!important;color:#c8bda7!important;background:#0a0c0ddd!important;border:0!important;border-radius:0!important;transform:translateX(-50%)!important}
${AS} .active-slot small{left:auto!important;right:${u(3)}!important;bottom:auto!important;top:${u(2)}!important;transform:none!important;min-width:0!important;padding:0 ${u(1)}!important;border:0!important;border-radius:0!important;background:#08090bdb!important;font:${u(7)}/1 Grenze,Georgia,serif!important;z-index:3}
${AS} .active-slot .slot-cd{inset:${u(3)}!important;border-radius:0!important;font:500 ${u(16)}/1 Grenze,Georgia,serif!important;background:#070a11b8!important;box-shadow:inset 0 0 0 1px #a18b5e55!important}
${AS} .active-slot.no-mana .ic{filter:grayscale(.8) brightness(.55)}
${AS} .active-slot:is(:hover,:focus-visible){outline:1px solid #9d4c55!important;outline-offset:-2px!important;filter:brightness(1.2)}
${AS}.pch-five .active-slot:nth-child(5){position:absolute!important;right:calc(100% + ${u(3)})!important}
${AS} .active-slot:nth-child(6){position:absolute!important;left:${u(295)}!important;right:auto!important}
${H} .pch-effects{position:absolute;right:${u(15)};bottom:${u(143)};width:${u(124)};display:flex;flex-wrap:wrap-reverse;flex-direction:row-reverse;justify-content:flex-start;gap:${u(3)}}
${H} .pch-effects .pch-cell{width:${u(25)};height:${u(25)}}
${H} .pch-challenge{position:absolute;top:${u(25)};left:${u(20)};width:${u(235)};border-left:1px solid #8c7953;padding:${u(5)} ${u(9)};font:${u(12)}/1.25 Grenze,Georgia,serif;color:#d8c9ac;background:linear-gradient(90deg,#0a0c1099,transparent)}
${H} .pch-challenge.done{color:#c4d4aa}
${N} .nbh-night{left:50%!important;right:auto!important;top:${u(4)}!important;width:${u(69)}!important;height:${u(69)}!important;transform:translateX(-50%)!important;transform-origin:50% 0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:${u(12)} 0 0!important;box-sizing:border-box!important}
${N} .nbh-night:before{content:'';position:absolute;inset:-7% -14% -21%;background:url('${A.clock}') center/100% 100% no-repeat;z-index:-1;filter:drop-shadow(0 2px 2px #000b)}
${N} .nbh-night>small{font:${u(6.7)}/1.15 Grenze,Georgia,serif!important;letter-spacing:${u(.3)}!important;max-width:${u(57)}!important;color:#c8bfa9!important}
${N} .nbh-night>strong{font:500 ${u(19)}/1 Grenze,Georgia,serif!important;letter-spacing:0!important;margin-top:${u(2)}}
${N} .nbh-night>strong.txt{font-size:${u(10)}!important;line-height:1.05!important;max-width:${u(59)}!important;white-space:normal!important;overflow:visible!important;text-wrap:balance;overflow-wrap:anywhere}
${H} .nbh-gain{position:absolute!important;top:auto!important;left:0!important;right:auto!important;bottom:calc(100% + ${u(8)})!important;font-size:${u(11)}!important;white-space:nowrap}
${N} .nbh-radar{top:${u(14)}!important;right:${u(16)}!important;width:${u(116)}!important;height:${u(116)}!important;transform:none!important}
${N} .nbh-radar:after{inset:-7.5%!important;background:url('${A.map}') center/100% 100% no-repeat!important;filter:drop-shadow(0 1px 2px #000b)!important}
${N} .nbh-radar #mini{inset:3.5%!important;left:3.5%!important;top:3.5%!important;width:93%!important;height:93%!important;border-radius:50%!important}
${O} #msg{top:${u(84)}!important;transform:translateX(-50%)!important;width:${u(560)}!important;max-width:65%!important;padding:${u(11)} ${u(18)}!important;font-size:${u(17)}!important;line-height:1.2!important}
${O} #msg:after{font-size:${u(7)}!important;letter-spacing:${u(2)}!important}
${N} .nbh-boss{left:50%!important;bottom:${u(106)}!important;width:${u(445)}!important;min-width:0!important;transform:translateX(-50%)!important;padding:${u(3)} ${u(8)}!important}
${N} .nbh-bh{gap:${u(8)}!important;margin-bottom:${u(1)}!important}
${N} .nbh-bh small{display:none!important}${N} .nbh-bh strong{font-size:${u(15)}!important;letter-spacing:${u(1)}!important}${N} .nbh-bh span{font-size:${u(11)}!important}
${N} .nbh-btr{height:${u(18)}!important;padding:${u(4)} 10%!important}${N} .nbh-btr:before{inset:${u(4)} 10%!important}${N} .nbh-poise{margin:${u(2)} ${u(40)} 0!important;height:${u(2)}!important}
${H} .pch-flash{animation:pchFlash .35s steps(2) infinite}@keyframes pchFlash{50%{filter:brightness(1.7)}}
@media(prefers-reduced-motion:reduce){${H} .pch-flash{animation:none}${H} .pch-liquid{transition:none}}
`;
 // Rozmiar tekstu zmienia litery, bez powiekszania i przesuwania calej listwy.
 style.textContent=style.textContent.replace(/(font(?:-size)?\s*:[^;{}]*?)calc\(var\(--hu,1px\)\*([\d.]+)\)/g,'$1calc(var(--hu,1px)*$2*var(--nbts,1))');
 document.head.append(style);
 const C='#orient'.repeat(17)+' #screen.pc-hud.pc-coop',CP=C+' .pcmp',CS=make('style','pc-coop-hud-style');
 CS.textContent=`
${C} #hud .left{display:none!important}
${CP} .pcmp-player{position:absolute;bottom:${u(5)};width:${u(318)};height:${u(200)};pointer-events:none}
${CP} .pcmp-p1{left:${u(9)}}${CP} .pcmp-p2{right:${u(9)}}
${CP} .pcmp-tag{position:absolute;top:0;left:0;right:0;padding-bottom:${u(7)};border-bottom:1px solid #9f81544d;text-align:center;font:450 ${u(12)}/1.2 Cinzel,Georgia,serif;color:#e5c9ae;letter-spacing:.08em}
${CP} .pcmp-p1 .pcmp-tag{border-image:linear-gradient(90deg,#a7535d,transparent) 1}
${CP} .pcmp-p2 .pcmp-tag{color:#b6d0eb;border-image:linear-gradient(90deg,transparent,#668db6) 1}
${CP} .pcmp-state{position:absolute;top:${u(24)};left:0;right:0;text-align:center;font:400 ${u(9)}/1.3 Georgia,serif;color:#baa989}
${CP} .pch-orb{bottom:${u(-7)}!important;width:${u(116)}!important;height:${u(116)}!important}
${CP} .pch-health{left:${u(27)}!important;right:auto!important}
${CP} .pch-mana{left:${u(166)}!important;right:auto!important;bottom:${u(1)}!important;width:${u(102)}!important;height:${u(102)}!important}
${CP} .pcmp-p2 .pch-health{left:auto!important;right:${u(27)}!important}
${CP} .pcmp-p2 .pch-mana{left:auto!important;right:${u(166)}!important}
${CP} .pch-orb strong{font:400 ${u(12)}/1 Georgia,serif!important}
${CP} .pch-stamina small{font:400 ${u(8)}/1 Georgia,serif!important}
${CP} .pcmp-p2 .pch-stamina svg{transform:scaleX(-1)}
${CP} .pcmp-skills{position:absolute;bottom:${u(126)};left:50%;right:auto;transform:translateX(-50%);display:flex;gap:${u(7)}}
${CP} .pcmp-p2 .pcmp-skills{right:auto;left:50%}
${CP} .pcmp-skills .pch-cell{width:${u(37)};height:${u(37)};padding:0;border:0;pointer-events:auto;cursor:pointer}
${CP} .pcmp-slot kbd{position:absolute;bottom:${u(-9)};font:400 ${u(8)}/1 Georgia,serif;color:#d7c9ad;white-space:nowrap;background:#090a0dc9;padding:1px 3px}
${CP} .pcmp-slot.no-mana img{filter:grayscale(.8) brightness(.5)}
${CP} .pcmp-slot.cooling img{opacity:.45}
${CP} .pcmp-slot b{inset:0;display:grid;place-items:center;font:400 ${u(17)}/1 Georgia,serif;background:#080a0c66}
${CP} .pcmp-slot:disabled{cursor:default;opacity:.6}
${CP} .pcmp-slot:not(:disabled):is(:hover,:focus-visible){outline:1px solid #b45b6c;outline-offset:-2px}
${CP} .pcmp-skills-title{position:absolute;bottom:${u(102)};right:0;width:${u(84)};text-align:center;font:400 ${u(8)}/1.2 Georgia,serif;color:#a99c83}
${CP} .pcmp-p2 .pcmp-skills-title{left:0;right:auto}
${CP} .pcmp-more{font:400 ${u(11)}/1 Georgia,serif;color:#dbc39b}
${CP} .pcmp-dead .pch-glass{filter:saturate(.35);opacity:.6}
${CP} .pcmp-dead .pcmp-state{color:#dec17b}
${CP} .pcmp-centre{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:${u(300)};height:${u(169)}}
${CP} .pch-level{bottom:${u(15)};width:${u(50)};height:${u(50)};border:1px solid #9c805366;border-radius:50%;background:radial-gradient(ellipse,#262426,#101115 72%);box-shadow:0 0 0 ${u(3)} #111217,0 0 0 ${u(4)} #7c69434d}
${CP} .pch-level strong{font:450 ${u(23)}/1 Cinzel,Georgia,serif!important}
${CP} .pch-level small{bottom:${u(56)};font:450 ${u(7.5)}/1.2 Cinzel,Georgia,serif!important}
${CP} .pch-experience{bottom:${u(3)}}
${CP} .pch-wallet{left:0;right:0;bottom:${u(21)};justify-content:space-between}
${CP} .pch-wallet .pch-cell{width:${u(39)};height:${u(38)}}
${CP} .pch-wallet .nbh-gain{bottom:100%!important}
${CP} .pcmp-revive{position:absolute;left:0;right:0;bottom:${u(95)};text-align:center;font:400 ${u(9)}/1.3 Georgia,serif;color:#b8aa8b}
${CP} .pcmp-active-label{position:absolute;left:0;right:0;bottom:${u(128)};text-align:center;font:450 ${u(8)}/1.2 Cinzel,Georgia,serif;color:#b8aa8b}
${C} #activeSkillHud{display:none!important}
${C} #activeSkillHud[hidden]{display:none!important}
${C} #activeSkillHud .active-slot{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;flex:0 0 ${u(35)}!important;width:${u(35)}!important;height:${u(35)}!important}
${C} #activeSkillHud kbd{font-size:${u(8)}!important}
${C} #nbHud .nbh-boss{bottom:${u(181)}!important}
${'#orient'.repeat(44)}.pc-menu #pause #skillLoadout .pcmp-loadout-tabs{grid-column:1/-1!important;display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;gap:16px!important;margin:0 0 18px!important}
`;
 CS.textContent=CS.textContent.replace(/(font(?:-size)?\s*:[^;{}]*?)calc\(var\(--hu,1px\)\*([\d.]+)\)/g,'$1calc(var(--hu,1px)*$2*var(--nbts,1))');document.head.append(CS);
})();

// PC: spokojne komunikaty i dolny panel rozmowy. Tylko prezentacja i nawigacja UI.
// Miniatura pochodzi z tej samej klatki atlasu co NPC w swiecie, bez nowych plikow.
// ?pcdialogue=0 przywraca dotychczasowa oprawe; sterowanie dotykowe pozostaje bez zmian.
(()=>{
 const root=$('orient'),dlg=$('dialog');
 if(coarse||!root.classList.contains('pc-menu')||new URLSearchParams(location.search).get('pcdialogue')==='0')return;
 root.classList.add('pc-conversations');
 const T=(p,e)=>EN?e:p,make=(tag,c)=>{const el=document.createElement(tag);el.className=c;return el};
 const picture=make('div','pc-talk-portrait'),portrait=make('canvas','');portrait.width=portrait.height=192;picture.append(portrait);picture.setAttribute('aria-hidden','true');
 const page=make('span','pc-talk-page');page.setAttribute('aria-hidden','true');dlg.prepend(picture);dlg.append(page);
 dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.setAttribute('aria-labelledby','dlgWho');dlg.setAttribute('aria-describedby','dlgTxt');
 const next=make('button','next'),key=make('kbd','pc-talk-key'),label=make('span','');next.type='button';next.append(key,label);dlg.querySelector('.next').replaceWith(next);
 // Natywne zatwierdzenie przycisku nie moze rownoczesnie ustawic talkPress / rollPress.
 dlg.addEventListener('keydown',e=>{if(e.target.closest('button')&&(e.key==='Enter'||e.key===' ')){e.stopPropagation();if(e.repeat)e.preventDefault()}});
 next.addEventListener('click',()=>resetInput());
 let image=null,wasOpen=false;
 const put=(el,t)=>{if(el.textContent!==t)el.textContent=t};
 const hide=(el,on)=>{if(el.hidden!==on)el.hidden=on};
 const sync=()=>{
  const open=!dlg.hidden&&!!S?.dialog;if(!open){wasOpen=false;return}
  const n=S.dialog,lines=NL(n),count=lines.length,frame=IMGS?.['npcp_'+n.art]||A?.[n.art]?.[0]?.n?.map?.image;
  hide(picture,!frame);dlg.classList.toggle('pc-talk-has-portrait',!!frame);
  if(frame&&frame!==image&&IMGS?.['npcp_'+n.art]===frame){image=frame;const g=portrait.getContext('2d');g.clearRect(0,0,192,192);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';const q=Math.min(192/frame.width,192/frame.height);g.drawImage(frame,(192-frame.width*q)/2,(192-frame.height*q)/2,frame.width*q,frame.height*q)}
  else if(frame&&frame!==image){image=frame;const g=portrait.getContext('2d');g.clearRect(0,0,192,192);
   // Zachowaj oryginalne proporcje: gorna czesc sylwetki w kwadratowej miniaturze.
   const probe=canvas(frame.width,frame.height),pg=probe.getContext('2d');pg.drawImage(frame,0,0);const pixels=pg.getImageData(0,0,probe.width,probe.height).data;
   let x0=probe.width,y0=probe.height,x1=0,y1=0;for(let y=0;y<probe.height;y++)for(let x=0;x<probe.width;x++)if(pixels[(y*probe.width+x)*4+3]>24){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
   if(x1>x0&&y1>y0){const side=Math.max(x1-x0,(y1-y0)*.74)*1.1;g.imageSmoothingEnabled=false;g.drawImage(frame,(x0+x1-side)/2,y0-side*.035,side,side,0,0,192,192)}
  }
  put(page,count>1&&!S.witChoice?`${Math.min(count,S.dlg+1)} / ${count}`:'');hide(page,!page.textContent);
  put(label,S.dlg>=count-1&&n.id!=='wit'?T('Zamknij','Close'):T('Dalej','Continue'));
  put(key,document.body.classList.contains('padlast')?'A':kbName(KB.map.talk));
  hide(next,S.witChoice||n.id==='chojrak');
  if(!wasOpen){wasOpen=true;if(!dlg.contains(document.activeElement))dlg.querySelector('button:not([hidden])')?.focus({preventScroll:true})}
 };
 new MutationObserver(sync).observe(dlg,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 const P='#orient'.repeat(44)+'.pc-conversations #screen:not(.port)',D=P+' #dialog',M=P+' #msg',st=make('style','pc-conversation-style');
 st.textContent=`
${P}{--talk-unit:clamp(.8px,.092vh,1.25px);--talk-gold:#c9b38b;--talk-copy:#e8dfcf}
${M}{top:calc(100 * var(--hu,1px))!important;left:50%!important;right:auto!important;width:min(58%,calc(650 * var(--talk-unit)))!important;max-width:68%!important;padding:calc(12 * var(--talk-unit)) calc(30 * var(--talk-unit))!important;border:0!important;border-image:none!important;background:linear-gradient(90deg,transparent,#0c0d12c9 16%,#0c0d12c9 84%,transparent)!important;box-shadow:none!important;color:var(--talk-copy)!important;font:400 max(16px,calc(19 * var(--talk-unit) * var(--nbts,1)))/1.45 Georgia,serif!important;text-align:center!important;text-wrap:pretty!important;text-shadow:0 2px 3px #000!important;transform:translate(-50%,-4px)!important;transition:opacity .25s ease,transform .25s ease!important;pointer-events:none!important}
${M}.on{opacity:1!important;transform:translate(-50%,0)!important}
${M}:before{content:''!important;inset:0 14% auto!important;height:1px!important;background:linear-gradient(90deg,transparent,#ad93604d,transparent)!important;opacity:1!important}
${M}[data-k]:not([data-k='']):after{font:450 max(10px,calc(10 * var(--talk-unit) * var(--nbts,1)))/1.3 Cinzel,Georgia,serif!important;letter-spacing:.14em!important;color:var(--talk-gold)!important;margin:0 0 calc(5 * var(--talk-unit))!important}
${M}.boss{background:linear-gradient(90deg,transparent,#28131bdf 16%,#28131bdf 84%,transparent)!important;color:#f5dfce!important}
${M}.boss:before{background:linear-gradient(90deg,transparent,#ab5868,transparent)!important}
${M}.boss:after{color:#e2a6a9!important}
${D}{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;column-gap:calc(26 * var(--talk-unit))!important;row-gap:calc(10 * var(--talk-unit))!important;position:absolute!important;left:50%!important;right:auto!important;bottom:calc(26 * var(--talk-unit))!important;transform:translateX(-50%)!important;width:min(88%,calc(1080 * var(--talk-unit)))!important;max-width:88%!important;max-height:52%!important;overflow:auto!important;padding:calc(24 * var(--talk-unit)) calc(30 * var(--talk-unit))!important;border:1px solid #a68b5e66!important;border-image:none!important;outline:0!important;border-radius:0!important;background:linear-gradient(140deg,#1c191ded,#0c0d11f5)!important;box-shadow:0 12px 38px #0007,inset 0 1px #cfb37d16!important;cursor:default!important;z-index:15!important;font:400 max(16px,calc(20 * var(--talk-unit) * var(--nbts,1)))/1.5 Georgia,serif!important;color:var(--talk-copy)!important}
${D}.pc-talk-has-portrait{grid-template-columns:calc(112 * var(--talk-unit)) minmax(0,1fr)!important}
${D}[hidden],${D} [hidden]{display:none!important}
${D} :is(.chain-edge,.chain-side){display:none!important}
${D} .pc-talk-portrait{grid-column:1!important;grid-row:1/4!important;align-self:start!important;aspect-ratio:1;width:100%;border:1px solid #a68b5e55;background:radial-gradient(ellipse at 50% 65%,#76604433,transparent 75%),#0a0b0d88;box-shadow:inset 0 0 20px #0005;overflow:hidden}
${D} .pc-talk-portrait canvas{display:block;width:100%;height:100%;object-fit:contain;image-rendering:pixelated}
${D} .who{grid-column:-2!important;grid-row:1!important;margin:0!important;padding:0 calc(44 * var(--talk-unit)) calc(10 * var(--talk-unit)) 0!important;border-bottom:1px solid #aa8b5b33!important;font:450 max(18px,calc(23 * var(--talk-unit) * var(--nbts,1)))/1.3 Cinzel,Georgia,serif!important;letter-spacing:0!important;color:#e0c89f!important;text-shadow:none!important}
${D} .txt{grid-column:-2!important;grid-row:2!important;margin:0!important;max-width:none!important;max-height:30vh!important;overflow:auto!important;padding:0 calc(8 * var(--talk-unit)) 0 0!important;font:inherit!important;line-height:1.55!important;color:var(--talk-copy)!important;text-align:left!important;text-wrap:pretty;scrollbar-width:thin;scrollbar-color:#87714f #0b0b0d}
${D} :is(.next,#dlgBtns,#witChoices){grid-column:-2!important;grid-row:3!important;justify-self:end!important;display:flex!important;flex-wrap:wrap!important;justify-content:flex-end!important;align-items:center!important;gap:calc(12 * var(--talk-unit))!important;margin:calc(4 * var(--talk-unit)) 0 0!important;width:auto!important}
${D} :is(button,.next){box-sizing:border-box!important;min-height:40px!important;padding:calc(8 * var(--talk-unit)) calc(18 * var(--talk-unit))!important;border:1px solid #aa8b5b66!important;border-image:none!important;outline:0!important;border-radius:0!important;background:#18161a!important;box-shadow:none!important;font:450 max(14px,calc(16 * var(--talk-unit) * var(--nbts,1)))/1.25 Cinzel,Georgia,serif!important;letter-spacing:0!important;color:#e4d3b3!important;text-shadow:none!important;cursor:pointer!important}
${D} button:hover,${D}:not(:has(button:hover)) button:is(:focus-visible,.pf){background:#49242f!important;border-color:#b45b6c!important;outline:1px solid #b45b6c!important;outline-offset:1px!important;color:#fff0d5!important}
${D} .pc-talk-key{display:inline-flex;align-items:center;justify-content:center;min-width:1.5em;padding:.1em .3em;border:1px solid #ad936066;background:#08090c77;color:#dbcaad;font:400 .8em/1.2 Georgia,serif;white-space:nowrap}
${D} .pc-talk-page{position:absolute;top:calc(27 * var(--talk-unit));right:calc(30 * var(--talk-unit));font:400 max(11px,calc(12 * var(--talk-unit) * var(--nbts,1)))/1.3 Georgia,serif;color:#ad9c83}
${D} :is(.next,#dlgBtns,#witChoices)[hidden]{display:none!important}
@media(max-height:600px){${D}{padding:16px 22px!important;bottom:16px!important;max-height:64%!important}${D}.pc-talk-has-portrait{grid-template-columns:76px minmax(0,1fr)!important}${D} .pc-talk-page{top:19px!important;right:22px!important}${D} .txt{max-height:32vh!important}}
@media(prefers-reduced-motion:reduce){${M}{transition:none!important}}
`;
 document.head.append(st);
})();

// Quiet PC tutorial card and secondary skip actions; existing timers and touch code remain in charge.
(()=>{
 const root=$('orient');if(!root.classList.contains('pc-menu')||coarse||isPort()||new URLSearchParams(location.search).get('tutorialui')==='0')return;
 root.classList.add('pc-tutorial');const card=$('tut'),skip=$('tutSkip'),head=document.createElement('div'),label=document.createElement('span'),count=document.createElement('span'),foot=document.createElement('div');
 head.className='pc-tut-head';label.textContent=EN?'Hint':'Podpowiedź';count.id='pcTutCount';count.textContent='';count.setAttribute('aria-hidden','true');head.append(label,count);foot.className='pc-tut-foot';foot.append(skip);card.prepend(head);card.append(foot);card.setAttribute('role','status');card.setAttribute('aria-atomic','true');
 const P='#orient'.repeat(48)+'.pc-menu.pc-tutorial #screen:not(.port)',T=P+' #tut',B=P+' #tutSkip',I=P+' #intro #iskip',style=document.createElement('style');style.id='pc-quiet-tutorial';
 style.textContent=`
${P}{--hint-u:clamp(.75px,.092vh,1.25px)}
${T}{box-sizing:border-box!important;position:absolute!important;top:max(88px,calc(104 * var(--hint-u)))!important;bottom:auto!important;left:clamp(18px,2.2vw,42px)!important;right:auto!important;transform:none!important;width:min(35vw,calc(420 * var(--hint-u) * var(--nbts,1)))!important;max-width:44%!important;margin:0!important;padding:calc(14 * var(--hint-u)) calc(19 * var(--hint-u)) calc(10 * var(--hint-u))!important;border:1px solid #a58c594d!important;border-image:none!important;border-radius:0!important;background:linear-gradient(140deg,#19171bdd,#0c0d11e8)!important;box-shadow:0 5px 18px #0003!important;font:400 max(15px,calc(17 * var(--hint-u) * var(--nbts,1)))/1.5 Georgia,serif!important;text-align:left!important;text-wrap:pretty!important;color:#dfd5c3!important;text-shadow:0 1px 2px #0008!important;z-index:9!important;pointer-events:none!important;opacity:0!important;visibility:hidden!important;transition:opacity .22s ease,visibility .22s!important}
${T}.on{opacity:1!important;visibility:visible!important}
${T} :is(.chain-edge,.chain-side){display:none!important}
${T} .pc-tut-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:calc(8 * var(--hint-u));margin-bottom:calc(8 * var(--hint-u));border-bottom:1px solid #a68b5b2b;font:450 max(11px,calc(12 * var(--hint-u) * var(--nbts,1)))/1.3 Cinzel,Georgia,serif;color:#c4ad82;letter-spacing:.05em}
${T} #pcTutCount{font:400 .9em/1.3 Georgia,serif;color:#b2a38a;letter-spacing:.02em;white-space:nowrap}
${T} #tutText{display:block!important;font:inherit!important;color:inherit!important}
${T} .pc-tut-foot{display:flex;justify-content:flex-end;margin-top:calc(8 * var(--hint-u));padding-top:calc(5 * var(--hint-u));border-top:1px solid #a68b5b20}
${B},${I}{box-sizing:border-box!important;position:static!important;inset:auto!important;transform:none!important;width:auto!important;min-width:0!important;max-width:100%!important;min-height:36px!important;margin:0!important;padding:6px 9px!important;border:1px solid transparent!important;border-image:none!important;border-radius:0!important;background:none!important;box-shadow:none!important;filter:none!important;font:450 max(12px,calc(13 * var(--hint-u) * var(--nbts,1)))/1.3 Cinzel,Georgia,serif!important;color:#bfb095!important;letter-spacing:.015em!important;text-transform:none!important;text-shadow:0 1px 2px #0009!important;cursor:pointer!important;pointer-events:auto!important;outline:0!important;animation:none!important}
${B}:is(:hover,:focus-visible,.pf),${I}:is(:hover,:focus-visible,.pf){border-color:#b45b6c!important;background:#49242f99!important;color:#fff0d5!important}
${B}:focus-visible,${I}:focus-visible{outline:1px solid #e3c790!important;outline-offset:2px!important}
${B}:before,${B}:after,${I}:before{display:none!important;content:none!important}
${B}[hidden],${T}[hidden]{display:none!important}
${I}{position:absolute!important;top:clamp(18px,2.5vh,32px)!important;right:clamp(20px,2.2vw,42px)!important;left:auto!important;bottom:auto!important;display:flex!important;align-items:center!important;gap:12px!important;min-height:40px!important;padding:7px 12px!important;background:#0c0d1166!important;border-color:#a58c5938!important;font-size:max(14px,calc(15 * var(--hint-u) * var(--nbts,1)))!important;z-index:5!important}
${I}:after{content:'Esc'!important;display:inline-flex!important;align-items:center;justify-content:center;min-width:2em;padding:.15em .3em;border:1px solid #ad93604d;background:#08090c55;color:#c9b896;font:400 .76em/1.1 Georgia,serif;letter-spacing:0!important}
body.padlast ${I}:after{content:'Menu'!important}
${P} #intro .ihint{font:400 max(13px,calc(14 * var(--hint-u) * var(--nbts,1)))/1.4 Georgia,serif!important;color:#c2b59f!important;text-transform:none!important;letter-spacing:.015em!important;animation:none!important;text-shadow:0 1px 3px #000!important}
${T}{top:auto!important;bottom:max(150px,21vh)!important;left:50%!important;transform:translateX(-50%)!important;width:max-content!important;max-width:min(92vw,calc(780 * var(--hint-u) * var(--nbts,1)))!important;padding:calc(14 * var(--hint-u)) calc(26 * var(--hint-u)) calc(6 * var(--hint-u))!important;border-color:#c9a86a99!important;background:linear-gradient(180deg,#141216f2,#0a0b0ef5)!important;box-shadow:0 8px 26px #000a!important;font:400 max(17px,calc(20 * var(--hint-u) * var(--nbts,1)))/1.4 Georgia,serif!important;text-align:center!important}
${T} .pc-tut-head{display:none!important}
${T} #tutText{display:flex!important;flex-wrap:wrap;align-items:center;justify-content:center;gap:calc(8 * var(--hint-u)) calc(9 * var(--hint-u))}
${T} #tutText kbd{display:inline-flex;align-items:center;justify-content:center;min-width:1.7em;padding:.16em .5em;border:1px solid #e3c790;border-radius:4px;background:#0b0c10;box-shadow:0 2px 0 #6b5a3a;font:700 .95em/1.25 Georgia,serif!important;color:#fff0d5;letter-spacing:.02em}
${T} #tutText b{margin-left:calc(6 * var(--hint-u));font:600 1.08em/1.25 Cinzel,Georgia,serif;color:#f0dcae;letter-spacing:.04em}
${T} #tutText .tut-d{flex-basis:100%;color:#dfd5c3}
${T} .pc-tut-foot{justify-content:center!important;margin-top:calc(4 * var(--hint-u))!important;padding-top:0!important;border-top:0!important}
${B}{font-size:max(11px,calc(12 * var(--hint-u) * var(--nbts,1)))!important;min-height:28px!important;color:#9f927c!important}
@media(max-width:1100px){${T}{max-width:92vw!important}}
@media(prefers-reduced-motion:reduce){${T}{transition:none!important}}
`;
 document.head.append(style);
})();

// ===== HUD PC, szlif czytelnosci (runda hud-pc-1): pasek staminy pod bohaterem, grubszy luk staminy i pasek doswiadczenia,
// wieksze liczniki monet, czerwona winieta przy niskim zyciu. Tylko odczyt stanu gry. ?hudfix=0 wylacza.
(()=>{if(new URLSearchParams(location.search).get('hudfix')==='0')return;
 const scr=$('screen'),nb=$('nbHud');if(!scr||!nb)return;const V3=new THREE.Vector3();
 const bars=[0,1].map(i=>{const e=document.createElement('div');e.className='nbx-sta nbx-sta'+(i+1);e.setAttribute('aria-hidden','true');e.innerHTML='<i></i>';scr.insertBefore(e,nb);return{e,f:e.firstChild,t:0,w:''}});
 const prevHud=hud;let lastXp=-1,xpT=0,lastCoins=-1,coinT=0;
 hud=function(){prevHud();const show=scr.classList.contains('pc-hud-visible')&&!!S,now=performance.now();scr.classList.toggle('nbx-hud',scr.classList.contains('pc-hud'));
  const w=scr.clientWidth,h=scr.clientHeight,hu=parseFloat(scr.style.getPropertyValue('--hu'))||1;
  for(const [i,p] of [pl,pl2].entries()){const b=bars[i];if(!show||!p||p.dead){if(b.on!==false){b.on=false;b.e.classList.remove('on')}continue}
   const r=Math.max(0,Math.min(1,(p.sta||0)/(p.staMax||1)));if(r<.995)b.t=now+650;const on=now<b.t;
   if(on){V3.set(p.x/16,0,p.y/16).project(cam);const x=Math.round((V3.x*.5+.5)*w),y=Math.round((-V3.y*.5+.5)*h+13*hu);b.e.style.transform='translate('+x+'px,'+y+'px) translate(-50%,0)';const fw=(r*100).toFixed(1)+'%';if(fw!==b.w){b.w=fw;b.f.style.width=fw}
    b.e.classList.toggle('low',r<.25);b.e.classList.toggle('no',!i&&!!SETT.flash&&$('stam').classList.contains('flash'))}
   if(on!==b.on){b.on=on;b.e.classList.toggle('on',on)}}
  if(!show)return;
  const xp=nb.querySelector('.pch:not(.pcmp) .pch-experience'),wal=nb.querySelector('.pch:not(.pcmp) .pch-coins');
  if(lastXp>=0&&S.xp!==lastXp&&xp){xp.classList.add('nbx-gain');xpT=now+450}if(xpT&&now>xpT&&xp){xp.classList.remove('nbx-gain');xpT=0}lastXp=S.xp;
  if(lastCoins>=0&&S.coins>lastCoins&&wal){wal.classList.add('nbx-gain');coinT=now+450}if(coinT&&now>coinT&&wal){wal.classList.remove('nbx-gain');coinT=0}lastCoins=S.coins;
 };
 const O='#orient'.repeat(40)+' #screen.pc-hud',H=O+' .pch',u=n=>'calc(var(--hu,1px)*'+n+')',st=document.createElement('style');st.id='nbHudFix';st.textContent=`
${O} .nbx-sta{position:absolute;left:0;top:0;width:${u(46)};height:${u(5)};box-sizing:border-box;pointer-events:none;background:#0a0c0fde;border:1px solid #7c6840;box-shadow:0 1px 3px #000,0 0 0 1px #05060899;opacity:0;transition:opacity .22s;will-change:transform,opacity}
${O} .nbx-sta.on{opacity:.96}
${O} .nbx-sta i{display:block;height:100%;width:100%;background:linear-gradient(#f6dc86,#c29a3f);transition:width .08s linear}
${O} .nbx-sta.low i{background:linear-gradient(#f0a352,#b4532a)}
${O} .nbx-sta.no{border-color:#e0584a;box-shadow:0 0 ${u(6)} #e0584acc,0 1px 3px #000}
${O} .nbx-sta2 i{background:linear-gradient(#e6c6f6,#9a6fc2)}
#screen:not(.pc-hud-visible) .nbx-sta{opacity:0!important}
${H} .pch-st-track{stroke-width:7!important;stroke:#101216e6!important}
${H} .pch-st-fill{stroke-width:4.6!important;filter:drop-shadow(0 0 ${u(2)} #f0c85a88)!important}
${H} .pch-stamina.pch-low .pch-st-fill{stroke:#e8893c!important}
${H} .pch-stamina small{font-size:${u(9.5)}!important;color:#f0d98c!important}
${H} .pch-experience{height:${u(7)}!important;bottom:${u(3)}!important;border-color:#a08653!important}
${H} .pch-experience i{background:linear-gradient(#f3d892,#a8823f)!important;box-shadow:0 0 ${u(4)} #e6c98755}
${H} .pch-experience.nbx-gain{filter:brightness(1.7);box-shadow:0 0 ${u(8)} #f3d892aa,0 1px 2px #000,inset 0 0 0 1px #080a0c!important}
${H} .pch-wallet{gap:${u(6)}!important;bottom:${u(16)}!important}
${H} .pch-wallet .pch-cell{width:${u(42)}!important;height:${u(44)}!important}
${H} .pch-wallet b{font-size:${u(13.5)}!important;font-weight:600!important;color:#f3e6c4!important;padding:${u(1)} 0!important}
${H} .pch-wallet .nbx-gain{filter:brightness(1.6)}
${H} .pch-wallet .pch-cell{transition:filter .25s}
${H}:has(.pch-health.pch-low)::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 46%,transparent 56%,rgba(128,14,26,.42) 100%);animation:nbxVig 1.5s ease-in-out infinite}
@keyframes nbxVig{50%{opacity:.5}}
@media(prefers-reduced-motion:reduce){${H}:has(.pch-health.pch-low)::after{animation:none}${O} .nbx-sta,${O} .nbx-sta i{transition:none}}
`;document.head.append(st)})();
// Pauza: dluzszy napis przycisku (np. Wybor rozdzialu) nie zawija sie i nie wychodzi poza ramke.
{const st=document.createElement('style');st.textContent='html body #pause#pause .btnrow button.go{white-space:nowrap!important;width:auto!important;max-width:none!important;min-width:max-content!important;height:auto!important;flex:0 0 auto!important}';document.head.append(st)}
// Zywe menu: iskry unoszace sie znad pogorzeliska i migotanie luny pozarow na ilustracji tytulowej. Tylko rozjasnia obraz (screen), nie lapie klikniec. ?menufx=0 wylacza.
{const ti=$('title');if(ti&&new URLSearchParams(location.search).get('menufx')!=='0'){const cv=document.createElement('canvas');cv.id='titleFx';cv.setAttribute('aria-hidden','true');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;mix-blend-mode:screen';ti.prepend(cv);
 const g=cv.getContext('2d'),P=[],reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;let last=0,CW=0,CH_=0;
 const spawn=first=>({x:Math.random(),y:first?Math.random():1+Math.random()*.08,vx:(Math.random()-.5)*.02,vy:-(.025+Math.random()*.055),r:.9+Math.random()*1.9,l:first?Math.random()*4:0,life:6+Math.random()*8,ph:Math.random()*6.283});
 const tick=t=>{requestAnimationFrame(tick);if(ti.hidden||document.hidden||t-last<33)return;const dt=Math.min(.1,(t-last)/1000);last=t;const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;if(w!==CW||h!==CH_){CW=cv.width=w;CH_=cv.height=h}
  g.clearRect(0,0,CW,CH_);const fl=reduce?.5:.5+.5*Math.sin(t*.0031)*Math.sin(t*.0017+1.3);
  for(const [fx,fy,fr] of [[.03,.42,.42],[.985,.4,.46]]){const gr=g.createRadialGradient(fx*CW,fy*CH_,0,fx*CW,fy*CH_,fr*CH_);gr.addColorStop(0,'rgba(255,112,42,'+(.11+.08*fl).toFixed(3)+')');gr.addColorStop(1,'rgba(255,90,30,0)');g.fillStyle=gr;g.fillRect(0,0,CW,CH_)}
  if(reduce)return;while(P.length<48)P.push(spawn(true));
  for(let i=0;i<P.length;i++){const p=P[i];p.l+=dt;p.x+=(p.vx+Math.sin(t*.0008+p.ph)*.012)*dt;p.y+=p.vy*dt;if(p.l>p.life||p.y<-.05){P[i]=spawn(false);continue}const a=Math.min(1,p.l/1.2)*Math.min(1,(p.life-p.l)/2)*(.5+.35*Math.sin(t*.006+p.ph));g.fillStyle='rgba(255,'+(150+((p.ph*20)|0)%70)+',70,'+Math.max(0,a).toFixed(3)+')';g.beginPath();g.arc(p.x*CW,p.y*CH_,p.r*CH_/900,0,6.283);g.fill()}};
 requestAnimationFrame(tick)}}
// Porzadek menu (runda menu-porzadek-pc-1): jedna zasada zaznaczenia/najechania/fokusu, napisy w ramkach, Kaplica, Kronika, Kram. ?menufix=0 wylacza.
if(new URLSearchParams(location.search).get('menufix')!=='0'){const st=document.createElement('style');st.id='nbMenuFix';st.textContent=`/* NightBrand PC: porzadek menu (jedna zasada zaznaczenia, napisy w ramkach). ?menufix=0 wylacza. */
:root{--nbs-on:linear-gradient(145deg,rgba(97,48,59,.92),rgba(53,28,37,.96));--nbs-line:rgba(196,110,130,.9);--nbs-idle:rgba(230,214,184,.17);--nbs-hover:rgba(230,214,184,.55);--nbs-focus:#ecc977;--nbs-cell:rgba(12,9,14,.46);--nbs-cellh:rgba(46,33,42,.62)}
/* --- Kaplica i Kronika: pozycje listy --- */
@P@ #kap .m2k-row{border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;border-radius:2px!important;height:auto!important;min-height:min-content!important;flex:0 0 auto!important;opacity:1!important;transition:background .12s,border-color .12s,box-shadow .12s;cursor:pointer;outline:0}
@P@ #kap .m2k-row::before{content:none!important}
@P@ #kap .m2k-row:hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important}
@P@ #kap .m2k-row.on{background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;box-shadow:inset 0 0 0 1px rgba(110,48,62,.95),inset 0 0 22px rgba(127,52,69,.22)!important}
@P@ #kap .m2k-row.on b{color:#fff0d5!important}
@P@ #kap .m2k-row:focus-visible,@P@ #kap .m2k-row.pf{outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
/* Kaplica: ikona z lewej, tekst z prawej, pelne opisy */
@P@ #kap:not(.pc-chronicle) #kapList{gap:1.25vh!important;align-content:start!important;grid-auto-rows:1fr!important}
@P@ #kap:not(.pc-chronicle) .m2k-row{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;grid-auto-rows:auto!important;column-gap:1.5vh!important;row-gap:.35vh!important;align-items:center!important;justify-items:start!important;text-align:left!important;padding:1.5vh 1.6vh!important}
@P@ #kap:not(.pc-chronicle) .m2k-row img{grid-row:1/span 3!important;width:6.6vh!important;height:6.6vh!important;margin:0!important}
@P@ #kap:not(.pc-chronicle) .m2k-row b{font-size:1.95vh!important;line-height:1.2!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important;text-align:left!important;align-self:end!important}
@P@ #kap:not(.pc-chronicle) .m2k-row small,@P@ #kap:not(.pc-chronicle) .m2k-row .m2k-pips{text-align:left!important;white-space:normal!important;line-height:1.3!important;font-size:max(13px,1.6vh)!important;margin:0!important}
@P@ #kap:not(.pc-chronicle) .m2k-row.lk>*{opacity:.58}
@P@ #kap:not(.pc-chronicle) .m2k-row.lk .m2k-pips::after{content:' · zablokowane'}
html[lang=en] @P@ #kap:not(.pc-chronicle) .m2k-row.lk .m2k-pips::after{content:' · locked'}
@P@ #kap #kapBuy{white-space:nowrap!important;font-size:2.15vh!important;letter-spacing:.02em}
@P@ #kap #kapBuy[disabled]{opacity:.62!important;filter:saturate(.45)!important;cursor:default}
@P@ #kap #kapBuy:not([disabled]):hover{filter:brightness(1.18)!important}
@P@ #kap #kapBuy:focus-visible,@P@ #kap #kronDay:focus-visible,@P@ #kap #kapBack:focus-visible{outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
/* Kronika: rowne wyrownanie i przycisk akcji w ramce */
@P@ #kap.pc-chronicle .m2k-row b,@P@ #kap.pc-chronicle .m2k-row small{align-self:flex-start!important;width:auto!important;max-width:100%!important;text-align:left!important}
@P@ #kap.pc-chronicle .m2k-row{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:.45vh!important;padding-top:1.3vh!important;padding-bottom:1.3vh!important}
@P@ #kap.pc-chronicle #kapList{grid-template-rows:none!important;grid-auto-rows:max-content!important;align-content:start!important;gap:.9vh!important;overflow-y:auto!important}
@P@ #kap.pc-chronicle .m2k-row>*{position:static!important;margin:0!important;transform:none!important;inset:auto!important}
@P@ #kap.pc-chronicle #kronDay{background:var(--nbs-on)!important;border:1px solid var(--nbs-line)!important;box-shadow:inset 0 0 0 1px rgba(110,48,62,.95)!important;white-space:nowrap!important;transition:filter .12s;box-sizing:border-box!important;width:auto!important;max-width:calc(100% - 3.2vh)!important;justify-self:stretch}
@P@ #kap.pc-chronicle #kronDay:hover{filter:brightness(1.2)!important}
/* --- Kram --- */
@P@ #shop #shopCards{grid-template-rows:none!important;grid-auto-rows:auto!important;gap:1.3vh!important;align-content:start!important;align-items:stretch!important}
@P@ #shop .card{height:auto!important;min-height:0!important;padding:1.2vh 1.6vh 1.5vh!important;gap:.55vh!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;opacity:1!important;filter:none!important;transition:background .12s,border-color .12s;outline:0;align-self:stretch!important;transform:none!important;margin:0!important;justify-content:flex-start!important}
@P@ #shop .card .ic{width:6.8vh!important;height:6.8vh!important}
@P@ #shop .card .cn{font-size:2.7vh!important;line-height:1.15!important}
@P@ #shop .card .cd{font-size:1.9vh!important;line-height:1.35!important}
@P@ #shop .card .cl{margin-top:.2vh!important}
@P@ #shop .card[disabled]{cursor:default}
@P@ #shop .card[disabled] .cn,@P@ #shop .card[disabled] .cd,@P@ #shop .card[disabled] .ic{opacity:.6}
@P@ #shop .card[disabled] .cl{color:#d59a8c!important}
@P@ #shop .card:not([disabled]):hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important}
@P@ #shop .card:focus-visible,@P@ #shop .card.pf{outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
/* --- Wspolna zasada: fokus (klawiatura, pad) i najechanie --- */
@P@ :is(#title,#kap,#opts,#manual,#prep,#lvl,#pause,#shop,#end,#conf) :is(button,[role=tab],[role=radio],summary):focus-visible{outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
@P@ :is(#kap,#opts,#manual,#prep,#pause,#shop,#end,#conf) :is(button.go,.tab,.stab,.nbp-tab,.pc-prep-tab,.slot-tab,.backar,.premium-back,#kapBack):not([disabled]):not(.on):not(.chosen):hover{filter:brightness(1.28)!important}
/* Przygotowanie: perki, wyzwania, klatwy */
@P@ #prep .prepbox .opt{border:1px solid transparent!important;border-radius:2px!important;transition:background .12s,border-color .12s}
@P@ #prep .prepbox .opt:not([disabled]):hover{background:var(--nbs-cellh)!important;border-color:var(--nbs-hover)!important}
@P@ #prep .prepbox .opt.on{background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;box-shadow:inset 0 0 0 1px rgba(110,48,62,.95)!important}
@P@ #prep .prepbox .opt.on b{color:#fff0d5!important}
@P@ #prep .nb-prep-class:not(.on):hover{color:#fff0d5!important;filter:brightness(1.25)!important}
@P@ #prep #prepGo{background:radial-gradient(at 50% 0,rgba(130,54,69,.27),rgba(0,0,0,0) 80%),linear-gradient(140deg,rgba(84,36,48,.96),rgba(46,21,30,.97))!important;box-shadow:inset 0 0 0 1px rgba(160,86,99,.4),0 0 17px rgba(99,36,49,.14)!important}
/* Jednolity przycisk powrotu */
@P@ :is(#kapBack,#optsBack,#manBack,#prepBack){border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;padding:.95vh 1.9vh!important;border-radius:2px!important;opacity:1!important;transition:border-color .12s,filter .12s}
@P@ :is(#kapBack,#optsBack,#manBack,#prepBack):hover{border-color:var(--nbs-hover)!important}
@P@ :is(#kapBack,#optsBack,#manBack,#prepBack)::before{content:'←  '!important;position:static!important;display:inline!important;background:none!important;width:auto!important;height:auto!important}
/* Minimalny rozmiar drobnych napisow */
@P@ :is(#title .pc-mode-note,#title .pc-profile-stat small,#title .pc-chapter-label small,#opts .nbo-ah small,#prep .pc-detail-kicker,#lvl .level-heading .kicker,#lvl .card .ck,#lvl .card .fx em,#lvl .lvbtns .hint,#pause .nbp-sub){font-size:max(13px,1.5vh)!important}
@P@ #opts .nbo-ah small{display:block!important;text-align:left!important}
/* Dopelnienie: fokus pozycji nie jest ucinany przez liste, tytul Kramu w jednej linii, Gotowy jako akcja glowna, reakcja rozwijanych przyciskow */
@P@ #kap .m2k-row:focus-visible,@P@ #kap .m2k-row.pf{outline-offset:-3px!important}
@P@ #shop .pcg-heading{white-space:nowrap!important;width:auto!important;max-width:none!important;padding-left:3vh!important;padding-right:3vh!important}
@Q@ #prep #prepGo.go{background:var(--pcg-selected,var(--nbs-on)) center/100% 180% no-repeat!important}
@Q@ #prep #prepGo.go:hover{filter:brightness(1.2)!important}
@P@ #prep summary:hover{filter:brightness(1.28)!important}
@P@ #pause .nbp-tab:not(.on):hover,@P@ #pause .slot-tab:not(.chosen):hover{filter:brightness(1.28)!important}
/* --- Runda 2: mocne najechanie (wybor rozdzialu, przygotowanie i reszta), trudnosc, wybor postaci --- */
:root{--nbs-hover:rgba(240,206,128,.98);--nbs-cellh:rgba(86,56,66,.72);--nbs-glow:0 0 0 1px rgba(240,206,128,.9),0 0 20px rgba(240,190,110,.34)}
@Q@ :is(#title,#prep,#kap,#opts,#manual,#pause,#shop,#end,#conf,#lvl) :is(.m2-ch,.pcg-menu,.pcg-action,.pc-home-button,.premium-go,.m2-b,.m2-kap,.tab,.stab,.nbp-tab,.pc-prep-tab,.slot-tab,.go,summary,#kapBack,#optsBack,#manBack,#prepBack,.premium-back,#optsBtn):not([disabled]):not(:disabled):hover{filter:brightness(1.5) saturate(1.12)!important;box-shadow:var(--nbs-glow)!important;outline:1px solid var(--nbs-hover)!important;outline-offset:-1px!important}
@Q@ #title .m2-ch:not([disabled]):hover{filter:brightness(1.6) saturate(1.15)!important;outline:2px solid var(--nbs-hover)!important;outline-offset:-2px!important}
@Q@ #title #optsBtn:hover{outline:0!important;box-shadow:none!important;filter:brightness(1.7) drop-shadow(0 0 8px rgba(240,190,110,.75))!important}
@Q@ #prep .prepbox .opt:not([disabled]):not(:disabled):hover{background:var(--nbs-cellh)!important;border-color:var(--nbs-hover)!important;box-shadow:var(--nbs-glow)!important;filter:brightness(1.25)!important}
@Q@ #kap .m2k-row:hover,@Q@ #shop .card:not([disabled]):hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important;box-shadow:var(--nbs-glow)!important}
@Q@ #lvl .card:not(.locked):hover{box-shadow:var(--nbs-glow)!important;filter:brightness(1.18)!important}
/* Trudnosc: trzy czytelne przyciski obok siebie zamiast nachodzacych napisow */
@Q@ #prep details.pc-popover>div{width:max-content!important;max-width:92vw!important;overflow:visible!important;padding:1.4vh!important}
@Q@ #prep #diffSw{display:flex!important;flex-wrap:nowrap!important;gap:1vh!important;align-items:stretch!important;width:auto!important}
@Q@ #prep #diffSw .premium-difficulty{flex:0 0 auto!important;width:auto!important;min-width:max-content!important;height:auto!important;min-height:0!important;padding:1.3vh 2.4vh!important;font-size:2.15vh!important;line-height:1.2!important;white-space:nowrap!important;overflow:visible!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;border-radius:2px!important}
@Q@ #prep #diffSw .premium-difficulty.on{background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;color:#fff0d5!important}
@Q@ #prep #diffSw .premium-difficulty:not(.on):hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important;box-shadow:var(--nbs-glow)!important}
/* Wybor postaci: pozostale klasy wygladaja jak przyciski do wyboru */
@Q@ #prep .nb-prep-class:not(.on){border:1px solid rgba(230,214,184,.42)!important;background:var(--nbs-cell)!important;min-height:5.6vh!important;height:auto!important;margin-top:.9vh!important;padding:.9vh 1.4vh!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:1vh!important;overflow:visible!important;cursor:pointer!important;opacity:1!important}
@Q@ #prep .nb-prep-class:not(.on) b{text-align:left!important;flex:1 1 auto!important}
@Q@ #prep .nb-prep-class:not(.on){flex-direction:row!important;flex-wrap:nowrap!important;margin-top:.7vh!important;min-height:5vh!important;padding:.6vh 1.4vh!important}
@Q@ #prep .nb-prep-class:not(.on) b{font-size:2.05vh!important;white-space:nowrap!important}
@Q@ #prep .nb-prep-class.on .premium-class-art{max-height:25vh!important;width:auto!important;max-width:100%!important;object-fit:contain!important;align-self:center!important}
@Q@ #prep .nb-prep-class.on{height:auto!important;min-height:0!important}
@Q@ #prep .nb-prep-class:not(.on)::after{content:'Wybierz  ›'!important;display:block!important;position:static!important;flex:0 0 auto!important;font:600 max(13px,1.55vh) Cinzel,Georgia,serif!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#d9b876!important;background:none!important;width:auto!important;height:auto!important;opacity:1!important}
html[lang=en] @Q@ #prep .nb-prep-class:not(.on)::after{content:'Select  ›'!important}
@Q@ #prep .nb-prep-class:not(.on):hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important;box-shadow:var(--nbs-glow)!important;filter:none!important}
@Q@ #prep .nb-prep-class:not(.on):hover::after{color:#fff0d5!important}
@Q@ #prep #prepCh .opt.nb-chal-art{padding-left:calc(88 * var(--pc-u,1px))!important;min-height:calc(78 * var(--pc-u,1px))!important}
/* Runda 613: porzadek po dodaniu 5. bohatera i imion. Pozostali bohaterowie w siatce 2x2 (wszyscy widoczni bez przewijania) */
@Q@ #prep #prepChar>div{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:.8vh!important;align-items:stretch!important}
@Q@ #prep #prepChar .nb-prep-class.on{grid-column:1/-1!important;order:-1!important}
@Q@ #prep .nb-prep-class:not(.on){flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:.1vh!important;margin-top:0!important;min-height:5.7vh!important;padding:.5vh .6vh!important;width:auto!important;min-width:0!important}
@Q@ #prep .nb-prep-class:not(.on) b{flex:0 0 auto!important;text-align:center!important;font-size:max(11px,2.15vh)!important;line-height:1.15!important}
@Q@ #prep .nb-prep-class:not(.on) small{display:block!important;margin:0!important;text-align:center!important;font-size:max(8px,1.45vh)!important;line-height:1.15!important;white-space:nowrap!important}
@Q@ #prep .nb-prep-class:not(.on) small.hero-ep{display:none!important}
@Q@ #prep .nb-prep-class:not(.on)::after{content:none!important;display:none!important}
@Q@ #prep #prepChar .nb-prep-class.on .premium-class-art{max-height:23vh!important}
@Q@ #prep .nb-prep-class.on .hero-ep{font:600 max(11px,2.35vh) Grenze,Georgia,serif!important;color:#e8d6a8!important;margin:.2vh 0 .3vh!important;text-align:center!important;display:block!important}
/* Kronika: portret po lewej, tekst obok; wiersze tej samej wysokosci co pozostale; licznik zawsze w osobnej linii, zeby zakladki nie skakaly */
@Q@ #kap .m2k-row.nbui-kron-row.nbui-has-art{position:relative!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;text-align:left!important;min-height:9vh!important;padding:1vh 2vh 1vh 10.5vh!important}
@Q@ #kap .m2k-row.nbui-kron-row.nbui-has-art>.premium-shrine-icon{position:absolute!important;left:2vh!important;top:50%!important;transform:translateY(-50%)!important;width:6.6vh!important;height:6.6vh!important;margin:0!important;object-fit:cover!important;object-position:center 12%!important;border:1px solid rgba(230,214,184,.28)!important;border-radius:2px!important;background:rgba(0,0,0,.35)!important}
@Q@ #kap .m2k-row.nbui-kron-row.nbui-has-art>b,@Q@ #kap .m2k-row.nbui-kron-row.nbui-has-art>small{text-align:left!important;margin-left:0!important}
@Q@ #kap:has(.nbui-kron-row) .m2k-tier{flex:0 0 100%!important;text-align:right!important;margin:0!important}
/* Kaplica: kafle nie sciskaja sie ponizej tresci (dlugie nazwy nie wychodza z ramki), lista przewija sie w razie potrzeby */
@Q@ #kap #kapList:not(:has(.nbui-kron-row)){grid-auto-rows:minmax(max-content,1fr)!important;align-content:start!important}
@Q@ #kap #kapList:not(:has(.nbui-kron-row))>.m2k-row{min-height:max-content!important;overflow:hidden!important}
@media(max-height:550px){
@Q@ #prep #prepChar .nb-prep-class.on .premium-class-art{max-height:15vh!important}
@Q@ #prep #prepChar .nb-prep-class.on{padding-bottom:1vh!important}
@Q@ #kap #kapList:not(:has(.nbui-kron-row))>.m2k-row small,@Q@ #kap #kapList:not(:has(.nbui-kron-row))>.m2k-row .m2k-pips{font-size:max(8px,2vh)!important;line-height:1.2!important}
@Q@ #kap:has(.nbui-kron-row) #kapDet p,@Q@ #kap:has(.nbui-kron-row) #kapDet td,@Q@ #kap:has(.nbui-kron-row) #kapDet div{font-size:max(10px,2.7vh)!important}
@Q@ #manual #manBody>ul{margin-bottom:3vh!important}
}
/* Instrukcja: jeden kroj i rozmiar tekstu, pelna szerokosc akapitow, oddech przed naglowkami */
@media(min-height:551px){
@Q@ #manual #manBody .mbox,@Q@ #manual #manBody .mbox>p,@Q@ #manual #manBody p,@Q@ #manual #manBody li{font:400 max(15px,2.3vh)/1.6 Georgia,serif!important;max-width:none!important}
@Q@ #manual #manBody .mbox b,@Q@ #manual #manBody p b,@Q@ #manual #manBody li b{font-size:inherit!important;font-family:inherit!important}
@Q@ #manual #manBody>ul,@Q@ #manual #manBody>p{margin-bottom:3vh!important}
@Q@ #manual #manBody .mh{margin-top:3.4vh!important}
}
`.replace(/@P@/g,'#orient'.repeat(30)).replace(/@Q@/g,'#orient'.repeat(110));document.head.append(st)}
// 12.11.2026: sygnal przewijania w panelach pauzy (gradient u dolu, gdy jest wiecej tresci)
if(new URLSearchParams(location.search).get('menufix')!=='0'){const st=document.createElement('style');st.id='nbScrollHint';st.textContent=`#pause .nbp-panel.nb-more::after{content:'\\25BE';display:block;position:sticky;bottom:0;height:30px;margin-top:-30px;text-align:center;line-height:34px;font-size:17px;color:#e8c878;pointer-events:none;background:linear-gradient(to bottom,rgba(10,8,8,0),rgba(10,8,8,.92))}`;document.head.append(st);
setInterval(()=>{const p=document.getElementById('pause');if(!p||p.hidden||p.offsetParent===null)return;p.querySelectorAll('.nbp-panel').forEach(e=>e.classList.toggle('nb-more',e.scrollHeight>e.clientHeight+12&&e.scrollTop+e.clientHeight<e.scrollHeight-8))},300)}

