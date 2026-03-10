import mongoose from 'mongoose';
import slug from 'slug';
import crypto from 'crypto';

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discountPrice: {
    type: Number,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  sku: {
    type: String,
    unique: true,
    sparse: true,
  },

  images: [
    {
      filename: String,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

}, { timestamps: true });

productSchema.pre('save', function (next) {

  if (this.isModified('name')) {

    const baseSlug = slug(this.name, { lower: true });

    this.slug = `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;
  }

  if (!this.sku) {
    this.sku = `SKU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  next();
});

export default mongoose.model('Product', productSchema);
