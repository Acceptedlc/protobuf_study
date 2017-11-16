#include <iostream>
#include <cstdint>

#include <rapidjson/document.h>
#include <nan.h>
#include "../out/image.pb.h"
#include "../out/action.pb.h"

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

NAN_METHOD(Json) {
  std::string compute_json = std::string(*(v8::String::Utf8Value(info[0]->ToString())));
  rapidjson::Document d;
  d.Parse(compute_json.data());
  for (auto& v : d.GetArray())
    printf("%s \n ", v.GetObject()["functionType"].GetString());
}

void Init(v8::Local<v8::Object> exports) {
  Nan::SetMethod(exports, "proto", Proro);
  Nan::SetMethod(exports, "json", Json);
}

NODE_MODULE(proto, Init)