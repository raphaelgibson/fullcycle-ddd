import { Order } from '../../../../domain/checkout/entity/order'
import { OrderItem } from '../../../../domain/checkout/entity/order-item'
import { OrderRepositoryInterface } from '../../../../domain/checkout/repository/order-repository-interface'
import OrderItemModel from './order-item-model'
import OrderModel from './order-model'

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity
      }))
    }, {
      include: [{ model: OrderItemModel }],
    })
  }

  async update (entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        }))
      },
      {
        where: { id: entity.id },
      }
    )

    await Promise.all(entity.items.map(async (item) => {
      await OrderItemModel.upsert({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id
      })
    }))
  }

  async find (id: string): Promise<Order> {
    let orderModel

    try {
      orderModel = await OrderModel.findOne({
        where: {
          id
        },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }]
      })
    } catch (error) {
      throw new Error('Order not found')
    }

    const orderItems = orderModel.items.map(item => {
      const orderItemPrice = item.price / item.quantity
      return new OrderItem(item.id, item.name, orderItemPrice, item.product_id, item.quantity)
    })

    const order = new Order(orderModel.id, orderModel.customer_id, orderItems)

    return order
  }

  async findAll (): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }]
    })

    const orders = orderModels.map(orderModel => {
      const orderItems = orderModel.items.map(item => {
        const orderItemPrice = item.price / item.quantity
        return new OrderItem(item.id, item.name, orderItemPrice, item.product_id, item.quantity)
      })

      const order = new Order(orderModel.id, orderModel.customer_id, orderItems)

      return order
    })

    return orders
  }
}