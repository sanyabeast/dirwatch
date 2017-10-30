var args = require("minimist")(process.argv.slice(2))._;

var childProcess = require('child_process');
var jsonfile = require("jsonfile");
var chokidar = require("chokidar");
var colors = require("colors");

var configPath = args[0];

jsonfile.readFile(configPath, function(err, obj){
  if (err){
    console.log("dirwatch:".red, err.code, err);
  } else {
    global.dirwatch = new Dirwatch(obj);
  }
});

class Dirwatch {
  constructor(config){
    this.changes = [];
    this.paths = config.paths;
    this.updateTrottling = config.updateTrottling || 200;
    this.command = config.command;
    this.updateTimeoutID = null;
    this.watchers = {};
    this.execWait = false;

    this.execute = this.execute.bind(this);
    this.subscribeForPaths(this.paths);

  }

  subscribeForPaths(paths){
    for (var a = 0, watcher; a < paths.length; a++){
      watcher = chokidar.watch(paths[a]);
      watcher
          .on("change", this.onChange.bind(this, "change"))
          .on("unlink", this.onChange.bind(this, "unlink"));

      this.watchers[paths[a]] - watcher;

      console.log("dirwatch:".yellow, "starts listening".green, paths[a].yellow);
    }
  }

  onChange(type, path, data){
    clearTimeout(this.updateTimeoutID);

    if (this.changes.indexOf(path) < 0){
      this.changes.push(path);
    }

    this.updateTimeoutID = setTimeout(this.execute, this.updateTrottling);
  }

  execute(){
    if (this.execWait){
      return;
    }

    this.execWait = true;

    this.logChanges(this.changes);
    
    childProcess.exec(this.command, function(error, stdout, stderr) {
      console.log("dirwatch:".yellow, this.command.blue, "executed".green);
      this.changes.length = 0;
      this.execWait = false;
    }.bind(this));
  }

  logChanges(changes){
      for (var a = 0; a < changes.length; a++){
        console.log(("dirwatch: changed at " + new Date()).yellow, changes[a].blue);
      }
  }

}

module.exports = Dirwatch;