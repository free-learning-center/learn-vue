import Watcher from './watcher'

declare global {
  interface Window { target: Watcher | null; }
}

function remove(arr, item) {
  if (arr.length) {
    const i = arr.indexOf(item)
    if(i > -1) {
      return arr.splice(i, 1)
    }
  }
}

let uid = 0
class Dep {
  id: number
  subs: any[]
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (window.target) {
      this.addSub(window.target)
      window.target.addDep(this)
    }
  }

  notify() {
    const subs = this.subs.slice()
    subs.forEach(sub => {
      sub.update()
    })
  }
}

export default Dep
