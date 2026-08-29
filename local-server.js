const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = __dirname;
const ASSETS_DIR = path.join(
  ROOT,
  "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files"
);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".mp4": "video/mp4",
};

function send(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhouse.8ed9b3db.png&w=...&q=...
// -> strip the content hash -> house.png -> look up in assets dir
function resolveNextImage(reqUrl, res) {
  const parsed = url.parse(reqUrl, true);
  const target = parsed.query.url;
  if (!target) {
    res.writeHead(400);
    res.end("missing url param");
    return;
  }
  const base = path.basename(decodeURIComponent(target)); // house.8ed9b3db.png
  const m = base.match(/^(.+)\.[0-9a-f]{8,}(\.[a-zA-Z0-9]+)$/);
  const candidate = m ? m[1] + m[2] : base; // house.png

  const direct = path.join(ASSETS_DIR, candidate);
  if (fs.existsSync(direct)) {
    send(res, direct);
    return;
  }

  // fallback: case-insensitive / fuzzy match by basename without extension
  const stem = candidate.replace(/\.[^.]+$/, "");
  const files = fs.readdirSync(ASSETS_DIR);
  const hit = files.find((f) => f.toLowerCase().startsWith(stem.toLowerCase()));
  if (hit) {
    send(res, path.join(ASSETS_DIR, hit));
    return;
  }

  res.writeHead(404);
  res.end("asset not found: " + candidate);
}

const server = http.createServer((req, res) => {
  const reqUrl = req.url;
  const pathname = url.parse(reqUrl).pathname;

  if (pathname === "/_next/image") {
    resolveNextImage(reqUrl, res);
    return;
  }

  let filePath;
  if (pathname === "/") {
    filePath = path.join(ROOT, "index.html");
  } else {
    filePath = path.join(ROOT, decodeURIComponent(pathname));
  }

  // dev probe: /?probe=1 serves index.html with a style-reporting script appended,
  // so headless --dump-dom can report post-hydration computed styles
  if (pathname === "/" && url.parse(reqUrl, true).query.probe) {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const scrollY = parseInt(url.parse(reqUrl, true).query.scrollY || "0", 10);
    const probe = `<script>
      window.__jsErrors=[];
      window.addEventListener('error',function(e){window.__jsErrors.push((e.error&&e.error.stack)?e.error.stack:e.message);});
      window.scrollTo(0, ${scrollY});
      if(typeof ScrollTrigger!=='undefined'){ScrollTrigger.update();}
      setTimeout(function(){
      if(typeof ScrollTrigger!=='undefined'){ScrollTrigger.refresh();}
      window.scrollTo(0, ${scrollY});
      if(typeof ScrollTrigger!=='undefined'){ScrollTrigger.update();}
      function buildProbeOutput(){
      var out={};
      var probeWaits=[];
      out.requestedScrollY=${scrollY};
      out.actualScrollY=window.scrollY;
      out.docScrollHeight=document.documentElement.scrollHeight;
      var headerLogoWrap=document.querySelector('.header_logo__LO_Jk');
      var headerLogoA=headerLogoWrap?headerLogoWrap.querySelector('a'):null;
      if(headerLogoA){
        var hls=getComputedStyle(headerLogoA);
        var hlr=headerLogoA.getBoundingClientRect();
        out.headerLogo={bgImage:(hls.backgroundImage||'').slice(0,200),bgSize:hls.backgroundSize,rect:hlr.toJSON(),display:hls.display};
      } else { out.headerLogo='not found'; }
      var navItems=Array.prototype.map.call(document.querySelectorAll('.header_nav-item__Wn05d'),function(n){var a=n.querySelector('a');return a?{text:a.textContent,href:a.getAttribute('href')}:null;});
      out.navItems=navItems;
      var actionsBtn=document.querySelector('.header_actions__Sv09J a');
      out.actionsBtn=actionsBtn?{text:actionsBtn.textContent,href:actionsBtn.getAttribute('href')}:'not found';
      var burgerItems=Array.prototype.map.call(document.querySelectorAll('.burger-menu_nav-item__mCA9u'),function(n){var a=n.querySelector('a');return a?{text:a.textContent,href:a.getAttribute('href')}:null;});
      out.burgerItems=burgerItems;
      var burgerActionsBtn=document.querySelector('.burger-menu_actions__In3qE a');
      out.burgerActionsBtn=burgerActionsBtn?{text:burgerActionsBtn.textContent,href:burgerActionsBtn.getAttribute('href')}:'not found';
      var footerNav=Array.prototype.map.call(document.querySelectorAll('.footer_nav-link__LFUNG'),function(a){return {text:a.textContent,href:a.getAttribute('href')};});
      out.footerNav=footerNav;
      var footerSocials=Array.prototype.map.call(document.querySelectorAll('.footer_social-link__2uQBq'),function(a){return {text:a.textContent,href:a.getAttribute('href')};});
      out.footerSocials=footerSocials;
      var footerSublinks=Array.prototype.map.call(document.querySelectorAll('.footer_sublinks__Pj_ed *'),function(a){return a.textContent;});
      out.footerSublinks=footerSublinks;
      var newsletter=document.querySelector('.footer_newsletter-title__bRCRZ, .footer_newsletter-form__0k_h5');
      out.newsletterPresent=!!newsletter;
      var contactVals=Array.prototype.map.call(document.querySelectorAll('.footer_contact__fFxbr'),function(c){var l=c.querySelector('.footer_contact-label__gYKsP');var a=c.querySelector('.footer_contact-value__e1jbK a');return {label:l?l.textContent:null,text:a?a.textContent.trim():null,href:a?a.getAttribute('href'):null};});
      out.footerContacts=contactVals;
      var copyrightDivs=Array.prototype.map.call(document.querySelectorAll('.footer_copyright-container__yt1ht > div.footer_copyright__1JHRz, .footer_copyright-container__yt1ht > div'),function(d){return d.textContent;});
      out.footerCopyrightDivs=copyrightDivs;
      function rectOf(sel){var el=document.querySelector(sel);return el?el.getBoundingClientRect().toJSON():null;}
      var fc=document.querySelector('.footer_content__E2ijt');
      if(fc){out.footerContentStyle={transform:getComputedStyle(fc).transform,opacity:getComputedStyle(fc).opacity,inlineStyle:fc.getAttribute('style')};}
      out.footerRects={
        wrapper:rectOf('.footer_wrapper__9GQwi'),
        logo:rectOf('.footer_logo__5ncK8'),
        nav:rectOf('.footer_links__vib46'),
        contacts:rectOf('.footer_newsletter-container__POI_T'),
        rera:rectOf('.kv-rera'),
        copyright:rectOf('.footer_copyright-container__yt1ht')
      };
      var headerContent=document.querySelector('.header_content__cVJDb');
      var headerWrapper=document.querySelector('.header_wrapper__MJ5bn');
      if(headerContent&&headerWrapper){
        out.headerColors={contentColor:getComputedStyle(headerContent).color,wrapperBg:getComputedStyle(headerWrapper).backgroundColor,wrapperClass:headerWrapper.className};
      }
      var comp=document.querySelector('.hero_composite__3blHB');
      var logo=document.querySelector('.hero_logo__FxgRj');
      if(comp){var s=getComputedStyle(comp);out.compositeMask=(s.maskImage||s.webkitMaskImage||'').slice(0,120);out.compositeMaskSize=s.maskSize||s.webkitMaskSize;out.compositeOpacity=s.opacity;out.compositeDisplay=s.display;out.compositeBg=s.backgroundColor;
        out.compositeTransform=s.transform;out.compositeRect=comp.getBoundingClientRect().toJSON();out.compositeZIndex=s.zIndex;out.compositePosition=s.position;
        var nestedHouse=comp.querySelector('.hero_house__aJy7p');
        out.nestedHouseDisplay=nestedHouse?getComputedStyle(nestedHouse).display:'no nested house';}
      var clouds=document.querySelector('.hero_clouds__bC7V4');
      if(clouds){var cs=getComputedStyle(clouds);out.cloudsZIndex=cs.zIndex;out.cloudsOpacity=cs.opacity;out.cloudsPosition=cs.position;}
      var smoke=document.querySelector('.hero_smoke__8za_R');
      if(smoke){var sms=getComputedStyle(smoke);out.smokeZIndex=sms.zIndex;out.smokeOpacity=sms.opacity;out.smokePosition=sms.position;var sr=smoke.getBoundingClientRect();out.smokeRect=sr.toJSON();}
      var heroContent=document.querySelector('.hero_content__DK_Ny');
      if(heroContent)out.heroContentOpacity=getComputedStyle(heroContent).opacity;
      var heroBg=document.querySelector('.hero_bg__S_r_n');
      if(heroBg){out.heroBgChildrenOrder=Array.prototype.map.call(heroBg.children,function(c){return c.className;});
        var hbs=getComputedStyle(heroBg);out.heroBgPosition=hbs.position;out.heroBgRect=heroBg.getBoundingClientRect().toJSON();
        var glow=getComputedStyle(heroBg,'::before');
        out.glow={bg:(glow.backgroundImage||'').slice(0,60),zIndex:glow.zIndex,opacity:glow.opacity,top:glow.top,left:glow.left,right:glow.right,bottom:glow.bottom,position:glow.position,content:glow.content};
        out.wordmarkCssVar=heroBg.style.getPropertyValue('--kv-wordmark-opacity');}
      var outerHouse=document.querySelector('body > * .hero_house__aJy7p:not(.hero_composite__3blHB .hero_house__aJy7p)');
      var allHouses=document.querySelectorAll('.hero_house__aJy7p');
      out.totalHouseEls=allHouses.length;
      if(allHouses.length>0){
        var outerH=null;
        allHouses.forEach(function(h){if(!comp||!comp.contains(h))outerH=h;});
        out.outerHouseDisplay=outerH?getComputedStyle(outerH).display:'not found';
        out.outerHouseOpacity=outerH?getComputedStyle(outerH).opacity:'n/a';
      }
      else out.compositeMask='NO .hero_composite ELEMENT';
      if(logo){out.logoSvgPaths=logo.querySelectorAll('path').length;
        var p=logo.querySelector('path');
        if(p)out.firstPathD=p.getAttribute('d').slice(0,40);
        out.logoSvgDisplay=logo.querySelector('svg')?getComputedStyle(logo.querySelector('svg')).display:'no svg';
        out.logoOpacity=getComputedStyle(logo).opacity;
        out.logoTransform=getComputedStyle(logo).transform;out.logoRect=logo.getBoundingClientRect().toJSON();out.logoZIndex=getComputedStyle(logo).zIndex;
        if(p){out.logoPathFill=getComputedStyle(p).fill;out.logoPathStroke=getComputedStyle(p).stroke;}}
      else out.logoSvgPaths='NO .hero_logo ELEMENT';
      out.brandCssLoaded=[].some.call(document.styleSheets,function(ss){return (ss.href||'').indexOf('kalpataru-brand')>-1;});
      var fl=document.querySelector('.footer_logo__5ncK8');
      if(fl){var fs2=getComputedStyle(fl);out.footerBg=(fs2.backgroundImage||'').indexOf('kalpataru-vista-logo.svg')>-1?'kalpataru-vista-logo.svg':(fs2.backgroundImage||'none').slice(0,70);
        var fsvg=fl.querySelector('svg');out.footerSvgDisplay=fsvg?getComputedStyle(fsvg).display:'no svg';}
      else out.footerBg='NO FOOTER LOGO';
      var hl=document.querySelector('.header_logo__LO_Jk');
      if(hl){var ha=hl.querySelector('a');out.navBg=ha?(getComputedStyle(ha).backgroundImage.indexOf('kalpataru-vista-logo.svg')>-1?'kalpataru-vista-logo.svg':getComputedStyle(ha).backgroundImage.slice(0,70)):'no a';
        var hsvg=hl.querySelector('svg');out.navSvgDisplay=hsvg?getComputedStyle(hsvg).display:'no svg';}
      var house=document.querySelector('.hero_house__aJy7p');
      if(house){var r=house.getBoundingClientRect();var hs=getComputedStyle(house);
        out.houseRect={top:Math.round(r.top),bottom:Math.round(r.bottom),height:Math.round(r.height),left:Math.round(r.left),width:Math.round(r.width)};
        out.houseTransform=hs.transform;out.houseTopCss=hs.top;out.houseHeightCss=hs.height;
        var img=house.querySelector('img');
        if(img){var ir=img.getBoundingClientRect();var is=getComputedStyle(img);
          out.imgRect={top:Math.round(ir.top),bottom:Math.round(ir.bottom),height:Math.round(ir.height)};
          out.imgObjectPosition=is.objectPosition;out.imgNaturalSize=img.naturalWidth+'x'+img.naturalHeight;
          // object-fit:contain visible-pixel rect (element box != visible photo content)
          var nr=img.naturalWidth/img.naturalHeight, br=ir.width/ir.height;
          var cw,ch;
          if(nr>br){cw=ir.width;ch=ir.width/nr;} else {ch=ir.height;cw=ir.height*nr;}
          var offX=(ir.width-cw)*0.5, offY=0; // object-position:top -> 0% vertical offset
          out.visiblePhotoRect={top:Math.round(ir.top+offY),bottom:Math.round(ir.top+offY+ch),height:Math.round(ch),left:Math.round(ir.left+offX),width:Math.round(cw)};
          out.visibleInViewportPx=Math.max(0,Math.min(window.innerHeight,ir.top+offY+ch)-Math.max(0,ir.top+offY));}
      }
      else out.houseRect='NO .hero_house ELEMENT';
      out.viewport={w:window.innerWidth,h:window.innerHeight};
      out.scrollY=window.scrollY;
      function styleOf(sel,props){
        var el=document.querySelector(sel);
        if(!el) return 'NOT FOUND: '+sel;
        var s=getComputedStyle(el);
        var o={};
        props.forEach(function(p){o[p]=s[p];});
        return o;
      }
      out.tokens={
        body: styleOf('body',['fontFamily','fontSize','color','backgroundColor']),
        h1: styleOf('.hero_title__JpmHS h1',['fontFamily','fontSize','fontWeight','lineHeight','color','letterSpacing']),
        headerRoot: styleOf('.header_content__cVJDb',['backgroundColor','backdropFilter','padding']),
        nav: styleOf('.header_nav__if_jI',['fontFamily','fontSize','fontWeight','color']),
        ctaButton: styleOf('.button_button-round__TFjlU.button_color-primary__JJ7Hh',['backgroundColor','color','borderRadius','padding','fontFamily','fontSize','fontWeight','border','textTransform','letterSpacing']),
        ctaButtonText: styleOf('.button_button-round-text__IEwW5',['fontFamily','fontSize','fontWeight','letterSpacing','textTransform']),
        container: styleOf('.container_container__v5gtR',['maxWidth','paddingLeft','paddingRight']),
      };
      out.sections={};
      ['why-us_root__aGsFp','arrows-section_root__yyPBl','testimonials_root__PiYLZ','services_root__Ch_WM','features_root__CCic6','latest-posts_root__W0OHF','outro_root__stMHm'].forEach(function(c){
        var el=document.querySelector('.'+c);
        out.sections[c]=el?getComputedStyle(el).display:'NOT FOUND';
      });
      var bareSections=document.querySelectorAll('section:not([class])');
      out.sections['bare-sections']=bareSections.length?Array.prototype.map.call(bareSections,function(s){return getComputedStyle(s).display}).join(','):'none present';
      ['kv-video','kv-overview','kv-amenities','kv-unit-layout','kv-plans','kv-why','kv-cta'].forEach(function(id){
        var el=document.getElementById(id);
        if(!el){out.sections[id]='NOT FOUND';return;}
        var r=el.getBoundingClientRect();
        out.sections[id]=getComputedStyle(el).display+' height='+Math.round(r.height);
      });
      var kvWhy=document.getElementById('kv-why');
      if(kvWhy){
        var wr=kvWhy.getBoundingClientRect();
        var wgrid=kvWhy.querySelector('.kv-why__grid');
        var wstats=kvWhy.querySelectorAll('.kv-why__stat-num');
        var wbenefits=kvWhy.querySelectorAll('.kv-why__benefit');
        var wbuttons=kvWhy.querySelectorAll('.kv-why__credit');
        var wimgsBefore=Array.prototype.map.call(kvWhy.querySelectorAll('.kv-why__viewer-img'),function(im){return {src:im.getAttribute('src').split('/').pop(),active:im.classList.contains('is-active')};});
        var captionBefore=(kvWhy.querySelector('.kv-why__viewer-caption')||{}).textContent;
        // simulate the "hover the 2nd credit" interaction (no click needed on desktop)
        var wimgsAfter=null,captionAfter=null,secondBtnActiveAfter=null;
        if(wbuttons.length>1){
          wbuttons[1].dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
          wimgsAfter=Array.prototype.map.call(kvWhy.querySelectorAll('.kv-why__viewer-img'),function(im){return {src:im.getAttribute('src').split('/').pop(),active:im.classList.contains('is-active')};});
          captionAfter=(kvWhy.querySelector('.kv-why__viewer-caption')||{}).textContent;
          secondBtnActiveAfter=wbuttons[1].classList.contains('is-active');
        }
        out.kvWhy={
          bg:getComputedStyle(kvWhy).backgroundColor,
          top:Math.round(wr.top),bottom:Math.round(wr.bottom),
          gridTemplateColumns:wgrid?getComputedStyle(wgrid).gridTemplateColumns:'NO GRID',
          statCount:wstats.length,
          statTexts:Array.prototype.map.call(wstats,function(s){return s.textContent;}),
          benefitCount:wbenefits.length,
          benefitBgImages:Array.prototype.map.call(wbenefits,function(b){return getComputedStyle(b).backgroundImage.slice(0,20)==='none'?'NONE':getComputedStyle(b).backgroundImage.split('/').pop();}),
          headingText:(kvWhy.querySelector('.kv-section__heading')||{}).textContent,
          creditButtonCount:wbuttons.length,
          galleryBeforeHover:{images:wimgsBefore,caption:captionBefore},
          galleryAfterHoverSecondCredit:{images:wimgsAfter,caption:captionAfter,secondButtonActive:secondBtnActiveAfter},
        };
      }
      var kvVideo=document.getElementById('kv-video');
      if(kvVideo){
        var vr=kvVideo.getBoundingClientRect();
        var vid=kvVideo.querySelector('video');
        out.kvVideo={
          top:Math.round(vr.top),bottom:Math.round(vr.bottom),width:Math.round(vr.width),height:Math.round(vr.height),
          videoFound:!!vid,
          src:vid?vid.currentSrc.split('/').pop():null,
          autoplay:vid?vid.autoplay:null,
          muted:vid?vid.muted:null,
          loop:vid?vid.loop:null,
          paused:vid?vid.paused:null,
          readyState:vid?vid.readyState:null,
          videoNaturalSize:vid?(vid.videoWidth+'x'+vid.videoHeight):null,
          objectFit:vid?getComputedStyle(vid).objectFit:null,
          zIndex:getComputedStyle(kvVideo).zIndex,
          coveredByHero:(function(){
            var cx=Math.round(vr.left+vr.width/2), cy=Math.round(vr.top+vr.height/2);
            if(cy<0||cy>window.innerHeight)return 'offscreen-vertically, skip';
            var top=document.elementFromPoint(cx,cy);
            if(!top)return 'no element at point';
            return top===vid||kvVideo.contains(top)?'no (video/overlay on top)':'YES, covered by: '+top.className;
          })()
        };
        var ov=document.getElementById('kv-overview');
        if(ov)out.kvVideo.overviewTop=Math.round(ov.getBoundingClientRect().top);
      } else out.kvVideo='kv-video element NOT FOUND';
      var kvUnitLayout=document.getElementById('kv-unit-layout');
      if(kvUnitLayout){
        var ulCards=kvUnitLayout.querySelectorAll('.kv-unit-layout__card');
        var ulGrid=kvUnitLayout.querySelector('.kv-unit-layout__grid');
        var ulTriggers=kvUnitLayout.querySelectorAll('.kv-layouts-trigger');
        out.kvUnitLayout={
          bg:getComputedStyle(kvUnitLayout).backgroundColor,
          gridColumns:ulGrid?getComputedStyle(ulGrid).gridTemplateColumns:null,
          cardCount:ulCards.length,
          cardNums:Array.prototype.map.call(ulCards,function(c){return (c.querySelector('.kv-unit-layout__num')||{}).textContent;}),
          cardHeadings:Array.prototype.map.call(ulCards,function(c){return (c.querySelector('h3')||{}).textContent;}),
          cardSpecs:Array.prototype.map.call(ulCards,function(c){return Array.prototype.map.call(c.querySelectorAll('.kv-unit-layout__specs dt,.kv-unit-layout__specs dd'),function(el){return el.tagName+':'+el.textContent;});}),
          cardPrices:Array.prototype.map.call(ulCards,function(c){return (c.querySelector('.kv-unit-layout__price')||{}).textContent;}),
          numFontFamily:ulCards[0]?getComputedStyle(ulCards[0].querySelector('.kv-unit-layout__num')).fontFamily:null,
          triggerCount:ulTriggers.length,
          noteText:(kvUnitLayout.querySelector('.kv-unit-layout__note')||{}).textContent,
          domOrder:{
            afterAmenities:!!(document.getElementById('kv-amenities')&&document.getElementById('kv-amenities').compareDocumentPosition(kvUnitLayout)&Node.DOCUMENT_POSITION_FOLLOWING),
            beforePlans:!!(document.getElementById('kv-plans')&&kvUnitLayout.compareDocumentPosition(document.getElementById('kv-plans'))&Node.DOCUMENT_POSITION_FOLLOWING)
          }
        };
      } else out.kvUnitLayout='kv-unit-layout element NOT FOUND';
      var kvPlans=document.getElementById('kv-plans');
      if(kvPlans){
        var siteImg=kvPlans.querySelector('.kv-plans__site-media img');
        var groups=kvPlans.querySelectorAll('.kv-plans__spec-group');
        var grid=kvPlans.querySelector('.kv-plans__grid');
        var siteInner=kvPlans.querySelector('.kv-plans__site-inner');
        out.kvPlans={
          gridColumns:grid?getComputedStyle(grid).gridTemplateColumns:null,
          siteInnerPosition:siteInner?getComputedStyle(siteInner).position:null,
          imgFound:!!siteImg,
          imgSrc:siteImg?siteImg.getAttribute('src').split('/').pop():null,
          imgNaturalSize:siteImg?(siteImg.naturalWidth+'x'+siteImg.naturalHeight):null,
          specGroupCount:groups.length,
          specItemCount:kvPlans.querySelectorAll('.kv-plans__spec-group li').length,
          benefitsGone:!document.getElementById('kv-benefits'),
          head:(function(){var h=kvPlans.querySelector('.kv-plans__head');if(!h)return 'kv-plans__head NOT FOUND';var t=h.querySelector('.kv-plans__head-title .kv-section__heading');var c=h.querySelector('.kv-plans__cta');var b=c?c.querySelector('a'):null;var r=function(e){if(!e)return null;var x=e.getBoundingClientRect();return {l:Math.round(x.left),r:Math.round(x.right),t:Math.round(x.top),b:Math.round(x.bottom)};};return {dir:getComputedStyle(h).flexDirection,heading:r(t),cta:r(c),btn:r(b),ctaRightOfHeading:(t&&c)?(c.getBoundingClientRect().left>t.getBoundingClientRect().right):null,footCtaRemains:kvPlans.querySelectorAll('.kv-section__cta').length};})()
        };
      } else out.kvPlans='kv-plans element NOT FOUND';
      var rera=document.querySelector('.kv-rera');
      out.sections['kv-rera']=rera?'found':'NOT FOUND';
      var navOverview=document.querySelector('a[href="#kv-overview"]');
      out.sections['nav-overview-link']=navOverview?'found':'NOT FOUND';
      var navAmenities=document.querySelector('a[href="#kv-amenities"]');
      out.sections['nav-amenities-link']=navAmenities?'found':'NOT FOUND';
      var amenPanels=document.querySelectorAll('#kv-amenities .kv-amenities__panel');
      out.amenities={panelCount:amenPanels.length};
      out.amenities.panels=Array.prototype.map.call(amenPanels,function(p){
        var img=p.querySelector('.kv-amenities__media img');
        var h3=p.querySelector('.kv-amenities__copy h3');
        var tags=p.querySelectorAll('.kv-amenities__tags li');
        return {
          heading:h3?h3.textContent:'NO H3',
          imgSrc:img?img.getAttribute('src').split('/').pop():'NO IMG',
          imgNaturalSize:img?(img.naturalWidth+'x'+img.naturalHeight):'n/a',
          tagCount:tags.length
        };
      });
      var oldList=document.querySelector('#kv-amenities .kv-amenities__list');
      out.amenities.oldFlatListPresent=!!oldList;
      var amenText=document.getElementById('kv-amenities')?document.getElementById('kv-amenities').textContent:'';
      out.amenities.allSeventeenPresent=['Swimming Pool','Gymnasium','Multi-Purpose Hall','Squash Court','Community Centre','Creche','Business Lounge',"Kids' Play Area",'Fitness Zone','Games Room','Jogging Path','Landscaped Podium for Walking','Library and TV Lounge','Lounge Area','Spa','Sundecks','Waiting Niche'].every(function(name){return amenText.indexOf(name)>-1;});
      var overviewCards=document.querySelectorAll('#kv-overview .kv-overview__card');
      out.overview={cardCount:overviewCards.length};
      out.overview.statsRemoved=!document.querySelector('#kv-overview .kv-overview__stats');
      out.overview.ctaFound=!!document.querySelector('#kv-overview .kv-overview__intro .button_button-round__TFjlU');
      out.overview.bg=document.getElementById('kv-overview')?getComputedStyle(document.getElementById('kv-overview')).backgroundColor:'n/a';
      out.overview.cards=Array.prototype.map.call(overviewCards,function(c){
        var img=c.querySelector('.kv-overview__card-media img');
        var h3=c.querySelector('.kv-overview__card-overlay h3');
        var btn=c.querySelector('.kv-overview__card-overlay .button_button-round__TFjlU');
        return {
          heading:h3?h3.textContent:'NO H3',
          hasButton:!!btn,
          buttonHref:btn?btn.getAttribute('href'):null,
          imgSrc:img?img.getAttribute('src').split('/').pop():'NO IMG',
          imgNaturalSize:img?(img.naturalWidth+'x'+img.naturalHeight):'n/a',
          mediaHeight:img?Math.round(img.getBoundingClientRect().height):0
        };
      });
      var cardsGrid=document.querySelector('#kv-overview .kv-overview__cards');
      out.overview.gridColumns=cardsGrid?getComputedStyle(cardsGrid).gridTemplateColumns.split(' ').length:0;
      try{
      var golfCard=document.querySelector('.kv-overview__card--golf');
      if(golfCard){
        var golfSlides=golfCard.querySelectorAll('.kv-overview__card-slide');
        out.golf={
          slideCount:golfSlides.length,
          activeIndexBefore:Array.prototype.findIndex.call(golfSlides,function(s){return s.classList.contains('is-active');}),
          inited:golfCard.dataset.kvGolfInited==='1',
          slideSrcs:Array.prototype.map.call(golfSlides,function(s){return s.src.split('/').pop();})
        };
        var golfHoverRuleFound=false;
        Array.prototype.forEach.call(document.styleSheets,function(ss){
          try{
            Array.prototype.forEach.call(ss.cssRules||[],function(r){
              if(r.selectorText==='.kv-overview__card:hover'&&/scale\\(/.test(r.style.transform))golfHoverRuleFound=true;
            });
          }catch(e){}
        });
        out.golf.hoverScaleRuleFound=golfHoverRuleFound;
        golfCard.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
        out.golf.activeIndexRightAfterMouseenter=Array.prototype.findIndex.call(golfSlides,function(s){return s.classList.contains('is-active');});
        golfCard.dispatchEvent(new MouseEvent('mouseleave',{bubbles:true}));
        out.golf.activeIndexAfterMouseleave=Array.prototype.findIndex.call(golfSlides,function(s){return s.classList.contains('is-active');});
      } else {
        out.golf='NO .kv-overview__card--golf ELEMENT';
      }
      }catch(golfErr){out.golfErr=(golfErr&&golfErr.stack)?golfErr.stack:String(golfErr);}
      out.amenitiesAnim={
        gsapLoaded:typeof gsap!=='undefined',
        scrollTriggerLoaded:typeof ScrollTrigger!=='undefined',
        splitTextLoaded:typeof SplitText!=='undefined',
        scrollTriggerInstanceCount:(typeof ScrollTrigger!=='undefined')?ScrollTrigger.getAll().length:0
      };
      var amenRoot=document.getElementById('kv-amenities');
      if(amenRoot){
        var bigImgs=amenRoot.querySelectorAll('[data-amenities-anim="big-image"]');
        var smallImgs=amenRoot.querySelectorAll('[data-amenities-anim="small-image"]');
        var slideBoxes=amenRoot.querySelectorAll('.kv-amenities-slide-box');
        var amenTriggers=amenRoot.querySelectorAll('[data-amenities-anim="trigger"]');
        out.amenitiesAnim.bigImageCount=bigImgs.length;
        out.amenitiesAnim.smallImageCount=smallImgs.length;
        out.amenitiesAnim.slideBoxCount=slideBoxes.length;
        out.amenitiesAnim.triggerCount=amenTriggers.length;
        out.amenitiesAnim.inited=amenRoot.dataset.kvAmenInited==='1';
        var amenTriggerProgresses=amenTriggers.length?Array.prototype.map.call(amenTriggers,function(trig,i){
          var st=ScrollTrigger.getAll().find(function(s){return s.trigger===trig;});
          return {index:i,progress:st?Math.round(st.progress*1000)/1000:null};
        }):[];
        out.amenitiesAnim.triggerProgresses=amenTriggerProgresses;
        out.amenitiesAnim.bigImages=Array.prototype.map.call(bigImgs,function(img,i){
          var s=getComputedStyle(img);
          return {index:i,isFirst:img.classList.contains('is-first'),maskImage:(s.maskImage||s.webkitMaskImage||'').slice(0,30),opacity:getComputedStyle(img).opacity,transform:s.transform==='none'?'none':'set'};
        });
        out.amenitiesAnim.smallImages=Array.prototype.map.call(smallImgs,function(img,i){
          var s=getComputedStyle(img);
          return {index:i,clipPath:s.clipPath};
        });
        out.amenitiesAnim.jsErrors=window.__jsErrors;
        out.amenitiesAnim.h3Debug=Array.prototype.map.call(slideBoxes,function(box,i){
          var h3=box.querySelector('[data-amenities-anim="title"]');
          if(!h3)return {index:i,found:false};
          var lines=h3.querySelectorAll('div,span');
          var innermost=lines[lines.length-1];
          var deep=getComputedStyle(innermost);
          return {index:i,offsetHeight:h3.offsetHeight,childCount:lines.length,h3Opacity:getComputedStyle(h3).opacity,textContent:h3.textContent,innermostTransform:deep.transform,innermostOpacity:deep.opacity,innermostColor:deep.color,innermostFontSize:deep.fontSize};
        });
        out.amenitiesAnim.slideBoxStates=Array.prototype.map.call(slideBoxes,function(box,i){
          var s=getComputedStyle(box);
          var h3=box.querySelector('[data-amenities-anim="title"]');
          return {index:i,opacity:s.opacity,visibility:s.visibility,heading:h3?h3.textContent.trim():'NO H3'};
        });
        var track=amenRoot.querySelector('.kv-amenities-track');
        out.amenitiesAnim.trackHeight=track?Math.round(track.getBoundingClientRect().height):0;
        out.amenitiesAnim.trackTop=track?Math.round(track.getBoundingClientRect().top+window.scrollY):0;
        var progressLine=amenRoot.querySelector('.kv-amenities-progress-line');
        out.amenitiesAnim.progressLineHeight=progressLine?getComputedStyle(progressLine).height:'NOT FOUND';
        var imagesEl=amenRoot.querySelector('.kv-amenities-images');
        var textsEl=amenRoot.querySelector('.kv-amenities-texts');
        var smallEl=amenRoot.querySelector('.kv-amenities-images-small');
        var h3El=amenRoot.querySelector('.kv-amenities-slide-box.is-first h3, .kv-amenities-slide-box[style*="opacity: 1"] h3')||amenRoot.querySelector('[data-amenities-anim="title"]');
        out.amenitiesAnim.rects={
          images:imagesEl?imagesEl.getBoundingClientRect().toJSON():null,
          texts:textsEl?textsEl.getBoundingClientRect().toJSON():null,
          small:smallEl?smallEl.getBoundingClientRect().toJSON():null,
          h3FontSize:h3El?getComputedStyle(h3El).fontSize:null
        };
      } else {
        out.amenitiesAnim.rootFound=false;
      }
      var locCard=document.getElementById('kv-location-card');
      function finishProbe(){document.title='PROBE::'+JSON.stringify(out);}
      if(locCard){
        var locBox=locCard.querySelector('.kv-overview__card-video');
        var locVideo=locBox?locBox.querySelector('.kv-overview__card-video-el'):null;
        out.locationVideo={
          cardFound:true,
          boxFound:!!locBox,
          videoFound:!!locVideo,
          videoSrc:locVideo?locVideo.currentSrc.split('/').pop():null,
          autoplay:locVideo?locVideo.autoplay:null,
          muted:locVideo?locVideo.muted:null,
          loop:locVideo?locVideo.loop:null,
          readyState:locVideo?locVideo.readyState:null,
          pausedBeforeHover:locVideo?locVideo.paused:null,
          activeBeforeHover:locBox?locBox.classList.contains('is-active'):null
        };
        if(locVideo){
          // getComputedStyle mid-CSS-transition is unreliable under headless
          // --virtual-time-budget (compositor timeline doesn't tick with virtual
          // time), so verify the cascade result with transitions bypassed rather
          // than reading an animated value.
          locBox.style.transition='none';
          locBox.classList.add('is-active');
          void locBox.offsetHeight;
          out.locationVideo.activeOpacity=getComputedStyle(locBox).opacity;
          out.locationVideo.activePointerEvents=getComputedStyle(locBox).pointerEvents;
          out.locationVideo.activeVisibility=getComputedStyle(locBox).visibility;
          locBox.classList.remove('is-active');
          locBox.style.transition='';

          // reveal()/conceal() are unconditional now: every hover-enter forces
          // currentTime=0+play(), every leave pauses immediately. No debounce --
          // "restart from the beginning on every hover" is the desired behavior,
          // not something to guard against.
          locCard.dispatchEvent(new MouseEvent('mouseenter',{bubbles:false}));
          out.locationVideo.activeAfterHover=locBox.classList.contains('is-active');
          out.locationVideo.pausedAfterHover=locVideo.paused;
          out.locationVideo.currentTimeAfterHover=locVideo.currentTime;
          locCard.dispatchEvent(new MouseEvent('mouseleave',{bubbles:false}));
          out.locationVideo.activeAfterLeave=locBox.classList.contains('is-active');
          out.locationVideo.pausedAfterLeave=locVideo.paused;
        }
      } else {
        out.locationVideo={cardFound:false};
      }
      var layoutsModal=document.getElementById('kv-layouts-modal');
      var layoutsTrigger=document.querySelector('.kv-layouts-trigger');
      out.layoutsModal={
        modalFound:!!layoutsModal,
        openOnLoad:layoutsModal?layoutsModal.classList.contains('is-open'):null,
        triggerFound:!!layoutsTrigger,
        triggerText:layoutsTrigger?layoutsTrigger.textContent.trim():null,
        triggerHref:layoutsTrigger?layoutsTrigger.getAttribute('href'):null
      };
      if(layoutsModal&&layoutsTrigger){
        try{
        var capturedHref=null;
        window.__kvMailtoOverride=function(href){capturedHref=href;};
        layoutsTrigger.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
        out.layoutsModal.openAfterClick=layoutsModal.classList.contains('is-open');
        // openKvModal defers its .focus() call by two requestAnimationFrame
        // callbacks (focusing an element still mid-transition from
        // visibility:hidden silently fails otherwise), so reading
        // document.activeElement synchronously here always sees pre-focus
        // state. Mirror the same double-rAF defer and let finishProbe wait
        // on it via probeWaits instead of reading activeElement immediately.
        //
        // KNOWN LIMITATION (see out.layoutsModal.focusNote below and
        // ARCHITECTURE.md's "Headless-Chrome gotcha"): under this probe's
        // --dump-dom --disable-gpu --virtual-time-budget harness,
        // focusedFieldName will read null regardless of how this wait is
        // implemented. Two things were independently confirmed while
        // building this fix: (1) native requestAnimationFrame is not
        // reliably granted animation frames under --disable-gpu virtual
        // time (0 frames observed across repeated runs); (2) even patching
        // window.requestAnimationFrame to a same-tick setTimeout(cb,0) --
        // which *does* make both of openKvModal's rAF calls fire -- still
        // doesn't produce a focused element here, because this probe's own
        // submit/escape/close-button/backdrop-click checks below run
        // synchronously in the same tick as the open click and cycle the
        // modal through close/reopen/close before either deferred callback
        // gets a chance to run, so f.focus() always lands after the modal
        // is already closed again by this test sequence. That race is
        // inherent to observing a rAF-deferred side effect from a fully
        // synchronous test sequence, independent of the timing mechanism.
        // The wait below is still correct and worth keeping: it prevents
        // the incorrect too-early read, resolves promptly on the (real-
        // browser-typical) path where frames do fire, and the bounded
        // fallback guarantees finishProbe() is never blocked by it.
        probeWaits.push(new Promise(function(resolveFocusWait){
          var settled=false;
          function settleFocusRead(){
            if(settled)return;
            settled=true;
            var active=document.activeElement;
            out.layoutsModal.focusedFieldName=active?active.getAttribute('name'):null;
            resolveFocusWait();
          }
          requestAnimationFrame(function(){
            requestAnimationFrame(settleFocusRead);
          });
          setTimeout(settleFocusRead,500);
        }));
        out.layoutsModal.focusNote="focusedFieldName cannot be positively verified through this --dump-dom probe -- see code comment above this field for why (rAF frames are not reliably granted under --disable-gpu virtual-time headless, and even a working timing substitute loses the race against this probe's own synchronous close/reopen/close checks). Confirmed correct via live CDP/browser session by two independent reviewers instead.";
        var form=document.getElementById('kv-layouts-form');
        out.layoutsModal.formFound=!!form;
        if(form){
          form.querySelector('[name="name"]').value='Test User';
          form.querySelector('[name="phone"]').value='9999999999';
          form.querySelector('[name="email"]').value='test@example.com';
          form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
        }
        out.layoutsModal.mailtoHref=capturedHref;
        out.layoutsModal.closedAfterSubmit=!layoutsModal.classList.contains('is-open');
        layoutsModal.classList.add('is-open');
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        out.layoutsModal.closedAfterEscape=!layoutsModal.classList.contains('is-open');
        layoutsModal.classList.add('is-open');
        var closeBtn=layoutsModal.querySelector('.kv-modal__close');
        if(closeBtn)closeBtn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
        out.layoutsModal.closeButtonFound=!!closeBtn;
        out.layoutsModal.closedAfterCloseButton=!layoutsModal.classList.contains('is-open');
        layoutsModal.classList.add('is-open');
        var backdrop=layoutsModal.querySelector('.kv-modal__backdrop');
        if(backdrop)backdrop.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
        out.layoutsModal.backdropFound=!!backdrop;
        out.layoutsModal.closedAfterBackdropClick=!layoutsModal.classList.contains('is-open');
        }catch(layoutsModalErr){out.layoutsModalErr=(layoutsModalErr&&layoutsModalErr.stack)?layoutsModalErr.stack:String(layoutsModalErr);}
      }
      // KVAUDIT: section-level geometry/typography audit (added for the
      // copy/alignment review -- reports rendered font sizes, box rects and
      // overflow for the sections under question).
      try{
        function kvBox(sel){var e=document.querySelector(sel);if(!e)return 'not found';
          var r=e.getBoundingClientRect();var cs=getComputedStyle(e);
          return {t:Math.round(r.top+window.scrollY),l:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),fs:cs.fontSize,lh:cs.lineHeight,ta:cs.textAlign,ov:e.scrollWidth>e.clientWidth+1?('OVERFLOW sw='+e.scrollWidth+' cw='+e.clientWidth):'ok'};}
        out.kvAudit={
          order:Array.prototype.map.call(document.querySelectorAll('main > section[id^=kv-], main > div[id^=kv-]'),function(n){return n.id;}),
          videoH2:kvBox('.kv-video__title h2'),
          videoText:kvBox('.kv-video__text'),
          ovTop:kvBox('.kv-overview__top'),
          ovEyebrow:kvBox('.kv-overview .kv-section__eyebrow'),
          ovHeading:kvBox('.kv-overview .kv-section__heading'),
          ovIntro:kvBox('.kv-overview__intro'),
          ovIntroP:kvBox('.kv-overview__body'),
          cta:kvBox('.kv-cta'),
          ctaHeading:kvBox('.kv-cta__heading'),
          footer:kvBox('.footer_content__E2ijt'),
          footerLogo:kvBox('.footer_logo__5ncK8'),
          footerContacts:kvBox('.footer_contacts__HFiAl'),
          footerLinks:kvBox('.footer_links__vib46'),
          rera:kvBox('.kv-rera'),
          copyright:kvBox('.footer_copyright-container__yt1ht'),
          navLinks:Array.prototype.map.call(document.querySelectorAll('.footer_nav-link__LFUNG'),function(a){var sp=a.querySelector('span');var ar=a.getBoundingClientRect();var sr=sp?sp.getBoundingClientRect():null;var cs=getComputedStyle(a);var ss=sp?getComputedStyle(sp):null;return {txt:a.textContent.trim(),ov:cs.overflow,pad:cs.paddingTop,linkH:Math.round(ar.height),spanH:sr?Math.round(sr.height):-1,spanTop:sr?Math.round(sr.top-ar.top):-1,spanBottom:sr?Math.round((ar.top+ar.height)-(sr.top+sr.height)):-1,fs:cs.fontSize,lh:ss?ss.lineHeight:cs.lineHeight};}),
          contacts:Array.prototype.map.call(document.querySelectorAll('.footer_contact__fFxbr'),function(d){var r=d.getBoundingClientRect();var lab=d.querySelector('.footer_contact-label__gYKsP');var val=d.querySelector('.footer_contact-value__e1jbK');return {k:d.getAttribute('data-contact'),l:Math.round(r.left),w:Math.round(r.width),labMb:lab?getComputedStyle(lab).marginBottom:'-',gap:(lab&&val)?Math.round(val.getBoundingClientRect().top-(lab.getBoundingClientRect().top+lab.getBoundingClientRect().height)):-1};}),
          clipped:(function(){var res=[];var root=document.querySelector('footer')||document.body;var all=root.querySelectorAll('*');for(var i=0;i<all.length;i++){var e=all[i];var cs=getComputedStyle(e);if(cs.overflow==='visible')continue;if(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1){res.push({cls:(e.className||'').toString().slice(0,50),tag:e.tagName,ov:cs.overflow,ch:e.clientHeight,sh:e.scrollHeight,cw:e.clientWidth,sw:e.scrollWidth,txt:(e.textContent||'').trim().slice(0,30)});}}return res;})(),
          ctaBlock:(function(){var s=document.querySelector('.kv-cta');if(!s)return 'nf';var r=s.getBoundingClientRect();var f=document.querySelector('footer');var fr=f?f.getBoundingClientRect():null;return {ctaBottom:Math.round(r.bottom+window.scrollY),footerTop:fr?Math.round(fr.top+window.scrollY):-1,footerBg:f?getComputedStyle(f).backgroundColor:'-',ctaBg:getComputedStyle(s).backgroundColor,footerPadTop:f?getComputedStyle(f).paddingTop:'-'};})(),
          ghost:(function(){var a=document.querySelector('.footer_nav-link__LFUNG');if(!a)return 'nf';var sp=a.querySelector('span');var ar=a.getBoundingClientRect();var sr=sp.getBoundingClientRect();var af=getComputedStyle(sp,'::after');var pb=parseFloat(getComputedStyle(a).paddingBottom);var afTop=parseFloat(af.top);return {linkH:+ar.height.toFixed(2),spanTopInLink:+(sr.top-ar.top).toFixed(2),spanH:+sr.height.toFixed(2),afterTopFromSpan:+afTop.toFixed(2),afterTopFromLink:+((sr.top-ar.top)+afTop).toFixed(2),clipAt:+ar.height.toFixed(2),leakPx:+(((ar.height)-((sr.top-ar.top)+afTop))).toFixed(2),padBottom:pb};})(),
          newBits:(function(){function bx(e){if(!e)return null;var r=e.getBoundingClientRect();return {t:Math.round(r.top+window.scrollY),l:Math.round(r.left),r:Math.round(r.right),w:Math.round(r.width),h:Math.round(r.height)};}
            var o={};
            o.videoTitle=bx(document.querySelector('.kv-video__title'));
            o.videoEyebrow=bx(document.querySelector('.kv-video__eyebrow'));
            o.videoH2=bx(document.querySelector('.kv-video__title h2'));
            o.videoIntro=bx(document.querySelector('.kv-video__intro'));
            o.videoIntroP=bx(document.querySelector('.kv-video__text'));
            o.videoBtn=bx(document.querySelector('.kv-video__intro a'));
            o.videoPreview=bx(document.querySelector('.kv-video__preview'));
            o.ctaBlocks=Array.prototype.map.call(document.querySelectorAll('.kv-section__cta'),function(c){var sec=c.closest('section');var t=c.querySelector('.kv-section__cta-text');var b=c.querySelector('a');var cs=getComputedStyle(c);return {sec:sec?sec.id:'?',dir:cs.flexDirection,just:cs.justifyContent,box:bx(c),txt:bx(t),btn:bx(b),gapPx:(b&&t)?Math.round(b.getBoundingClientRect().left-t.getBoundingClientRect().right):-1};});
            o.sections=Array.prototype.map.call(document.querySelectorAll('main > section[id]'),function(s){return {id:s.id,box:bx(s)};});
            return o;})(),
          whyCol:(function(){function bx(e){if(!e)return null;var r=e.getBoundingClientRect();return {t:Math.round(r.top+window.scrollY),l:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)};}
            var intro=document.querySelector('.kv-why__intro');var ps=intro?intro.querySelectorAll(':scope > p'):[];var cr=document.querySelector('.kv-why__credits');var btn=document.querySelector('.kv-why__cta');var vw=document.querySelector('.kv-why__viewer');
            if(!btn)return 'kv-why__cta not found';
            var ib=intro.getBoundingClientRect(),cb=cr.getBoundingClientRect(),bb=btn.getBoundingClientRect();
            var lastP=ps[ps.length-1].getBoundingClientRect();
            var bcs=getComputedStyle(btn);
            var hd=document.querySelector('.kv-why__intro .kv-section__heading');var eb=document.querySelector('.kv-why__intro .kv-section__eyebrow');var fr=document.querySelector('.kv-why__viewer-frame');var cap=document.querySelector('.kv-why__viewer-caption');
            return {heading:bx(hd),eyebrow:bx(eb),frame:bx(fr),caption:bx(cap),headingTopFromIntro:Math.round(hd.getBoundingClientRect().top-ib.top),frameTopMinusHeadingTop:Math.round(fr.getBoundingClientRect().top-hd.getBoundingClientRect().top),frameBottomMinusBtnBottom:Math.round(fr.getBoundingClientRect().bottom-bb.bottom),capPos:getComputedStyle(cap).position,frameAR:getComputedStyle(fr).aspectRatio,intro:bx(intro),viewer:bx(vw),pCount:ps.length,paras:Array.prototype.map.call(ps,function(p){var cs=getComputedStyle(p);return {box:bx(p),mb:cs.marginBottom,fs:cs.fontSize};}),credits:bx(cr),btn:bx(btn),btnText:btn.textContent.trim(),btnHref:btn.getAttribute('href'),btnBg:bcs.backgroundColor,btnColor:bcs.color,gapPtoCredits:Math.round(cb.top-lastP.bottom),gapCreditsToBtn:Math.round(bb.top-cb.bottom),introBottomVsBtn:Math.round(ib.bottom-bb.bottom),introVsViewerH:Math.round(ib.height-(vw?vw.getBoundingClientRect().height:0)),footerCtaInWhy:document.querySelectorAll('#kv-why .kv-section__cta').length};})(),
          docW:document.documentElement.clientWidth,
          bodyOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1?('BODY OVERFLOW '+document.documentElement.scrollWidth):'ok',
          faqAccordion:(function(){
            var groups=document.querySelectorAll('.kv-faq__group');
            if(!groups.length)return 'nf';
            var items=document.querySelectorAll('.kv-faq__item');
            var first=items[0];var firstPanel=first.querySelector('.kv-faq__a');
            var second=items[1];
            var o={groups:Array.prototype.map.call(groups,function(g){return (g.querySelector('.kv-faq__group-label')||{}).textContent+':'+g.querySelectorAll('.kv-faq__item').length;}),
              itemCount:items.length,
              closedPanelH:Math.round(firstPanel.getBoundingClientRect().height),
              closedRows:getComputedStyle(firstPanel).gridTemplateRows,
              answerTextInDom:(first.querySelector('.kv-faq__a-inner p').textContent||'').slice(0,40),
              labelPos:getComputedStyle(groups[0].querySelector('.kv-faq__group-label')).position,
              btnAria:first.querySelector('.kv-faq__q').getAttribute('aria-expanded')};
            Array.prototype.forEach.call(document.querySelectorAll('.kv-faq__a'),function(p){p.style.transition='none';});
            first.querySelector('.kv-faq__q').click();
            probeWaits.push(new Promise(function(res){setTimeout(function(){
              o.afterClick={openClass:first.classList.contains('is-open'),aria:first.querySelector('.kv-faq__q').getAttribute('aria-expanded'),rows:getComputedStyle(firstPanel).gridTemplateRows,innerH:Math.round(first.querySelector('.kv-faq__a-inner').getBoundingClientRect().height),panelH:Math.round(firstPanel.getBoundingClientRect().height)};
              second.querySelector('.kv-faq__q').click();
              setTimeout(function(){
                o.afterSecondClick={firstOpen:first.classList.contains('is-open'),firstH:Math.round(firstPanel.getBoundingClientRect().height),secondOpen:second.classList.contains('is-open'),secondH:Math.round(second.querySelector('.kv-faq__a').getBoundingClientRect().height)};
                second.querySelector('.kv-faq__q').click();
                setTimeout(function(){o.afterToggleOff={secondOpen:second.classList.contains('is-open'),secondH:Math.round(second.querySelector('.kv-faq__a').getBoundingClientRect().height)};res();},600);
              },600);
            },600);}));
            return o;})(),
          ctaCount:Array.prototype.map.call(document.querySelectorAll('main a'),function(a){var h=a.getAttribute('href')||'';if(h.indexOf('kv-cta')<0&&h.indexOf('tel')!==0&&!a.classList.contains('kv-layouts-trigger'))return null;var sc=a.closest('section');return (sc?sc.id:'?')+' :: '+a.textContent.trim().slice(0,40);}).filter(Boolean)
        };
      }catch(kvErr){out.kvAuditErr=String(kvErr);}
      Promise.all(probeWaits).then(function(){setTimeout(finishProbe,50);});
      }
      function realTicks(n){
        if(typeof gsap==='undefined'||n<=0){buildProbeOutput();return;}
        gsap.ticker.tick();
        if(typeof ScrollTrigger!=='undefined'){ScrollTrigger.update();}
        setTimeout(function(){realTicks(n-1);},16);
      }
      realTicks(120);
    },5000)</script></body>`;
    const patched = html.replace("</body>", probe);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(patched);
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      send(res, filePath);
      return;
    }
    res.writeHead(404);
    res.end("Not found: " + pathname);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}/`);
});
