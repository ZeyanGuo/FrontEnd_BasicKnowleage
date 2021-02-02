# Args

一个Story是一个有一系列参数(props, slots, inputs.etc)表示的组件，`Args`是StoryBook用于定义这些参数的方式。`Args`将允许Storybook以及其`addons`插件动态编辑组件。

当`Args`的值改变后，组件将重新渲染，并允许通过`Storybook`UI上的`addons`来动态修改`Args`


## Args 对象

`Args`对象可以被定义到`Story`或`Component`层级，它是一个由健值对组成的对象，并且允许任意值类型。

## Story Args

为了定义单个`Story`的`Args`，使用`args CSF story key`

```javascript
i// Button.stories.js

import Button from './Button';

export default { title: 'Components/Button' };

// We create a “template” of how args map to rendering
const Template = (args, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  template: '<Button v-bind="$props" v-on="$props" />',
});

// Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Primary',
};
```

以上的`Args`将只作用于它所绑定的`Story`，或者可以通过JavaScript对象的方式进行复用

## Component Args

除了`Story`级别的`Args`，还可以定义`Component`级别的`Args`，`Component`级别的`Args`将会在所有组件中共享，并且可以进行复写

```javascript
// Button.stories.js

import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  args: {
    // Now all Button stories will be primary.
    primary: true,
  },
};
```

## Args Composition

可以将`Args`分离成小的组合，从而实现在多个`Story`之间进行复用

```javascript
// Button.stories.js | Button.stories.ts

const Primary = ButtonStory.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
}

const Secondary = ButtonStory.bind({});
Secondary.args = {
  ...Primary.args,
  primary: false,
}
```

> 注意：如果经常进行`Args Composition`，则可以考虑使用`Component Args`来实现`Args`复用

`Args Composition`常用于复用其他组件的情况，通过`Args Composition`可以实现对其他组件的`Args`进行复用

如下：

```javascript
// Page.stories.js

import Page from './Page.vue';
import * as HeaderStories from './Header.stories';

export default {
  title: 'Page',
};

const Template = (args, { argTypes }) => ({
  components: { Page },
  props: Object.keys(argTypes),
  template: '<page v-bind="$props" />',
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};
```