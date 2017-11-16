const ActionProto = require("../out/action_pb.js");
const TestProro = require("../out/test_pb.js");


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


console.log()
console.log("test1")
let test1 = new TestProro.Test1();
test1.setId(980);
console.log(test1.serializeBinary());


console.log()
console.log("test2")
let test = new TestProro.Test2();
test.setStr("testing");
console.log(test.serializeBinary());


console.log()
console.log("test3")
let test3 = new TestProro.Test3();
test3.setC(test1);
console.log(test3.serializeBinary());