# Slot插槽

本文的目的是对插槽进行一个详尽的学习，保证以后使用`Slot`插槽时能够信手拈来

## 普通插槽

首先看一个普通插槽最简单的例子

```html
<template>
  <div class="slot-demo">
    <slot>this is slot default content text</slot>
  </div>
</template>
```

将会显示如下默认内容

<div style="height: 60px; line-height:60px; padding: 10px; font-weight:bold; font-size:20px; background:#f8f9fa; color: black">
  this is slot default content text
</div>

此时，如果我们对`slot`内容进行覆盖

```html
<slot>this is a slot custom content</slot>
```

内容会变成下图所示

<div style="height: 60px; line-height:60px; padding: 10px; font-weight:bold; font-size:20px; background:#f8f9fa; color: black">
  this is a slot custom content
</div>


上述普通插槽使用很简单，但是仅仅是使用还是不够的，我们还需要知道插槽在底层是如何实现的。

### 1. vm.$slots

首先，我们看看在`Vue`的`Component`接口上对`$slots`属性的定义

```javascript
$slots: { [key: string]: Array<VNode>; }
```

> `$slots`用于描述当前页面或组件所具备的插槽信息，最终插槽会被转化成`VNode`的形式进行渲染

### 2. renderSlot

`renderSlot`是用于将`slots`生成的`VNode`渲染成真实`DOM`的逻辑

- `renderSlot()`
```typescript
export function renderSlot(
  name: string, // 插槽名 slotName
  fallback: ?Array<VNode>, // 插槽默认内容生成的 vnode 数值
  props: ?Object, // props 对象
  bindObject: ?Object // v-bind 绑定对象
): ?Array<VNode> {}
```

对于普通的`slot`，逻辑如下

```typescript
const slotNodes = this.$slots[name]
nodes = slotNodes || fallback
return nodes
```

在看了上述代码之后，知道如果`slotNodes`存在数据则直接返回，否则返回`fallback`（插槽默认内容生成的VNode），但是我们会有一个疑惑：`$slots`是在哪里定义的呢？

### 3. renderSlots

为了解答这个问题，首先我们得先看看`resolveSlots`方法

```typescript
export function resolveSlots (
  children: ?Array<VNode>, // 父节点的 children
  context: ?Component // 父节点的上下文，即父组件的 vm 实例
): { [key: string]: Array<VNode> } {}
```

`resolveSlots`的具体逻辑中，如果`children`参数不存在，直接返回一个空对象

```javascript
const slots = {}
if (!children){
  return slots
}
```

如果`children`存在，则直接对`children`进行遍历操作：

```javascript
for( let i = 0, l = children.length; i < l; i++ ){
  const child = children[i];
  const data = child.data;
  //如果 data.slot 存在，将插槽名称当作 key, child 当做值直接添加到slots中去
  if((child.context === context || child.fnContext === context) && data && data.slot != null){
    const name = data.slot;
    const slot = (slots[name] || (slots[name] = []));
    //child 的 tag 为 template 标签的情况
    if(child.tag === 'template'){
      slot.push.apply(slot, child.children || []);
    }
    else {
      slot.push(child)
    }
  // 如果 data.slot 不存在，则直接将 child 丢到 slots.default 中去
  } else {
    (slots.default || (slots.default = [])).push(child);
  }
}
```

`slots`获取到值之后，则进行一些过滤操作，然后直接返回有用的`slots`

```javascript
// 忽略只包含空格的slots
for(const name in slots){
  if(slots[name].every(isWhitespace)){ // every()方法用于测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值
    delete slots[name];
  }
}
return slots

//相关逻辑
function isWhitespace(node: VNode): boolean{
  return (node.isComment && !node.asyncFactory) || node.text === ' ';
}

```

### initRender()

`initRender`方法则是对`vm.$slots`进行初始化的赋值

```javascript
const options = vm.$options;
const parentVnode = vm.$vnode = options._parentVnode; // 替换父级树节点
const renderContext = parentVnode && parentVnode.context;
vm.$slots = resolveSlots(options._renderChildren, renderContext);
```


### genSlot

`genSlot`则是用于生成`slot`的属性，代码如下
```javascript
function genSlot(el: ASTElement, state: CodegenState): string{
  const slotName = el.slotName || '"default"' // 取slotName，若无，则直接命名为"default"
  const children = genChildren(el, state) //对 children 进行 generate 操作
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs && `{${el.attrs.map(a => `${camelize(a.name)}:${a.value}`).join(',')}}` // 将 attrs 转换成对象形式
  const bind = el.attrsMap['v-bind'] // 获取 slot 上的 v-bind 属性
  // 若 attrs 或者 bind 属性存在但是 children 却木得，直接赋值第二参数为 null
  if ((attrs || bind) && !children) {
    res += `,null`
  }
  // 若 attrs 存在，则将 attrs 作为 `_t()` 的第三个参数(普通插槽的逻辑处理)
  if (attrs) {
    res += `,${attrs}`
  }
  // 若 bind 存在，这时如果 attrs 存在，则 bind 作为第三个参数，否则 bind 作为第四个参数(scoped-slot 的逻辑处理)
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`
  }
  return res + ')'
}
```

父组件编译阶段用到的`slotTarget`

```javascript
function processSlot(el){
  if(el.tag ==='')
}
```
