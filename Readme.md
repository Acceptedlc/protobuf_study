# Protocol Buffer 大业

* [First Simple Message](#1) 
	* [Message编译后，使用方法如下](#1.1)  
	* [消息结构](#1.2)  	
	* [Varint](#1.3)  	
* [有符号整形](#2) 
	* [有符号整形在计算机中的存储方案](#2.1) 
  	* [zigzag编码](#2.2) 
* [字符串的编码](#4)
* [嵌套Message](#4)
* [使用PB，扩展js](#5)
	* [性能评估之Google自吹自擂](#6.1)
	* [Pb VS Json](#6.2)

 
<h2 id="1">First Simple Message</h2> 

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


<h3 id="1.1"> Message编译后，使用方法如下 </h3>

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

<h3 id="1.2"> 消息结构 </h3>

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


上例中field_number = 1,wire\_type = 0。  

* field\_number << 3 -----> 1000 (二进制)
* 与wire\_type 做与运算 -------> 1000 (二进制)
* 因此，这个byte是 0000 1000cn



<h3 id="1.3"> Varint </h3>

value 是一个无符号整形，pb使用Varint（可变长度int）进行编码。

Varint第一位是一个标志位，表示下一个字节与本字节是否是一个整体（1代表是，0代表不是）。 

先来看一个简单的“1”，用一个字节足以表示，因此，符号位为零—— 0000 0001

对例子中的980，采用1个字节不足以表示。
将标志位去掉得到：1010100 0000111

pb采用小端模式，最后的value位：0000111 1010100 = 980

__Varint的效果还是很明显的，对于一个字长位32bit的计算机，数据压缩了50%__


<h2 id="2"> 有符号整形 </h2>

<h3 id="2.1"> 有符号整形在计算机中的存储方案 </h3>

以32位字长的计算机为例子

* 一个整形数会占据32bit，最高的一个bit表示符号
	* 0代表正数
	* 1代表负数
* 计算机中的数字采用补码存储
	* 正数的补码就是其本身
	* 负数的补码除符号位外，对源码剩余bit依次取反后加一

	
**以-1为例**

源码： 1000 0000 0000 0000 0000 0000 0000 0001  
反码： 1111 1111 1111 1111 1111 1111 1111 1110  
补码： 1111 1111 1111 1111 1111 1111 1111 1111  	

可以看到，如果直接传输-1，需要传输32bit。protocol buffer认为这样很浪费，所以对于负数先采用Zigzag编码，对编码后的内容使用Varint压缩


<h3 id="2.2"> Zigzag编码 </h3>

以32位字长的计算机为例子

Zigzag算法实际上可以理解为一个hash函数，定义如下：

> hash(n) = (n << 1) ^ (n >> 31)

Tips:
 
* 左移
	* 舍弃左边的一位
	* 右边空出的位用0填补
* 右移
	* 舍弃右边的一位
	* 左边
		* 正数：用0补位
		* 右边：用1补位

看一个例子：

```
message Test2 {
  sint32 id = 1;
}

let test2 = new TestProro.Test2();
test2.setId(1);
console.log(test2.serializeBinary());

OutPut:
Uint8Array [ 8, 2 ]
```

n：     0000 0000 0000 0000 0000 0000 0000 0001  
n<< 1 : 0000 0000 0000 0000 0000 0000 0000 0010  
n>>31: 0000 0000 0000 0000 0000 0000 0000 0000  
最终结果： 0000 0000 0000 0000 0000 0000 0000 0010   
结果的十进制：  2


```
test2 = new TestProro.Test2();
test2.setId(-1);
console.log(test2.serializeBinary());

OutPut:
Uint8Array [ 8, 1 ]
```	
n：     1111 1111 1111 1111 1111 1111 1111 1111  
n<< 1 : 1111 1111 1111 1111 1111 1111 1111 1110  
n>>31: 1111 1111 1111 1111 1111 1111 1111 1111  
最终结果： 0000 0000 0000 0000 0000 0000 0000 0001  
结果的十进制：  1

实际上，Zigzag的hash函数想要达到的效果是： 

* 正数： n * 2
* 负数： n * 2 - 1 

换句刷说，就是讲有符号正数映射为无符号正数，然后再使用Varint编码


从效果上来说，对于-1，本来需要传递32个bit，现在只需要传递8bit，节省了75%的开销


<h2 id="4">字符串的编码</h2> 

```
message Test3
{
  string str = 2;
}

console.log();
console.log("字符串的编码")
let test3 = new TestProro.Test3();
test3.setStr("aaa");
console.log(test3.serializeBinary());

OutPut:
Uint8Array [ 18, 3, 97, 97, 97 ]
```

field = 2
wire type = 2

所以消息的key位 100010 = 18

对于字符串，第二个byte表示这个string的length，因此序列化后的第二个byte位3，剩下的3个byte则是a的asc码


<h2 id="5">嵌套Message</h2> 


```
message Test4
{
  Test1 c = 2;
}

console.log();
console.log("嵌套Message")
let test4 = new TestProro.Test4();
test4.setC(test1);
console.log(test4.serializeBinary());

OutPut:
Uint8Array [ 18, 3, 8, 212, 7 ]

```

* 在父message中wire type=2
* value则是，子message序列化后的内容


<h2 id="6">使用PB，扩展js</h2> 

在我目前的项目中，考虑使用pb的最大的原因是用c++解析json，开发效率有些低，而pb可以直接将数据pass成相应的类实例，使用起来也很方便。

随着，spark的引入，在java当中，也会解析一遍json，会让这段逻辑再写一遍

在js addones当中，只要将编译好的内容，放到一个Buffer当中。在c++中就可以用Node提供的Buffer API 获得一个byte数组，使用这个数组可以直接得到一个c++的实例

* node::Buffer::Data
* node::Buffer::Length





```
let bytes = action.serializeBinary();
let msg = [Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes)]
console.time("proto");
addones.proto(msg);
console.timeEnd("proto");

```


```
NAN_METHOD(Proro) {

  v8::Local<v8::Array> input = v8::Local<v8::Array>::Cast(info[0]);
  unsigned int num_locations = input->Length();
  for (unsigned int i = 0; i < num_locations; i++) {
    char* buffer =  (char*) node::Buffer::Data(input->Get(i));
    int length = node::Buffer::Length(input->Get(i)); 
    std::string s(buffer,length);
    eci::protobuf::Action action;
    action.ParseFromString(s);
    std::cout << action.functiontype() << std::endl;
  }
}
```

这里有一个有趣的地方，在Node当中，是不允许worker线程访问v8的数据的。如果，想要获得v8当中的数据，只能进行一次copy，将副本传递到子线程当中。这样做有好有怀，不用考虑太多的同步问题，坏处则是，如果worker的input比较庞大，比如一张图片，那么这个拷贝的操作就会成为性能瓶颈，这个时候Buffer就会成为一个很好的媒介，如上所示**node::Buffer::Data**可以获得一个数组的指针，这个指针可以直接传递到worker线程，也就避免了数据拷贝来拷贝去的开销


<h3 id="6.1">性能评估之Google自吹自擂</h3> 


![序列化数据size](http://chart.apis.google.com/chart?chtt=length&chf=c||lg||0||FFFFFF||1||76A4FB||0|bg||s||EFEFEF&chs=689x430&chd=t:207.0,211.0,211.0,226.0,231.0,231.0,264.0,264.0,300.0,353.0,359.0,370.0,378.0,399.0,419.0,448.0,465.0,470.0,475.0,475.0,526.0,919.0,2024.0&chds=0,2226.4&chxt=y&chxl=0:|scala|java|hessian|stax/woodstox|stax/aalto|json/google-gson|json/jackson-databind|protostuff-json|javolution xmlformat|xstream (stax with conv)|json (jackson)|JsonMarshaller|protostuff-numeric-json|thrift|binaryxml/FI|sbinary|java (externalizable)|protobuf|activemq protobuf|kryo|avro-specific|avro-generic|kryo-optimized&chm=N *f*,000000,0,-1,10&lklk&chdlp=t&chco=660000|660033|660066|660099|6600CC|6600FF|663300|663333|663366|663399|6633CC|6633FF|666600|666633|666666&cht=bhg&chbh=10&nonsense=aaa.png' /> "序列化数据size")


![序列化](http://chart.apis.google.com/chart?chtt=timeSerializeDifferentObjects&chf=c||lg||0||FFFFFF||1||76A4FB||0|bg||s||EFEFEF&chs=689x430&chd=t:2874.1185,2912.7375,3437.8375,5749.9665,6330.785,6777.6865,7223.819,7226.509,7302.9785,7584.8375,8011.9495,8018.866,8542.4285,8639.84,8704.781,10550.4115,13354.7855,15336.6385,16116.891,24618.395,25773.3065&chds=0,28350.637150000002&chxt=y&chxl=0:|java|JsonMarshaller|xstream (stax with conv)|binaryxml/FI|hessian|json/jackson-databind|sbinary|protostuff-json|stax/woodstox|avro-generic|protostuff-numeric-json|javolution xmlformat|thrift|protobuf|json (jackson)|activemq protobuf|stax/aalto|avro-specific|kryo|kryo-optimized|java (externalizable)&chm=N *f*,000000,0,-1,10&lklk&chdlp=t&chco=660000|660033|660066|660099|6600CC|6600FF|663300|663333|663366|663399|6633CC|6633FF|666600|666633|666666&cht=bhg&chbh=10&nonsense=aaa.png' /> "序列化")

![反序列化](http://chart.apis.google.com/chart?chtt=timeDeserializeAndCheckAllFields&chf=c||lg||0||FFFFFF||1||76A4FB||0|bg||s||EFEFEF&chs=689x430&chd=t:3043.0035,3998.4815,4308.2,4355.6565,4371.6045,4584.8715,4779.31,4924.946,6084.47,7185.3925,7366.9585,7948.7375,8082.8465,10567.319,10575.581,12161.0625,14528.3345,21082.57,26235.771,41115.133,71573.7965&chds=0,78731.17615&chxt=y&chxl=0:|java|JsonMarshaller|xstream (stax with conv)|hessian|binaryxml/FI|stax/woodstox|json/jackson-databind|javolution xmlformat|stax/aalto|thrift|protostuff-json|protostuff-numeric-json|json (jackson)|activemq protobuf|avro-generic|sbinary|protobuf|avro-specific|kryo|kryo-optimized|java (externalizable)&chm=N *f*,000000,0,-1,10&lklk&chdlp=t&chco=660000|660033|660066|660099|6600CC|6600FF|663300|663333|663366|663399|6633CC|6633FF|666600|666633|666666&cht=bhg&chbh=10&nonsense=aaa.png' /> "反序列化")


<h3 id="6.2">Pb VS Json</h3> 


* 优点
	* 传输效率高，Protocol Buffer序列化后的数据要远小于json
	* 可维护性高
		* Protocol Buffer可以直接反序列化为class。
		* Protocal Buffer有明确的声明文件，不同团队之间可以基于生命文件进行沟通。JSON格式及其灵活，一方修改，可能其他方面并不知道。在工程的扩展过程中野蛮生长可能性极大。
		* Protocal Buffer提供了向下兼容的方案
* 缺点：
	* 数据本身的可读性比较差，调试起来不是很方便
* 其他
	* 性能方面，不同的实现方案差异比较大，需要具体分析
	* 可用性方面，两种方案资料都比较丰富，现存的库也比较丰富











		
	


