
import { EventDispatcher } from '../../@shared/event/event-dispatcher'
import { CustomerCreatedEvent } from './customer-created-event'
import { EnviaConsoleLog1Handler } from './handler/envia-console-log-1-handler'
import { EnviaConsoleLog2Handler } from './handler/envia-console-log-2-handler'

describe('Customer created event tests', () => {
  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const handler1 = new EnviaConsoleLog1Handler()
    const handler2 = new EnviaConsoleLog2Handler()
    const spyHandler1 = jest.spyOn(handler1, 'handle')
    const spyHandler2 = jest.spyOn(handler2, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', handler1)
    eventDispatcher.register('CustomerCreatedEvent', handler2)

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(handler1)
    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(handler2)

    const customerCreatedEvent = new CustomerCreatedEvent({})

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyHandler1).toHaveBeenCalled()
    expect(spyHandler2).toHaveBeenCalled()
  })
})
