const ActionProto = require("../out/action_pb.js");


let action = new ActionProto.Action();
action.setFunctiontype(ActionProto.Action.FunctionType.SUM);
var refArg = new ActionProto.Action.RefArgument();
refArg.setIndex(1);
refArg.setArgumentindex(1);
action.addRefargs(refArg);


console.log("序列化的bytes:");
let bytes = action.serializeBinary();
console.log(bytes);

console.log();


console.log("反序列化:")
let action2 = ActionProto.Action.deserializeBinary(bytes);
console.log(action2.toObject());