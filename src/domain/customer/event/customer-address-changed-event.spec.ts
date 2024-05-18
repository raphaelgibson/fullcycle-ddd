
import { EventDispatcher } from '../../@shared/event/event-dispatcher'
import { CustomerAddressChangedEvent } from './customer-address-changed-event'
import { EnviaConsoleLogHandler } from './handler/envia-console-log-handler'

describe('Customer address changed event tests', () => {
  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const handler = new EnviaConsoleLogHandler()
    const spyHandler1 = jest.spyOn(handler, 'handle')

    eventDispatcher.register('CustomerAddressChangedEvent', handler)

    expect(eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'][0]).toMatchObject(handler)

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: '123',
      name: 'John',
      address: {
        street: 'Street 1',
        number: 123,
        city: 'City 1'
      }
    })

    eventDispatcher.notify(customerAddressChangedEvent)

    expect(spyHandler1).toHaveBeenCalled()
  })
})
