import { Address } from '../value-object/address'
import { Customer } from './customer'

describe('Customer unit tests', () => {
  it('Should throw error when id is empty', () => {
    expect(() => {
      new Customer('', 'Raphael')
    }).toThrowError('Id is required')
  })

  it('Should throw error when name is empty', () => {
    expect(() => {
      new Customer('123', '')
    }).toThrowError('Name is required')
  })

  it('Should change name', () => {
    const customer = new Customer('123', 'Raphael')
    customer.changeName('Sara')
    expect(customer.name).toBe('Sara')
  })

  it('Should activate customer', () => {
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, '12345-678', 'São Paulo')
    customer.changeAddress(address)
    customer.activate()
    expect(customer.isActive()).toBe(true)
  })

  it('Should throw error when address is undefined when you activate a customer', () => {
    expect(() => {
      const customer = new Customer('1', 'Customer 1')
      customer.activate()
    }).toThrowError('Address is mandatory to activate a customer')
  })

  it('Should deactivate customer', () => {
    const customer = new Customer('1', 'Customer 1')
    customer.deactivate()
    expect(customer.isActive()).toBe(false)
  })

  it('should add reward points', () => {
    const customer = new Customer('1', 'Customer 1')
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(10)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(20)
  })
})
