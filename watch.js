var args = require("minimist")(process.argv.slice(2))._;

var childProcess = require('child_process');
var chokidar = require("chokidar");
var colors = require("colors");
var changes = [];

var updateTrottling = args[2] || 3000;
var updateTimeoutID;

var paths = args[0].split(", ");
var cmd = args[1];

console.log(paths, cmd, updateTrottling);

for (var a = 0, watcher; a < paths.length; a++){
  watcher = chokidar.watch(paths[a]);
  watcher
      .on("change", onChange.bind(null, "change"))
      .on("unlink", onChange.bind(null, "unlink"));

  console.log("Watcher:".green, "starts listening".red, paths[a].yellow)
}


function onChange(type, path, data){
  clearTimeout(updateTimeoutID);
  if (changes.indexOf(path) < 0) changes.push(path);
  updateTimeoutID = setTimeout(execute.bind(), updateTrottling);
}

function execute(){
  childProcess.exec(cmd, function(error, stdout, stderr) {
    console.log("Watcher:".green, cmd.red, "executed".yellow);
    logChanges();
    changes.length = 0;
  });
}

function logChanges(){
    for (var a = 0; a < changes.length; a++){
      console.log(changes[a].blue);
    }
}
