
module.exports = function(babel){
	let t = babel.types;
	return {
		pre: file => {
			this.file = file;
			this.active = ~file.ast.comments.map(x => x.value.trim()).indexOf("@mobxtract");
			if(!this.active)
				return;
			file.path.get("body")[0].insertBefore(
				t.variableDeclaration(
					"const",
					[t.variableDeclarator(
						this.observer = file.path.scope.generateUidIdentifier("observer"),
						this.observer2 = file.path.scope.generateUidIdentifier("observer"),
					)],
				),
			);
			file.path.get("body")[0].insertBefore(
				t.importDeclaration(
					[t.importSpecifier(
						this.observer2,
						t.identifier("observer"),
					)],
					t.stringLiteral("mobx-react"),
				),
			);
			file.path.traverse({
				JSXExpressionContainer: path => {
					if(!this.active || path.node.expression.type !== "JSXElement")
						return;
					let Xtraction = path.scope.generateUidIdentifier("Xtracted" + path.node.expression.openingElement.name.name);
					path.replaceWith(t.jSXExpressionContainer(xtraction(t, Xtraction, this.observer, path.node.expression)));
				},
				CallExpression: path => {
					let { node } = path;
					let r;
					if(
						!this.active ||
          node.callee.name !== "mobxtract" ||
          node.arguments.length !== 1 ||
          !(node.arguments[0].type === "JSXElement" || (
          	node.arguments[0].type === "ArrowFunctionExpression" &&
            node.arguments[0].body.type === "BlockStatement" &&
            (r = node.arguments[0].body.body.slice().reverse()[0]).type === "ReturnStatement" &&
            r.argument.type === "JSXElement"
          ))
					)
						return;
					let el = r ? r.argument : node.arguments[0];
					let func = r && node.arguments[0];
					let Xtraction = path.scope.generateUidIdentifier("Xtracted" + el.openingElement.name.name);
					path.replaceWith(xtraction(t, Xtraction, this.observer, func ? t.callExpression(func, [Xtraction]) : el, el));
				},
			}, this);
		},
	}
}

function xtraction(t, Xtraction, observer, expression, el = expression){
	let keyAttr = el.openingElement.attributes.find(a => a.name.name === "key");
	return t.callExpression(
		t.arrowFunctionExpression(
			[],
			t.blockStatement([
				t.variableDeclaration(
					"const",
					[t.variableDeclarator(
						Xtraction,
						t.callExpression(
							observer,
							[t.arrowFunctionExpression(
								[],
								expression,
							)]
						)
					)]
				),
				t.returnStatement(
					t.jSXElement(
						t.jSXOpeningElement(
							t.jSXIdentifier(Xtraction.name),
							keyAttr ? [keyAttr] : [],
							true,
						),
						null,
						[],
						true
					)
				)
			])
		),
		[]
	)
}
