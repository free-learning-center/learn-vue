import { parsePath, traverse } from './utils'


class Watcher {
  vm: any
  deep: boolean
  deps: any[]
  depIds: Set<unknown>
  getter: any
  cb: any
  value: any
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm

    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }

    this.deps = []
    this.depIds = new Set()
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    if (this.deep) {
      traverse(value)
    }
    window.target = null
    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }

  addDep(dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  teardown() {
    // this.deps.forEach(dep => {
    //   dep.removeSub(this)
    // })
    // ? why remove start from the end
    let i = this.deps.length
    while(i--) {
      this.deps[i].removeSub(this)
    }
  }
}

export default Watcher