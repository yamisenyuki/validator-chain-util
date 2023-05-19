import valid from './validatorWrapper'

describe('validatorWrapper Sync', () => {
  const obj = {
    testStr: 'test',
    testNumber: 13,
    testFloat: 13.13,
    testBoolean: true,
    testArray: [1, 2, 3],
    testObject: {
      a: 1,
      b: 2,
      c: 3
    },
    testObjArray: [
      {
        a: 1,
        b: 2,
        c: 3
      },
      {
        a: 4,
        b: 5,
        c: 6
      }
    ],
    testOptional: undefined,
    testNull: null,
    testNaN: NaN,
    testEmpty: '',
  }

  test('string', () => {
    expect(valid('testStr').notEmpty()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testStr').notEmpty()
      .withMessage('testStr is empty')
      .run({ testStr: '' })).toEqual({ pass: false, msg: 'testStr is empty', data: [
      { fun: '_notEmpty', msg: 'testStr is empty', pass: false }
    ] })
    expect(valid('testStr').notEmpty()
      .isLength({ min: 5 })
      .withMessage('testStr is too short')
      .run(obj)).toEqual({ pass: false, msg: 'testStr is too short', data: [
      { fun: '_isLength', msg: 'testStr is too short', pass: false }
    ] })
    expect(valid('testStr').notEmpty()
      .isLength({ min: 1 })
      .withMessage('testStr is too short')
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testStr').notEmpty()
      .contains('test')
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testStr').notEmpty()
      .isArray({ min: 4 })
      .run(obj)).toEqual({ pass: false, msg: '_isArray', data: [
      { fun: '_isArray', msg: '_isArray', pass: false }
    ] })

  })

  test('number', () => {
    expect(valid('testNumber').isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testNumber').isInt()
      .withMessage('testNumber is not int')
      .run({ testNumber: 13.13 })).toEqual({ pass: false, msg: 'testNumber is not int', data: [
      { fun: '_isInt', msg: 'testNumber is not int', pass: false }
    ] })
    expect(valid('testNumber').isInt()
      .withMessage('testNumber is not int')
      .run({ testNumber: 'test' })).toEqual({ pass: false, msg: 'testNumber is not int', data: [
      { fun: '_isInt', msg: 'testNumber is not int', pass: false }
    ] })

    expect(valid('testFloat').isFloat()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testFloat').isFloat({ min: 13 })
      .withMessage('testFloat is too small')
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testFloat').isFloat({ min: 14 })
      .withMessage('testFloat is too small')
      .run(obj)).toEqual({ pass: false, msg: 'testFloat is too small', data: [
      { fun: '_isFloat', msg: 'testFloat is too small', pass: false }
    ] })

    expect(valid('testNaN').isFloat()
      .run(obj)).toEqual({ pass: false, msg: '_isFloat', data: [
      { fun: '_isFloat', msg: '_isFloat', pass: false }
    ] })
  })

  test('boolean', () => {
    expect(valid('testBoolean').isBoolean()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testBoolean').isBoolean()
      .run({ testBoolean: 'test' })).toEqual({ pass: false, msg: '_isBoolean', data: [
      { fun: '_isBoolean', msg: '_isBoolean', pass: false }
    ] })
  })

  test('array', () => {
    expect(valid('testArray').isArray()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testArray').isArray()
      .run({ testArray: 'test' })).toEqual({ pass: false, msg: '_isArray', data: [
      { fun: '_isArray', msg: '_isArray', pass: false }
    ] })

    expect(valid('testArray.*').isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testArray.*').isInt()
      .run({ testArray: [1, 2, 'test'] })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })

    expect(valid('testObjArray').isArray()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testObjArray.*.a').isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testObjArray.*.a').isInt()
      .run({ testObjArray: [{ a: 1 }, { a: 'test' }] })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })
    expect(valid('testObjArray').isArray({ min: 2, max: 2 })
      .bail()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
  })

  test('object', () => {
    expect(valid('testObject').isObject()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testObject').isObject()
      .run({ testObject: 'test' })).toEqual({ pass: false, msg: '_isObject', data: [
      { fun: '_isObject', msg: '_isObject', pass: false }
    ] })

    expect(valid('testObject.*').isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testObject.*').isInt()
      .run({ testObject: { a: 1, b: 'test' } })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })

    expect(valid('testObject.a').isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testObject.a').isInt()
      .run({ testObject: { a: 'test' } })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })
  })

  test('optional', () => {
    expect(valid('testOptional').optional()
      .isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testOptional').optional()
      .isInt()
      .run({ testOptional: 'test' })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })

    expect(valid('testOptional').optional()
      .isInt()
      .run({})).toEqual({ pass: true, msg: '', data: [] })

    expect(valid('testNull').optional()
      .isInt()
      .run(obj)).toEqual({ pass: false, msg: 'must value', data: [
      { fun: '', msg: 'must value', pass: false }
    ] })

    expect(valid('testNull').allowNull()
      .isInt()
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testNull').allowNull()
      .isInt()
      .run({ testNull: 'test' })).toEqual({ pass: false, msg: '_isInt', data: [
      { fun: '_isInt', msg: '_isInt', pass: false }
    ] })
    expect(valid('testOptional').allowNull()
      .isInt()
      .run(obj)).toEqual({ pass: false, msg: 'must value', data: [
      { fun: '', msg: 'must value', pass: false }
    ] })

    expect(valid('testOptional').optional()
      .allowNull()
      .isInt()
      .run({ testOptional: null })).toEqual({ pass: true, msg: '', data: [] })
  })

  test('customer', () => {
    expect(valid('testStr').customer(value => value === 'test')
      .run(obj)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid('testStr').customer(value => value === 'test')
      .run({ testStr: 'test1' })).toEqual({ pass: false, msg: '_customer', data: [
      { fun: '_customer', msg: '_customer', pass: false }
    ] })
    expect(valid('testStr').customer(value => value === 'te')
      .bail()
      .isLength({ min: 3, max: 5 })
      .run({ testStr: 'test1' })).toEqual({ pass: false, msg: '_customer', data: [
      { fun: '_customer', msg: '_customer', pass: false }
    ] })
  })

  test('all function', () => {
    expect(valid().allowNull()
      .run(null)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().equals('test')
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isAlpha()
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isAlphanumeric()
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isAscii()
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isBase64()
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isBefore('2019-01-01')
      .run('2018-01-01')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isBefore('2019-01-01')
      .run('2019-01-01')).toEqual({ pass: false, msg: '_isBefore', data: [
      { fun: '_isBefore', msg: '_isBefore', pass: false }
    ] })

    expect(valid().isBoolean()
      .run(true)).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isBoolean()
      .run('test')).toEqual({ pass: false, msg: '_isBoolean', data: [
      { fun: '_isBoolean', msg: '_isBoolean', pass: false }
    ] })

    expect(valid().isByteLength({ min: 1, max: 4 })
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isEmail()
      .run('123@gmail.com')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isNumeric()
      .run('123')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isIn(['test', 'test1'])
      .run('test')).toEqual({ pass: true, msg: '', data: [] })
    expect(valid().isBase32()
      .run('test')).toEqual({ pass: false, msg: '_isBase32', data: [
      { fun: '_isBase32', msg: '_isBase32', pass: false }
    ] })
    expect(valid().isBIC()
      .run('test')).toEqual({ pass: false, msg: '_isBIC', data: [
      { fun: '_isBIC', msg: '_isBIC', pass: false }
    ] })
    expect(valid().isBtcAddress()
      .run('test')).toEqual({ pass: false, msg: '_isBtcAddress', data: [
      { fun: '_isBtcAddress', msg: '_isBtcAddress', pass: false }
    ] })
    expect(valid().isCreditCard()
      .run('test')).toEqual({ pass: false, msg: '_isCreditCard', data: [
      { fun: '_isCreditCard', msg: '_isCreditCard', pass: false }
    ] })

    expect(valid()
      .trim()
      .rtrim()
      .ltrim()
      .escape()
      .unescape()
      .stripLow()
      .whitelist('test')
      .blacklist('')
      .contains('test')
      .equals('test')
      .isAlpha()
      .isAlphanumeric()
      .isAscii()
      .isBase32()
      .isBase58()
      .isBase64()
      .isBefore()
      .isBIC()
      .isBoolean()
      .isBtcAddress()
      .isByteLength({ min: 1 })
      .isCreditCard()
      .isDataURI()
      .isDate()
      .isDivisibleBy(1)
      .isEAN()
      .isEmail()
      .isEmpty()
      .isEthereumAddress()
      .isFloat()
      .isFQDN()
      .isFullWidth()
      .isHalfWidth()
      .isHash('md4')
      .isHexadecimal()
      .isHexColor()
      .isHSL()
      .isIBAN()
      .isIdentityCard('ES')
      .isIMEI()
      .isIn(['test', 'test1'])
      .isInt()
      .isIP('4')
      .isIPRange()
      .isISIN()
      .isISO8601()
      .isISO31661Alpha2()
      .isISO31661Alpha3()
      .isISO4217()
      .isISRC()
      .isISSN()
      .isJSON()
      .isJWT()
      .isLatLong()
      .isLength()
      .isLocale()
      .isLowercase()
      .isMACAddress()
      .isMagnetURI()
      .isMD5()
      .isMimeType()
      .isMobilePhone('en-US')
      .isMongoId()
      .isMultibyte()
      .isNumeric()
      .isOctal()
      .isPassportNumber()
      .isPort()
      .isPostalCode('US')
      .isRFC3339()
      .isRgbColor()
      .isSemVer()
      .isSurrogatePair()
      .isUppercase()
      .isSlug()
      .isTime()
      .isTaxID()
      .isURL()
      .isUUID()
      .isVariableWidth()
      .isVAT('US')
      .isWhitelisted('test')
      .isCurrency({ symbol: '$' })
      .isISBN(13)
      .notNaN()
      .matches(/test/)
      .run('test')).toEqual({
      pass: false,
      msg: '_isBase32',
      data: [
        { pass: false, fun: '_isBase32', msg: '_isBase32' },
        { pass: false, fun: '_isBefore', msg: '_isBefore' },
        { pass: false, fun: '_isBIC', msg: '_isBIC' },
        { pass: false, fun: '_isBoolean', msg: '_isBoolean' },
        { pass: false, fun: '_isBtcAddress', msg: '_isBtcAddress' },
        { pass: false, fun: '_isCreditCard', msg: '_isCreditCard' },
        { pass: false, fun: '_isDataURI', msg: '_isDataURI' },
        { pass: false, fun: '_isDate', msg: '_isDate' },
        { pass: false, fun: '_isDivisibleBy', msg: '_isDivisibleBy' },
        { pass: false, fun: '_isEAN', msg: '_isEAN' },
        { pass: false, fun: '_isEmail', msg: '_isEmail' },
        { pass: false, fun: '_isEmpty', msg: '_isEmpty' },
        {
          pass: false,
          fun: '_isEthereumAddress',
          msg: '_isEthereumAddress'
        },
        { pass: false, fun: '_isFloat', msg: '_isFloat' },
        { pass: false, fun: '_isFQDN', msg: '_isFQDN' },
        { pass: false, fun: '_isFullWidth', msg: '_isFullWidth' },
        { pass: false, fun: '_isHash', msg: '_isHash' },
        { pass: false, fun: '_isHexadecimal', msg: '_isHexadecimal' },
        { pass: false, fun: '_isHexColor', msg: '_isHexColor' },
        { pass: false, fun: '_isHSL', msg: '_isHSL' },
        { pass: false, fun: '_isIBAN', msg: '_isIBAN' },
        { pass: false, fun: '_isIdentityCard', msg: '_isIdentityCard' },
        { pass: false, fun: '_isIMEI', msg: '_isIMEI' },
        { pass: false, fun: '_isInt', msg: '_isInt' },
        { pass: false, fun: '_isIP', msg: '_isIP' },
        { pass: false, fun: '_isIPRange', msg: '_isIPRange' },
        { pass: false, fun: '_isISIN', msg: '_isISIN' },
        { pass: false, fun: '_isISO8601', msg: '_isISO8601' },
        { pass: false, fun: '_isISO31661Alpha2', msg: '_isISO31661Alpha2' },
        { pass: false, fun: '_isISO31661Alpha3', msg: '_isISO31661Alpha3' },
        { pass: false, fun: '_isISO4217', msg: '_isISO4217' },
        { pass: false, fun: '_isISRC', msg: '_isISRC' },
        { pass: false, fun: '_isISSN', msg: '_isISSN' },
        { pass: false, fun: '_isJSON', msg: '_isJSON' },
        { pass: false, fun: '_isJWT', msg: '_isJWT' },
        { pass: false, fun: '_isLatLong', msg: '_isLatLong' },
        { pass: false, fun: '_isMACAddress', msg: '_isMACAddress' },
        { pass: false, fun: '_isMagnetURI', msg: '_isMagnetURI' },
        { pass: false, fun: '_isMD5', msg: '_isMD5' },
        { pass: false, fun: '_isMimeType', msg: '_isMimeType' },
        { pass: false, fun: '_isMobilePhone', msg: '_isMobilePhone' },
        { pass: false, fun: '_isMongoId', msg: '_isMongoId' },
        { pass: false, fun: '_isMultibyte', msg: '_isMultibyte' },
        { pass: false, fun: '_isNumeric', msg: '_isNumeric' },
        { pass: false, fun: '_isOctal', msg: '_isOctal' },
        { pass: false, fun: '_isPassportNumber', msg: '_isPassportNumber' },
        { pass: false, fun: '_isPort', msg: '_isPort' },
        { pass: false, fun: '_isPostalCode', msg: '_isPostalCode' },
        { pass: false, fun: '_isRFC3339', msg: '_isRFC3339' },
        { pass: false, fun: '_isRgbColor', msg: '_isRgbColor' },
        { pass: false, fun: '_isSemVer', msg: '_isSemVer' },
        { pass: false, fun: '_isSurrogatePair', msg: '_isSurrogatePair' },
        { pass: false, fun: '_isUppercase', msg: '_isUppercase' },
        { pass: false, fun: '_isTime', msg: '_isTime' },
        { pass: false, fun: '_isTaxID', msg: '_isTaxID' },
        { pass: false, fun: '_isURL', msg: '_isURL' },
        { pass: false, fun: '_isUUID', msg: '_isUUID' },
        { pass: false, fun: '_isVariableWidth', msg: '_isVariableWidth' },
        { pass: false, fun: '_isVAT', msg: '_isVAT' },
        { pass: false, fun: '_isCurrency', msg: '_isCurrency' },
        { pass: false, fun: '_isISBN', msg: '_isISBN' },
        { pass: false, fun: '_notNaN', msg: '_notNaN' }
      ]
    })
  })

})
