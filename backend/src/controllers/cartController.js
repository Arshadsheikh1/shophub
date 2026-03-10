import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../utils/errorHandler.js';

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name sku price discountPrice stock',
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          user: req.user._id,
          items: [],
          totalPrice: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return next(new AppError('Product ID and quantity are required', 400));
    }

    if (quantity < 1) {
      return next(new AppError('Quantity must be at least 1', 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (product.isActive === false) {
      return next(new AppError('Product is not available', 400));
    }

    if (product.stock < quantity) {
      return next(new AppError(`Only ${product.stock} items in stock`, 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity,
            price: product.discountPrice || product.price,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find((item) => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;

        if (product.stock < existingItem.quantity) {
          return next(new AppError(`Only ${product.stock} items in stock`, 400));
        }
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.discountPrice || product.price,
        });
      }
    }

    await cart.save();

    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name sku price discountPrice stock',
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return next(new AppError('Product ID and quantity are required', 400));
    }

    if (quantity < 0) {
      return next(new AppError('Quantity cannot be negative', 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const cartItem = cart.items.find((item) => item.product.toString() === productId);

    if (!cartItem) {
      return next(new AppError('Product not in cart', 404));
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      if (product.stock < quantity) {
        return next(new AppError(`Only ${product.stock} items in stock`, 400));
      }

      cartItem.quantity = quantity;
      cartItem.price = product.discountPrice || product.price;
    }

    await cart.save();

    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name sku price discountPrice stock',
    });

    res.status(200).json({
      success: true,
      message: quantity === 0 ? 'Product removed from cart' : 'Cart item updated',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();

    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name sku price discountPrice stock',
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
