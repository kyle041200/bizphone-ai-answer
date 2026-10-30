#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { parseArgs } from "node:util";
import { scan } from "./scan.mjs";
const { values: args } = parseArgs({
  options: {
    repo: { type: "string" },
    github: { type: "string" },
    ref: { type: "string" },
    repository: { type: "string" },
    url: { type: "string" },
    routes: { type: "string" },
    out: { type: "string" },
    chromium: { type: "string" },
    "allow-missing-images": { type: "boolean", default: false },
    "allow-missing-assets": { type: "boolean", default: false },
    "accept-interaction-loss": { type: "boolean", default: false },
    "report-only": { type: "boolean", default: false },
  },
});
let checkout;
if (args.github) {
  if (args.repo) throw Error("Choose --repo or --github");
  const { checkout: clone } = await import("./github.mjs");
  checkout = await clone(args.github, args.ref);
  args.repo = checkout.repo;
  args.repository = args.github;
}
if (!args.repo) throw Error("Use --repo PATH or --github owner/repository");
const { execFile } = await import("node:child_process");
const { promisify } = await import("node:util");
let sourceCommit = checkout?.commit || null;
if (!sourceCommit)
  try {
    const { stdout } = await promisify(execFile)("git", ["-C", args.repo, "rev-parse", "HEAD"]);
    if (/^[a-f0-9]{40}$/.test(stdout.trim())) sourceCommit = stdout.trim();
  } catch {}
const detected = await scan(args.repo);
const {analyze}=await import("./analyze.mjs");
const compatibility=await analyze(args.repo);
const reportDir=path.resolve(args.out||"./kghq-export");
await fs.mkdir(reportDir,{recursive:true});
compatibility.sourceCommit=sourceCommit;
compatibility.policy={missingStylesOrCSSAssets:args["allow-missing-assets"]?"explicitly accepted omissions; each is reported":"fail on unavailable CSS/font/background asset",missingImages:args["allow-missing-images"]?"explicitly accepted placeholders; all missing assets are reported":"fail on unavailable image",interactionLoss:args["accept-interaction-loss"]?"explicitly acknowledged static export; unsupported actions require WordPress integration":"not accepted"};
await fs.writeFile(path.join(reportDir,"compatibility.json"),JSON.stringify(compatibility,null,2));
if(args["report-only"]){console.log(JSON.stringify(compatibility,null,2));await checkout?.cleanup();process.exit(0);}
if(args.url&&compatibility.requiresInteractionAcknowledgment&&!args["accept-interaction-loss"]){await checkout?.cleanup();throw Error("Project contains dynamic/interactive features. Read compatibility.json first. Use --accept-interaction-loss only after reviewing required WordPress integrations; no bundle was created.");}
if (!args.url) {
  console.log(JSON.stringify(detected, null, 2));
  await checkout?.cleanup();
  process.exit(0);
}
if (!/^[\w.-]+\/[\w.-]+$/.test(args.repository || ""))
  throw Error("--repository owner/name is required");
const base = new URL(args.url);
if (!["http:", "https:"].includes(base.protocol)) throw Error("Invalid source URL");
const routes = args.routes ? args.routes.split(",") : detected.routes.map((r) => r.path);
for (const route of routes)
  if (
    !route.startsWith("/") ||
    route.startsWith("//") ||
    route.includes("..") ||
    route.includes("#") ||
    route.includes("?")
  )
    throw Error("Routes must be local absolute paths without query/fragment");
const { chromium } = await import("playwright");
const { createBlock, serialize, convertTree, validateContent } = await import("./blocks.mjs");
const { scopeCSS } = await import("./styles.mjs");
const browser = await chromium.launch({
  headless: true,
  executablePath: args.chromium || process.env.KGHQ_CHROMIUM || undefined,
  args: ["--no-sandbox"],
});
const assets = [];
const assetIndex = new Map();
const pages = [];
async function asset(buffer, mime, filename) {
  const id = crypto.createHash("sha256").update(buffer).digest("hex");
  if (!assetIndex.has(id)) {
    assets.push({
      id,
      mime,
      filename: `${id.slice(0, 16)}-${filename.replace(/[^\w.-]/g, "_")}`,
      data: buffer.toString("base64"),
    });
    assetIndex.set(id, true);
  }
  return `https://kghq.invalid/asset/${id}`;
}
try {
  for (const route of routes) {
    console.error(`Converting ${route}`);
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      locale: "en-US", timezoneId: "UTC", colorScheme: "light", reducedMotion: "reduce",
    });
    const warnings = [
      "React event-driven behavior is not imported; native Details toggles are preserved. SVG icons are rasterized to transparent PNG media. Internal source links retain original paths; review destination slugs before publishing.",
    ];
    const response = await page.goto(new URL(route, base).href, { waitUntil: "networkidle" });
    if (!response?.ok()) throw Error(`Route ${route}: HTTP ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const scope =
      "kghq-page-" +
      crypto
        .createHash("sha256")
        .update(args.repository + route)
        .digest("hex")
        .slice(0, 12);
    // Preserve static content; do not execute React or serialize event handlers inside WordPress.
    const inaccessible = await page.evaluate(
      () =>
        [...document.styleSheets].filter((sheet) => {
          try {
            void sheet.cssRules;
            return false;
          } catch {
            return true;
          }
        }).length,
    );
    if (inaccessible)
      warnings.push(
        inaccessible +
          " cross-origin stylesheets could not be read; export them as same-origin CSS before relying on font/style fidelity.",
      );
    if (await page.locator("picture,img[srcset]").count())
      warnings.push(
        "Responsive image sources use the desktop currentSrc in this MVP; inspect mobile art direction.",
      );
    const tree = await page.evaluate(() => {
      const skip = new Set(["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "TEMPLATE"]);
      let counter = 0;
      const escape = (s) =>
        s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
      function inline(el) {
        return [...el.childNodes]
          .map((n) => {
            if (n.nodeType === 3) return escape(n.textContent);
            if (n.nodeType !== 1 || skip.has(n.tagName)) return "";
            if (n.tagName === "BR") return "<br>";
            if (["SVG", "IMG"].includes(n.tagName.toUpperCase())) {
              n.dataset.kghqNode = "n" + counter++;
              return (
                '<img class="' +
                (n.getAttribute("class") || "").replaceAll('"', "&quot;") + " kghq-source-node kghq-source-svg kghq-" + n.dataset.kghqNode +
                '" src="https://kghq.invalid/icon/' +
                n.dataset.kghqNode +
                '" alt="">'
              );
            }
            if (["PATH", "CIRCLE"].includes(n.tagName.toUpperCase())) return "";
            if (!n.dataset.kghqNode) n.dataset.kghqNode = "n" + counter++;
            const tag = ["STRONG", "EM", "B", "I", "S", "CODE", "SPAN", "A", "SUP", "SUB"].includes(
              n.tagName,
            )
              ? n.tagName.toLowerCase()
              : "span";
            const href =
              tag === "a" && /^(https?:|mailto:|tel:|\/|#)/i.test(n.getAttribute("href") || "")
                ? ' href="' +
                  n.getAttribute("href").replaceAll("&", "&amp;").replaceAll('"', "&quot;") +
                  '"'
                : "";
            const inside =
              inline(n) || (tag === "span" && n.getAttribute("class") ? "&#8203;" : "");
            if (!inside) return "";
            return (
              "<" +
              tag +
              href +
              ' class="' +
              (n.getAttribute("class") || "").replaceAll('"', "&quot;") + " kghq-source-node kghq-" + n.dataset.kghqNode +
              '">' +
              inside +
              "</" +
              tag +
              ">"
            );
          })
          .join("");
      }
      function visit(el) {
        if (el.nodeType === 3) {
          const s = el.textContent.trim();
          return s ? { type: "text", html: escape(s), classes: "kghq-inline-text kghq-source-node" } : null;
        }
        if (el.nodeType !== 1 || skip.has(el.tagName)) return null;
        // Hidden responsive elements are retained, unlike display-only screenshot conversion.
        if (el.matches("[data-radix-popper-content-wrapper],#tanstack-devtools")) return null;
        el.dataset.kghqNode = "n" + counter++;
        const attrs = {
          tag: el.tagName.toLowerCase(),
          classes: (el.getAttribute("class") || "") + (el.hidden ? " kghq-source-hidden" : "") + (el.tagName === "BODY" ? " kghq-source-body" : "") + " kghq-source-node kghq-tag-" + el.tagName.toLowerCase() + " kghq-" + el.dataset.kghqNode,
          id: el.id,
          native: (() => {
            // Exact authored inline values can be represented by native controls.
            // Utility/media-derived values stay in responsive CSS, not frozen snapshots.
            const style = {}, typography = {}, color = {}, spacing = {}, border = {};
            for (const [css,key] of [["font-size","fontSize"],["font-family","fontFamily"],["font-weight","fontWeight"],["line-height","lineHeight"],["letter-spacing","letterSpacing"]]) if(el.style.getPropertyValue(css))typography[key]=el.style.getPropertyValue(css);
            if(el.style.color)color.text=el.style.color;
            if(el.style.backgroundColor)color.background=el.style.backgroundColor;
            if(/^(?:linear|radial|conic)-gradient/.test(el.style.backgroundImage))color.gradient=el.style.backgroundImage;
            for(const prop of ["padding","margin"]) {
              const sides={};for(const side of ["top","right","bottom","left"])if(el.style.getPropertyValue(prop+"-"+side))sides[side]=el.style.getPropertyValue(prop+"-"+side);
              if(Object.keys(sides).length)spacing[prop]=sides;
            }
            if(el.style.borderRadius)border.radius=el.style.borderRadius;
            for(const [key,value] of Object.entries({typography,color,spacing,border}))if(Object.keys(value).length)style[key]=value;
            const result=Object.keys(style).length?{style}:{};
            if(["P","H1","H2","H3","H4","H5","H6"].includes(el.tagName)&&el.style.textAlign)result.align=el.style.textAlign;
            return result;
          })(),
        };
        const children = () => [...el.childNodes].map(visit).filter(Boolean);
        // Accessible accordion/disclosure adapter: one controlling button and
        // its region become editable native Details, rather than visible hidden
        // answers or a dead JavaScript button. No page names or class names.
        const controls=el.querySelectorAll("button[aria-controls][aria-expanded]");
        if(controls.length===1){
          const control=controls[0],region=document.getElementById(control.getAttribute("aria-controls"));
          if(region&&region.parentElement===el&&!["BODY","HTML","MAIN","SECTION"].includes(el.tagName)&&!control.contains(region)){
            control.dataset.kghqNode="n"+counter++;
            const summaryClasses=(control.className||"")+" kghq-source-node kghq-"+control.dataset.kghqNode;
            const regionNode=visit(region);
            if(regionNode?.classes)regionNode.classes=regionNode.classes.replace(" kghq-source-hidden","");
            return {...attrs,type:"details",adaptedDisclosure:true,open:control.getAttribute("aria-expanded")==="true",summary:'<span class="'+summaryClasses.replaceAll('"',"&quot;")+'">'+inline(control)+'</span>',children:regionNode?[regionNode]:[]};
          }
        }
        if (/^H[1-6]$/.test(el.tagName))
          return { ...attrs, type: "heading", level: Number(el.tagName[1]), html: inline(el) };
        if(["STRONG","B","EM","I","CITE"].includes(el.tagName)) {
          const bold=["STRONG","B"].includes(el.tagName);
          return {...attrs,type:"text",html:`<${el.tagName.toLowerCase()} style="${bold?'font-weight':'font-style'}:inherit">${inline(el)}</${el.tagName.toLowerCase()}>`};
        }
        if (el.tagName === "IMG")
          return { ...attrs, classes:attrs.classes+(el.hasAttribute("srcset")?" kghq-authored-srcset":"")+(el.hasAttribute("loading")?" kghq-loading-"+el.getAttribute("loading"):""), type: "image", src: el.currentSrc || el.src, alt: el.alt };
        if (el.tagName.toUpperCase() === "SVG")
          return {
            ...attrs,
            classes: attrs.classes + " kghq-source-svg",
            type: "image",
            icon: el.dataset.kghqNode,
            alt: el.getAttribute("aria-label") || "Decorative icon",
          };
        if (
          el.tagName === "P" ||
          (["SPAN", "SMALL", "LABEL"].includes(el.tagName) && !el.querySelector("div,p,img,svg"))
        )
          return { ...attrs, type: "text", html: inline(el) };
        if ((el.tagName === "A" && !el.querySelector("div,img")) || el.tagName === "BUTTON")
          return {
            ...attrs,
            type: "button",
            href: el.getAttribute("href") || "#",
            target: el.target,
            html: inline(el),
          };
        if(el.tagName === "A") return {...attrs,type:"link-group",href:el.getAttribute("href")||"",target:el.target,children:children()};
        if (["UL", "OL"].includes(el.tagName) && !el.querySelector("li div,li p,li svg"))
          return {
            ...attrs,
            type: "list",
            ordered: el.tagName === "OL",
            items: [...el.children].map(li => ({html:inline(li),classes:(li.className||"")+" kghq-source-node kghq-tag-li"})),
          };
        if (el.tagName === "DETAILS") {
          const summary = el.querySelector(":scope > summary");
          if(summary)summary.dataset.kghqNode="n"+counter++;
          return {
            ...attrs,
            type: "details",
            open: el.open,
            summary: summary
              ? '<span class="' +
                (summary.getAttribute("class") || "").replaceAll('"', "&quot;") + " kghq-source-node kghq-" + summary.dataset.kghqNode +
                '">' +
                inline(summary) +
                "</span>"
              : "Details",
            children: [...el.childNodes]
              .filter((n) => n !== summary)
              .map(visit)
              .filter(Boolean),
          };
        }
        if (el.tagName === "HR") return { ...attrs, type: "separator" };
        if (
          ["BUTTON", "INPUT", "SELECT", "TEXTAREA", "FORM", "IFRAME", "VIDEO", "CANVAS"].includes(
            el.tagName,
          )
        )
          return {
            ...attrs,
            type: "unsupported",
            reason:
              el.tagName +
              " requires an accessible custom block or WordPress form integration; static content only.",
            children: el.tagName === "BUTTON" ? [{ type: "text", html: inline(el) }] : children(),
          };
        return { ...attrs, type: "group", children: children() };
      }
      return visit(document.body);
    });
    const sheets=await page.evaluate(()=>[...document.styleSheets].map(sheet=>{
      try{return{url:sheet.href||location.href,css:[...sheet.cssRules].map(r=>r.cssText).join("\n")};}
      catch{return{url:sheet.href||location.href,css:"",unreadable:true};}
    }));
    const postcss=(await import("postcss")).default;
    const valueParser=(await import("postcss-value-parser")).default;
    let css="";
    for(const sheet of sheets){
      if(sheet.unreadable){const url=new URL(sheet.url);const warning="Unreadable source stylesheet: "+url.origin+url.pathname+". Its fonts/styles are not certified by this export.";
        compatibility.renderedWarnings ||= [];compatibility.renderedWarnings.push({route,warning});await fs.writeFile(path.join(reportDir,"compatibility.json"),JSON.stringify(compatibility,null,2));
        if(!args["allow-missing-assets"])throw Error(warning+" Review compatibility.json and explicitly use --allow-missing-assets to accept this limitation.");warnings.push(warning);continue;}
      const parsed=postcss.parse(sheet.css);
      parsed.walkDecls(decl=>{
        const value=valueParser(decl.value);
        value.walk(node=>{if(node.type==="function"&&node.value.toLowerCase()==="url"){
          const target=node.nodes.find(n=>n.type==="word"||n.type==="string");
          if(target&&!target.value.startsWith("#"))try{target.value=new URL(target.value,sheet.url).href;}catch{}
        }});decl.value=value.toString();
      });
      css+=parsed.toString()+"\n";
    }
    css += await page.evaluate(() =>
      [...document.querySelectorAll("[data-kghq-node][style]")]
        .map((el) => ".kghq-" + el.dataset.kghqNode + "{" + el.getAttribute("style") + "}")
        .join("\n"),
    );
    if (!css.trim())
      throw Error("No readable compiled CSS; serve same-origin styles or provide CORS access.");
    // Fetch assets with browser request context; credentials never enter the bundle.
    async function fetchAsset(url) {
      const u = new URL(url, base);
      if (!["http:", "https:", "data:"].includes(u.protocol))
        throw Error("Unsupported asset protocol");
      const res = await page.request.get(u.href);
      if (!res.ok()) throw Error(`Asset HTTP ${res.status()}: ${u.pathname}`);
      const mime = (res.headers()["content-type"] || "").split(";")[0];
      return asset(await res.body(), mime, path.basename(u.pathname) || "asset");
    }
    const iconDefaults = [];
    async function captureIcon(key) {
      const el = page.locator(`[data-kghq-node="${key}"]`);
      const size=await el.evaluate(svg => ({width:svg.getAttribute("width"),height:svg.getAttribute("height")}));
      if(size.width && /^\d+(?:\.\d+)?$/.test(size.width))iconDefaults.push(`.kghq-${key}{width:${size.width}px;height:${size.height||size.width}px}`);
      if (await el.evaluate((e) => e.tagName.toUpperCase() === "IMG"))
        return fetchAsset(await el.evaluate((e) => e.currentSrc || e.src));
      const png = await el.evaluate(async (svg) => {
        const clone = svg.cloneNode(true);
        const originals = [svg, ...svg.querySelectorAll("*")];
        const copies = [clone, ...clone.querySelectorAll("*")];
        originals.forEach((node, i) => {
          const style = getComputedStyle(node);
          for (const property of [
            "fill",
            "stroke",
            "stroke-width",
            "stroke-linecap",
            "stroke-linejoin",
            "opacity",
            "fill-rule",
            "clip-rule",
            "color",
          ])
            copies[i].style.setProperty(property, style.getPropertyValue(property));
        });
        const box = svg.getBoundingClientRect();
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const width=box.width||svg.width?.baseVal.value||svg.viewBox?.baseVal.width||24;
        const height=box.height||svg.height?.baseVal.value||svg.viewBox?.baseVal.height||24;
        clone.setAttribute("width", width);
        clone.setAttribute("height", height);
        clone.style.width = width + "px";
        clone.style.height = height + "px";
        const xml = new XMLSerializer().serializeToString(clone);
        const image = new Image();
        image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(width * 2);
        canvas.height = Math.ceil(height * 2);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png").split(",")[1];
      });
      return asset(Buffer.from(png, "base64"), "image/png", "icon.png");
    }
    async function replaceInline(html) {
      for (const key of [
        ...new Set(
          [...html.matchAll(/https:\/\/kghq\.invalid\/icon\/(n[0-9]+)/g)].map((m) => m[1]),
        ),
      ]) {
        const url = await captureIcon(key);
        html = html.split("https://kghq.invalid/icon/" + key).join(url || "");
      }
      return html;
    }
    async function walk(n) {
      if (n.type === "image") {
        if (n.icon) {
          n.src = await captureIcon(n.icon);
          if (!n.src) {
            n.type = "group";
            n.children = [];
          }
          delete n.icon;
        } else {
          try { n.src = await fetchAsset(n.src); }
          catch (error) {
            if (!args["allow-missing-images"]) throw error;
            const pathname = (() => { try { return new URL(n.src, base).pathname; } catch { return "unknown"; } })();
            warnings.push("Missing source image " + pathname + ": a transparent placeholder was imported. Restore the original graphic manually; it was unavailable in the source checkout.");
            n.src = await asset(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=", "base64"), "image/png", "missing-source-image.png");
          }
        }
      }
      if (n.summary) n.summary = await replaceInline(n.summary);
      if (n.html) n.html = await replaceInline(n.html);
      if (n.items) n.items = await Promise.all(n.items.map(async item => typeof item === "string" ? replaceInline(item) : {...item,html:await replaceInline(item.html)}));
      for (const c of n.children || []) await walk(c);
    }
    await walk(tree);
    function linkedWarnings(n) {if(n.type==="link-group")warnings.push("Linked card/layout uses the reusable KGHQ Linked Layout block. Keep KGHQ Import Styles active for its visual editor controls; saved front-end markup is static and native child blocks remain editable.");for(const c of n.children||[])linkedWarnings(c);}
    linkedWarnings(tree);
    function countDisclosures(n){return (n.adaptedDisclosure?1:0)+(n.children||[]).reduce((count,c)=>count+countDisclosures(c),0);}
    const disclosures=countDisclosures(tree);
    if(disclosures)warnings.push(`${disclosures} accessible disclosure controls were converted to native editable Details blocks, preserving keyboard/open-close behavior without React.`);
    const buttonCount=await page.locator("button").count();
    if(buttonCount)warnings.push(`${buttonCount} JavaScript buttons are preserved as editable native buttons, but source event handlers are not imported. Configure WordPress actions before publishing.`);
    function nativeVariables(n) {
      if(n.native)n.native=JSON.parse(JSON.stringify(n.native).replace(/var\((--[A-Za-z_][\w-]*)/g,(_,name)=>"var(--"+scope+"-"+name.slice(2)));
      for(const c of n.children||[])nativeVariables(c);
    }
    nativeVariables(tree);
    // Resolve original background images and fonts; remote CSS imports are explicitly not silently accepted.
    if (/@import\b/.test(css))
      warnings.push("External CSS @import requires manual font/style review; imports are removed.");
    css = css.replace(/@import[^;]+;/g, "");
    const urls = [
      ...new Set([...css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map((m) => m[1])),
    ];
    for (const url of urls) {
      try {
        const target = await fetchAsset(url);
        css = css.split(url).join(target);
      } catch (error) {
        if(!args["allow-missing-assets"])throw Error("CSS/font/background asset unavailable. No replacement is automatic; review the source and explicitly use --allow-missing-assets if acceptable.");
        warnings.push(
          "A CSS background/font asset could not be preserved; its URL was removed. Check source asset availability.",
        );
        css = css.split(url).join("data:,");
      }
    }
    compatibility.design.renderedBreakpoints ||= [];
    postcss.parse(css).walkAtRules("media",rule=>{if(!compatibility.design.renderedBreakpoints.includes(rule.params))compatibility.design.renderedBreakpoints.push(rule.params);});
    const buttonDefaults=await page.evaluate(()=>[...document.querySelectorAll('a[data-kghq-node],button[data-kghq-node]')].map(el=>`:where(.kghq-${el.dataset.kghqNode}){background-color:${getComputedStyle(el).backgroundColor}}`).join('\n'));
    // Native Buttons use a DIV RichText surface in the editor. Its WordPress
    // default paint must not leak through. Authored rules follow and override
    // these zero-specificity source defaults, including responsive/hover rules.
    css = buttonDefaults + "\n" + iconDefaults.join("\n") + "\n" + css;
    const rootFontSize=await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize);
    const sourceRoot=await page.evaluate(()=>{
      const html=document.documentElement,body=document.body,a=getComputedStyle(html),b=getComputedStyle(body);
      const line=el=>el.computedStyleMap?.().get("line-height")?.toString()||getComputedStyle(el).lineHeight;
      const transparent=c=>c==='rgba(0, 0, 0, 0)'||c==='transparent';
      const canvasColor=!transparent(a.backgroundColor)?a.backgroundColor:!transparent(b.backgroundColor)?b.backgroundColor:'rgb(255, 255, 255)';
      return {canvasColor,classes:html.className,id:html.id,html:`font-family:${a.fontFamily};font-size:${a.fontSize};line-height:${line(html)};color:${a.color}`,body:`margin:${b.margin};padding:${b.padding};font-family:${b.fontFamily};font-size:${b.fontSize};line-height:${line(body)};color:${b.color}`};
    });
    css=`:root{${sourceRoot.html}}body{${sourceRoot.body}}\n`+css;
    css = await scopeCSS(css, scope, {rootFontSize,rootClasses:sourceRoot.classes.split(/\s+/).filter(Boolean)});
    // Only our opt-in canvas document receives the original viewport paint.
    // Overflow outside the source body must not reveal a theme's white background.
    css+=`\nbody.kghq-import-canvas:has(.${scope}){background-color:${sourceRoot.canvasColor}}`;
    const ns=Array(6).fill(`.${scope}`).join("");
    // A source-only cascade boundary prevents theme defaults leaking into native
    // content. Source declarations follow it; user-edited inline block styles win.
    css = `${ns},${ns} :where(.kghq-source-node){all:revert;box-sizing:border-box}\n` +
      `${ns} .kghq-tag-span,${ns} .kghq-tag-label,${ns} .kghq-tag-small,${ns} .kghq-tag-strong,${ns} .kghq-tag-b,${ns} .kghq-tag-em,${ns} .kghq-tag-i,${ns} .kghq-tag-cite{display:inline}${ns} .kghq-tag-strong,${ns} .kghq-tag-b{font-weight:bolder}${ns} .kghq-tag-em,${ns} .kghq-tag-i,${ns} .kghq-tag-cite{font-style:italic}\n` + css;
    const typography = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        lineHeight: document.body.computedStyleMap?.().get("line-height")?.toString() || s.lineHeight,
        color: s.color,
        loadedFaces: [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
      };
    });
    let bodyFont = typography.fontFamily;
    for (const face of typography.loadedFaces) {
      const family = face.family.replace(/^['"]|['"]$/g, "");
      if (css.includes(scope + "-" + family))
        bodyFont = bodyFont
          .split(",")
          .map((part) =>
            part.trim().replace(/^['"]|['"]$/g, "") === family
              ? '"' + scope + "-" + family + '"'
              : part,
          )
          .join(",");
    }

    css += `\n${ns} .kghq-inline-text{display:contents}${ns} .kghq-source-hidden{display:none}${ns} .wp-block-details>summary{list-style:none}${ns} .wp-block-details>summary::-webkit-details-marker{display:none}\n`;
    // Native wrappers are normalized by the independent styling companion.
    // Do not append source-overriding button/image/spacing resets here.
    // Move original utility classes from native image/button wrappers to their semantic leaf elements via scoped selectors.
    const extra = [];
    function leaf(n) {
      if (n.type === "image" || n.type === "button")
        extra.push({
          className: n.classes,
          tag: n.type === "image" ? "img" : ".wp-block-button__link",
        });
      for (const c of n.children || []) leaf(c);
    }
    leaf(tree);
    // Rebuild selectors so utility styles reach native image and button leaf nodes.
    const { leafCSS } = await import("./styles.mjs");
    css = await leafCSS(css, scope, extra);
    const blocks = convertTree(tree, warnings);
    let content = serialize([
      createBlock(
        "core/group",
        { className: scope + " kghq-import-root " + sourceRoot.classes, anchor: sourceRoot.id || undefined, layout: { type: "default" } },
        blocks,
      ),
    ]);
    const { normalizeClasses } = await import("./normalize-classes.mjs");
    ({content,css}=await normalizeClasses(content,css));
    const invalid = validateContent(content);
    if (invalid.length) throw Error("Invalid saved blocks: " + invalid.join(","));
    const title = await page.title();
    const outDir = path.resolve(args.out || "./kghq-export");
    await fs.mkdir(outDir, { recursive: true });
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.screenshot({
        path: path.join(outDir, `${scope}-${width}-source.png`),
        fullPage: true,
      });
    }
    compatibility.renderedPages ||= [];
    compatibility.renderedPages.push({route,title,typography,warnings:[...new Set(warnings)],nativeBlocksValid:invalid.length===0,reviewRequired:warnings.length>0});
    await fs.writeFile(path.join(reportDir,"compatibility.json"),JSON.stringify(compatibility,null,2));
    pages.push({
      route,
      title,
      scope,
      content,
      css,
      typography,
      warnings: [...new Set(warnings)],
      sourceHash: crypto
        .createHash("sha256")
        .update(content + css)
        .digest("hex"),
    });
    await page.close();
  }
  const out = path.resolve(args.out || "./kghq-export");
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(
    path.join(out, "bundle.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        repository: args.repository,
        sourceCommit,
        createdAt: new Date().toISOString(),
        pages,
        assets,
        scan: detected,
        compatibility,
      },
      null,
      2,
    ),
  );
  console.error(`Exported ${pages.length} pages, ${assets.length} assets to ${out}`);
} finally {
  await browser.close();
  await checkout?.cleanup();
}
