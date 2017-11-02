## 作用

* 序列化与反序列化数据
* 更好的向下兼容


## 简单实例

```
syntax = "proto3";

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}

//序列化与反序列化
#include <iostream>

#include "../out/data.pb.h"

int main() {
  SearchRequest s;
  s.set_query("protocol buffer usage");
  s.set_page_number(1);
  s.set_result_per_page(1);
  std::string str;
  s.SerializeToString(&str);
  std::cout << "*************" << std::endl;
  for(auto a : str){
    std::cout << (int)a << " ";
  }
  std::cout << std::endl << "*************" << std::endl;

  SearchRequest p;
  p.ParseFromString(str);
  std::cout << p.page_number() << std::endl;
  std::cout << p.query() << std::endl;
  std::cout << p.result_per_page() << std::endl;
  return 1;
}
```

* 第一行指定使用proto3语法


### 名词解释

* 字段类型
* 标签
	* 最后的1，1，2，3是这个字段的标签，在二进制中用这个数字代表这个字段。
	* 1~15只会占用一个字节进行编码
	* 16~2047会占用两个字节
* 字段限制
	* singular： 这个field有且仅有一次
	* repeated： 这个filed可以出现很多次，但是出现的顺序会丢失。如果生命，默认是repeated
	* reserved: 当删除了某个标签，或者字段名称后，需要将入reserved当中，防止后边维护的人继续使用，造成版本不兼容

	
## 数据类型

* [数据类型](https://developers.google.com/protocol-buffers/docs/proto3#scalar)
* 默认值：反序列化的时候，如果接受到的数据不包含，singular字段，则会使用如下默认值





	