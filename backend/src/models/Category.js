import mongoose from 'mongoose';
import slug from 'slug';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slug(this.name, { lower: true });
  }
  next();
});

categorySchema.query.active = function () {
  return this.where({ isActive: true });
};

export default mongoose.model('Category', categorySchema);
