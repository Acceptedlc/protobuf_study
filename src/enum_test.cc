#include <iostream>

#include "../out/enum_test.pb.h"

int main() {
  test::enums::SearchRequest s;

  s.set_corpus(test::enums::SearchRequest_Corpus::SearchRequest_Corpus_LOCAL);
  return 1;
}