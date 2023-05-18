
import objectProcess from './objectProcess'

describe('objectProcess', () => {
  test('pathStr', () => {
    expect(objectProcess.pathStr('a.b.c')).toEqual({ newpath: ['a.b.c'], includeWild: false })
    expect(objectProcess.pathStr('a.b.*')).toEqual({ newpath: ['a.b', '*'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c')).toEqual({ newpath: ['a', '*', 'c'], includeWild: true })
    expect(objectProcess.pathStr('a.*.*')).toEqual({ newpath: ['a', '*', '*'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c.*')).toEqual({ newpath: ['a', '*', 'c', '*'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c.*.d')).toEqual({ newpath: ['a', '*', 'c', '*', 'd'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c.d.e')).toEqual({ newpath: ['a', '*', 'c.d.e'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c.d.*')).toEqual({ newpath: ['a', '*', 'c.d', '*'], includeWild: true })
    expect(objectProcess.pathStr('a.*.c.d.*.e')).toEqual({ newpath: ['a', '*', 'c.d', '*', 'e'], includeWild: true })
  })

  test('objFind Test1', () => {
    const obj = {
      a: {
        b: {
          c: {
            d: 'test'
          },
          c2: {
            d2: 'test2'
          }
        }
      },
      a2: {
        b2: {
          c3: {
            d3: 'test3'
          },
          c4: {
            d4: 'test4'
          }
        }
      },
      a3: 'test5'
    }
    expect(objectProcess.objFind(obj, 'a.b.c.d')).toEqual(['test'])
    expect(objectProcess.objFind(obj, 'a.b.*.d')).toEqual(['test', undefined])
    expect(objectProcess.objFind(obj, 'a.*.c4.*')).toEqual([undefined])
    expect(objectProcess.objFind(obj, 'a.*.*.*')).toEqual(['test', 'test2'])
    expect(objectProcess.objFind(obj, 'a.*.*')).toEqual([{ "d": "test"},{"d2": "test2"}])
    expect(objectProcess.objFind(obj, 'a2.b2.c3.*')).toEqual(['test3'])
    expect(objectProcess.objFind(obj, 'a2.b2.*.*')).toEqual(['test3', 'test4'])
    expect(objectProcess.objFind(obj, 'a2.b2.*.d3')).toEqual(['test3',undefined])
    expect(objectProcess.objFind(obj, 'a2.b2.*.d4')).toEqual([undefined,'test4'])
    expect(objectProcess.objFind(obj, 'a2.b2.*.*')).toEqual(['test3', 'test4'])
    expect(objectProcess.objFind(obj, 'a2.b2.*')).toEqual([{ "d3": "test3" },  { "d4": "test4" }])
    expect(objectProcess.objFind(obj, 'a2.b2')).toEqual([{"c3": { "d3": "test3" } , "c4": { "d4": "test4"  }}])
    expect(objectProcess.objFind(obj, 'a2')).toEqual([{ "b2": { "c3": { "d3": "test3" },"c4": { "d4": "test4" } } }])
    expect(objectProcess.objFind(obj, 'a3')).toEqual(['test5'])
    expect(objectProcess.objFind(obj, 'a4')).toEqual([undefined])
    expect(objectProcess.objFind(obj, 'a4.b4')).toEqual([undefined])
    expect(objectProcess.objFind(obj, 'a4.b4.c4')).toEqual([undefined])
    expect(objectProcess.objFind(obj, 'a4.b4.c4.d4')).toEqual([undefined])
  })
  
  
 
    test('objFind Test2', () => {
      const obj = {
        a: {
          b: {
            c: 1,
            d: 2
          }
        },
        e: 3,
        f: {
          g: 4,
          h: 5
        }
      }
      expect(objectProcess.objFind(obj, 'a.b.c')).toEqual([1])
      expect(objectProcess.objFind(obj, 'a.b.*')).toEqual([1, 2])
      expect(objectProcess.objFind(obj, 'a.*.c')).toEqual([1])
      expect(objectProcess.objFind(obj, 'a.*.*')).toEqual([1, 2])
      expect(objectProcess.objFind(obj, '*.b.c')).toEqual([1])
      expect(objectProcess.objFind(obj, '*.b.*')).toEqual([1, 2])
      expect(objectProcess.objFind(obj, '*.b.*.*')).toEqual([undefined,undefined,undefined,undefined])
      expect(objectProcess.objFind(obj, '*.b.*.*.*')).toEqual([undefined,undefined,undefined,undefined])
      expect(objectProcess.objFind(obj, '*.*.*')).toEqual([1, 2, undefined, undefined, undefined])
    })

  

  test('objFind Test3',()=>{
      const obj = {
        name: 'testName',
        age: 10,
        class: {
          name: 'testClassName',
          grade: 1
        },
        course: [
          {
            name: 'testCourseName1',
            grade: 1
          },
          {
            name: 'testCourseName2',
            grade: 2
          }
        ]
      }
      expect(objectProcess.objFind(obj,'name')).toStrictEqual(['testName'])
      expect(objectProcess.objFind(obj,'class.name')).toStrictEqual(['testClassName'])
      expect(objectProcess.objFind(obj,'course.name')).toStrictEqual([undefined])
      expect(objectProcess.objFind(obj,'course.*.name')).toStrictEqual(['testCourseName1','testCourseName2'])
      expect(objectProcess.objFind(obj,'class.*')).toStrictEqual(['testClassName',1])
      expect(objectProcess.objFind(obj,'course.*.grade')).toStrictEqual([1,2])
      expect(objectProcess.objFind(obj,'*.*.grade')).toStrictEqual([undefined,undefined,undefined,undefined,1,2])
      expect(objectProcess.objFind(obj,'*.*.*')).toStrictEqual([ undefined,
        undefined,
        undefined,
        undefined,
        'testCourseName1',
        1,
        'testCourseName2',
        2])
    })
  
  })