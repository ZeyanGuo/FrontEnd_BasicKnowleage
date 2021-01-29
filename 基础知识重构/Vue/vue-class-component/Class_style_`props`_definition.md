# class方式定义 `props` 

## 如何定义props

vue-class-component 使用 prop 函数定义props，参照一下定义方法

```javascript
import { Vue, prop } from 'vue-class-component'
//Define props in a class
class Props {
	count = prop({
		type: Number,
		required: true,
		validator: (value) => value >= 0
	})
}

export default class MyComp extends Vue.with(Props){}
```

在 typescript 中，还可以忽略`prop`，只需要定义类型

```javascript
import { Vue, prop } from 'vue-class-component'

class Props {
	foo?: string
	bar!: string
	baz = prop<string>({ default: 'default value'} )
}

export default class MyComp extends Vue.with(Props){}
```

还可以通过设置Typescript的设置项`"useDefineForClassFields": true`来提示未被声明的props

## 动机

其一是为了适当的键入组件`Props`类型参数以支持`TSX`和`Vetur`的类型检测。通过这种方式`TSX`和`Vetur`可以在编译阶段验证`props`类型。

示例
```javascript
import { defineComponent } from 'vue'

// The type Props = { count: number } in component type
const Counter = defineComponent({
  props: {
    count: {
      type: Number,
      required: true
    }
  }
})

<Counter count={'Hello'} /> // Error because `count` is of type `number`
```

另一个原因是减少冗余，在Vue基础版本中，我们需要定义类型注释以声明复杂类型

示例
```javascript
interface Person{
	firstName: string;
	lastName: string;
}

const App = defineComponent({
	props: {
		// Specify value `Object` then annotate it with `PropType<Person>`
		person: Object as PropType<person>
	}
})
```

以上方法相比于现有的`vue-property-decorator`相当冗余

示例
```javascript
interface Person{
	firstName: string;
	lastName: string;
}

@Component
class App extends Vue{
	// Just specify `Person` type ( and `@Prop` decorator )
	@Prop person: Person 
}

```

## 细节

以下将详细介绍`Vue.with`和`prop`方法

`Vue.with(...)`方法接受一个用于描述组件`props`的类构造函数，其收集所有的类属性并为组件生成对应的`props`属性

示例：
```javascript
import { Vue } from 'vue-class-component';

class Props{
	optional?: string
	required!: number
}

class App extends Vue.with(Props){
	// Vue.with generates the following props option under the hood
	// props: { optional: null, required: null }
	
	mounted(){
		// It retains the property types for props
		this.optional // string | undefined
		this.required // number
	}
}
```

还可以使用`prop`函数来指定于`Vue core props`相同的选项，以定义更为详细的描述信息

示例:
```javascript
import { Vue, prop } from 'vue-class-component'
class Props{
	const: number = prop({
		validator: (count: number) => count >= 0
	})

	amount = prop<number>({default: 1})
}
```

> 注意，如果要声明默认值，请使用`prop`函数，而且如果可以通过默认值推断出变量类型，则不必冗余声明其类型

## 替代方案

#### 装饰器方法

可以通过`@Prop`装饰器来声明`props`

缺陷：
1. 无法设置`props`类型参数，以及无法核对`props`类型
2. 存在声明不确定的困扰

#### `Mixin`方法

可以通过`Mixin`的方式将`props`混入到组件中。

缺陷：
1. 声明过于冗长
2. 并不能直观的描述`props`声明