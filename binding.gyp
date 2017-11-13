{
    "targets":[
        {
            "target_name":"proto_test",
            "sources":[
              "<!@(find addone -name \*.cc -print)"
              "<!@(find out -name \*.cc -print)"
            ]
        }
    ],
    "include_dirs" : [
      "<!(node -e \"require('nan')\")"
      "<!@(find out -name \*.h -print)"
    ]
}