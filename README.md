
# `babel-plugin-mobxtract`

Plugin for babel to simplify extracting JSX elements in `mobx-react` so as to lower rerenders.

**Note that a `/* @mobxtract */` is required for the plugin to activate!**

## Installation
```
npm i tjjfvi/babel-plugin-mobxtract
```
Add `babel-plugin-mobxtract` to `plugins`.

## Example
```jsx
class ABC extends React.Component {
    
    @observable a;
    @observable b;
    @observable c;

    @observer
    render(){
        return <div>
            <span>A: {this.a}</span>
            <span>B: {this.b}</span>
            <span>C: {this.c}</span>
        </div>
    }

}
```
Consider the above code. When any of A, B, or C update, the whole component rerenders. In this trivial example that is not very consequential, but in a larger component this could have serious performance issues.

The normal solution to this problem would be to create a `ABCDisplay` component something like the below:
```js
class ABCDisplay extends React.Component {
    @observer
    render(){
        let { which, obj } = this.props;
        let val = obj[which];
        return <span>{which.toUpperCase()}: {val}</span>;
    }
}

class ABC extends React.Component {
    // ...
    render(){
        return <div>
            <ABCDisplay obj={this} which=a>
            <ABCDisplay obj={this} which=b>
            <ABCDisplay obj={this} which=c>
        </div>
    }
}
```
While this approach works, it can quickly become tedious, especially for large components.

With `babel-plugin-mobxtract`, you can simply write:
```js
/* @mobxtract */
// ...
    render(){
        return <div>
            {<span>A: {this.a}</span>}
            {<span>B: {this.b}</span>}
            {<span>C: {this.c}</span>}
        </div>
    }
// ...
```
And the plugin will automatically expand the inlined elements to an `observer` component so that it rerenders seperately.