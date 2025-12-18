const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    menuItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MenuItem", 
      required: true 
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
      min: 1,
      default: 1 
    }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    items: { 
      type: [CartItemSchema], 
      default: [],
      validate: {
        validator: function(items) {
          // Ensure no duplicate menuItems in cart
          const menuItemIds = items.map(item => item.menuItem.toString());
          return new Set(menuItemIds).size === menuItemIds.length;
        },
        message: "Duplicate menu items in cart"
      }
    },
    status: { 
      type: String, 
      enum: ["active", "checked_out"], 
      default: "active" 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for subtotal calculation
CartSchema.virtual("subtotal").get(function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
});

// Virtual for item count
CartSchema.virtual("itemCount").get(function() {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

module.exports = mongoose.model("Cart", CartSchema);