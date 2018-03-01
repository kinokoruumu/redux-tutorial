# redux-tutorial

```
$ npm install

$ npm run build:watch
```

# React + reduxでモダンなフロントエンドについて語る

## まずはReactについて

Reactについての説明は参考になる記事が沢山あるので、そちらを参照してください。


> [React公式](https://facebook.github.io/react/)
> 
> [5分で理解する React.js](http://qiita.com/tomzoh/items/7fabe7cb57dd96425867)

## reduxについて

reduxはfluxという設計思想に影響されて生まれたアーキテクチャです。  
> [redux公式](http://redux.js.org/)
> 
> 
> ![](https://raw.githubusercontent.com/kinokoruumu/images/master/redux-flow-original.png)

reduxでは`Store` という場所でアプリケーションの状態を一元管理し、
その値を変更するとViewが更新されます。
Storeを更新したいときは、ViewがActionCreatorからActionオブジェトを受け取りStoreにdispatchします。
そのactionオブジェクトの情報を元にreducerが新たにStateを作り、Storeが更新されます。


初めにこの設計思想に登場するキーワードの解説からしていきます。

- Store
- Reducer
- State
- ActionCreator
- Action
- dispatch
- View -> Reactが担当する

## Store
### Storeはアプリケーションの状態を一元管理するところ

アプリケーションの状態とは

```
Todoリストでのアプリケーションの状態なら、すべてのタスクやそのタスクが終わっているかどうかなどのことです。
```


- Storeの動き

	Storeの中には`Reducer`と`State`という概念があり、あるきっかけで`Reducer`が新しい`State`を作り、Storeを更新します。

	**reduxという思想の中では、Storeを更新するのはreducerだけ**

- Reducerの動き

	Reducerは`dispatch`された`actionオブジェクト`に基づき`Store`の`State`を更新します。
	先ほど出てきた`あるきっかけ`とは`actionブジェクト`が`Store`に`dispatch`された時です。
	
	dispatchについては後ほど説明します。

## ActionCreator
### ActionCreatorはActionオブジェクトを返す関数

Actionオブジェクトとは

```
ReducerがどのようにStoreを更新するかを定義したオブジェクト
```

実際にコードにすると以下のようになります

```
return {
    type: 'ADD_TODO',
    text: text
}
```
Actionオブジェクトは`type`と`payload`を持っていて、この`type`によって`Reducer`はどの処理を行うかを判断します。
このActionオブジェクトを作るのがActionCreatorの責務です。

実際にコードにすると以下のようになります

```
function add_todo(text) {
	return {
	    type: 'ADD_TODO',
	    text: text
	}
}
```

つまりActionCreatorはただ単にActionオブジェクトを返しているだけです。

## dispatch
### ReducerにActionオブジェクトを届ける為の仕組み

```store.dispatch(Actionオブジェクト)```のような感じで使うことが出来ます。
これで`Reducer`に`Actionオブジェクト`を届けることが出来ます。

先ほどのactionオブジェクトと届けたい場合は

```
store.dispatch(addTodo('hoge'))
```

のようになります。
	

## View
### ViewはStoreから受け取った状態を表示するところ

今回はReactが担当します。
fluxでstoreの更新を検知する場合は、componentDidMountなどのライフサイクルを使ってaddEventListenerで監視する必要があります。
ですが、reduxでは`Provider`に`Store`を渡すので特にこちらが何か書く必要はありません。

`Provider`は実際にコードを書く時に出てきます。

## ディレクトリ構成
```
- /src/
	| - actions/
		| - actionTypes/
			| - counter.js
		| - actionCreators/
			| - counter.js
	| - store/
		| - reducers/
			| - index.js
			| - counter.js
		| - configureStore.js
	| - components/
		| - App.jsx
		| - Home.jsx
	| - containers/
		| - HomeContainer.js
	| - app.js
- /index.html
- /package.json
- /webpack.config.js
```

今回はこんな感じのディレクトリ構成にしてみました。

## 実際に書いてみる

まずはreduxを構成するためにstoreやreducerやcontainerなどを作る必要があります。

今回は画面に数字が表示されていて、数字をクリックするとその数字が1増えるといったアプリケーションを作り、reduxの流れを体感したいと思います。

その前に、まずはReactで書いたViewを表示できるようにしましょう。
Reactはもう知ってるという人は `reduxの基盤を作る` までスキップしてください。

今回使うnode_moduleは以下の通りです。

- react
- react-dom
- redux
- react-redux
- babel-core
- babel-loader
- babel-preset-es2015
- babel-preset-react
- webpack

```
$npm init
```
上のコマンドを実行すると`package.json`が生成されます。  
その中の`scripts `の部分を以下のように書き足してください。

```
  "scripts": {
    "prebuild": "rm -rf dist/",
    "build": "webpack --color --progress",
    "build:watch": "npm run build -- --watch",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

その後、以下のコマンドで`package`を`install`してください。

```
$ npm install --save react react-dom redux react-redux babel-core babel-loader babel-preset-es2015 babel-preset-react webpack
```

## Reactで`Hello World!`

1. まずは`Hello World!`と表示する`component`を書きます。

	```js
	/src/components/App.jsx
	
	import React from "react"
	
	const App = () => (
	    <h1>Hello World!</h1>
	)
	
	export default App
	```

2. `component`をDOMに登録する

	```js
	/src/app.js
	
	import React from 'react'
	import { render } from 'react-dom'
		
	import App from './components/App.jsx'
		
	render (
	    <App/>,
	    document.getElementById('react')
	)
	```
	
3. srcの中身をトランスパイルしてbundle.jsを生成する
	
	今回はwebpackを使うので、下記のようなwebpackのconfigファイルを用意します。
	
	```js
	/webpack.config.js
	
	var path = require("path")
	
	module.exports = {
	    entry: "./src/app.js",
	    output: {
	        path: path.resolve(__dirname, "./dist"),
	        filename: "bundle.js",
	        libraryTarget: "umd"
	    },
	    module: {
	        loaders: [
	            {
	                test: /\.jsx?$/,
	                loader: "babel-loader",
	                exclude: /node_modules/,
	                query: {
	                    presets: ["es2015","react"]
	                }
	            }
	        ]
	    }
	}
	```
	
	トランスパイルするときは
	
	```
	$ webpack
	```
	でできます。


4. index.htmlからbundle.jsを呼び出す

	```html
	/index.html
	
	<!DOCTYPE html>
	<html lang="ja">
	<head>
	    <meta charset="UTF-8">
	    <title>React + redux Tutorial</title>
	</head>
	<body>
	    <div id="react"></div>
	    <script src="./dist/bundle.js"></script>
	</body>
	</html>
	```
	
	ブラウザでindex.htmlを読み込むと`Hello World!`と表示されるはずです。

## reduxの基盤を作る
さて、ReactのViewは表示できたので、今度は本題のreduxについて実装していきます。
まずは、reduxの基盤からです。

1. reducersを作る

	```js
	/src/store/reducers/index.js
	
	import { combineReducers } from 'redux'
	
	const reducers = combineReducers({
	    // ここにreducerを入れる
	})
	
	export default reducers
	```
	
	複数のreducerを結合してreducersを作ります

2. storeを作る

	```js
	/src/store/configureStore.js

	import { createStore } from 'redux'
	import reducers from './reducers'
	
	export const store = createStore(
	    reducers
	)
	```
	
	先ほど生成したreducersをstoreに入れて、storeを作ります

3. storeをReactのViewに渡す

	```js
	/src/components/App.jsx
	import React from "react"
	import { Provider } from 'react-redux'
	import { store } from '../store/configureStore'
	
	const App = () => (
	    <Provider store={store}>
	        <h1>Hello World!</h1>
	    </Provider>
	)
	
	export default App
	```

	さて`Provider`というものが出てきました。
	これが`Store`を管理していて、`mapStateToProps`などを使い`component`に`Store`の`state`を渡します。
	
	`mapStateToProps`については後ほど解説します。


これでreduxの型は完成しました。まだcombineReducersの中にreducerを登録していないのでerrorが出ますが一旦放置します。
reducerはあとで作るのでその時に登録します。

## 本題の「表示された数字を加算する」一連の流れを書いていきます

工程としては以下の通り

1. ActionTypeを定義
2. ActionCreatorの作成
3. reducerを作成
4. connectでstateとhandlerを渡す
5. stateとhanderを呼び出す

#

1. ActionTypeを定義
----

まずはactionオブジェクトの中で定義する`type`だけを宣言します。
そうすることでactionオブジェクトを作る時やreducerを作る時にimportして使えるので、タイポなどがなくなります。

今回はcountを加算するので`ADD_COUNT`という`type`にしました。

```js
/src/actions/actionTypes/counter.js

export const INCREMENT = 'INCREMENT'
```

2. ActionCreatorの作成
----

先ほど作った`type`をimportしてActionCreatorを作ります。

```js
/src/actions/actionCreators/counter.js

import { INCREMENT } from '../actionTypes/counter'

export const increment = () => {
    return {
        type: INCREMENT
    }
}
```

今回`payload`はいらないので、Actionオブジェクトの内容は`type`のみです。

3. reducerを作成
----

reduxの中でstoreを更新するための責務を持つreducerを作っていきます。

まずはActionTypeをimportします。

initialStateとしてreducerごとに初期値を定義しています。
今回は現在のカウントの状態を保持するために`count`を定義しています。

reducerの第２引数には`dispatch`された`Actionオブジェクト`が入るので、先ほど定義した`type`を元にswitchします。
その時に先ほどimportした`ActionType`を使用します。

実際にコードにすると以下のようになります。

```js
/src/store/reducers/counter.js

import { INCREMENT } from '../../actions/actionTypes/counter'

const initialState = {
    count: 0
}

export function counter(state = initialState, action) {
    switch (action.type) {
        case INCREMENT:
            return Object.assign({}, state, {
                count: state.count + 1
            })
        default:
            return state
    }
}
```

returnで新しいオブジェクトを作っていることに注目してください。
reduxでは現状の`State`を書き換えることはせず、新しい`State`を作ります。
なので`Object.assign`を使い、現状の`State`に新しく状態を足したオブジェクトを返しています。

こんな感じです。

```
return Object.assign({}, state, {
    count: state.count + 1
})
```

さて、`reducer`を作ったので`combineReducers`に登録します。

**※reducerを登録するのは忘れがちなので注意してください**

```js
/src/store/reducers/index.js

const reducers = combineReducers({
    counter
})
```

**※redux三原則に「reducerは純粋関数でないといけない」という制約があるのでそのあたりも注意してreducerを作りましょう**


4. connectでstateとhandlerを渡す
----

さきほど`mapStateToProps`を使い`Store`の`state`を`component`に渡すと言いましたが、具体的な方法を書いていなかったので、ここで解説します。

具体的には`react-redux`の中にある`connect`を使います。

実際にコードにすると以下のようになります。

```js
/src/containers/HomeContainer.js

import { connect } from 'react-redux'
import Home from "../components/Home.jsx"
import { increment } from '../actions/actionCreators/counter'

const mapStateToProps = state => {
    return {
        count: state.counter.count
    }
}

const mapDispatchToProps = dispatch => {
    return {
        increment: () => {
            dispatch(increment())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

ここでは、`connect`を使い`component`に`state`と`handler`を渡します。

関数名を`mapStateToProps`と`mapDispatchToProps`にしていますが、必ずしもそうでないといけないわけではありません。
connectの第１引数に`state`から必要な情報を取り出してreturnしてくれる関数、  
第２引数に`component内で使う関数`をreturnしてくれる関数を登録します。

今回の`mapStateToProps`では引数の`state`で受け取った`store`の`state`の中から、`counter(後で作るreducer)`の`count`を`HomeComponent`に渡します。

そうすることで、`HomeComponent `のpropsに`count`と`handler`を渡すことができます。

自分は`connect`を使い`component`に`state`を渡す責務は`container`に持たせることにしています。

5. stateとhanderを呼び出す
----

先ほど`connect`関数を使い`State`と`handler`を`props`に渡したので`this.props`から取り出してみましょう。


```js
/src/components/Home.jsx
import React from 'react'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1 onClick={() => this.props.increment()}>{this.props.count}</h1>
            </div>
        )
    }
}
```

`container`を作ったので、`App.jsx`には`Home.jsx`ではなく`HomeContainer.js`を読み込みます。

```js
/src/components/App.jsx
import React from "react"
import { Provider } from 'react-redux'
import { store } from '../store/configureStore'
import HomeContainer from '../containers/HomeContainer'

const App = () => (
    <Provider store={store}>
        <HomeContainer/>
    </Provider>
)

export default App
```

さぁ、一通りのファイルを作ったので、数字をクリックしてみましょう。  
ちゃんと加算されたでしょうか？？




## 最後に

reduxにはmiddlewareというものが用意されていて、非同期的な処理や、actionごとに何か処理を実行したい場合などに利用します。

ただ、少しややこしいのでreduxのflowがしっかりと理解できてから手を出す方が良いでしょう。
