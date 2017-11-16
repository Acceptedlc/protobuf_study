#include <iostream>

#include <image.pb.h>

using eci::protobuf::Image;
using std::cout;
using std::endl;

int main() {
  Image image;
  image.set_cloudcover(1.1);
  image.set_index(2);

  Image::File * file = image.add_files();
  file -> set_path("test/data/B03.jp2");
  file -> set_band(1);

  cout << "cloud of image: " << image.cloudcover() << endl;
  cout << "total file number: " << image.files_size()  <<endl;
  for(auto file : image.files())
  {
    cout <<  file.path() << " " << file.band() <<endl;
  }

  cout << "index: " << image.index()  <<endl;

  std::string out;
  image.SerializeToString(&out);
  cout << out.length() <<endl;
  for(auto ch : out){
    cout << (int)ch << ",";
  }
  cout << endl;
  cout << image.DebugString() << endl;
  return 1;
}