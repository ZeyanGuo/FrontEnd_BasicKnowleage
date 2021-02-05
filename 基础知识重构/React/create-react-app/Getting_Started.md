# 起步

Create React App是一个被官方支持的创建React单页应用脚手架，它提供现代化的无配置构建设置

> 推荐使用`npx`以使用最新版本的`create-react-app`，并且必须在`node`环境大于`11`的情况下使用`create-react-app`

## 选择模板

`create-react-app`提供创建`app`时的模板的可选项，通过`--template [template-name]`的方式来选择指定模板。

如果不选择模板，则会使用`react`推荐的基础模板进行创建。

模板命名规范

`cra-template-[template-name]`

使用过程中可以只提供`[template-name]`

并且可以通过搜索`cra-template-*`的方式来查找所有可用模板。

## 创建Typescript应用

你可以使用`Typescript`模板创建一个支持`Typescript`语法的`React`应用。
```
npx create-react-app my-app --template typescript
```

## 选择包管理器

当创建一个新的应用时，如果已经安装`Yarn`脚手架会默认使用`Yarn`进行安装，并且提供`use-npm`命令以使用`npm`进行包管理。

```
npx create-react-app my-app --use-npm
```

## 默认模板`Scripts`脚本

#### `npm run start` 或 `yarn start`

用于以`development`方式启动应用，并且将运行于`http://localhost:3000`。

#### `npm run test` 或 `yarn test`

在交互模式下运行测试检测器。

#### `npm run build` 或 `yarn build`

以`production`方式构建项目到`build`文件夹下，其在`production`模式下打包`React`并以最有的方式优化构建过程。

#### `npm run eject` 或 `yarn eject`

> 这是一个单项操作，一旦`eject`，将无法恢复

在不满意打包工具和配置设置的情况下，可以通过`eject`的方式将配置文件和依赖提取到`package.json`中，并且会将配置项也提取到顶层。

但是并不推荐使用`eject`，因为`React`有一些默认的优化配置，通过`eject`之后将会导致一些优化项是失效。

## 文件夹目录

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html // 页面模板
    favicon.ico
  src/ // 只有src内的文件才会通过webpack进行编译
    App.css
    App.js
    App.test.js
    index.css
    index.js // JavaScript入口点
    logo.svg
```

## 浏览器兼容性和功能

### 浏览器

默认情况下，`React`兼容所有现代浏览器，如果要支持`IE9，10, 11`则需要使用`react-app-polyfill`进行向后兼容

