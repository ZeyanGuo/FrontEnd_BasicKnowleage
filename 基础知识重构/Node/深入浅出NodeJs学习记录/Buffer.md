# 理解Buffer

由于Node中需要处理网络协议、操作数据库、处理图片、接受上传文件邓，在网络流和文件的操作中，还要处理大量二进制数据。而JavaScript自有的字符串不能满足这些需求，于是Buffer对象应运而生。

## Buffer结构

Buffer类似于Array，但是其主要用于操作字节。

---

## 模块结构

Buffer是一个典型的JavaScript与C++结合的模块，它将性能相关部分用C++实现，将非性能相关的部分用JavaScript实现

Buffer对象的范围是0到255之间，在给Buffer进行直接赋值时，需要注意
1. 赋值如果小于0，就该逐次加256，直到得到一个0到255之间的整数
2. 如果数值大于255，就逐次小256，直到得到0到255之间的数值。
3. 如果是小数则舍弃小数部分，只保留整数部分

---

## 内存分配

Node中Buffer采用slab分配机制，slab机制就是申请一块好的固定大小的内存区域，slab具有如下种状态：
 - full：完全分配状态
 - partial: 部分分配状态
 - empty: 没有分配状态

**小内存空间的Buffer对象**

Buffer是按照固定大小内存区域进行分配，默认一次小Buffer对象的分配的slab大小为8kb。

如果新建的Buffer对象其Size在8kb以下，Buffer会使用8kb Buffer pool中的空间，如果空间不够了则会再次分配新的8kb slab。

注意点：

如果slab剩余的空间不够，将会创造新的slab，原slab中剩余的空间会造成浪费。例如，第一次构造1字节的Buffer对象，第二次构造8192字节的Buffer对象，由于第二次分配时slab中的空间不够，所以创建并使用新的slab，第一个slab的8kb将会被第一个1字节的Buffer对象独占。

```javascript
new Buffer(1);
new Buffer(8192);
```
如上代码将会生成两个8kb slab空间并且造成其中一个1kb数据占用8kb空间

**大内存空间的Buffer对象**

如果超过8KB的Buffer对象，将会直接分配一个SlowBuffer（现在SlowBuffer已经弃用，而是使用allocUnsafeSlow方法来创建内存空间）对象作为slab单元，这个slab单元会被这个大Buffer对象独占。

>**总结**: Node的内存是在C++层面提供的，JavaScript层面只是使用它。当进行小而频繁的Buffer操作时，采用slab的机制进行预先申请和事后分配，使得JavaScript到操作系统之间不必有过多的内存申请方面的系统调用。对于大块的Buffer而言，则直接使用C++层面提供的内存，而无需细腻的分配操作。

---

## Buffer转换

Buffer支持的字符串编码类型：ASCII、UTF-8、UTF-16LE/UCS-2、Base64、Binary、Hex



**Buffer与String之间操作方法**

1. Buffer.from() 方法，用于从字符串、对象、ArrayBuffer、array等方面生成Buffer对象
2. Buffer.write() 方法，向Buffer中写入指定的string或其他信息
3. Buffer.toString() 方法，将Buffer转成字符串

**Buffer拼接**

Buffer在实际场景中，通常是以一段一段的方式传输，以下是常见的从输入流中读取内容的示例代码

```javascript
var fs = require('fs');

var rs = fs.createReadStream("test.md", {highWaterMark: 11});
var data = '';

rs.on("data", function(chunk){
    data += chunk;
})
rs.on("end", function(){
    console.log(data);
})
```

以上内容会存在对于宽字符处理时出现乱码，因为设置了`highWaterMark`为11，限制了每次读取Buffer的长度，从而造成中文字符在中间被截断，从而形成乱码.

**readable.setEncoding()**处理方法

可以通过readable.setEncoding()方法来设置编码方式为'utf-8'来解决该问题，原理是其底层使用了`string_decoder`模块的`StringDecoder`，如果在设置为'utf-8'之后，`string_decoder`知道'utf-8'是以3个字节为一个字符进行处理的，因此其在只拿到2个字符时，会将其存储在StringDecoder中，并且在获取到后续字符后才同意输出，从而解决乱码问题。

但是`StringDecoder`并不是万能的，其只能处理`UTF-8`，`Base64`等编码方式

**Buffer拼接处理方法**

由于使用`setEncoding`方式存在局限性，因此推荐将Buffer进行拼接，从小Buffer向大Buffer对象复制，从而解决分割输出问题。

Buffer.Concat()源码
```javascript
Buffer.concat = function(list, length){
    if(!Array.isArray(list)){
        throw new Error('Usage: Buffer.concat(list, [length])');
    }

    if(list.length === 0){
        return new Buffer(0);
    }
    else if(list.length === 1){
        return list[0];
    }

    if(typeof length !== 'number'){ //计算出最后拼接成的Buffer的大小
        length = 0;
        for(var i = 0; i < list.length; i++){
            var buf = list[i];
            length += buf.length;
        }
    }

    var buffer = new Buffer(length); //根据最后大小声明Buffer

    var pos = 0;

    for(var i = 0; i < list.length; i ++){//将buffer复制到新Buffer中并返回
        var buf = list[i];
        buf.copy(buffer, pos);
        pos += buf.length;
    }

    return buffer;// 最终返回Buffer
}
```

## Buffer与性能


