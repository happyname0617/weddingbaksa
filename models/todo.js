const mongoose = require('mongoose');

// todos Schema
const TodoSchema = mongoose.Schema({
  ownerid: {
    type: String,
    required:true
  },
  title: {
    type: String,
    default:'',
    required: false
  },
  categoryid: {
    type: String,
    required: true
  },
  memo: {
    type: String,
    default:'',
    required: false
  },
  completed: {
    type: Boolean,
    default:false,
    required: false
  },
  descryption: {
    type: String,
    default:'',
    required: false
  },
  budget_avg: {
    type: Number,
//    default:0,
    min:-1,
    max:10000,
    required: false
  },  
  budget: {
    type: Number,
    //default:0,
    min:-1,
    max:10000,
    required: false
  }
});

const Todo = module.exports = mongoose.model('Todo', TodoSchema);

module.exports.getTodoByOwnerId = function(userid, callback){
  const query = {ownerid: userid}
  Todo.find(query, callback);
}

module.exports.getTodoByQuery = function(query, callback){
  Todo.find(query, callback);
}


module.exports.addTodo = function(newTodo, callback){
  console.log('newTodo',newTodo);
  newTodo.save(callback);
}

module.exports.updateTodo = function(todoid,newTodo, callback){
  console.log('newTodo',newTodo);
  Todo.findByIdAndUpdate(todoid,newTodo,callback);
}
module.exports.deleteTodoById = function(todoid, ownerid,callback){
  const query = {_id:todoid, ownerid: ownerid}
  Todo.findOneAndRemove(query,callback);
}
