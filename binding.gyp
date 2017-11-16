{
    "targets":[
        {
            "target_name":"proto_test",
            "sources":[
                "<!@(find addone -name \*.cc -print)",
                "<!@(find out -name \*.cc -print)"
            ],
            "include_dirs" : [
                "<!(node -e \"require('nan')\")",
                "<!(pwd)/vender"
            ],
            
            "cflags": ["-std=c++11", "-rtti"],
            "conditions": [
                ['OS == "mac"', {
                    "libraries": [
                        "/usr/local/lib/libprotobuf.dylib"
                    ],
                    'xcode_settings': {
                        "GCC_ENABLE_CPP_RTTI":"YES",
                        'OTHER_CFLAGS': [
                            "-std=c++11",
                            "-stdlib=libc++"
                        ]
                    }
                }]
            ]
            
        }
    ]
}