# Change Log


### 1.0.4
1. add `isString()` validator
```typescript
valid("name").isString().run({name:'test'})
```

----
### 1.0.3
1. change `contains()` param from `contains({ seed:string }& ContainsOptions )` to `contains(str: string, options?: ContainsOptions)`
```typescript
// before
valid("name").contains({seed:'test'}).run({name:'test'})
//after
valid("name").contains('test').run({name:'test'})
```
2. remove `isArrayLength()`, merge functionality into `isArray()`

```typescript
// before
valid("name").isArray().run({name:[1,2,3]})
valid("name").isArrayLength({min:1,max:10}).run({name:[1,2,3]})
//after
valid("name").isArray().run({name:[1,2,3]})
valid("name").isArray({min:1,max:10}).run({name:[1,2,3]})
```