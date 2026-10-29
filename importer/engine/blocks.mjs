import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (e) => {
  if (e.type !== "css parsing") console.error(e.message);
});
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
  virtualConsole,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "HTMLIFrameElement",
  "Element",
  "Node",
  "MutationObserver",
  "DOMParser",
  "File",
  "Blob",
  "navigator",
  "getComputedStyle",
]) {
  if (dom.window[key])
    Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true });
}
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
window.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const { createBlock, serialize, parse, validateBlock, registerBlockType } = require("@wordpress/blocks");
const { registerCoreBlocks } = require("@wordpress/block-library");
registerCoreBlocks();
const { createElement } = require("@wordpress/element");
const { useBlockProps, InnerBlocks } = require("@wordpress/block-editor");
registerBlockType("kghq/link-group", {
 apiVersion:3,title:"KGHQ Linked Layout",category:"design",
 attributes:{url:{type:"string",default:""},linkTarget:{type:"string",default:""},rel:{type:"string",default:""}},
 supports:{html:false,anchor:true,color:{text:true,background:true,gradients:true},spacing:{padding:true,margin:true,blockGap:true},typography:{fontSize:true,lineHeight:true},__experimentalBorder:{radius:true}},
 save:({attributes})=>createElement("a",useBlockProps.save({href:attributes.url||undefined,target:attributes.linkTarget||undefined,rel:attributes.rel||undefined}),createElement(InnerBlocks.Content))
});
export { createBlock, serialize, parse, validateBlock };
export function convertTree(node, warnings = []) {
  const attrs = { className: node.classes || undefined, anchor: node.id || undefined, ...(node.native || {}) };
  const children = () => node.children.flatMap((n) => convertTree(n, warnings));
  if (node.type === "heading")
    return [createBlock("core/heading", { ...attrs, level: node.level, content: node.html })];
  if (node.type === "text")
    return [createBlock("core/paragraph", { ...attrs, content: node.html })];
  if (node.type === "image")
    return [
      createBlock("core/image", {
        ...attrs,
        url: node.src,
        alt: node.alt || "",
        linkDestination: "none",
      }),
    ];
  if (node.type === "button")
    return [
      createBlock("core/buttons", { className: "kghq-button-host" }, [
        createBlock("core/button", {
          ...attrs,
          tagName: node.tag === "button" ? "button" : "a",
          text: node.html,
          url: node.href,
          linkTarget: node.target || undefined,
          rel: node.target === "_blank" ? "noopener noreferrer" : undefined,
        }),
      ]),
    ];
  if (node.type === "link-group")return [createBlock("kghq/link-group",{...attrs,url:node.href,linkTarget:node.target||"",rel:node.target==="_blank"?"noopener noreferrer":""},children())];
  if (node.type === "list")
    return [
      createBlock(
        "core/list",
        { ...attrs, ordered: node.ordered },
        node.items.map((item) => createBlock("core/list-item", typeof item === "string" ? {content:item} : {content:item.html,className:item.classes})),
      ),
    ];
  if (node.type === "details")
    return [
      createBlock(
        "core/details",
        { ...attrs, summary: node.summary, showContent: node.open || false },
        children(),
      ),
    ];
  if (node.type === "separator") return [createBlock("core/separator", attrs)];
  if (node.type === "unsupported") {
    warnings.push(node.reason);
    return node.children?.length ? children() : [];
  }
  // Preserve grid/flex DOM relationships. Counting utility classes is not enough
  // to map arbitrary grids to core Columns (which adds wrappers and flex sizing).
  return [
    createBlock(
      "core/group",
      {
        ...attrs,
        tagName: ["section", "header", "footer", "main", "aside", "article", "nav", "figure", "figcaption", "blockquote"].includes(
          node.tag,
        )
          ? node.tag
          : "div",
        layout: { type: "default" },
      },
      children(),
    ),
  ];
}
export function validateContent(content) {
  const blocks = parse(content);
  const failures = [];
  function walk(block) {
    if (!validateBlock(block)[0]) failures.push(block.name);
    block.innerBlocks.forEach(walk);
  }
  blocks.forEach(walk);
  return failures;
}
