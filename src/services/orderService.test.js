require('dotenv').config();
const { orderService } = require('./orderService');

jest.mock('../db/models/orderModel');
const { orderModel } = require('../db/models/orderModel');

jest.mock('../db/models/productModel');
const { productModel } = require('../db/models/productModel');

const { NotFoundError } = require('../utils');

describe('test orderService methods', () => {
  describe('test findAllOrders', () => {
    test('orderModel에서 가져온 데이터의 수가  1보다 커서 가져온 배열을 return 해야햔다.', async () => {
      const dataInDB = [{ order: 1 }, { order: 2 }];

      await orderModel.findAll.mockReturnValue(dataInDB);

      const result = await orderService.findAllOrders();

      expect(result).toHaveLength(dataInDB.length);
    });

    test('orderModel에서 가져온 데이터의 수가  1보다 작아서 빈 객체를 반환해야 한다.', async () => {
      orderModel.findAll.mockReturnValue([]);

      const result = await orderService.findAllOrders();

      expect(result).toEqual({});
    });
  });

  describe('test findOrder', () => {
    test('orderId를 이용하여 orderModel에서 order 1개를 가져온다', async () => {
      const orderId = '1234';

      orderModel.find.mockReturnValue({
        _id: '1234',
        value: '_id가 1234인 값',
      });

      const result = await orderService.findOrder(orderId);

      expect(result._id).toBe(orderId);
    });

    test('orderModel에 orderId와 일치하는 order가 없다. ', async () => {
      const orderId = '1234';

      orderModel.find.mockReturnValue(null);

      try {
        await orderService.findOrder(orderId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
        expect(err.statusCode).toBe(404);
      }
    });
  });

  describe('test createOrder', () => {
    test('orderInfo를 이용하여 orderModel에 order 1개를 추가한다.', async () => {
      const orderInfo = {
        _id: '1234',
        value: '추가될 값',
      };

      orderModel.create.mockReturnValue({
        _id: '1234',
        value: '추가될 값',
      });

      orderModel.find.mockReturnValue({
        _id: '1234',
        value: '추가될 값',
      });

      const result = await orderService.createOrder(orderInfo);

      expect(result._id).toBe(orderInfo._id);
    });

    test('orderInfo를 이용하여 orderModel에 order 1개를 추가했지만 DB에 저장되지 않았다.', async () => {
      const orderInfo = {
        _id: '1234',
        value: '추가될 값',
      };

      orderModel.create.mockReturnValue({
        _id: '1234',
        value: '추가될 값',
      });

      orderModel.find.mockReturnValue(null);

      try {
        await orderService.createOrder(orderInfo);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('test calculateTotalPrice', () => {
    test('calculateTotalPrice를 통해 나온 값이 올바르게 나온다.', async () => {
      const requestedProducts = [
        {
          product: '1234',
          count: 3,
        },
      ];

      productModel.findProducts.mockReturnValue([
        {
          product: {
            _id: '1234',
            price: 3000,
          },
        },
        {
          product: {
            _id: '5678',
            price: 2000,
          },
        },
      ]);

      const totalPrice = await orderService.calculateTotalPrice(
        requestedProducts
      );

      expect(totalPrice).toBe(9000);
    });
  });
});
