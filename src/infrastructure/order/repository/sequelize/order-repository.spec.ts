import { Sequelize } from 'sequelize-typescript'
import { OrderRepository } from './order-repository'
import { Address } from '../../../../domain/customer/value-object/address'
import { CustomerRepository } from '../../../customer/repository/sequelize/customer-repository'
import { Customer } from '../../../../domain/customer/entity/customer'
import { ProductRepository } from '../../../product/repository/sequelize/product-repository'
import { Product } from '../../../../domain/product/entity/product'
import { OrderItem } from '../../../../domain/checkout/entity/order-item'
import { Order } from '../../../../domain/checkout/entity/order'
import CustomerModel from '../../../customer/repository/sequelize/customer-model'
import ProductModel from '../../../product/repository/sequelize/product-model'
import OrderModel from './order-model'
import OrderItemModel from './order-item-model'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([OrderModel, OrderItemModel, CustomerModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
      const customerRepository = new CustomerRepository()
      const customer = new Customer('123', 'Customer 1')
      const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
      customer.changeAddress(address)
      await customerRepository.create(customer)

      const productRepository = new ProductRepository()
      const product = new Product('123', 'Product 1', 10)
      await productRepository.create(product)

      const orderItem = new OrderItem('1', product.name, product.price, product.id, 2)

      const orderRepository = new OrderRepository()
      const order = new Order('123', '123', [orderItem])
      await orderRepository.create(order)

      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ['items']
      })

      expect(orderModel.toJSON()).toStrictEqual({
        id: '123',
        customer_id: '123',
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: '123',
            product_id: '123'
          }
        ]
      })
  })

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('1', product.name, product.price, product.id, 2)

    const orderRepository = new OrderRepository()
    const order = new Order('123', '123', [orderItem])
    await orderRepository.create(order)

    const newOrderItem = new OrderItem('2', product.name, product.price, product.id, 3)
    order.addItem(newOrderItem)
    await orderRepository.update(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '123',
          product_id: '123'
        },
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          order_id: '123',
          product_id: '123'
        }
      ]
    })
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('1', product.name, product.price, product.id, 2)

    const orderRepository = new OrderRepository()
    const order = new Order('123', '123', [orderItem])
    await orderRepository.create(order)

    const orderResult = await orderRepository.find(order.id)

    expect(order).toStrictEqual(orderResult)
  })

  it('should throw an error when order is not found', async () => {
    const orderRepository = new OrderRepository()

    expect(async () => {
      await orderRepository.find('456ABC')
    }).rejects.toThrow('Order not found')
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem1 = new OrderItem('1', product.name, product.price, product.id, 2)
    const orderItem2 = new OrderItem('2', product.name, product.price, product.id, 3)

    const orderRepository = new OrderRepository()
    const order1 = new Order('123', '123', [orderItem1])
    await orderRepository.create(order1)

    const order2 = new Order('456', '123', [orderItem2])
    await orderRepository.create(order2)

    const orders = await orderRepository.findAll()

    expect(orders).toHaveLength(2)
    expect(orders).toContainEqual(order1)
    expect(orders).toContainEqual(order2)
  })
})
