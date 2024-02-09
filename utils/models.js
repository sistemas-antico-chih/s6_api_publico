const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
 
const contratacionesSchema = new Schema({
   ocid: String,
   id: String,
   date: Date,
   initiationType: String,
   language: String,
   cycle: Number,
   tag: { type: [], default: void 0 },
   parties: { type: [], default: void 0 },
   tender: {
       id: String,
       title: String,
       description: String,
       status: String,
       enquiryPeriod: String,
       procuringEntity: {id: String, name: String},
       items: { type: [], default: void 0 },
       value: {amount: Number, currency: String},
       minValue: {amount: Number, currency: String},
       procurementMethod: String,
       procurementMethodDetails: String,
       procurementMethodRationale: String,
       submissionMethod: { type: [], default: void 0 },
       submissionMethodDetails: String,
       tenderers: { type: [], default: void 0 },
       mainProcurementCategory: String,
       aditionalProcurementCategories: { type: [], default: void 0 },
       awardCriteria: String,
       awardCriteriaDetails: String,
       tenderPeriod: {startDate: Date, endDate: Date},
       awardPeriod: {startDate: Date, endDate: Date},
       numberOfTenderers: Number, 
       hasEnquiries: Boolean,
       contractPeriod: {startDate: Date, endDate: Date},
   },
   awards: { type: [], default: void 0 },
   contracts: { type: [], default: void 0 },
   buyer: {id: String, name: String},
   planning: {
       rationale: String,
       documents: { type: [], default: void 0 },
       milestone: { type: [], default: void 0 },
       budget: {
           description: String,
           amount: { amount: Number, currency: String},
           uri: String
       }
   },
   publisher: {
       name: String,
       uid: String,
       uri: String
   }
}, { collation: { locale: 'es', strength: 4 } });

contratacionesSchema.plugin(mongoosePaginate);

let contrataciones = model('S6', contratacionesSchema, 'contrataciones');

module.exports = {
   contratacionesSchema,
   contrataciones
};
