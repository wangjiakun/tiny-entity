"use strict";
const Datastore = require("nedb");
class DBOpenWorker {
    constructor(option, callback) {
        this.interval = 200;
        this.option = option;
        this.callback = callback;
        this.workId = new Date().getTime();
    }
    get WorkId() { return this.workId; }
    BeginTask(interval) {
        if (interval)
            this.interval = interval;
        this.timer = setInterval(this.OpenDBTask.bind(this), this.interval);
    }
    Destory() {
        if (this.timer)
            clearInterval(this.timer);
        if (this.OnDestory)
            this.OnDestory = null;
    }
    OpenDBTask() {
        clearInterval(this.timer);
        let db = new Datastore(this.option.path);
        db.loadDatabase(err => {
            if (err)
                this.timer = setInterval(this.OpenDBTask.bind(this), this.interval);
            else {
                this.callback(db);
                this.OnDestory && this.OnDestory();
            }
        });
    }
}
exports.DBOpenWorker = DBOpenWorker;
class OpenWorkerManager {
    constructor() {
        this.taskList = [];
    }
    Task(task) {
        task.OnDestory = () => {
            let index = this.taskList.findIndex(x => x.WorkId == task.WorkId);
            task.Destory();
            this.taskList.splice(index, 1);
        };
        this.taskList.push(task);
        process.nextTick(task.BeginTask);
    }
}
OpenWorkerManager.Current = new OpenWorkerManager();
exports.OpenWorkerManager = OpenWorkerManager;
//# sourceMappingURL=dbOpenWorker.js.map