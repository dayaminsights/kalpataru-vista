const fs=require('fs');
const F='index.html';
let s=fs.readFileSync(F,'utf8');
const n0=s.length;
function rep(a,b,label){
  const c=s.split(a).length-1;
  if(c!==1)throw new Error('anchor '+label+' matched '+c+' times');
  s=s.replace(a,b);
}
const ARROW='<span class="button_icon-after__vljdM"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m20.78 12.531-6.75 6.75a.75.75 0 1 1-1.06-1.061l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.469a.75.75 0 1 1 1.06-1.061l6.75 6.75a.75.75 0 0 1 0 1.061"></path></svg></span>';

/* ---- 1. unit layout: drop the two per-card CTAs, one shared CTA below the grid ---- */
const CARD_CTA='<a class="button_button-round__TFjlU button_color-primary__JJ7Hh kv-layouts-trigger" href="#kv-layouts-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Get the Floor Plans">Get the Floor Plans</span></div></div></a>';
const cardCtaCount=s.split(CARD_CTA).length-1;
if(cardCtaCount!==2)throw new Error('expected 2 card CTAs, found '+cardCtaCount);
s=s.split(CARD_CTA).join('');

rep('<p class="kv-unit-layout__note">Duplex residences also available &#8211; enquire for details.</p>',
'<div class="kv-unit-layout__cta"><a class="button_button-round__TFjlU button_color-primary__JJ7Hh kv-layouts-trigger" href="#kv-layouts-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Get the Floor Plans">Get the Floor Plans</span></div>'+ARROW+'</div></a><p class="kv-unit-layout__note">Floor plans for both configurations in one PDF. Duplex residences also available &#8211; enquire for details.</p></div>',
'unit-layout note');

/* ---- 2. renumber the eyebrows below the new 05 ---- */
rep('>05 — Site Layout','>06 — Site Layout','eyebrow 05');
rep('>06 — Why Kalpataru Vista','>07 — Why Kalpataru Vista','eyebrow 06');
rep('>07 — Questions','>08 — Questions','eyebrow 07');

/* ---- 3. new kv-payment section, injected right after kv-unit-layout ---- */
const CARDS=[
 ['01','Down Payment Plan','The bulk of the consideration paid close to booking. Shortest schedule, fewest milestones to track &#8212; and the plan that carries the keenest price on the sheet.','Suits buyers with funds already in hand'],
 ['02','Construction Linked Plan','Instalments fall due against construction milestones, so payment tracks the towers going up rather than the calendar.','Suits buyers pacing outflow against progress'],
 ['03','Possession Linked Plan','A smaller commitment through construction, with the larger balance due at handover.','Suits buyers carrying rent or an existing EMI']
].map(function(c){
 return '<li class="kv-payment__card"><div class="kv-payment__card-num">'+c[0]+'</div><h3>'+c[1]+'</h3><p>'+c[2]+'</p><p class="kv-payment__card-note">'+c[3]+'</p></li>';
}).join('');

const PAYMENT='<section class="kv-payment" id="kv-payment"><div class="container_container__v5gtR"><div class="kv-payment__head"><div class="kv-section__eyebrow">05 — Payment Plans</div><h2 class="kv-section__heading">Flexible payment plans</h2><p class="kv-payment__intro">Three ways to pay for the same residence. Pick the one that matches how your money actually moves &#8212; the sales team confirms the schedule and the price that applies to your unit.</p></div><ol class="kv-payment__grid">'+CARDS+'</ol><div class="kv-payment__loan"><h3>Home loan assistance</h3><p>The team walks you through lender options, sanction timelines and the paperwork each one asks for, alongside whichever plan you pick.</p></div><p class="kv-payment__disclaimer">Plan availability, the exact schedule and the applicable price vary by tower, floor and configuration, and are governed by the agreement for sale. Nothing on this page is an offer or a commitment &#8212; ask for the current sheet.</p><div class="kv-payment__callout"><div class="kv-payment__callout-text"><div class="kv-section__eyebrow kv-section__eyebrow--light">Talk to Sales</div><h3 class="kv-payment__callout-heading">Not sure which plan fits? We will walk you through it.</h3><p class="kv-payment__callout-body">Leave a number and a time that suits you. A Kalpataru Vista consultant calls back with the current price sheet, the full payment schedule and the home loan options open on this project.</p></div><div class="kv-payment__callout-actions"><a class="button_button-round__TFjlU button_color-primary__JJ7Hh button_inversed__slQcI kv-callback-trigger" href="#kv-callback-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Request a Call Back">Request a Call Back</span></div>'+ARROW+'</div></a><a class="kv-payment__callout-phone" href="tel:+912230643065">or call +91 22 3064 3065</a></div></div></div></section>';

rep("},{id:'kv-plans',anchor:'main',pos:'beforeend'",
"},{id:'kv-payment',anchor:'main',pos:'beforeend',html:`"+PAYMENT+"`},{id:'kv-plans',anchor:'main',pos:'beforeend'",
'kv-plans section entry');

/* ---- 4. callback modal, injected next to the layouts modal ---- */
const CB_MODAL='<div class="kv-modal" id="kv-callback-modal"><div class="kv-modal__backdrop"></div><div class="kv-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="kv-callback-modal-title"><button type="button" class="kv-modal__close" aria-label="Close">&times;</button><h3 id="kv-callback-modal-title" data-kv-title="Request a call back">Request a call back</h3><p class="kv-modal__body">Tell us when to call and what you are looking at. A Kalpataru Vista consultant comes back with prices, the payment schedule and availability.</p><form class="kv-modal__form" id="kv-callback-form"><label class="kv-modal__field"><span>Name</span><input type="text" name="name" required></label><label class="kv-modal__field"><span>Phone</span><input type="tel" name="phone" required></label><label class="kv-modal__field"><span>Best time to call</span><select name="time"><option>Morning (9am &#8211; 12pm)</option><option>Afternoon (12pm &#8211; 4pm)</option><option>Evening (4pm &#8211; 8pm)</option><option>Any time</option></select></label><label class="kv-modal__field"><span>Interested in</span><select name="config"><option>3 BHK</option><option>4 BHK</option><option>Duplex</option><option>Still deciding</option></select></label><button type="submit" class="button_button-round__TFjlU button_color-primary__JJ7Hh"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Request the Call">Request the Call</span></div></div></button></form><div class="kv-modal__success" id="kv-callback-success" hidden><p class="kv-modal__body">We have opened an email to the sales team with your details &#8212; send it and they will call you back. If nothing opened, write to <a href="mailto:sales@kalpataru.com">sales@kalpataru.com</a> or call <a href="tel:+912230643065">+91 22 3064 3065</a>.</p></div></div></div>';

rep("},{id:'kv-rera',anchor:'.footer_copyright-container__yt1ht'",
"},{id:'kv-callback-modal',anchor:'main',pos:'beforeend',html:`"+CB_MODAL+"`},{id:'kv-rera',anchor:'.footer_copyright-container__yt1ht'",
'kv-rera section entry');

/* ---- 5. make the modal plumbing serve both dialogs ---- */
rep('<h3 id="kv-layouts-modal-title">Get the floor plans</h3>',
    '<h3 id="kv-layouts-modal-title" data-kv-title="Get the floor plans">Get the floor plans</h3>',
    'layouts modal title');

rep("    var f=m.querySelector('#kv-layouts-form');\n","    var f=m.querySelector('.kv-modal__form');\n",'closeKvModal form lookup');
rep("      var title=m.querySelector('#kv-layouts-modal-title');\n      if(intro)intro.hidden=false;\n      if(title)title.textContent='Get the floor plans';",
    "      var title=m.querySelector('.kv-modal__dialog h3');\n      if(intro)intro.hidden=false;\n      if(title&&title.dataset.kvTitle)title.textContent=title.dataset.kvTitle;",
    'closeKvModal title reset');

rep("    var trigger=e.target.closest('.kv-layouts-trigger');",
    "    var cb=e.target.closest('.kv-callback-trigger');\n    if(cb){e.preventDefault();var mcb=document.getElementById('kv-callback-modal');if(mcb)openKvModal(mcb);return;}\n    var trigger=e.target.closest('.kv-layouts-trigger');",
    'callback trigger');

const CB_SUBMIT="\n  document.addEventListener('submit',function(e){\n"+
"    var form=e.target.closest('#kv-callback-form');\n"+
"    if(!form)return;\n"+
"    e.preventDefault();\n"+
"    function val(n){var el=form.querySelector('[name=\"'+n+'\"]');return el?el.value:'';}\n"+
"    var subject=encodeURIComponent('Call Back Request \\u2014 Kalpataru Vista');\n"+
"    var body=encodeURIComponent('Name: '+val('name')+'\\nPhone: '+val('phone')+'\\nBest time to call: '+val('time')+'\\nInterested in: '+val('config'));\n"+
"    var href='mailto:sales@kalpataru.com?subject='+subject+'&body='+body;\n"+
"    try{if(window.__kvMailtoOverride){window.__kvMailtoOverride(href);}else{window.location.href=href;}}catch(err){}\n"+
"    var dlg=form.closest('.kv-modal__dialog');\n"+
"    var ok=dlg&&dlg.querySelector('.kv-modal__success');\n"+
"    if(ok){\n"+
"      var intro=dlg.querySelector('.kv-modal__body');\n"+
"      var title=dlg.querySelector('h3');\n"+
"      form.hidden=true;\n"+
"      if(intro)intro.hidden=true;\n"+
"      if(title)title.textContent='We will call you back';\n"+
"      ok.hidden=false;\n"+
"    } else {\n"+
"      var m=form.closest('.kv-modal');\n"+
"      if(m)closeKvModal(m);\n"+
"    }\n"+
"    form.reset();\n"+
"  });\n";

rep("    form.reset();\n  });\n})();</script>","    form.reset();\n  });\n"+CB_SUBMIT+"})();</script>",'submit handler tail');

fs.writeFileSync(F,s);
console.log('ok, '+n0+' -> '+s.length+' bytes');
