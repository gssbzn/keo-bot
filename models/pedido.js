var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var pedidoSchema = mongoose.Schema({
  jugo: { type: String, unique: true },
  num: { type: Number, default: 0 }
})

pedidoSchema.plugin(findOrCreate);
var Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
