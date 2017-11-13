{
    "targets":[
        {
            "target_name":"hello",
            "sources":[
              "<!@(find addone -name \*.cc -print)"
            ]
        }
    ],
    "include_dirs" : [
      "<!(node -e \"require('nan')\")"
    ]
}