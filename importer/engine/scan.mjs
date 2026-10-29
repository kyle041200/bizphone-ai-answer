import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
export async function scan(repo) {
  const root = path.resolve(repo);
  const routes = [];
  const warnings = [];
  const {projectFiles}=await import("./files.mjs");
  for(const file of await projectFiles(root)) {
    if(/\.[jt]sx?$/.test(file)) {
        const text = await fs.readFile(file, "utf8");
        const ast = ts.createSourceFile(
          file,
          text,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        );
        function visit(node) {
          if (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === "createFileRoute" &&
            ts.isStringLiteral(node.arguments[0])
          ) {
            const route = node.arguments[0].text.replace(/_(?=\/|$)/g, "");
            if (route.includes("$"))
              warnings.push({
                route,
                file: path.relative(root, file),
                reason: "Dynamic route requires explicit concrete URLs via --routes.",
              });
            else
              routes.push({
                path: route,
                title: route === "/" ? "Home" : route.slice(1).replaceAll("-", " "),
                file: path.relative(root, file),
              });
          }
          ts.forEachChild(node, visit);
        }
        visit(ast);
        // Resolve literal React Router routes, including nested layouts, without evaluating source.
        const literal = (n) => n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
        const add = (value, prefix = "", index = false) => {
          const full = index ? (prefix || "/") : value?.startsWith("/") ? value : [prefix, value].filter(Boolean).join("/");
          const route = "/" + (full || "").split("/").filter(Boolean).join("/");
          if (!/^\/(?!\/)[A-Za-z0-9/_-]*$/.test(route)) {
            warnings.push({file:path.relative(root,file),reason:"Dynamic, wildcard or unsupported route omitted: " + route});
            return null;
          }
          routes.push({path:route,title:route === "/" ? "Home" : route.split("/").filter(Boolean).at(-1).replaceAll("-"," "),file:path.relative(root,file)});
          return route;
        };
        function jsxInfo(node) {
          const el = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
          if (!el || el.tagName.getText(ast) !== "Route") return null;
          const attrs = el.attributes.properties;
          const attr = name => attrs.find(p => ts.isJsxAttribute(p) && p.name.getText(ast) === name);
          const p = attr("path");
          const value = p ? literal(ts.isJsxExpression(p.initializer) ? p.initializer.expression : p.initializer) : null;
          return {value,index:!!attr("index"),unknown:!!p && value === null};
        }
        function prefixFor(node) {
          let p=node.parent;
          while(p) { const info=jsxInfo(p); if(info) { const base=prefixFor(p);return info.value?.startsWith("/") ? info.value : [base,info.value].filter(Boolean).join("/"); } p=p.parent; }
          return "";
        }
        function objects(array,prefix="") {
          if(!array || !ts.isArrayLiteralExpression(array)) {warnings.push({file:path.relative(root,file),reason:"Computed route arrays require a project adapter."});return;}
          for(const item of array.elements) {
            if(!ts.isObjectLiteralExpression(item))continue;
            const prop=name=>item.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(ast).replace(/["']/g,"")===name)?.initializer;
            const value=literal(prop("path")),index=prop("index")?.kind===ts.SyntaxKind.TrueKeyword;
            const next=value!==null||index ? add(value,prefix,index) : prefix;
            const children=prop("children");if(children && next!==null)objects(children,next);
          }
        }
        function router(node) {
          const info=jsxInfo(node);
          if(info && (info.value!==null||info.index)) add(info.value,prefixFor(node),info.index);
          if(info?.unknown)warnings.push({file:path.relative(root,file),reason:"Computed JSX route path requires a project adapter."});
          if(ts.isCallExpression(node)&&["createBrowserRouter","useRoutes"].includes(node.expression.getText(ast)))objects(node.arguments[0]);
          ts.forEachChild(node,router);
        }
        router(ast);
    }
  }
  return {
    schemaVersion: 1,
    routes: [...new Map(routes.map((r) => [r.path, r])).values()].sort((a, b) =>
      a.path.localeCompare(b.path),
    ),
    warnings,
  };
}
