const ActionProto = require("../out/action_pb.js");
const TestProro = require("../out/test_pb.js");


console.log("First Simple Message")
let test1 = new TestProro.Test1();
test1.setId(980);
console.log(test1.serializeBinary());

console.log();
console.log("有符号正数")
let test2 = new TestProro.Test2();
test2.setId(1);
console.log(test2.serializeBinary());
test2 = new TestProro.Test2();
test2.setId(-1);
console.log(test2.serializeBinary());

console.log();
console.log("字符串的编码")
let test3 = new TestProro.Test3();
test3.setStr("aaa");
console.log(test3.serializeBinary());


console.log();
console.log("嵌套Message")
let test4 = new TestProro.Test4();
test4.setC(test1);
console.log(test4.serializeBinary());

// console.log()
// console.log("test2")
// let test = new TestProro.Test2();
// test.setStr("testing");
// console.log(test.serializeBinary());


// console.log()
// console.log("test3")
// let test3 = new TestProro.Test3();
// test3.setC(test1);
// console.log(test3.serializeBinary());



// let action = new ActionProto.Action();
// action.setFunctiontype(ActionProto.Action.FunctionType.SUM);
// var refArg = new ActionProto.Action.RefArgument();
// refArg.setIndex(1);
// refArg.setArgumentindex(1);
// action.addRefargs(refArg);


// console.log("序列化的bytes:");
// let bytes = action.serializeBinary();
// console.log(bytes);

// console.log();