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
      window.scrollTo(0, ${scrollY});
      setTimeout(function(){
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
      ['kv-overview','kv-benefits','kv-amenities','kv-cta'].forEach(function(id){
        var el=document.getElementById(id);
        if(!el){out.sections[id]='NOT FOUND';return;}
        var r=el.getBoundingClientRect();
        out.sections[id]=getComputedStyle(el).display+' height='+Math.round(r.height);
      });
      var rera=document.querySelector('.kv-rera');
      out.sections['kv-rera']=rera?'found':'NOT FOUND';
      var navOverview=document.querySelector('a[href="#kv-overview"]');
      out.sections['nav-overview-link']=navOverview?'found':'NOT FOUND';
      document.title='PROBE::'+JSON.stringify(out);
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
