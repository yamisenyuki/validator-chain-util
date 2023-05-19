import { isArray } from 'lodash'
import { ValidatorResult, ValidatorWrapper } from './validatorWrapper'


export type ValidatorSchema = {
  [key: string]: ValidatorWrapper
}

function validatorCheck(result: ValidatorResult[]): boolean
function validatorCheck(result: ValidatorResult): boolean
function validatorCheck (result: ValidatorResult|ValidatorResult[]): boolean {
  const checkResult = isArray(result) ? result.map(x => x.pass) : [result.pass]
  const check = !checkResult.some(x => x === false)
  return check
}


function validatorSchemaCheck (schema: ValidatorSchema, data: any): ValidatorResult[] {
  const result: ValidatorResult[] = []
  Object.keys(schema).forEach(key => {
    schema[key].setKey(key)
    result.push(schema[key].run(data))
  })
  return result
}

export {
  validatorCheck,
  validatorSchemaCheck
}
