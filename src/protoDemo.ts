const addones = require("../build/Release/proto_test.node");
const ActionProto = require("../out/action_pb.js");

let action = new ActionProto.Action();
action.setFunctiontype(ActionProto.Action.FunctionType.SUM);
var refArg = new ActionProto.Action.RefArgument();
refArg.setIndex(1);
refArg.setArgumentindex(1);
action.addRefargs(refArg);

console.time("start");
let bytes = action.serializeBinary();
addones.hello(Buffer.from(bytes));
console.timeEnd("start");

