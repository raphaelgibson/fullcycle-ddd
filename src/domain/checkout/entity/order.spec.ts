import { Order } from './order'
import { OrderItem } from './order-item'

describe('Order unit tests', () => {
  it('Should throw error when id is empty', () => {
    expect(() => {
      new Order('', '123', [])
    }).toThrowError('Id is required')
  })

  it('Should throw error when customerId is empty', () => {
    expect(() => {
      new Order('123', '', [])
    }).toThrowError('CustomerId is required')
  })

  it('Should throw error when items are empty', () => {
    expect(() => {
      new Order('123', '123', [])
    }).toThrowError('Items are required')
  })

  it('Should calculate total', () => {
    const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2)
    const item2 = new OrderItem('i2', 'Item 2', 200, 'p2', 2)
    const order = new Order('o1', 'c1', [item])
    expect(order.total()).toBe(200)
    const order2 = new Order('o2', 'c2', [item, item2])
    expect(order2.total()).toBe(600)
  })

  it('Should throw error if the item qtt is less or equal zero', () => {
    expect(() => {
      const item = new OrderItem('i1', 'Item 1', 100, 'p1', 0)
      new Order('o1', 'c1', [item])
    }).toThrowError('Quantity must be greater than 0')
  })
})
