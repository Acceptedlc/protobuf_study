cmake_minimum_required(VERSION 3.5)
set(CMAKE_CXX_STANDARD 11)

find_package(Protobuf REQUIRED)

include_directories(../out)

file(GLOB SRC
        ../out/*.cc)

add_executable(main main.cc ${SRC})
target_link_libraries(main ${PROTOBUF_LIBRARIES})



