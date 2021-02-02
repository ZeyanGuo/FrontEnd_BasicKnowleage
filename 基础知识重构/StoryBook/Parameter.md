# Parameters

`Parameters`是一组关于`Story`的静态，具名的元数据，用于控制`Storybook`的功能和`addons`

举个例子，如果需要通过`Paramters`定制化背景色`addons`，只需要使用`parameters.background`就可以定义背景色

## Story Parameters

可以定义`Story`级别的`Parameters`

```javascript
// Button.stories.js | Button.stories.ts

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
Primary.parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ],
  },
};
```

## Component Paramters

可以定义`Component`级别的`Paramters`

```javascript
// Button.stories.js | Button.stories.ts

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
Primary.parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ],
  },
};
```

## Global Parameters

还可以在`.storybook/preview.js`(用于定义所有`stories`的配置文件)中定义全局`Parameters`

```javascript
// .storybook/preview.js

export const parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ],
  },
};
```