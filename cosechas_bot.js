var mongoose = require('mongoose');
var Pedido = require('./models/pedido.js');
var i18n = require("i18n");
i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales',
    defaultLocale: process.env.LOCALE || 'en'
});

var CosechasBot = (function() {
  function CosechasBot(_slack) {
    this._slack = _slack;
  }
  var menu_list = function(channel){
    var menu = "*Bebidas funcionales `4400/3900`*\n" +
               ">1. Pura energia\n" +
               "> _Espinaca, piña, remolacha y banano_\n" +
               ">2. Proteinico\n" +
               "> _Naranja, banano y proteina de soya_\n" +
               ">3. Antioxidante\n" +
               "> _Vinagre, repolo, manzana, brocoli, piña y tomate_\n"+
               ">4. Control Peso\n" +
               "> _Piña, apio, pepino, perejil y naranja_\n"+
               ">5. Menos Colesterol\n" +
               "> _Pimenton, jengibre, apio, perejil, zanahoria, piña y naranja_\n"+
               ">6. Cardio Frutas\n" +
               "> _Banano, piña, mango y aguacate_\n"+
               ">7. Periodo\n" +
               "> _Piña, tomate, canela, espinaca y remolacha_\n"+
               ">8. Colon-gastritis\n" +
               "> _Papaya, germen de trigo, miel, perejil, apio y naranja_\n"+
               ">9. Gripa\n" +
               "> _Jengibre, miel, limon y naranja_\n" +
               "*Batidos Refrescantes `4900/4400`*\n" +
               "> 10. Sandia, fresa y limon\n" +
               "> 11. Piña, naranja y papaya\n" +
               "> 12. Manzana, banano y naranja\n" +
               "> 13. Mango, fresa y piña\n" +
               "> 14. Banano, papaya y naranja\n" +
               "*Batidos con helado o yogurt `6400/5900`*\n" +
               "> 15. Mango, banano y papaya\n" +
               "> 16. Fresa y guanabana\n" +
               "> 17. Sandia y maracuya\n" +
               "> 18. Piña y crema de coco\n" +
               "> 19. Sandia, banano y creama de coco\n" +
               "> 20. Banano y chocolate\n" +
               "*Premium frutos exoticos (en leche) `7400/6900`*\n" +
               "> 21. Colibri Morado\n" +
               "> _Mora, blueberries, arandanos y fresa_\n"+
               "> 22. Mariposa Naranja\n" +
               "> _Melocoton, naranja y mango_\n"+
               "> 23. Arandanos, blueberries y piña\n" +
               "> 24. Moras, blueberries y piña\n"+
               "*Premium frutos exoticos (en agua) `6500/5900`*\n" +
               "> 25. Lapa Roja\n" +
               "> _Kiwi, sandía y uvas rojas_\n"+
               "> 26. Tortuga Verde\n" +
               "> _Kiwi, piña y uvas verdes._\n";

    channel.send(menu);
  }

  var addJugo = function(channel, jugo, num){
    Pedido.findOrCreate({ jugo: jugo }, function(err, pedido, created) {
      pedido.num += parseInt(num, 10);
      pedido.save();
      mensaje += pedido.jugo;
    });
    var mensaje = "anotado " + num + " " + jugo;
    channel.send(mensaje);
  }

  var removeJugo = function(channel, jugo, num){
    Pedido.findOrCreate({ jugo: jugo }, function(err, pedido, created) {
      pedido.num -= parseInt(num, 10);
      if(pedido.num <= 0){
        pedido.remove();
      } else {
        pedido.save();
      }
      mensaje += pedido;
    });
    var mensaje = "eliminado " + num + " " + jugo;
    channel.send(mensaje);
  }

  var pedidoList = function(channel){
    Pedido.find({}, 'jugo num', function(err, pedidos) {
      var response = "*Pedidos:*";
      if(pedidos.length > 0){
        for (var i = 0; i < pedidos.length; i++){
          response += "\n" + pedidos[i].jugo + ": " + pedidos[i].num;
        }
      } else {
        response += "\nSin pedidos"
      }
      channel.send(response);
    });
  }

  var resetPedido = function(channel){
    Pedido.remove({}, function(err){
      if(err){
        console.log('error');
      }
    });
    channel.send("Ya no hay pedidos");
  }

  CosechasBot.prototype.processMessage = function(message){
    var type = message.type, text = message.text;
    var channel = this._slack.getChannelGroupOrDMByID(message.channel);

    if (type === 'message' && (text != null) && (channel != null)) {
      //if(channel.name == 'cosechas'){
        var re = /<.*?>/g;
        var mentions = text.match(re);
        if(mentions && mentions[0].indexOf(this._slack.self.id) != -1){
          var myRe = /(\d+)\s+(\D+)/g;
          if(text.indexOf("menu") != -1){
            return menu_list(channel);
          } else if(text.indexOf("reinicio") != -1){
            return resetPedido(channel);
          } else if(text.indexOf("+") != -1){
            var myArray = myRe.exec(text);
            num =  myArray[1];
            jugo = myArray[2];
            console.log("+", jugo, num);
            return addJugo(channel, jugo, num);
          } else if(text.indexOf("-") != -1){
            var myArray = myRe.exec(text);
            num =  myArray[1];
            jugo = myArray[2];
            console.log("-", jugo, num);
            return removeJugo(channel, jugo, num)
          } else if(text.indexOf("pedido") != -1){
            return pedidoList(channel);
          }
        }
      //}
    } else {
      var typeError = "unexpected type " + type + ".";
      var textError = text == null ? 'text was undefined.' : null;
      var channelError = channel == null ? 'channel was undefined.' : null;
      var errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      return console.log("@" + this._slack.self.name + " could not respond. " + errors);
    }
  }
  return CosechasBot;
})();

module.exports = CosechasBot;
