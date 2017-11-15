const addones = require("../build/Release/proto_test.node");
const ActionProto = require("../out/action_pb.js");

const scope = [
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },{
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  },
  {
    functionType:"SUM",
    refArgs: {
      index: 1,
      argumentIndex: 1
    }
  }
];



let message = JSON.stringify(scope)
console.time("json");
addones.json(message);
console.timeEnd("json");
console.log();

let action = new ActionProto.Action();
action.setFunctiontype(ActionProto.Action.FunctionType.SUM);
var refArg = new ActionProto.Action.RefArgument();
refArg.setIndex(1);
refArg.setArgumentindex(1);
action.addRefargs(refArg);


let bytes = action.serializeBinary();
let msg = [Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes),Buffer.from(bytes)]
console.time("proto");
addones.proto(msg);
console.timeEnd("proto");



