
module.exports = function(babel){
	let t = babel.types;
	return {
		pre: file => {
			this.file = file;
			this.active = ~file.ast.comments.map(x => x.value.trim()).indexOf("@mobxtract");
			if(this.active)
				file.path.get("body")[0].insertBefore(
					t.importDeclaration(
						[t.importSpecifier(
							this.observer = file.path.scope.generateUidIdentifier("observer"),
							t.identifier("observer"),
						)],
						t.stringLiteral("mobx-react"),
					),
				);
		},
		visitor: {
			JSXExpressionContainer: path => {
				if(!this.active || path.node.expression.type !== "JSXElement")
					return;
				let Xtraction = path.scope.generateUidIdentifier("Xtracted" + path.node.expression.openingElement.name.name);
				path.replaceWith(t.jSXExpressionContainer(xtraction(t, Xtraction, this.observer, path.node.expression)));
			},
			CallExpression: path => {
				if(
					!this.active ||
					path.node.callee.name !== "mobxtract" ||
					path.node.arguments.length !== 1 ||
					path.node.arguments[0].type !== "JSXElement"
				)
					return;
				let Xtraction = path.scope.generateUidIdentifier("Xtracted" + path.node.arguments[0].openingElement.name.name);
				path.replaceWith(xtraction(t, Xtraction, this.observer, path.node.arguments[0]));
			},
		}
	}
}

function xtraction(t, Xtraction, observer, expression){
	let keyAttr = expression.openingElement.attributes.find(a => a.name.name === "key");
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
								expression
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
