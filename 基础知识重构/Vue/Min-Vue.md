# mini-vue 

Github上开源的vue3简化代码，包含vue3的核心逻辑，去除边缘情况或者兼容处理逻辑，用于学习vue3核心知识。

## 阅读记录

### vnode.ts

主要包含两个方法

|方法名称|作用|
|---|---|
|createVNode|用于创建vnode，最终要的是标识出当前vnode的falg类型|
|createTextVNode|创建文本类型的VNode|

**总结**： 该文件包含创建vnode的主要内容，h函数则

### 