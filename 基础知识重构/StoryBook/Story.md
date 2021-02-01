# Story 详解

## 如何书写Story

Story的作用是描述UI组件状态，Story使用通用术语描述组件的prop参数

## 如何存放Stories

一个组件的Stories被存放在组件文件中，并且这个Story文件只是开发使用的，它不会被包含在生产包中。

# 组件故事格式(Component Story Formt)

CSF是一种ES6模式的语法标准，利于快速的在工具间书写和共享。

## Default Export

Default Export导出用于控制Storybook侧边栏列表和Addons插件的元数据。

举个例子

```javascript
import MyButton from './MyButton'

export default {
  title: 'Example/Button',
  component: MyButton,
  argTypes: {
    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
  },
};
```

## Definig Stories

使用named export导出组件的Story定义。

举个例子

```javascript
import MyButton from './MyButton'

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyButton },
  template: '<my-button @onClick="onClick" v-bind="$props" />',
});

export const Primary = Template.bind({});

```

## Rename Stories

可以通过重写组件的属性来重命名stories

举个例子

```javascript
export const Primary = Template.bind({})

Primary.args = {
  label: 'Click me',
  primary: true,
};
```

> 注意，以上内容使用`Template.bind({})`的原因是为了消除代码重复，而后如果使用`...Primary,args`的方式复用主参数的目的则是为了消除数据重复。

# 如何书写Stories

## 使用args参数

提炼组件的主Story模版，是一个减少代码重复，并提高可维护性的好方法。

```javascript
// Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = { background: '#ff0', label: 'Button' };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, label: '😄👍😍💯' };

export const Tertiary = Template.bind({});
Tertiary.args = { ...Primary.args, label: '📚📕📈🤓' };
```

还可以通过以上方式实现跨stories的参数共享

```javascript
import { ButtonGroup } from '../ButtonGroup';
import * as ButtonStories from './Button.stories';

export default {
  title: 'ButtonGroup',
  component: ButtonGroup,
}
const Template = (args) => <ButtonGroup {...args} />

export const Pair = Template.bind({});
Pair.args = {
  buttons: [ ...ButtonStories.Primary.args, ...ButtonStories.Secondary.args ],
  orientation: 'horizontal',
};
```

并且在使用了`args`之后，`Addons`中的`Controls`就可以获取所有声明的属性，并可以提供给测试做边界测试。

## 使用parameter参数

Parameter是一个方法，用于定义Story静态元数据，Story Parameter可以为`Addons`提供一个`Story`层级或者一组`Story`层级的配置

```javascript
// Button.stories.js

import React from 'react';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    backgrounds: {
      values: [
         { name: 'red', value: '#f00', },
         { name: 'green', value: '#0f0', },
         { name: 'blue', value: '#00f', },
      ]
    }
  }
}
```

## 使用decorators

装饰器是在呈现故事时用任意标记包装组件的一种机制

# Stories对应多个组件

当开发系统或组件库时，可能会遇到多个组件共同使用的情况。比如`List`组件就需要与`ListItem`组件共用

```javascript
// List.stories.js

import React from 'react';
import List from './List';
import ListItem from './ListItem';

export default {
  component: List,
  title: 'List',
};

export const Empty = (args) => <List {...args} />;

export const OneItem = (args) => (
  <List {...args}>
    <ListItem />
  </List>
);

export const ManyItems = (args) => (
  <List {...args}>
    <ListItem />
    <ListItem />
    <ListItem />
  </List>
);
```
