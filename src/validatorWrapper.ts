import { get, isArray, isNil, isNull, isObject, isUndefined } from 'lodash'
import validator from 'validator'
import objectProcess from './objectProcess'

type ValidAction = `_${keyof Omit<ValidatorWrapper, 'run'|'withMessage'|'result'|'optional'|'allowNull'|"setKey">}`

type ValidatorResultItem = {
  fun: string
  msg: string
  pass: boolean
}
export type ValidatorResult ={
  pass: boolean
  msg: string
  data:ValidatorResultItem[]
}

export class ValidatorWrapper {
  private _key?: string
  private _v = ''
  private _rawV: any
  private _result: ValidatorResultItem[] = []
  private _isOptional = false
  private _chian: {fun: ValidAction, options?: any, msg?: string}[] = []
  private _isBail = false
  private _allowNull = false

  constructor (key?: string) {
    this._key = key
  }

  public setKey(key?:string){
    this._key = key
  }

  private _notEmpty (options?: validator.IsEmptyOptions) {
    return !validator.isEmpty(this._v, options)
  }

  public notEmpty (msg?: string, options?: validator.IsEmptyOptions) {
    this._chian.push({ fun: '_notEmpty', options, msg })
    return this
  }

  public withMessage (msg: string) {
    if (this._chian[this._chian.length - 1]) {
      this._chian[this._chian.length - 1].msg = msg
    }
    return this
  }

  public optional () {
    this._isOptional = true
    return this
  }

  public allowNull () {
    this._allowNull = true
    return this
  }

  public isEmail (options?: validator.IsEmailOptions) {
    this._chian.push({ fun: '_isEmail', options })
    return this
  }

  private _isEmail (options?: validator.IsEmailOptions) {
    return validator.isEmail(this._v, options)
  }

  public isLength (options?: validator.IsLengthOptions) {
    this._chian.push({ fun: '_isLength', options })
    return this
  }

  private _isLength (options?: validator.IsLengthOptions) {
    return validator.isLength(this._v, options)
  }

  public isBoolean (options?: {loose?: boolean}) {
    this._chian.push({ fun: '_isBoolean', options })
    return this
  }

  private _isBoolean (options?: {loose?: boolean}) {
    return validator.isBoolean(this._v, options)
  }

  public isNumeric (options?: validator.IsNumericOptions) {
    this._chian.push({ fun: '_isNumeric', options })
    return this
  }

  private _isNumeric (options?: validator.IsNumericOptions) {
    return validator.isNumeric(this._v, options)
  }

  public isInt (options?: validator.IsIntOptions) {
    this._chian.push({ fun: '_isInt', options })
    return this
  }

  private _isInt (options?: validator.IsIntOptions) {
    return validator.isInt(this._v, options)
  }

  public isFloat (options?: validator.IsFloatOptions) {
    this._chian.push({ fun: '_isFloat', options })
    return this
  }

  private _isFloat (options?: validator.IsFloatOptions) {
    return validator.isFloat(this._v, options)
  }

  public isIn (options: any[]) {
    this._chian.push({ fun: '_isIn', options })
    return this
  }

  private _isIn (options: any[]) {
    return validator.isIn(this._v, options)
  }

  public matches (options: RegExp) {
    this._chian.push({ fun: '_matches', options })
    return this
  }

  private _matches (options: RegExp) {
    return validator.matches(this._v, options)
  }


  public contains (options: {seed: string}&validator.ContainsOptions) {
    this._chian.push({ fun: '_contains', options })
    return this
  }

  private _contains (options: {seed: string}&validator.ContainsOptions) {
    return validator.contains(this._v, options.seed, options)
  }

  private _equals (options: string) {
    return validator.equals(this._v, options)
  }

  public equals (options: string) {
    this._chian.push({ fun: '_equals', options })
    return this
  }

  private _isAlpha (options?: {options?: validator.IsAlphaOptions, local?: validator.AlphaLocale}) {
    return validator.isAlpha(this._v, options?.local, options?.options)
  }

  public isAlpha (options?: {options?: validator.IsAlphaOptions, local?: validator.AlphaLocale}) {
    this._chian.push({ fun: '_isAlpha', options })
    return this
  }

  private _isAlphanumeric (options?: {options?: validator.IsAlphanumericOptions, local?: validator.AlphanumericLocale}) {
    return validator.isAlphanumeric(this._v, options?.local, options?.options)
  }

  public isAlphanumeric (options?: {options?: validator.IsAlphanumericOptions, local?: validator.AlphanumericLocale}) {
    this._chian.push({ fun: '_isAlphanumeric', options })
    return this
  }

  private _isAscii (_options?: any) {
    return validator.isAscii(this._v)
  }

  public isAscii () {
    this._chian.push({ fun: '_isAscii' })
    return this
  }

  private _isBase32 (_options?: any) {
    return validator.isBase32(this._v)
  }

  public isBase32 () {
    this._chian.push({ fun: '_isBase32' })
    return this
  }

  private _isBase58 (_options?: any) {
    return validator.isBase58(this._v)
  }

  public isBase58 () {
    this._chian.push({ fun: '_isBase58' })
    return this
  }

  private _isBase64 (options?: validator.IsBase64Options) {
    return validator.isBase64(this._v, options)
  }

  public isBase64 (options?: validator.IsBase64Options) {
    this._chian.push({ fun: '_isBase64', options })
    return this
  }

  private _isBefore (date?: string) {
    return validator.isBefore(this._v, date)
  }

  public isBefore (date?: string) {
    this._chian.push({ fun: '_isBefore', options: date })
    return this
  }

  private _isBIC (_options?: any) {
    return validator.isBIC(this._v)
  }

  public isBIC () {
    this._chian.push({ fun: '_isBIC' })
    return this
  }

  private _isBtcAddress (_options?: any) {
    return validator.isBtcAddress(this._v)
  }

  public isBtcAddress () {
    this._chian.push({ fun: '_isBtcAddress' })
    return this
  }

  private _isByteLength (options: validator.IsByteLengthOptions) {
    return validator.isByteLength(this._v, options)
  }

  public isByteLength (options: validator.IsByteLengthOptions) {
    this._chian.push({ fun: '_isByteLength', options })
    return this
  }

  private _isCreditCard (options?: validator.IsCreditCardOptions) {
    return validator.isCreditCard(this._v, options)
  }

  public isCreditCard (options?: validator.IsCreditCardOptions) {
    this._chian.push({ fun: '_isCreditCard', options })
    return this
  }

  private _isCurrency (options: validator.IsCurrencyOptions) {
    return validator.isCurrency(this._v, options)
  }

  public isCurrency (options: validator.IsCurrencyOptions) {
    this._chian.push({ fun: '_isCurrency', options })
    return this
  }

  private _isDataURI (_o: any) {
    return validator.isDataURI(this._v)
  }

  public isDataURI () {
    this._chian.push({ fun: '_isDataURI' })
    return this
  }

  private _isDate (options?: validator.IsDateOptions) {
    return validator.isDate(this._v, options)
  }

  public isDate (options?: validator.IsDateOptions) {
    this._chian.push({ fun: '_isDate', options })
    return this
  }

  private _isDivisibleBy (number: number) {
    return validator.isDivisibleBy(this._v, number)
  }

  public isDivisibleBy (number: number) {
    this._chian.push({ fun: '_isDivisibleBy', options: number })
    return this
  }

  private _isEAN (_o: any) {
    return validator.isEAN(this._v)
  }

  public isEAN () {
    this._chian.push({ fun: '_isEAN' })
    return this
  }

  private _isEmpty (options?: {ignore_whitespace: boolean}) {
    return validator.isEmpty(this._v, options)
  }

  public isEmpty (options?: {ignore_whitespace: boolean}) {
    this._chian.push({ fun: '_isEmpty', options })
    return this
  }

  private _isEthereumAddress (_o: any) {
    return validator.isEthereumAddress(this._v)
  }

  public isEthereumAddress () {
    this._chian.push({ fun: '_isEthereumAddress' })
    return this
  }

  private _isFQDN (options?: validator.IsFQDNOptions) {
    return validator.isFQDN(this._v, options)
  }

  public isFQDN (options?: validator.IsFQDNOptions) {
    this._chian.push({ fun: '_isFQDN', options })
    return this
  }

  private _isFullWidth (_o: any) {
    return validator.isFullWidth(this._v)
  }

  public isFullWidth () {
    this._chian.push({ fun: '_isFullWidth' })
    return this
  }

  private _isHalfWidth (_o: any) {
    return validator.isHalfWidth(this._v)
  }

  public isHalfWidth () {
    this._chian.push({ fun: '_isHalfWidth' })
    return this
  }

  private _isHash (algorithm: validator.HashAlgorithm) {
    return validator.isHash(this._v, algorithm)
  }

  public isHash (algorithm: validator.HashAlgorithm) {
    this._chian.push({ fun: '_isHash', options: algorithm })
    return this
  }

  private _isHexColor (_o: any) {
    return validator.isHexColor(this._v)
  }

  public isHexColor () {
    this._chian.push({ fun: '_isHexColor' })
    return this
  }

  private _isHexadecimal (_o: any) {
    return validator.isHexadecimal(this._v)
  }

  public isHexadecimal () {
    this._chian.push({ fun: '_isHexadecimal' })
    return this
  }

  private _isHSL (_o: any) {
    return validator.isHSL(this._v)
  }

  public isHSL () {
    this._chian.push({ fun: '_isHSL' })
    return this
  }

  private _isIBAN (_o: any) {
    return validator.isIBAN(this._v)
  }

  public isIBAN () {
    this._chian.push({ fun: '_isIBAN' })
    return this
  }

  private _isIdentityCard (locale: validator.IdentityCardLocale) {
    return validator.isIdentityCard(this._v, locale)
  }

  public isIdentityCard (locale: validator.IdentityCardLocale) {
    this._chian.push({ fun: '_isIdentityCard', options: locale })
    return this
  }

  private _isIP (version: validator.IPVersion) {
    return validator.isIP(this._v, version)
  }

  public isIP (version: validator.IPVersion) {
    this._chian.push({ fun: '_isIP', options: version })
    return this
  }

  private _isIPRange (_o: any) {
    return validator.isIPRange(this._v)
  }

  public isIPRange () {
    this._chian.push({ fun: '_isIPRange' })
    return this
  }

  private _isISBN (version: validator.ISBNVersion) {
    return validator.isISBN(this._v, version)
  }

  public isISBN (version: validator.ISBNVersion) {
    this._chian.push({ fun: '_isISBN', options: version })
    return this
  }

  private _isISSN (options?: validator.IsISSNOptions) {
    return validator.isISSN(this._v, options)
  }

  public isISSN (options?: validator.IsISSNOptions) {
    this._chian.push({ fun: '_isISSN', options })
    return this
  }

  private _isIMEI (_o: any) {
    return validator.isIMEI(this._v)
  }

  public isIMEI () {
    this._chian.push({ fun: '_isIMEI' })
    return this
  }

  private _isISIN (_o: any) {
    return validator.isISIN(this._v)
  }

  public isISIN () {
    this._chian.push({ fun: '_isISIN' })
    return this
  }

  private _isISO8601 (_o: any) {
    return validator.isISO8601(this._v)
  }

  public isISO8601 () {
    this._chian.push({ fun: '_isISO8601' })
    return this
  }

  private _isISO31661Alpha2 (_o: any) {
    return validator.isISO31661Alpha2(this._v)
  }

  public isISO31661Alpha2 () {
    this._chian.push({ fun: '_isISO31661Alpha2' })
    return this
  }

  private _isISO31661Alpha3 (_o: any) {
    return validator.isISO31661Alpha3(this._v)
  }

  public isISO31661Alpha3 () {
    this._chian.push({ fun: '_isISO31661Alpha3' })
    return this
  }

  private _isISO4217 (_o: any) {
    return validator.isISO4217(this._v)
  }

  public isISO4217 () {
    this._chian.push({ fun: '_isISO4217' })
    return this
  }

  private _isISRC (_o: any) {
    return validator.isISRC(this._v)
  }

  public isISRC () {
    this._chian.push({ fun: '_isISRC' })
    return this
  }


  private _isArray (_o: any) {
    return isArray(this._rawV)
  }

  public isArray () {
    this._chian.push({ fun: '_isArray' })
    return this
  }

  private _notNaN (_o: any) {
    return !isNaN(this._rawV)
  }

  public notNaN () {
    this._chian.push({ fun: '_notNaN' })
    return this
  }

  private _isObject (_o: any) {
    return isObject(this._rawV)
  }

  public isObject () {
    this._chian.push({ fun: '_isObject' })
    return this
  }

  private _isJSON (_o: any) {
    return validator.isJSON(this._v)
  }

  public isJSON () {
    this._chian.push({ fun: '_isJSON' })
    return this
  }

  private _isJWT (_o: any) {
    return validator.isJWT(this._v)
  }

  public isJWT () {
    this._chian.push({ fun: '_isJWT' })
    return this
  }

  private _isLatLong (_o: any) {
    return validator.isLatLong(this._v)
  }

  public isLatLong () {
    this._chian.push({ fun: '_isLatLong' })
    return this
  }

  private _isLocale (_o: any) {
    return validator.isLocale(this._v)
  }

  public isLocale () {
    this._chian.push({ fun: '_isLocale' })
    return this
  }

  private _isLowercase (_o: any) {
    return validator.isLowercase(this._v)
  }

  public isLowercase () {
    this._chian.push({ fun: '_isLowercase' })
    return this
  }

  private _isMACAddress (options?: validator.IsMACAddressOptions) {
    return validator.isMACAddress(this._v, options)
  }

  public isMACAddress (options?: validator.IsMACAddressOptions) {
    this._chian.push({ fun: '_isMACAddress', options })
    return this
  }

  private _isMagnetURI (_o: any) {
    return validator.isMagnetURI(this._v)
  }

  public isMagnetURI () {
    this._chian.push({ fun: '_isMagnetURI' })
    return this
  }

  private _isMD5 (_o: any) {
    return validator.isMD5(this._v)
  }

  public isMD5 () {
    this._chian.push({ fun: '_isMD5' })
    return this
  }

  private _isMimeType (_o: any) {
    return validator.isMimeType(this._v)
  }

  public isMimeType () {
    this._chian.push({ fun: '_isMimeType' })
    return this
  }

  private _isMobilePhone (options?: {locale?: validator.MobilePhoneLocale, options?: validator.IsMobilePhoneOptions}) {
    return validator.isMobilePhone(this._v, options?.locale, options?.options)
  }

  public isMobilePhone (locale: validator.MobilePhoneLocale, options?: validator.IsMobilePhoneOptions) {
    this._chian.push({ fun: '_isMobilePhone', options: { locale, options } })
    return this
  }

  private _isMongoId (_o: any) {
    return validator.isMongoId(this._v)
  }

  public isMongoId () {
    this._chian.push({ fun: '_isMongoId' })
    return this
  }

  private _isMultibyte (_o: any) {
    return validator.isMultibyte(this._v)
  }

  public isMultibyte () {
    this._chian.push({ fun: '_isMultibyte' })
    return this
  }

  private _isOctal (_o: any) {
    return validator.isOctal(this._v)
  }

  public isOctal () {
    this._chian.push({ fun: '_isOctal' })
    return this
  }

  private _isPassportNumber (countryCode?: string) {
    return validator.isPassportNumber(this._v, countryCode)
  }

  public isPassportNumber (countryCode?: string) {
    this._chian.push({ fun: '_isPassportNumber', options: countryCode })
    return this
  }

  private _isPort (_o: any) {
    return validator.isPort(this._v)
  }

  public isPort () {
    this._chian.push({ fun: '_isPort' })
    return this
  }

  private _isPostalCode (locale: 'any'|validator.PostalCodeLocale) {
    return validator.isPostalCode(this._v, locale)
  }

  public isPostalCode (locale: 'any'|validator.PostalCodeLocale) {
    this._chian.push({ fun: '_isPostalCode', options: locale })
    return this
  }

  private _isRFC3339 (_o: any) {
    return validator.isRFC3339(this._v)
  }

  public isRFC3339 () {
    this._chian.push({ fun: '_isRFC3339' })
    return this
  }

  private _isRgbColor (includePercentValues?: boolean) {
    return validator.isRgbColor(this._v, includePercentValues)
  }

  public isRgbColor (includePercentValues?: boolean) {
    this._chian.push({ fun: '_isRgbColor', options: includePercentValues })
    return this
  }

  private _isSemVer (_o: any) {
    return validator.isSemVer(this._v)
  }

  public isSemVer () {
    this._chian.push({ fun: '_isSemVer' })
    return this
  }

  private _isSurrogatePair (_o: any) {
    return validator.isSurrogatePair(this._v)
  }

  public isSurrogatePair () {
    this._chian.push({ fun: '_isSurrogatePair' })
    return this
  }

  private _isUppercase (_o: any) {
    return validator.isUppercase(this._v)
  }

  public isUppercase () {
    this._chian.push({ fun: '_isUppercase' })
    return this
  }

  private _isSlug (_o: any) {
    return validator.isSlug(this._v)
  }

  public isSlug () {
    this._chian.push({ fun: '_isSlug' })
    return this
  }

  private _isTime (options?: validator.IsTimeOptions) {
    return validator.isTime(this._v, options)
  }

  public isTime (options?: validator.IsTimeOptions) {
    this._chian.push({ fun: '_isTime', options })
    return this
  }

  private _isTaxID (locale?: string) {
    return validator.isTaxID(this._v, locale)
  }

  public isTaxID (locale?: string) {
    this._chian.push({ fun: '_isTaxID', options: locale })
    return this
  }

  private _isURL (options?: validator.IsURLOptions) {
    return validator.isURL(this._v, options)
  }

  public isURL (options?: validator.IsURLOptions) {
    this._chian.push({ fun: '_isURL', options })
    return this
  }

  private _isUUID (version?: validator.UUIDVersion) {
    return validator.isUUID(this._v, version)
  }

  public isUUID (version?: validator.UUIDVersion) {
    this._chian.push({ fun: '_isUUID', options: version })
    return this
  }

  private _isVariableWidth (_o: any) {
    return validator.isVariableWidth(this._v)
  }

  public isVariableWidth () {
    this._chian.push({ fun: '_isVariableWidth' })
    return this
  }

  private _isVAT (countryCode: string) {
    return validator.isVAT(this._v, countryCode)
  }

  public isVAT (countryCode: string) {
    this._chian.push({ fun: '_isVAT', options: countryCode })
    return this
  }

  public isArrayLength(options:validator.IsLengthOptions) {
    this._chian.push({fun:'_isArrayLength',options})
    return this
  }

  private _isArrayLength(options:validator.IsLengthOptions) {
    let result =true
    if(!isArray(this._rawV)){
      return false
    }

    if(options.min){
      result = result && this._rawV.length >= options.min
    }

    if(options.max){
      result = result && this._rawV.length <= options.max
    }
    return result
  }

  private _isWhitelisted (chars: string|string[]) {
    return validator.isWhitelisted(this._v, chars)
  }

  public isWhitelisted (chars: string|string[]) {
    this._chian.push({ fun: '_isWhitelisted', options: chars })
    return this
  }

  public trim (options?: string) {
    this._chian.push({ fun: '_trim', options })
    return this
  }

  private _trim (options?: string) {
    this._v = validator.trim(this._v, options)
    return true
  }

  public ltrim (options?: string) {
    this._chian.push({ fun: '_ltrim', options })
    return this
  }

  private _ltrim (options?: string) {
    this._v = validator.ltrim(this._v, options)
    return true
  }

  public rtrim (options?: string) {
    this._chian.push({ fun: '_rtrim', options })
    return this
  }

  private _rtrim (options?: string) {
    this._v = validator.rtrim(this._v, options)
    return true
  }

  public escape () {
    this._chian.push({ fun: '_escape' })
    return this
  }

  private _escape (_options?: any) {
    this._v = validator.escape(this._v)
    return true
  }

  public unescape () {
    this._chian.push({ fun: '_unescape' })
    return this
  }

  private _unescape (_options?: any) {
    this._v = validator.unescape(this._v)
    return true
  }

  public stripLow (keep_new_lines?: boolean) {
    this._chian.push({ fun: '_stripLow', options: keep_new_lines })
    return this
  }

  private _stripLow (keep_new_lines?: boolean) {
    this._v = validator.stripLow(this._v, keep_new_lines)
    return true
  }

  private _whitelist (chars: string) {
    this._v = validator.whitelist(this._v, chars)
    return true
  }

  public whitelist (chars: string) {
    this._chian.push({ fun: '_whitelist', options: chars })
    return this
  }

  private _blacklist (chars: string) {
    this._v = validator.blacklist(this._v, chars)
    return true
  }

  public blacklist (chars: string) {
    this._chian.push({ fun: '_blacklist', options: chars })
    return this
  }

  public customer(fun:(value:string,raw:any)=>boolean){
    this._chian.push({ fun: '_customer', options: fun })
    return this
  }

  private _customer(fun:(value:string,raw:any)=>boolean){
    return fun(this._v,this._rawV)
  }

  run (obj: any): ValidatorResult {
    const rawV = isUndefined(this._key) ? [obj] : (this._key.indexOf('*') !== -1 ? objectProcess.objFind(obj, this._key) : [get(obj, this._key)])
   
    for (const v of rawV) {

      if (isNil(v)) {
        this._v = ''
      } else {
        this._v = String(v)
      }
      this._rawV = v

      if (isUndefined(this._rawV) && !this._isOptional) {
        this._result.push({ pass: false,fun:"", msg: 'must value' })
        continue
      }

      if (isNull(this._rawV) && !this._allowNull) {
        this._result.push({ pass: false,fun:"", msg: 'must value' })
        continue
      }

      if (this._isOptional && isUndefined(this._rawV)) {
        continue
      }

      if (this._allowNull && isNull(this._rawV)) {
        continue
      }

      for (const item of this._chian) {
        try {
          if (this._isBail) {return this.result()}

          const t = this[item.fun](item.options)
          // only log false
          if (!t) {this._result.push({ pass:t,fun:item.fun, msg: isNil(item.msg) ? item.fun : item.msg })}

        } catch (error) {
          this._result.push({ pass:false,fun:item.fun, msg: isNil(item.msg) ? item.fun : item.msg })
        }
      }
    }
    return this.result()
  }

  private result ():ValidatorResult {
    const pass = this._result.length === 0
    return { pass, msg:pass ? '' : this._result[0].msg, data: this._result }
  }

  bail () {
    this._chian.push({ fun: '_bail' })
    return this
  }

  private _bail () {
    if (!this.result().pass) {
      this._isBail = true
    }
    return true
  }
}

const validatorUtil= (key?:string):ValidatorWrapper =>new ValidatorWrapper(key)
export default validatorUtil