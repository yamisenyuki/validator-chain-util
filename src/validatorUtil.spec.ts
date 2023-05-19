
import {ValidatorSchema, validatorCheck, validatorSchemaCheck} from "./validatorUtil"
import valid from "./validatorWrapper"

describe("validatorCheck",()=>{
  test("object",()=>{
    expect(validatorCheck({pass:true,msg:"",data:[]})).toBe(true)
    expect(validatorCheck({pass:false,msg:"",data:[]})).toBe(false)
  })

  test("array",()=>{
    expect(validatorCheck([{pass:true,msg:"",data:[]},{pass:true,msg:"",data:[]}])).toBe(true)
    expect(validatorCheck([{pass:false,msg:"",data:[]},{pass:true,msg:"",data:[]}])).toBe(false)
    expect(validatorCheck([{pass:false,msg:"",data:[]},{pass:false,msg:"",data:[]}])).toBe(false)
  })
})

describe("validatorSchema",()=>{
  const obj = {
    testStr:"test",
    testNumber:13,
    testFloat:13.13,
    testBoolean:true,
    testArray:[1,2,3],
    testObject:{
      a:1,
      b:2,
      c:3
    },
    testObjArray:[
      {
        a:1,
        b:2,
        c:3
      },
      {
        a:4,
        b:5,
        c:6
      }
    ],
    testOptional:undefined,
    testNull:null,
    testNaN:NaN,
    testEmpty:"",
  }
  test("test1",()=>{
    const schema:ValidatorSchema={
      testStr:valid().contains("te"),
      testNumber:valid().isInt(),
      testFloat:valid().isFloat(),
      testBoolean:valid().isBoolean(),
      testArray:valid().isArray(),
      testObject:valid().isObject(),
      testObjArray:valid().isArray(),
      "testObjArray.*.a":valid().isInt(),
      "testObjArray.*.b":valid().isInt(),
      "testArray.*":valid().isInt(),
    }
    expect(validatorCheck(validatorSchemaCheck(schema,obj))).toBe(true)
  })
  test("test2",()=>{
    const schema:ValidatorSchema={
      testStr:valid().contains("te"),
      testNumber:valid().isInt(),
      testFloat:valid().isFloat(),
      testBoolean:valid().isBoolean(),
      testArray:valid().isArray(),
      testObject:valid().isObject(),
      testObjArray:valid().isArray(),
      "testObjArray.*.a":valid().isInt(),
      "testObjArray.*.b":valid().isInt(),
      "testArray.*":valid().isInt({min:3}),
    }
    expect(validatorCheck(validatorSchemaCheck(schema,obj))).toBe(false)
  })
  
})