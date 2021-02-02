# Decorators

`Decorator`是一种将`Story`包装于额外"渲染"功能的方式，许多`addons`定义`Decorator`以使用额外渲染功能或集成细节来渲染`Story`

## 使用额外的装饰来包装`Stories`

某些情况下，可能希望给`Storybook`中渲染的组件增加一些边距，以更好的显示`Story`，此时就可以使用`decorator`

事例如下：

```javascript
// YourComponent.stories.js

export default {
  component: YourComponent,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
};
```

## Story Decorators
可以使用`Story`级别的`Decorator`

```javascript
// Button.stories.js

import Button from './Button';

export default { title: 'Components/Button' };

export const Primary = () => ({
  components: { Button },
  template: '<Button primary label="Hello World" />',
});
Primary.decorators = [() => ({ template: '<div style="margin: 3em;"><story /></div>' })];
```

## Component Decorators
可以使用`Component`级别的`Decorator`

```javascript
// Button.stories.js

import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story /></div>' })],
};
```

## Global Decorators
可以使用`Global`级别的`Decorator`

```javascript
// .storybook/preview.js

export const decorators = [(story) => ({
  components: { story },
  template: '<div style="margin: 3em;"><story /></div>'
})];
```