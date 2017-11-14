#include <iostream>
#include <cstdint>

#include <nan.h>
#include "../out/image.pb.h"
#include "../out/action.pb.h"

void Method(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  char* buffer = (char*) node::Buffer::Data(info[0]->ToObject());
  int length = node::Buffer::Length(info[0]->ToObject());
  std::string s(buffer,length);

  eci::protobuf::Action action;
  action.ParseFromString(s);

  std::cout << action.DebugString() << std::endl;

}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(hello, Init)