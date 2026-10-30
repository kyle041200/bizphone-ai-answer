import { test } from "node:test";
import assert from "node:assert/strict";
import { scan } from "./scan.mjs";
import { scopeCSS, leafCSS } from "./styles.mjs";
import { checkout } from "./github.mjs";
import { convertTree, serialize, validateContent } from "./blocks.mjs";
test("AST scanner detects nested JSX, object routes and TanStack without site-specific adapters", async () => {
  const fs=await import("node:fs/promises"),os=await import("node:os"),path=await import("node:path");
  const repo=await fs.mkdtemp(path.join(os.tmpdir(),"kghq-scan-test-"));
  try {
    await fs.writeFile(path.join(repo,"App.tsx"),`const router=createBrowserRouter([{path:"/docs",children:[{index:true},{path:"start"},{path:":slug"}]}]);const ui=<Routes><Route path="/"><Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="users/:id"/></Route></Routes>;const t=createFileRoute("/pricing")({});`);
    const result=await scan(repo);
    assert.deepEqual(result.routes.map(r=>r.path),["/","/about","/docs","/docs/start","/pricing"]);
    assert.ok(result.warnings.some(w=>w.reason.includes("Dynamic")));
  } finally {await fs.rm(repo,{recursive:true,force:true});}
});
test("scoping contains reset, root variables, media selectors, hover, layers, and keyframes", async () => {
  const css = await scopeCSS(
    "@layer utilities{.red:hover{color:red}} :root{--color:red} @media(max-width:600px){.a{display:none}} @keyframes spin{to{transform:rotate(1turn)}} .animate{animation:spin 1s}",
    "kghq-page-123456abcdef",
  );
  assert.match(css, /(?:\.kghq-page-123456abcdef){6} \.red:hover/);
  assert.match(css, /(?:\.kghq-page-123456abcdef){6}\{--kghq-page-123456abcdef-color/);
  assert.match(css, /(?:\.kghq-page-123456abcdef){6} \.a/);
  assert.match(css, /@keyframes kghq-page-123456abcdef-spin/);
  assert.doesNotMatch(css, /@layer/);
  assert.doesNotMatch(css, /\.kghq-page-123456abcdef to/);
});
test("native wrappers receive image and button utility styles", async () => {
  const css = await leafCSS(".kghq-page-x .w-full{width:100%}", "kghq-page-x", [
    { className: "w-full", tag: "img" },
  ]);
  assert.match(css, /\.w-full:is\(figure\.wp-block-image,\.wp-block-button\) > img/);
});
test("GitHub arguments reject command/options injection before network", async () => {
  await assert.rejects(checkout("foo;bar/repo"));
  await assert.rejects(checkout("foo/bar", "--upload-pack=evil"));
});
test("canonical native blocks survive parse/save without recovery", () => {
  const tree = {
    type: "group",
    classes: "grid md:grid-cols-2",
    children: [
      { type: "heading", classes: "title", level: 2, html: "Editable <strong>heading</strong>" },
      { type: "button", classes: "btn", html: "Read more", href: "/about" },
    ],
  };
  const blocks = convertTree(tree);
  assert.equal(blocks[0].name, "core/group");
  assert.equal(blocks[0].innerBlocks.length, 2);
  const content = serialize(blocks);
  assert.deepEqual(validateContent(content), []);
  assert.doesNotMatch(content, /wp:html|iframe|<script/);
});
test("native Details preserves editable summary, inline icons, and child content", () => {
  const blocks = convertTree({
    type: "details",
    classes: "faq",
    open: false,
    summary: 'Question <img class="size-4" src="https://example.com/icon.png" alt="">',
    children: [{ type: "text", html: "Editable answer" }],
  });
  const content = serialize(blocks);
  assert.equal(blocks[0].name, "core/details");
  assert.deepEqual(validateContent(content), []);
  assert.match(content, /<details/);
});
test("escaped ampersands in utility class names do not bypass selector scoping", async () => {
  const css = await scopeCSS(".\\[\\&\\>svg\\]\\:size-4>svg{width:1rem}", "kghq-page-123456abcdef");
  assert.match(css, /^(?:\.kghq-page-123456abcdef){6} /);
});
test("font-face names and font family variables are namespaced together", async () => {
  const css = await scopeCSS(
    '@font-face{font-family:"Manrope";src:url(font.woff2)}:root{--font-body:Manrope,sans-serif}.body{font-family:var(--font-body)}',
    "kghq-page-123456abcdef",
  );
  assert.match(css, /font-family:"kghq-page-123456abcdef-Manrope"/);
  assert.match(
    css,
    /--kghq-page-123456abcdef-font-body:"kghq-page-123456abcdef-Manrope",sans-serif/,
  );
});
test("zero-width content preserves decorative inline spans without block recovery", () => {
  const content = serialize([
    convertTree({ type: "text", html: '<span class="h-px w-8">&#8203;</span>Label' })[0],
  ]);
  assert.deepEqual(validateContent(content), []);
  assert.match(content, /h-px w-8/);
});
test('custom property scoping does not rename arbitrary utility class tokens or asset URLs',async()=>{
 const css=await scopeCSS('.bg-\\[var\\(--brand\\)\\]{background:var(--brand);background-image:url("/--original.png")} :root{--brand:red} @property --brand{syntax:"<color>";inherits:true;initial-value:red}','kghq-page-123456abcdef');
 assert.match(css,/bg-\\\[var\\\(--brand\\\)\\\]/);
 assert.match(css,/var\(--kghq-page-123456abcdef-brand\)/);
 assert.match(css,/\/--original.png/);
 assert.match(css,/@property --kghq-page-123456abcdef-brand/);
});
test('source rem units retain project root size without changing media breakpoint semantics',async()=>{
 const css=await scopeCSS('@media(min-width:48rem){.title{font-size:2rem;padding:1rem}}','kghq-page-123456abcdef',{rootFontSize:'20px'});
 assert.match(css,/--kghq-page-123456abcdef-root-rem:20px/);
 assert.match(css,/min-width:48rem/);
 assert.match(css,/font-size:calc\(2 \* var\(--kghq-page-123456abcdef-root-rem\)\)/);
});
test('native static buttons, authored inline controls and linked native children remain canonical',()=>{
 const buttons=convertTree({type:'button',tag:'button',classes:'outline kghq-source-node',html:'Inspect',native:{style:{spacing:{padding:{top:'12px'}},color:{background:'#123456'}}}});
 assert.equal(buttons[0].innerBlocks[0].attributes.tagName,'button');
 const link=convertTree({type:'link-group',classes:'grid',href:'/destination',children:[{type:'heading',level:2,html:'Editable title'},{type:'text',html:'Editable body'}]});
 assert.equal(link[0].name,'kghq/link-group');assert.deepEqual(validateContent(serialize([...buttons,...link])),[]);
 assert.doesNotMatch(serialize(link),/wp:html|iframe/);
});
