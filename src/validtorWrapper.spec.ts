import valid from "./validatorWrapper"

describe("validatorWrapper Sync",()=>{
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

  test("string",()=>{
    expect(valid("testStr").notEmpty().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testStr").notEmpty().withMessage("testStr is empty").run({testStr:""})).toEqual({pass:false,msg:"testStr is empty",data:[
      {fun:"_notEmpty",msg:"testStr is empty",pass:false}
    ]})
    expect(valid("testStr").notEmpty().isLength({min:5}).withMessage("testStr is too short").run(obj)).toEqual({pass:false,msg:"testStr is too short",data:[
      {fun:"_isLength",msg:"testStr is too short",pass:false}
    ]})
    expect(valid("testStr").notEmpty().isLength({min:1}).withMessage("testStr is too short").run(obj)).toEqual({pass:true,msg:"",data:[]})
  })

  test("number",()=>{
    expect(valid("testNumber").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testNumber").isInt().withMessage("testNumber is not int").run({testNumber:13.13})).toEqual({pass:false,msg:"testNumber is not int",data:[
      {fun:"_isInt",msg:"testNumber is not int",pass:false}
    ]})
    expect(valid("testNumber").isInt().withMessage("testNumber is not int").run({testNumber:"test"})).toEqual({pass:false,msg:"testNumber is not int",data:[
      {fun:"_isInt",msg:"testNumber is not int",pass:false}
    ]})

    expect(valid("testFloat").isFloat().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testFloat").isFloat({min:13}).withMessage("testFloat is too small").run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testFloat").isFloat({min:14}).withMessage("testFloat is too small").run(obj)).toEqual({pass:false,msg:"testFloat is too small",data:[
      {fun:"_isFloat",msg:"testFloat is too small",pass:false}
    ]})

    expect(valid("testNaN").isFloat().run(obj)).toEqual({pass:false,msg:"_isFloat",data:[
      {fun:"_isFloat",msg:"_isFloat",pass:false}
    ]})
  })

  test("boolean",()=>{
    expect(valid("testBoolean").isBoolean().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testBoolean").isBoolean().run({testBoolean:"test"})).toEqual({pass:false,msg:"_isBoolean",data:[
      {fun:"_isBoolean",msg:"_isBoolean",pass:false}
    ]})
  })

  test("array",()=>{
    expect(valid("testArray").isArray().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testArray").isArray().run({testArray:"test"})).toEqual({pass:false,msg:"_isArray",data:[
      {fun:"_isArray",msg:"_isArray",pass:false}
    ]})

    expect(valid("testArray.*").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testArray.*").isInt().run({testArray:[1,2,"test"]})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})

    expect(valid("testObjArray").isArray().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testObjArray.*.a").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testObjArray.*.a").isInt().run({testObjArray:[{a:1},{a:"test"}]})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})
  })

  test("object",()=>{
    expect(valid("testObject").isObject().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testObject").isObject().run({testObject:"test"})).toEqual({pass:false,msg:"_isObject",data:[
      {fun:"_isObject",msg:"_isObject",pass:false}
    ]})

    expect(valid("testObject.*").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testObject.*").isInt().run({testObject:{a:1,b:"test"}})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})

    expect(valid("testObject.a").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testObject.a").isInt().run({testObject:{a:"test"}})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})
  })

  test("optional",()=>{
    expect(valid("testOptional").optional().isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testOptional").optional().isInt().run({testOptional:"test"})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})

    expect(valid("testOptional").optional().isInt().run({})).toEqual({pass:true,msg:"",data:[]})

    expect(valid("testNull").optional().isInt().run(obj)).toEqual({pass:false,msg:"must value",data:[
      {fun:"",msg:"must value",pass:false}
    ]})

    expect(valid("testNull").allowNull().isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testNull").allowNull().isInt().run({testNull:"test"})).toEqual({pass:false,msg:"_isInt",data:[
      {fun:"_isInt",msg:"_isInt",pass:false}
    ]})
    expect(valid("testOptional").allowNull().isInt().run(obj)).toEqual({pass:false,msg:"must value",data:[
      {fun:"",msg:"must value",pass:false}
    ]})

    expect(valid("testOptional").optional().allowNull().isInt().run({testOptional:null})).toEqual({pass:true,msg:"",data:[]})
  })

  test("customer",()=>{
    expect(valid("testStr").customer((value)=>value==="test").run(obj)).toEqual({pass:true,msg:"",data:[]})
    expect(valid("testStr").customer((value)=>value==="test").run({testStr:"test1"})).toEqual({pass:false,msg:"_customer",data:[
      {fun:"_customer",msg:"_customer",pass:false}
    ]})
  })

})

// describe("validatorWrapper async",()=>{
//   const obj = {
//     testStr:"test",
//     testNumber:13,
//     testFloat:13.13,
//     testBoolean:true,
//     testArray:[1,2,3],
//     testObject:{
//       a:1,
//       b:2,
//       c:3
//     },
//     testObjArray:[
//       {
//         a:1,
//         b:2,
//         c:3
//       },
//       {
//         a:4,
//         b:5,
//         c:6
//       }
//     ],
//     testOptional:undefined,
//     testNull:null,
//     testNaN:NaN,
//     testEmpty:"",
//   }

//   test("string",async ()=>{
//     expect(await valid("testStr").notEmpty().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testStr").notEmpty().withMessage("testStr is empty").run({testStr:""})).toEqual({pass:false,msg:"testStr is empty",data:[
//       {fun:"_notEmpty",msg:"testStr is empty",pass:false}
//     ]})
//     expect(await valid("testStr").notEmpty().isLength({min:5}).withMessage("testStr is too short").run(obj)).toEqual({pass:false,msg:"testStr is too short",data:[
//       {fun:"_isLength",msg:"testStr is too short",pass:false}
//     ]})
//     expect(await valid("testStr").notEmpty().isLength({min:1}).withMessage("testStr is too short").run(obj)).toEqual({pass:true,msg:"",data:[]})
//   })

//   test("number",async ()=>{
//     expect(await valid("testNumber").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testNumber").isInt().withMessage("testNumber is not int").run({testNumber:13.13})).toEqual({pass:false,msg:"testNumber is not int",data:[
//       {fun:"_isInt",msg:"testNumber is not int",pass:false}
//     ]})
//     expect(await valid("testNumber").isInt().withMessage("testNumber is not int").run({testNumber:"test"})).toEqual({pass:false,msg:"testNumber is not int",data:[
//       {fun:"_isInt",msg:"testNumber is not int",pass:false}
//     ]})

//     expect(await valid("testFloat").isFloat().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testFloat").isFloat({min:13}).withMessage("testFloat is too small").run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testFloat").isFloat({min:14}).withMessage("testFloat is too small").run(obj)).toEqual({pass:false,msg:"testFloat is too small",data:[
//       {fun:"_isFloat",msg:"testFloat is too small",pass:false}
//     ]})

//     expect(await valid("testNaN").isFloat().run(obj)).toEqual({pass:false,msg:"_isFloat",data:[
//       {fun:"_isFloat",msg:"_isFloat",pass:false}
//     ]})
//   })

//   test("boolean",async ()=>{
//     expect(await valid("testBoolean").isBoolean().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testBoolean").isBoolean().run({testBoolean:"test"})).toEqual({pass:false,msg:"_isBoolean",data:[
//       {fun:"_isBoolean",msg:"_isBoolean",pass:false}
//     ]})
//   })

//   test("array",async ()=>{
//     expect(await valid("testArray").isArray().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testArray").isArray().run({testArray:"test"})).toEqual({pass:false,msg:"_isArray",data:[
//       {fun:"_isArray",msg:"_isArray",pass:false}
//     ]})

//     expect(await valid("testArray.*").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testArray.*").isInt().run({testArray:[1,2,"test"]})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})

//     expect(await valid("testObjArray").isArray().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testObjArray.*.a").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testObjArray.*.a").isInt().run({testObjArray:[{a:1},{a:"test"}]})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})
//   })

//   test("object",async ()=>{
//     expect(await valid("testObject").isObject().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testObject").isObject().run({testObject:"test"})).toEqual({pass:false,msg:"_isObject",data:[
//       {fun:"_isObject",msg:"_isObject",pass:false}
//     ]})

//     expect(await valid("testObject.*").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testObject.*").isInt().run({testObject:{a:1,b:"test"}})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})

//     expect(await valid("testObject.a").isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testObject.a").isInt().run({testObject:{a:"test"}})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})
//   })

//   test("optional",async ()=>{
//     expect(await valid("testOptional").optional().isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testOptional").optional().isInt().run({testOptional:"test"})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})

//     expect(await valid("testOptional").optional().isInt().run({})).toEqual({pass:true,msg:"",data:[]})

//     expect(await valid("testNull").optional().isInt().run(obj)).toEqual({pass:false,msg:"must value",data:[
//       {fun:"",msg:"must value",pass:false}
//     ]})

//     expect(await valid("testNull").allowNull().isInt().run(obj)).toEqual({pass:true,msg:"",data:[]})
//     expect(await valid("testNull").allowNull().isInt().run({testNull:"test"})).toEqual({pass:false,msg:"_isInt",data:[
//       {fun:"_isInt",msg:"_isInt",pass:false}
//     ]})
//     expect(await valid("testOptional").allowNull().isInt().run(obj)).toEqual({pass:false,msg:"must value",data:[
//       {fun:"",msg:"must value",pass:false}
//     ]})

//     expect(await valid("testOptional").optional().allowNull().isInt().run({testOptional:null})).toEqual({pass:true,msg:"",data:[]})
//   })

// })