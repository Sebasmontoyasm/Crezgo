const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Orderchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        cantidad: Number,
        tipo: String,
        total: Number,

      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", Orderchema);
