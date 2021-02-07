# 配置StoryBook

Storybook 通过`.storybook`进行配置。

## 配置 StoryBook 项目

主要的配置文件是`main.js`，并且文件控制着`storybook`服务器的行为。

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx)'],
  addons: ['@storybook/addon-essentials']
}
```

`main.js`包含以下的配置字段

- stories - 一个数组型`globs`，用于指定`stories`存在的目录
- addons - 一个所使用的`addons`列表
- webpackFinal - 自定义的`webpack`配置
- babel - 自定义的`babel`配置

## 配置 StoryUi

可以通过修改`.storybook/manager.js`来更改`StoryBook UI`

## Story 渲染

可以通过修改以下的文件实现直接的修改`HTML`

### Adding to <head>
如果需要给`head`添加额外的内容，可以通过创建`.storybook/preview-head.html`的方式来实现，并且可以添加类似以下内容

```html
<!-- .storybook/preview-head.html -->
<!-- Pull in static files served from your Static director or the internet -->

<link rel="preload" href="your/font" />
<!-- Or you can load custom head-tag javaScript -->
<script src="https://use.typekit.net/xxxyyy.js"></script>
<script> try{ Typekit.load(); } catch(e){} </script>
```

### Adding <body>

与此同时，我们还可以通过添加`<body>`标签，以实现添加自定义内容

可以通过创建一个名叫`[review-body.html`的文件来添加标签，如下

```html
<!-- .storybook/preview-body.html -->
<style>
  body {
    font-size: 15px
  }
</style>
```

## Story 布局

全局`parameter`布局允许配置`Storybook`的`Canvas`布局

我们可以通过在`./storybook/preview.js`中添加以下配置
```javascript
// .storybook/preview.js

export const parameters = {
  layout: 'centered'
}
```

`layout`接受以下配置内容：

- `centered`：配置`Canvas`全局垂直水平居中
- `fullscreen`：允许组件扩展`Canvas`到全屏的`width`和`height`
- `padded`：为组件添加额外的`padding`

如果希望对样式更加细粒度的控制，或者希望书写自己的样式，我们可以使用`decorators`来实现

## Story 功能和行为

可以通过在`.storybook/manager.js`中添加以下的内容来控制`Storybook`的UI

``` javascript
//.storybook/manager.js
import { addons } from '@storybook/addons'

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  theme: undefined,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
})
```

以下是`API` `Feature`的值

|Name|Type|Description|Example Value|
|---|---|---|---|
| isFullscreen | Boolean | 全屏显示Component | false |
| showNav | Boolean | 控制是否显示stories列表的面板 | true |
| showPanel | Boolean | 控制是否显示addons的面板 | true |
| panelPosition | String/Object | 显示在哪儿显示addons面板 | button or right |
| sidebarAnimations | Boolean | 侧边栏树形表单动画 | true |
| enableShortcuts | Boolean | 启动或禁用截图 | true |
| isToolshown | String | 显示/隐藏工具栏 | true |
| theme | Object | Storybook的主题 | undefined |
| selectedPanel | String | addons面板的id | my-panel |
| initialActive | String | 选择移动端默认的启动tab | sidebar or canvas or addons |
| showRoots | Boolean | 显示顶层root的列表 | false |