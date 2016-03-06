/**
 * Created by lizongyuan on 16/3/6.
 */
/**
 * Created by lizongyuan on 16/3/6.
 */
var mongodb = require('./db');

function TaskList(task, listname){
    this.taskName = task;
    this.listname = listname;
}

module.exports = TaskList;

TaskList.prototype.save = function(callback){
    var tasklist = {
        taskName: this.taskName,
        listname: this.listname
    };
    mongodb.open(function(err, db){
        if (err){
            return callback(err);
        }
        db.collection('tasklists', function(err, collection){
            if (err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(tasklist, {
                safe: true
            }, function(err, tasklist){
                mongodb.close();
                if (err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

TaskList.getAll = function(taskname, callback){
    mongodb.open(function(err, db){
        if (err){
            return callback(err);
        }
        db.collection('tasklists', function(err, collection){
            if (err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (taskname){
                query.taskName = taskname
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
