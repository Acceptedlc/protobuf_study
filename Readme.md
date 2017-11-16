# Protocol Buffer 大业

## 第一个Message

```
syntax = "proto3";

message Test1
{
    uint32 id = 1;
}
```

* proto3 说明使的是version 3的语法
* Test1 是Message的名字，与class对应
* 这个message生命了一个field，是int32类型的
* 最后的1是这个字段的标签，在二进制中用这个数字代表这个字段


### message编译后，使用方法如下

```
const TestProro = require("../out/test_pb.js");
let test1 = new TestProro.Test1();
test1.setId(980);
console.log(test1.serializeBinary());

out：
Uint8Array [ 8, 212, 7 ]
```

__输出分析__

十进制 | 二进制
---- | ---
8 | 0000 1000
212 | 1101 0100
7 | 0000 0111


### 消息结构

protobuf的消息是经过编码序列化的一系列key-value对，一个类型的数据对应一个key-value。value就是原始数据经过编码后的数据，而key由field number和wire type组成

> (field_number << 3) | wire\_type


__wire type__ 

Type | 序列化后 | 序列化前
---- | ------- | -------|
0 | Varint | int32, int64, uint32, uint64, sint32, sint64, bool, enum |
1 | 64 | fixed64, sfixed64, double
2 | Length-delimited | string, bytes, embedded messages, packed repeated fields
3 | 	Start group | groups (deprecated)
4 | End group | groups (deprecated)
5 | 32-bit | fixed32, sfixed32, float


上例中field_number = 1,wire\_type = 0。因此，拼接出来 __0000 1000__ , 也就是byte8


### Varint

value 是一个uint，pb使用Varint（可变长度int）进行编码。

先来看一个简单的“1”，用一个字节足以表示—— 0000 0001

对例子中的980，采用1个字节不足以表示。Varint为了兼容这种情况，用每个字节的第一位表示，下一个字节是不是这个数字（1代表是，0代表不是）。 

将标志位去掉得到：1010100 0000111

pb采用小端模式，最后的value位：0000111 1010100 = 980









