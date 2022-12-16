import { defineReactive } from "./defineReactive"

export function isObject(val) {
  return typeof val === 'object' && val
}

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function protoAugment (target, src, keys) {
  target.__proto__ = src
}

export function copyAugment (target, src, keys) {
  keys.forEach(key => {
    // set array method directly on the array self.
    def(target, key, src[key])
  })
}

export function def(obj, key, val, enumerable?) {
  Object.defineProperty(obj, key, {
    enumerable: !!enumerable,
    value: val,
    writable: true,
    configurable: true
  })
}

const bailRE = /[^\w.$]/

export function parsePath(path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    segments.forEach(seg => {
      if (!obj) {
        return
      }
      obj = obj[seg]
    })

    return obj
  }
}

const seenObjects = new Set()
export function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}


function _traverse(val, seen: Set<any>) {
  let i
  let keys
  const isArray = Array.isArray(val)
  if ((!isArray && !isObject(val)) || Object.isFrozen(val)) {
    return
  }

  if(val.__ob__) {
    const depId = val.__ob__.dep.id
    if(seen.has(depId)) {
      return
    }
    seen.add(depId)
  }

  if (isArray) {
    i = val.length
    while(i--) {
      _traverse(val[i], seen)
    }
  } else {
    keys = Object.keys(val)
    i = keys.length
    while(i--) {
      _traverse(val[keys[i]], seen)
    }
  }
}

// todo: maybe not correct
function isValidArrayIndex(key) {
  return Number.isInteger(key) && key > -1
}

export function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  // new field
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    // give a warning
    console.warn('not add properties to Vue instance or its root $data')

    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}


export function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    // give a warning
    console.warn('not delete properties to Vue instance or its root $data')

    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}