const arrayProto = Array.prototype

/** new array method */
export const arrayMethods = Object.create(arrayProto)

// methods that can change the array itself
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  const origin = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      console.log('new method', method)
      const result = origin.apply(this, args)
      const ob = this.__ob__
      let inserted
      switch(method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if(inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
