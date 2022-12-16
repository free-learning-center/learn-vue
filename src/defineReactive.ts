import { arrayMethods } from "./array";
import Dep from "./dep";
import { isObject, hasOwn, def, protoAugment, copyAugment } from './utils'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

// start
export class Observer {
  value: any;
  dep: Dep;
  constructor(value) {
    this.value = value

    this.dep = new Dep()
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      // change array prototype
      // value.__proto__ = arrayMethods

      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)


      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray(items) {
    items.forEach(item => {
      observe(item)
    })
  }

  walk(obj) {
    const keys = Object.keys(obj)
    keys.forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function observe(value, asRootData?) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

// make object be reactive
export function defineReactive(data, key, val) {
  // if (typeof val === 'object') {
  //   new Observer(val)
  // }
  let childOb = observe(val);
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend()
      console.log('Im in get')
      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set: function(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      console.log('I changed, to notify...')
      dep.notify()
    }
  })
}