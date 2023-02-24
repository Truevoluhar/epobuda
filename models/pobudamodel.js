var mongoose = require('mongoose');
var Schema = mongoose.Schema

var pobudaSchema = new Schema({
  datum: String,
  stpobude: String,
  predmet: String,
  predlagatelj: String,
  izvajalec: String,
  narocilnicapogodba: String,
  stnarocilnicepogodbe: String,
  pp: String,
  nrp: String,
  konto: String,
  podkonto: String,
  skupnavrednost: Number,
  l2022: Number,
  l2023: Number,
  l2024: Number,
  l2025: Number,
  l2026: Number,
  l2027: Number,
  l2028: Number,
  stzadevevzbirki: String,
  statuszadeve: String,
  zadnjaspremembastatusa: String
}, { collection: "Pobude" })

var pobudaModel = mongoose.model("pobudaModel", pobudaSchema)
module.exports = pobudaModel
