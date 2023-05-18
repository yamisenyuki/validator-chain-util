import { get, isNil, isObject } from "lodash"

const objectProcess ={
  pathStr (path: string) {
    const newpath: string[] = []
    let s: string[] = []
    let includeWild = false
    const pathArr = path.split('.')
    pathArr.map(x => {
      if (x === '*') {
        includeWild = true
        if (s.length > 0) {
          newpath.push(s.join('.'))
        }
        newpath.push('*')
        s = []
      } else {
        s.push(x)
      }
    })
    if (s.length > 0) {newpath.push(s.join('.'))}
    return { newpath, includeWild }
  },
  objFind (obj: any, path: string) {
    const { newpath, includeWild } = objectProcess.pathStr(path)
    let tempList: any[] = []
    let isNew = false

    if (newpath.length <= 1 && !includeWild) {
      return [get(obj, newpath[0])]
    } else {
      newpath.forEach(v => {
        const newObj: any[] = []
        if (v === '*') {
          if (isNew) {
            tempList.forEach((item: any) => {
              if (isNil(item)) {
                newObj.push(item)
                return
              }
              if (!isObject(item)) {
                newObj.push(undefined)
                return
              }
              Object.keys(item).forEach(k => {newObj.push(get(item, k))})
            })
          } else {
            Object.keys(obj).forEach(k => {newObj.push(get(obj, k))})
            isNew = true
          }
        } else {
          if (isNew) {
            tempList.forEach((item: any) => {newObj.push(get(item, v))})
          } else {
            newObj.push(get(obj, v))
            isNew = true
          }
        }
        tempList = newObj
      })
    }
    return tempList
  }
}

export default objectProcess