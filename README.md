## Overview
validator-chain-util is a utility library for the [validator.js](https://github.com/validatorjs/validator.js) project.
You can verify data through chain functions, or use schema to verify data.
It supports wildcard attribute selectors, you can use wildcards to validate data inside arrays or objects.

## Index
[Getting Started](#getting-started)
- [Overview](#overview)
- [Index](#index)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Examples](#examples)
    - [Test Object](#test-object)
    - [Use Chain Function](#use-chain-function)
    - [Use Schema](#use-schema)
  - [Advanced Usage](#advanced-usage)
    - [Wildcard](#wildcard)
    - [Bail Function](#bail-function)
    - [Optional / Allow Null / notEmpty](#optional--allow-null--notempty)
    - [Custom Validator](#custom-validator)
    - [Custom Error Message](#custom-error-message)

## Getting Started

### Installation
```bash
# NPM 
npm install validator-chain-util

# Yarn
yarn add validator-chain-util
```


### Usage
#### JavaScript
```javascript
const { valid,validatorCheck} = require('validator-chain-util');  // only chain
const { valid,validatorSchema,validatorCheck } = require('validator-chain-util'); // chain and schema
```

#### TypeScript
```typescript
import valid,{validatorCheck} from 'validator-chain-util'; // only chain
import valid,{validatorSchema,validatorCheck} from 'validator-chain-util'; // chain and schema
```

### Examples
#### Test Object
```typescript
const testObj = {
  name: 'test',
  age: 18,
  email: '12345@gmail.com',
  files: [
    {
      name: 'test1',
      size: 100,
    },
    {
      name: 'test2',
      size: 200,
    },
  ],
}
```

#### Use Chain Function
```typescript

const emailCheck = valid("email").isEmail().run(testObj)
// {pass: true, msg: '',data:[]}

const nameCheck = valid("name")
  .notEmpty()
  .isLength({ min: 5 })
  .withMessage("name is too short")
  .run(testObj)
// {
//   pass: false,
//   msg: 'name is too short',
//   data: [ { pass: false, fun: '_isLength', msg: 'name is too short' } ]
// }

console.log(valid("age").isInt().run(testObj))
// {pass: true, msg: '',data:[]}

/* Optional field check */
console.log(valid("phone")
  .optional() // If the field is not present, skip the check
  .isMobilePhone()
  .run(testObj))
// {pass: true, msg: '',data:[]}

/* Check the data in the array */
console.log(
  valid("files.1.name")
  .notEmpty()
  .isLength({ min: 5 })
  .withMessage("name is too short")
  .run(testObj))
// { pass: true, msg: '', data: [] }

/* use validatorCheck */
validatorCheck(emailCheck) // true
validatorCheck(nameCheck) // false
validatorCheck([emailCheck, nameCheck]) // false

```

#### Use Schema
```typescript
const schema = {
  name: valid().notEmpty().isLength({ min: 5 }),
  age: valid().isInt(),
  email: valid().isEmail(),
  files: valid().isArray()
}

const checkResult = validatorSchemaCheck(schema, testObj)
// [
//   { pass: false, msg: '_isLength', data: [ [Object] ] },
//   { pass: true, msg: '', data: [] },
//   { pass: true, msg: '', data: [] },
//   { pass: true, msg: '', data: [] }
// ]

/* use validatorCheck */
validatorCheck(checkResult) // false
```

### Advanced Usage
#### Wildcard
```typescript
valid("files.*.name")
  .notEmpty()
  .isLength({ min: 5 })
  .withMessage("name is too short")
  .run(testObj)
// { pass: true, msg: '', data: [] }

valid("files.*")
  .isObject()
  .run(testObj)
// { pass: true, msg: '', data: [] }

valid("a.*.*").isInt().run({ a: { b: { c: 1 } } })
// { pass: true, msg: '', data: [] }

/* schema */
const schema = {
  files: valid().isArray(),
  "files.*.name": valid().notEmpty().isLength({ min: 5 }),
  "files.*.size": valid().isInt(),
}

validatorSchemaCheck(schema, testObj) // pass
```

#### Bail Function
`bail()` will stop checking if the current check fails
```typescript
valid("name")
  .isLength({ min: 6 })
  .withMessage("name length must > 6")
  .isLength({ min: 5 })
  .withMessage("name length must > 5")
  .run(testObj)
// {
//   pass: false,
//   msg: 'name length must > 6',
//   data: [ 
//            { pass: false, fun: '_isLength', msg: 'name length must > 6' }
//            { pass: false, fun: '_isLength', msg: 'name length must > 5' }
//         ]
// }

valid("name")
  .isLength({ min: 6 })
  .withMessage("name length must > 6")
  .bail()  // If the current check fails, stop checking
  .isLength({ min: 5 })
  .withMessage("name length must > 5")
  .run(testObj)
// {
//   pass: false,
//   msg: 'name length must > 6',
//   data: [{ pass: false, fun: '_isLength', msg: 'name length must > 6' }]
// }
```

#### Optional / Allow Null / notEmpty
`optional()` and `allowNull()` are different, `optional()` will skip the check if the field is not present, `allowNull()` will skip check the field if the field is present, but the value is null.
`notEmpty()` will check the field is "".
| optional() | allowNull() | notEmpty() | input value                                                                                                                                                                                        |
| ---------- | ----------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| false      | false       | false      | :x:`undefined` must value error, stop checking <br> :x:`null` must value error, stop checking <br> :arrow_forward: `""` check next function <br> :arrow_forward:`normal value` check next function |
| true       | false       | false      | :white_check_mark:`undefined` skip all check <br> :x:`null`  must value error, stop checking <br> :arrow_forward: `""` check next function <br> :arrow_forward:`normal value` check next function  |
| false      | true        | false      | :x:`undefined` must value error, stop checking <br> :white_check_mark:`null` skip all check <br> :arrow_forward: `""` check next function <br> :arrow_forward:`normal value` check next function   |
| false      | false       | true       | :x:`undefined` must value error, stop checking <br> :x:`null` must value error, stop checking <br> :x:`""` _notEmpty error, then check next <br> :arrow_forward:`normal value` check next function |
| true       | true        | false      | :white_check_mark:`undefined` skip all check <br> :white_check_mark:`null` skip all check <br> :arrow_forward: `""` check next function <br> :arrow_forward:`normal value` check next function     |
| false      | true        | true       | :x:`undefined` must value error, stop checking  <br> :white_check_mark:`null` skip all check <br> :x:`""` _notEmpty error, then check next <br> :arrow_forward:`normal value` check next function  |
| true       | false       | true       | :white_check_mark:`undefined` skip all check <br> :x:`null`  must value error, stop checking <br> :x:`""` _notEmpty error, then check next <br> :arrow_forward:`normal value` check next function  |
| true       | true        | true       | :white_check_mark:`undefined` skip all check <br> :white_check_mark:`null` skip all check <br> :x:`""` _notEmpty error, then check next <br> :arrow_forward:`normal value` check next function     |


```typescript
valid("email").isEmail().run({})
// {
//   pass: false,
//   msg: 'must value',
//   data: [ { pass: false, fun: '', msg: 'must value' } ]
// }

/* Optional Filed */
// If the field is not present, skip the check
// If the field is null,cannot skip the check
valid("email").optional().isEmail().run({})
// { pass: true, msg: '', data: [] }
valid("email").optional().isEmail().run({email:null})
// {
//   pass: false,
//   msg: 'must value',
//   data: [ { pass: false, fun: '', msg: 'must value' } ]
// }

/* Allow Null */
// If the field is not present, cannot skip the check
// If the field is null, skip the check
valid("email").allowNull().isEmail().run({})
// {
//   pass: false,
//   msg: 'must value',
//   data: [ { pass: false, fun: '', msg: 'must value' } ]
// }
valid("email").allowNull().isEmail().run({email:null})
// { pass: true, msg: '', data: [] }

/* notEmpty */
// If the field is empty (is ""), the check will fail
valid("email").notEmpty().isEmail().run({email:""})
// {
//   pass: false,
//   msg: '_notEmpty',
//   data: [ { pass: false, fun: '_notEmpty', msg: '_notEmpty' } ]
// }
```

#### Custom Validator
```typescript
valid().customer((value:string,rawValue:any):boolean=>{
  if(value === 'test'){
    return true
  }
  return false
}).run(testObj)

// value is the input value to string
// rawValue is the input value to raw type
```

#### Custom Error Message
```typescript
valid("name")
.isLength({min:5})
.withMessage('name is too short')
.contains('test')
.withMessage('name must contains test')
.run(testObj)
```


