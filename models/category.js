const mongoose = require('mongoose');

// todos Schema
const CategorySchema = mongoose.Schema({
  ownerid: {
    type: String,
    required:true
  },
  title: {
    type: String,
    default:'',
    required: false
  },
  budget_avg: {
    type: Number,
    default:0,
    required: false
  },
  budget_automatic:{
    type:Boolean,
    default:true,
    required:false
  },
  budget: {
    type: Number,
    default:0,
    required: false
  },
  memo: {
    type: String,
    default:'',
    required: false
  },
  required: {
    type: Boolean,
    default:false,
    required: false
  },
  descryption: {
    type: String,
    default:'',
    required: false
  }
});

const Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.getCategoryByOwnerId = function(userid, callback){
  const query = {ownerid: userid}
  Category.find(query, callback);
}


module.exports.addCategory = function(newCategory, callback){
  console.log('newCategory',newCategory);
  newCategory.save(callback);
}

module.exports.updateCategory = function(id, newCategory, callback){
  Category.findByIdAndUpdate(id,newCategory,callback);
  console.log('newCategory',newCategory);
  // var categoryid = mongoose.Types.ObjectId(id);
  // const query = {id: categoryid}
  // newCategory.update(query,newCategory,callback);
}

module.exports.deleteCategoryById = function(id, ownerid,callback){
  const query = {_id:id, ownerid: ownerid}
  Category.findOneAndRemove(query,callback);
  //Category.findByIdAndRemove(id, callback);
}
