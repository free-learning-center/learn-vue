import { Observer } from "../src/defineReactive";
import Watcher from '../src/watcher'
import '../src/array'

const data = {
  name: 'allen'
}

window.Watcher = Watcher

window.d = new Observer(data)
console.log(d)
window.data = data
console.log(data)

window.arr = [1,2,3, {age: 11}]
new Observer(window.arr)
arr.push(4)