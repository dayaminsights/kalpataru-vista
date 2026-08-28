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
      out.requestedScrollY=${scrollY};
      out.actualScrollY=window.scrollY;
      out.docScrollHeight=document.documentElement.scrollHeight;
      var comp=document.querySelector('.hero_composite__3blHB');
      var logo=document.querySelector('.hero_logo__FxgRj');
      if(comp){var s=getComputedStyle(comp);out.compositeMask=(s.maskImage||s.webkitMaskImage||'').slice(0,120);out.compositeMaskSize=s.maskSize||s.webkitMaskSize;out.compositeOpacity=s.opacity;out.compositeDisplay=s.display;out.compositeBg=s.backgroundColor;
        var nestedHouse=comp.querySelector('.hero_house__aJy7p');
        out.nestedHouseDisplay=nestedHouse?getComputedStyle(nestedHouse).display:'no nested house';}
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
      ['kv-video','kv-overview','kv-benefits','kv-amenities','kv-cta'].forEach(function(id){
        var el=document.getElementById(id);
        if(!el){out.sections[id]='NOT FOUND';return;}
        var r=el.getBoundingClientRect();
        out.sections[id]=getComputedStyle(el).display+' height='+Math.round(r.height);
      });
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
      } else {
        out.amenitiesAnim.rootFound=false;
      }
      document.title='PROBE::'+JSON.stringify(out);
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
