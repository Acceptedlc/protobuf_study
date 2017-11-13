mkdir -p out
cd proto_file
protoc --cpp_out=../out image.proto action.proto
protoc --js_out=import_style=commonjs,binary:../out image.proto action.proto