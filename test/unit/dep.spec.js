/**
 * @jest-environment jsdom
 */
import { describe, beforeAll, afterAll, beforeEach, expect, it, vi } from 'vitest'

import Dep from '../../src/dep'

describe('Dep', () => {
  let dep

  beforeEach(() => {
    dep = new Dep()
  })

  describe('instance', () => {
    it('should be created with correct properties', () => {
      expect(dep.subs.length).toBe(0)
      expect(new Dep().id).toBe(dep.id + 1)
    })
  })

  describe('addSub()', () => {
    it('should add sub', () => {
      dep.addSub(null)
      expect(dep.subs.length).toBe(1)
      expect(dep.subs[0]).toBe(null)
    })
  })

  describe('removeSub()', () => {
    it('should remove sub', () => {
      dep.subs.push(null)
      dep.removeSub(null)
      expect(dep.subs.length).toBe(0)
    })
  })

  describe('depend()', () => {
    let _target

    beforeAll(() => {
      _target = Dep.target
    })

    afterAll(() => {
      Dep.target = _target
    })

    it('should do nothing if no target', () => {
      Dep.target = null
      dep.depend()
    })

    it('should add itself to target', () => {
      window.target = {
        addDep() {}
      }
      const spy = vi.spyOn(window.target, 'addDep')
      // Dep.target = jasmine.createSpyObj('TARGET', ['addDep'])
      dep.depend()
      expect(spy).toHaveBeenCalled()
      // expect(Dep.target.addDep).toHaveBeenCalledWith(dep)
    })
  })

  describe('notify()', () => {
    it('should notify subs', () => {
      const obj = {
        update() {}
      }
      const spy = vi.spyOn(obj, 'update')
      dep.subs.push(obj)
      dep.notify()
      expect(spy).toHaveBeenCalled()
    })
  })
})