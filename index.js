
module.exports = function(babel){
	let t = babel.types;
	return {
		pre: file => {
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
				if(path.node.expression.type !== "JSXElement")
					return;
				let Xtraction = path.scope.generateUidIdentifier("Xtracted" + path.node.expression.openingElement.name.name);
				path.replaceWith(
					t.jSXExpressionContainer(
						t.callExpression(
							t.arrowFunctionExpression(
								[],
								t.blockStatement([
									t.variableDeclaration(
										"const",
										[t.variableDeclarator(
											Xtraction,
											t.callExpression(
												this.observer,
												[t.arrowFunctionExpression(
													[],
													path.node.expression
												)]
											)
										)]
									),
									t.returnStatement(
										t.jSXElement(
											t.jSXOpeningElement(
												t.jSXIdentifier(Xtraction.name),
												[],
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
					)
				)
			}
		}
	}
}
