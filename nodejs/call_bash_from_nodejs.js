const fs = require("fs")
const os = require("os")
const path = require("path")
const execSync = require('child_process').execSync
const folderName = "bunchOfFiles"

let myStr = "cd " + os.homedir() + "\n"
  + "mkdir -p " + folderName + "\n"
console.log("Script execution string:", myStr)
let res = execSync(myStr, { encoding: 'utf-8' })
console.log("res:", res)

for (let i = 0; i < 50; i++){
  myStr = "touch " + path.join(os.homedir(), folderName, "file_" + i + ".txt") + "\n"
  console.log("Script execution string:", myStr)
  res = execSync(myStr, { encoding: 'utf-8' })
}
