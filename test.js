
let babel = require("@babel/core");
let plugin = require(".");

let { code } = babel.transform(`
let a = 5;
console.log(a);
let el = <View>{<Text>abc</Text>}</View>;
`.trim(), {
	plugins: [plugin, "@babel/plugin-syntax-jsx"]
});
console.log("\n------------\n");
console.log(code);
