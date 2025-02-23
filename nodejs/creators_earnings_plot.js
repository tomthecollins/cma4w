// Copyright Tom Collins, 16.5.2024
// Making a distribution plot of UK music creators' earnings.

// Requires
const argv = require('minimist')(process.argv.slice(2))
const fs = require("fs")
const path = require("path")
const csvParser = require("csv-parser")
const plotlib = require("nodeplotlib")
// const mm = require("maia-markov")
const mu = require("maia-util")

// Individual user paths
const mainPaths = {
  "tom": {
    "inDir": path.join(
      "/Users", "tomthecollins", "Library", "CloudStorage",
      "GoogleDrive-tom.collins@york.ac.uk", "My\ Drive",
      "Coding\ music\ and\ audio\ for\ the\ web",
      "Drafts", "1", "figs"
    ),
    "inFileName": "creator_earnings_5_qs.csv",
    "outDir": path.join(
      "/Users", "tomthecollins", "Library", "CloudStorage",
      "GoogleDrive-tom.collins@york.ac.uk", "My\ Drive",
      "Coding\ music\ and\ audio\ for\ the\ web",
      "Drafts", "1", "figs"
    ),
    "outFileName": "creators_earnings"
  },
  "anotherUser": {
    // ...
  }
}

// Parameters
// const param = {
//   "mnnIndex": 1
// }

// Declare/initialize the variables that will contain the results of the analysis.
const result = []

// Import and analyse the MIDI files.
const mainPath = mainPaths[argv.u]


fs.createReadStream(path.join(
  mainPath["inDir"], mainPath["inFileName"]
))
.pipe(csvParser())
.on("data", (data) => {
  result.push(data)
})
.on("end", () => {
  console.log(result.slice(0, 2))
  const keys = Object.keys(result[0])
  const ansCount = []
  keys.forEach(function(k, i){
    ansCount[i] = {}
    result.forEach(function(entry){
      if (ansCount[i][entry[k]] == undefined){
        ansCount[i][entry[k]] = 1
      }
      else {
        ansCount[i][entry[k]]++
      }
    })
  })
  console.log("ansCount:", ansCount)

  // Plot/visualize
  const xData = [
    '0',
    '1-1K',
    '1K-5K',
    '5K-10K',
    '10K-20K',
    '20K-30K',
    '30K-40K',
    '40K-50K',
    '50K-75K',
    '75K-100K',
    '100K+',
    'N/A',
    'Not say'
  ]
  const y2018 = [
    ansCount[0]['I did not earn anything from music in this year'],
    ansCount[0]['£1 - 1,000'],
    ansCount[0]['£1,001 - £5,000'],
    ansCount[0]['£5,001 - £10,000'],
    ansCount[0]['£10,001 - £20,000'],
    ansCount[0]['£20,001 - £30,000'],
    ansCount[0]['£30,001 - £40,000'],
    ansCount[0]['£40,001 - £50,000'],
    ansCount[0]['£50,001 - £75,000'],
    ansCount[0]['£75,001 - £100,000'],
    ansCount[0]['£100,000.00'],
    ansCount[0]['Not applicable'],
    ansCount[0]['Prefer not to say/not sure']
  ]
  const y2019 = [
    ansCount[1]['I did not earn anything from music in this year'],
    ansCount[1]['£1 - 1,000'],
    ansCount[1]['£1,001 - £5,000'],
    ansCount[1]['£5,001 - £10,000'],
    ansCount[1]['£10,001 - £20,000'],
    ansCount[1]['£20,001 - £30,000'],
    ansCount[1]['£30,001 - £40,000'],
    ansCount[1]['£40,001 - £50,000'],
    ansCount[1]['£50,001 - £75,000'],
    ansCount[1]['£75,001 - £100,000'],
    ansCount[1]['£100,000.00'],
    ansCount[1]['Not applicable'],
    ansCount[1]['Prefer not to say/not sure']
  ]
  const y2020 = [
    ansCount[2]['I did not earn anything from music in this year'],
    ansCount[2]['£1 - 1,000'],
    ansCount[2]['£1,001 - £5,000'],
    ansCount[2]['£5,001 - £10,000'],
    ansCount[2]['£10,001 - £20,000'],
    ansCount[2]['£20,001 - £30,000'],
    ansCount[2]['£30,001 - £40,000'],
    ansCount[2]['£40,001 - £50,000'],
    ansCount[2]['£50,001 - £75,000'],
    ansCount[2]['£75,001 - £100,000'],
    ansCount[2]['£100,000.00'],
    ansCount[2]['Not applicable'],
    ansCount[2]['Prefer not to say/not sure']
  ]
  const trace2018 = {
    "x": xData,
    "y": y2018,
    "name": "2018",
    "type": "bar",
  }
  const trace2019 = {
    "x": xData,
    "y": y2019,
    "name": "2019",
    "type": "bar",
  }
  const trace2020 = {
    "x": xData,
    "y": y2020,
    "name": "2020",
    "type": "bar",
  }
  const data = [trace2018, trace2019, trace2020]
  const layout = {
    "xaxis": { "title": "Amount earned (£)" },
    "yaxis": { "title": "Frequency of observation" }, //, "range": [0, 1] },
    "title": { "text": "Distribution of music creator earnings" },
    "barmode": "group"
  }
  plotlib.plot(data, layout)


})
