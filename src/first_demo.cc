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