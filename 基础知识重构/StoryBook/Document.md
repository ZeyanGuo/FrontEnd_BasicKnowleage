# Document

当书写了组件的`stories`之后，我们还可以创建基础文档，方便下一次阅读。

`storybook`提供给我们扩展基础文档的工具，并允许我们为UI库创建自己的使用说明，并设计自己的系统站点。

`storybook`有两种文档书写方式
1. DocsPage
2. MDX
如果您对此感兴趣，可以阅读以下内容

## DocsPage

当安装了`Storybook Docs`，`DocsPage`是不需要额外配置的，其将每个组件的stories，文本描述，注释信息，`args`表单，以及代码事例组合到一个单独的页面上。

## Component 参数

`Storybook`通过分析`stories`的默认导出来将组件的描述信息和参数列表提取出来。

## Subcomponents 参数

有时，将多个组件组织到一个文档中是十分有用的，比如说，一个组件库的`ButtonGroup`和`Button`组件是无法排除另一个单独存在的。

`DocsPage`就存在基于组件参数定义的`primary`组件，它接受一个或者多个子组件。

子组件的变量表单将会出现在主组件的`tab`接口处，并且这些`tab`会根据子组件的`key`值进行命名。

如果你希望将自己的组件以不同的方式进行组织，我们推荐你使用`MDX`，它将允许你完全操控页面的显示，并且支持配置。

## 替换 DocsPage
