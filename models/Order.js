const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    menuItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MenuItem" 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    qty: { 
      type: Number, 
      required: true,
      min: 1 
    }
  },
  { _id: false }
);

OrderItemSchema.virtual("itemTotal").get(function() {
  return this.price * this.qty;
});

const OrderSchema = new mongoose.Schema(
  {
    cartId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cart",
      required: true 
    },
    items: { 
      type: [OrderItemSchema], 
      required: true,
      validate: {
        validator: function(items) {
          return items.length > 0;
        },
        message: "Order must have at least one item"
      }
    },
    subtotal: { 
      type: Number, 
      required: true,
      min: 0 
    },
    tax: { 
      type: Number, 
      required: true,
      min: 0 
    },
    total: { 
      type: Number, 
      required: true,
      min: 0 
    },
    customer: {
      name: { 
        type: String, 
        trim: true,
        default: "" 
      },
      email: { 
        type: String, 
        trim: true,
        lowercase: true,
        default: "" 
      }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Order", OrderSchema);