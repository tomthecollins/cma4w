// // Declare/initialize the variables that will contain the results of the analysis.
// const myArr = []
// const myObj = {}
//
// // Import and analyse the MIDI files.
// const mainPath = mainPaths[argv.u]
// console.log("Here we go!")
// let files = fs.readdirSync(mainPath["inDir"])
// files = files.filter(function(file){
//   return path.extname(file) === ".mid"
// })
// console.log("files.length:", files.length)
//
// // Iterate
// files
// // .slice(0, 3)
// .forEach(function(file, ithFile){
//   console.log("ithFile:", ithFile)
//   const fid = file.split(".mid")[0]
//   console.log("fid:", fid)
//   try {
//     const mi = new mm.MidiImport(path.join(mainPath["inDir"], file))
//     // Have a look at the first five points.
//     console.log("mi.points.slice(0, 5):", mi.points.slice(0, 5))
//     // Extract features (here, calculate the mean MNN).
//     const meanMnn = mu.mean(
//       mi.points.map(function(pt){ return pt[param.mnnIndex] })
//     )
//     console.log("meanMnn:", meanMnn)
//     myArr.push(meanMnn)
//     myObj[fid] = meanMnn
//   }
//   catch (e) {
//     console.log(e)
//   }
// })
//
// // Plot/visualize
// let data = [{
//   "x": myArr,
//   "type": "histogram",
// }]
// const layout = {
//   "xaxis": { "title": "Mean MIDI note number" },
//   "yaxis": { "title": "Frequency of observation" }, //, "range": [0, 1] },
//   "title": { "text": "Histogram of mean MIDI note numbers" }
// }
// plotlib.plot(data, layout)
//
// // Write output(s) to file.
// // Array containing the means
// fs.writeFileSync(
//   path.join(mainPath["outDir"], mainPath["outFileName"] + "_arr.json"),
//   JSON.stringify(myArr)//, null, 2)
// )
// // Object containing the means
// fs.writeFileSync(
//   path.join(mainPath["outDir"], mainPath["outFileName"] + "_obj.json"),
//   JSON.stringify(myObj, null, 2)
// )
