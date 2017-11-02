cmake_minimum_required(VERSION 3.5)
set(CMAKE_CXX_STANDARD 11)

file(GLOB SRC
        ${CMAKE_CURRENT_SOURCE_DIR}/out/*.cc)

find_package(Protobuf REQUIRED)

add_executable(01 src/first_demo.cc ${SRC})
target_link_libraries(01 ${PROTOBUF_LIBRARIES})

add_executable(02 src/enum_test.cc ${SRC})
target_link_libraries(02 ${PROTOBUF_LIBRARIES})
