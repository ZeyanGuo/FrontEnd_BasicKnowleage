# 总结

- `@Component`被重命名为`@Options`
- `@Options`如果不声明任何`options`，那么其是一个可选项
- `Vue`构造函数由`vue-class-component`提供
- `Component.registerHooks`将被迁移到`Vue.registerHooks`

示例:
```javascript
import { Vue, Options } from 'vue-class-component'

// Component definition
@Options({
  // Define component options
  watch: {
    count: value => {
      console.log(value)
    }
  }
})
export default class Counter extends Vue {
  // The behavior in class is the same as the current
  count = 0

  increment() {
    this.count++
  }
}
```

```javascript
// Adding lifecycle hooks
import { Vue } from 'vue-class-component'

Vue.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
```

## 替代方案

使用静态属性声明组件选项

```javascript
export default class Counter extends Vue {
  // All component options are static properties
  static watch = {
    count: value => {
      console.log(value)
    }
  }

  count = 0

  increment() {
    this.count++
  }
}
```