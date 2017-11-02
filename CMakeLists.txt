cmake_minimum_required(VERSION 3.5)
set(CMAKE_CXX_STANDARD 11)

file(GLOB SRC
        ${CMAKE_CURRENT_SOURCE_DIR}/out/*.cc
        ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc)

find_package(Protobuf REQUIRED)

add_executable(01 ${SRC})
target_link_libraries(01 ${PROTOBUF_LIBRARIES})
