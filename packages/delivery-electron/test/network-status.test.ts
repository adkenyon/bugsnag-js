import EventEmitter from 'events'
import NetworkStatus from '../network-status'

const appReady = { isReady: () => true, whenReady: async () => await new Promise(() => {}) }
const appNotReady = { isReady: () => false, whenReady: async () => await new Promise(() => {}) }

const nextTick = async () => await new Promise(resolve => process.nextTick(resolve))

describe('delivery: electron -> NetworkStatus', () => {
  it('should use the value of `net.online` on construction', () => {
    let checker = new NetworkStatus({ emitter: new EventEmitter() }, { online: true }, appReady)
    expect(checker.isConnected).toBe(true)

    checker = new NetworkStatus({ emitter: new EventEmitter() }, { online: false }, appReady)
    expect(checker.isConnected).toBe(false)
  })

  it('alerts watchers when the connection value changes', async () => {
    const emitter = new EventEmitter()
    const checker = new NetworkStatus({ emitter }, { online: true }, appReady)
    const updates: boolean[] = []

    checker.watch((isConnected) => { updates.push(isConnected) })

    emitter.emit('MetadataUpdate', { section: 'device', values: { online: false } }, null)

    await nextTick()

    expect(updates).toEqual([true, false])
  })

  it('should not send duplicate updates', async () => {
    const emitter = new EventEmitter()
    const checker = new NetworkStatus({ emitter }, { online: true }, appReady)
    const updates: boolean[] = []

    checker.watch((isConnected) => { updates.push(isConnected) })

    emitter.emit('MetadataUpdate', { section: 'device', values: { online: false } }, null)
    emitter.emit('MetadataUpdate', { section: 'device', values: { online: true } }, null)
    emitter.emit('MetadataUpdate', { section: 'device', values: { online: true } }, null)

    await nextTick()

    expect(updates).toEqual([true, false, true])
  })

  it('ignores irrelevant updates', async () => {
    const emitter = new EventEmitter()
    const checker = new NetworkStatus({ emitter }, { online: true }, appReady)
    const updates: boolean[] = []

    checker.watch((isConnected) => { updates.push(isConnected) })

    emitter.emit('MetadataUpdate', { section: 'app', values: { online: false } }, null)
    emitter.emit('MetadataUpdate', { section: 'device', values: { usingBattery: true } }, null)

    await nextTick()

    expect(updates).toEqual([true])
  })

  it('is not online if the app is not ready', () => {
    let checker = new NetworkStatus({ emitter: new EventEmitter() }, { online: true }, appNotReady)
    expect(checker.isConnected).toBe(false)

    checker = new NetworkStatus({ emitter: new EventEmitter() }, { online: false }, appNotReady)
    expect(checker.isConnected).toBe(false)
  })

  it('will not go online after an update until the app is ready', async () => {
    let isReady = false
    let becomeReady = () => {}

    const whenReady = async () => await new Promise(resolve => {
      becomeReady = () => {
        isReady = true
        resolve(null)
      }
    })

    const app = { isReady: () => isReady, whenReady }

    const emitter = new EventEmitter()
    const checker = new NetworkStatus({ emitter }, { online: true }, app)

    expect(checker.isConnected).toBe(false)

    const updates: boolean[] = []

    checker.watch((isConnected) => { updates.push(isConnected) })

    // the app is not ready so these updates should not be reported
    emitter.emit('MetadataUpdate', { section: 'device', values: { online: true } }, null)
    emitter.emit('MetadataUpdate', { section: 'device', values: { online: false } }, null)
    emitter.emit('MetadataUpdate', { section: 'device', values: { online: true } }, null)

    await nextTick()

    expect(updates).toEqual([false])
    expect(checker.isConnected).toBe(false)

    becomeReady()

    await nextTick()

    expect(updates).toEqual([false, true])
    expect(checker.isConnected).toBe(true)

    emitter.emit('MetadataUpdate', { section: 'device', values: { online: false } }, null)

    await nextTick()

    expect(updates).toEqual([false, true, false])
    expect(checker.isConnected).toBe(false)
  })
})
