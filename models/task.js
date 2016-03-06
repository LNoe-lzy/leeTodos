/**
 * Created by lizongyuan on 16/3/6.
 */
var mongodb = require('./db');

function Task(email, task){
    this.email = email;
    this.taskName = task;
}

module.exports = Task;

Task.prototype.save = function(callback){
    var task = {
        email: this.email,
        taskName: this.taskName
    };
    mongodb.open(function(err, db){
        if (err){
            return callback(err);
        }
        db.collection('tasks', function(err, collection){
            if (err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(task, {
                safe: true
            }, function(err, task){
                mongodb.close();
                if (err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Task.getAll = function(name, callback){
    mongodb.open(function(err, db){
        if (err){
            return callback(err);
        }
        db.collection('tasks', function(err, collection){
            if (err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name){
                query.name = name;
            }
            // 根据query对象查询文档
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, tas){
                mongodb.close();
                if (err){
                    return callback(err);
                }
                callback(null, tas);
            });
        });
    });
};

Task.getOne = function(name, taskName, callback){
   mongodb.open(function(err, db){
       if (err){
           return callback(err);
       }
       db.collection('tasks', function(err, collection){
           if (err){
               mongodb.close();
               return callback(err);
           }
           collection.findOne({
               "email": name,
               "taskName": taskName
           }, function(err, tas){
               mongodb.close();
               if (err){
                   return callback(err);
               }
               callback(null, tas);
           });
       });
   });
};