# Lerna 命令集

在使用Lerna之前需要明确Lerna所解决的问题：“Lerna是一个通过git和npm优化和管理多个package仓库工作流的工具”，所以针对以下情况，可以考虑使用lerna

1. 需要管理多个package，或者一个大工程可以拆解成monorepo
2. 多个package之间存在依赖关系
3. package之间存在共同依赖，需要统一管理

### 如何使用lerna？

安装lerna，并初始化lerna工程

```

$ mkdir lerna-repo && cd ./lerna-repo
$ npx lerna init

```

以上命令将会生成一个lerna.json，并且生成如下结构

```

lerna-repo/
	packages/
	package.json
	lerna.json

```

### 工作原理

#### Fixd/Locked mode(default)

Fixed模式下的lerna项目将维护一个唯一的版本线。版本信息将存储在lerna.json文件下的version属性上。当运行lerna publish的时候，如果packages中的一个module较上一个版本做出了修改，
那么这个module的修改将会被更新到当前发布的版本中。这意味着仅当需要时才发布新的版本。

换言之，使用这个模式将会自动将所以package版本绑定到一起。任何package的major修改都会导致所有的package有了一个新的版本

#### independent mode

```

lerna init --independent

```

independent模式下的Lerna项目允许开发者独立的增加每个package的版本，每次发布都会有一个提示来表明每个package是patch，minior，major或者custom修改。

> 通过将lerna.json中的version字段设置为independent来开启independent模式

### 概念

#### Debug

lerna将把错误保存到lerna-debug.log文件内。

#### lerna.json

```json

{
	"version": "1.1.3",
	"npmClient": "npm",
	"command": {
		"publish": {
			"ignoreChanges": ["ignored-file": "*.md"],
			"message": "chore(release): publish",
			"registry": "http://npm.pkg.github.com"
		},
		"bootstrap":{
			"ignore": "component-*",
			"npmClientArgs": ["--no-package-lock"]
		}
	},
	"packages":["packages/*"]
}

```
- version: 仓库的当前版本
- npmClient: 指定命令行运行代码，默认是`npm`，可以设置为`yarn`
- command.publish.ignoreChanges: 用一个`glob`匹配的数组表示不会被包含在`lerna changed/publish`中的文件。用于避免发布不必要的版本，比如仅仅是更新`md`文件
- commond.publish.message: 当发版时的客户自定义消息。
- command.publish.registry: 设置自定义npm仓库，用于取代npm官方仓库。
- command.bootstrap.ignore: 用glob匹配不需要被`bootstrap`的仓库。
- command.bootstrap.npmClientArgs: 运行`npm install`时携带的额外参数。
- command.bootstrap.scope: 使用scope的glob匹配来过滤不需要`bootstrap`的包
- packages: Array数组，可以设置globs匹配，表示被当作packages的文件

#### 公共`devDependencies`

可以通过lerna link convert将所有packages的`devDependencies`拉取到`root`

拉取`devDependencies`有以下好处
1. 所有的packages都将使用同一版本的依赖
2. 可以保持依赖处于最新状态
3. 减少依赖安装时间
4. 减少存储空间要求

> 注意：需要执行命令的`devDependencies`依旧需要被安装在每个package中