import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import valueParser from "postcss-value-parser";
export async function scopeCSS(css, scope, options = {}) {
  const root = postcss.parse(css);
  const variable = name => "--" + scope + "-" + name.slice(2);
  // Rename property definitions and var() references, never selector class names,
  // URLs or literal strings. Tailwind arbitrary utilities can contain --tokens.
  root.walkDecls(decl => {
    if (decl.prop.startsWith("--")) decl.prop = variable(decl.prop);
    const parsed=valueParser(decl.value);
    parsed.walk(node => {
      if(node.type === "function" && node.value === "var") {
        const first=node.nodes.find(n=>n.type === "word");
        if(first?.value.startsWith("--"))first.value=variable(first.value);
      }
      if(options.rootFontSize && node.type === "word" && /^-?(?:\d*\.)?\d+rem$/.test(node.value) && !(decl.parent.type === "atrule" && decl.parent.name === "property")) {
        node.value = `calc(${parseFloat(node.value)} * var(--${scope}-root-rem))`;
      }
    });
    decl.value=parsed.toString();
  });
  root.walkAtRules("property", rule => { if(rule.params.startsWith("--"))rule.params=variable(rule.params); });
  const families = new Map();
  root.walkAtRules("font-face", (rule) =>
    rule.walkDecls("font-family", (decl) => {
      const family = decl.value.replace(/^['"]|['"]$/g, "");
      families.set(family, scope + "-" + family);
    }),
  );
  root.walkDecls((decl) => {
    if (
      decl.prop === "font-family" ||
      (decl.prop.startsWith("--") && /font|family|typeface|typography/.test(decl.prop))
    )
      decl.value = decl.value
        .split(",")
        .map((part) => {
          const family = part.trim().replace(/^['"]|['"]$/g, "");
          return families.has(family) ? '"' + families.get(family) + '"' : part;
        })
        .join(",");
  });
  // Theme CSS is usually unlayered; export Tailwind layers in source order at the same cascade level.
  root.walkAtRules("layer", (rule) => {
    if (rule.nodes) rule.replaceWith(...rule.nodes);
    else rule.remove();
  });
  const keyframes = new Map();
  root.walkAtRules((rule) => {
    if (/keyframes$/.test(rule.name)) {
      const name = rule.params;
      keyframes.set(name, scope + "-" + name);
      rule.params = scope + "-" + name;
    }
  });
  root.walkDecls((decl) => {
    if (/^animation(?:-name)?$/.test(decl.prop))
      for (const [name, scoped] of keyframes)
        decl.value = decl.value.replace(
          new RegExp("(?<![\\w-])" + name + "(?![\\w-])", "g"),
          scoped,
        );
  });
  root.walkAtRules((rule) => {
    if (["import", "charset"].includes(rule.name)) rule.remove();
  });
  root.walkRules((rule) => {
    if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
    rule.selector = selectorParser(selectors=>selectors.walkTags(node=>{
      if(node.value === "svg")node.replaceWith(selectorParser().astSync(":is(svg,img.kghq-source-svg)").first.first.clone());
    })).processSync(rule.selector);
    let nested = false;
    selectorParser((selectors) =>
      selectors.walkNesting(() => {
        nested = true;
      }),
    ).processSync(rule.selector);
    if (nested) return;
    rule.selector = selectorParser((selectors) => {
      const roots=new Set(options.rootClasses||[]),extra=[];
      selectors.each(selector=>{
        const head=[];for(const node of selector.nodes){if(node.type==="combinator")break;head.push(node);}
        if(head.some(n=>n.type==="class"&&roots.has(n.value))&&!head.some(n=>n.type==="tag")){
          const clone=selector.clone();clone.prepend(selectorParser.className({value:scope}));extra.push(clone);
        }
      });
      for(const selector of extra)selectors.append(selector);
      selectors.each((selector) => {
        let foundRoot = selector.nodes.some(node=>node.type==="class"&&node.value===scope);
        selector.walk((node) => {
          if ((node.type === "pseudo" && node.value === ":root") || (node.type === "tag" && node.value === "html")) {
            node.replaceWith(selectorParser.className({ value: scope }));foundRoot = true;
          } else if(node.type === "tag" && node.value === "body") {
            node.replaceWith(selectorParser.className({value:"kghq-source-body"}));
          }
        });
        if (!foundRoot) {
          selector.prepend(selectorParser.combinator({ value: " " }));
          selector.prepend(selectorParser.className({ value: scope }));
        }
      });
    }).processSync(rule.selector);
    rule.selector = selectorParser(selectors => { const nodes=[];selectors.walkClasses(node=>{if(node.value===scope)nodes.push(node);});for(const node of nodes){node.parent.insertAfter(node,selectorParser.className({value:scope}));node.parent.insertAfter(node,selectorParser.className({value:scope}));} }).processSync(rule.selector);
  });
  return (options.rootFontSize ? `.${scope}{--${scope}-root-rem:${options.rootFontSize}}\n` : "") + root.toString();
}
export async function leafCSS(css, scope, leaves) {
  const root = postcss.parse(css);
  const classes = new Map();
  for (const leaf of leaves)
    for (const name of leaf.className.split(/\s+/).filter(Boolean)) {
      if (!classes.has(name)) classes.set(name, new Set());
      classes.get(name).add(leaf.tag);
    }
  root.walkRules((rule) => {
    if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
    if (rule.selector.includes("wp-block-")) return;
    let nested = false;
    selectorParser((selectors) =>
      selectors.walkNesting(() => {
        nested = true;
      }),
    ).processSync(rule.selector);
    if (nested) return;
    const additions = [];
    selectorParser((selectors) =>
      selectors.each((sel) => {
        const tail = [];
        for (let i = sel.nodes.length - 1; i >= 0 && sel.nodes[i].type !== "combinator"; i--)
          tail.push(sel.nodes[i]);
        const targets = new Set();
        for (const n of tail)
          if (n.type === "class" && classes.has(n.value))
            for (const tag of classes.get(n.value)) targets.add(tag);
        for (const tag of targets) {
          const s = sel.clone();
          const pseudos = [];
          while (s.last?.type === "pseudo") pseudos.unshift(s.last.remove());
          // Restrict leaf promotion to real native wrappers. A utility like mt-8
          // can also occur on a parent Group; copying that rule to its child
          // button would double the source margin.
          s.append(selectorParser().astSync(":is(figure.wp-block-image,.wp-block-button)").first.first.clone());
          s.append(selectorParser.combinator({ value: " > " }));
          s.append(
            tag === "img"
              ? selectorParser.tag({ value: "img" })
              : selectorParser.className({ value: "wp-block-button__link" }),
          );
          for (const p of pseudos) s.append(p);
          additions.push(s.toString());
        }
      }),
    ).processSync(rule.selector);
    if (additions.length) rule.selector += "," + additions.join(",");
  });
  return root.toString();
}
