
// Chenyu, 30.07.2024, for VGO dataset preprocess:
// 1) remove empty tracks,
// 2) correct MIDI note number error by removing any notes out of the range [0, 127],
// 3) other steps will involve using TC to identify infinity loop, which will be processed by another script...

// Requires
const argv = require('minimist')(process.argv.slice(2))
const fs = require("fs")
const path = require("path")
// const uu = require("uuid/v4")
const { Midi } = require('@tonejs/midi')

// Individual user paths
const mainPaths = {
  "tom": {
    "midi": path.join(
      "/Users", "tomthecollins", "Shizz", "UMiami", "Projects", "cma4w_data",
      "hip_hop_midi"
    ),
    "midiDirs": ["mid"],
    "outputDir": path.join(
      "/Users", "tomthecollins", "Shizz", "UMiami", "Projects", "cma4w_data",
      "preprocessed",
    ),
  },
  "someoneElse": {
    "midi": path.join("blah", "blah"),
    "midiDirs": ["someFolder"],
    "outputDir": path.join("blah", "blah")
  }
}

const param = {
  "downbeat": {
    "histType": "drumsFalseVelocityTrue",
    "drumsOnly": false,
    "rounding": true,
    "granularity": 4,
    "beatsInMeasure": 4,
    "velocityIndex": 4,
    "ontimeIndex": 0
  },
  "ontimeIndex": 0,
  "noteIndices": {
    "ontimeIndex": 0,
    "mnnIndex": 1,
    "durationIndex": 2,
    "channelIndex": 3,
    "velocityIndex": 4
  },
  "controlChanges": null,
  "scaleFactor": 0.5,
  "timeSigtopNo": 4,
  "timeSigBottomNo": 4
}

// Grab user name from command line to set path to data.
const mainPath = mainPaths[argv.u]

// Import and analyse the MIDI files.
let instSet = new Set()
let midiDirs = fs.readdirSync(mainPath["midi"])
midiDirs = midiDirs.filter(function(midiDir){
  return mainPath["midiDirs"].indexOf(midiDir) >= 0
})
console.log("midiDirs:", midiDirs)
midiDirs.forEach(function(midiDir, jDir){
  console.log("Working on midiDir:", midiDir, "jDir:", jDir)
  let files = fs.readdirSync(path.join(mainPath["midi"], midiDir))
  files = files.filter(function(file){
    const fileSplit = file.split(".")
    return fileSplit[fileSplit.length - 1] == "mid"
  })
  console.log("files.length:", files.length)

  files
  // .slice(0,1)
  // Comment out slice() when everything seems to be working.
  .forEach(function(file, iFile){
    console.log("File:", file)
    console.log("iFile:", iFile)
    const fid = file.split(".mid")[0]
    if (iFile % 10 === 0){
      console.log("FILE " + (iFile + 1) + " OF " + files.length + ".")
    }
    try {
      const midiData = fs.readFileSync(
        path.join(mainPath["midi"], midiDir, file)
      )
      const midi = new Midi(midiData)

      // This is a quick way to obtain an opening time signature from the MIDI file.
      const timeSigs = [midi.header.timeSignatures.map(function(ts){
        return {
          "barNo": ts.measures + 1,
          "topNo": ts.timeSignature[0],
          "bottomNo": ts.timeSignature[1],
          "ontime": ts.ticks/midi.header.ppq
        }
      })[0]]

      // Here we will get the track/instrument information.
      // console.log("Track information:", midi.tracks)

      let allTracks = []
      // In future if you want to separate out percussion tracks, something like
      // track.instrument.family === "drums"
      // and defining a second or third array above to hold separated tracks
      // might be a good idea.
      let tmpTrackCnt = 0
      let maxTick = 0
      let tmpInstrument = []
      midi.tracks.forEach(function(track, idx){
        let allPoints = []
        if(track.notes.length > 0){
          tmpTrackCnt ++
          instSet.add(track.instrument.number)

          const instrInfo = track.instrument.family + " -> " + track.instrument.name
          // console.log("instrInfo:", instrInfo)
          // // Get instrument number
          // console.log("track.instrument.number:", track.instrument.number)
          tmpInstrument.push({"number": track.instrument.number, "family": track.instrument.family, "name": track.instrument.name})

          track.notes.forEach(function(n){
            // Update maxTick. maxTick doesn't seem to be used. Remove?
            if (n.ticks + n.durationTicks > maxTick){
              maxTick = n.ticks + n.durationTicks
            }
            // pt = [beat, midi note number, duration, channel, velocity]
            if (n.midi <= 127 && n.midi >=0){
              let pt = [
                Math.round(100000*(n.ticks/midi.header.ppq))/100000,
                n.midi,
                Math.round(100000*(n.durationTicks/midi.header.ppq))/100000,
                track.channel,
                Math.round(1000*n.velocity)/1000
              ]
              allPoints.push(pt)
            }

            // if (track.instrument.family !== "drums"){
            //   tonalPoints.push(pt)
            // }
          })
          if(allPoints.length > 0){
            allTracks.push({"pt": allPoints, "instrument": track.instrument, "name": track.name, "channel":track.channel, "tempo": midi.header.tempos})
          }
        }


        // console.log("midi.header", midi.header)
      })
      console.log("allTracks.length", allTracks.length)

      // Write a new MIDI file
      const midiOut = new Midi()
      let ntracks = allTracks.length
      for (let itrack = 0; itrack < ntracks; itrack++){
        const tmpOutPoints = allTracks[itrack].pt
        const track = midiOut.addTrack()
        track.name = allTracks[itrack].name
        track.instrument = allTracks[itrack].instrument
        track["channel"] = allTracks[itrack].channel
        tmpOutPoints.forEach(function(p){
          track.addNote({
            midi: p[param.noteIndices.mnnIndex],
            time: param.scaleFactor*(p[param.noteIndices.ontimeIndex]),
            duration: param.scaleFactor*p[param.noteIndices.durationIndex],
            velocity: p[param.noteIndices.velocityIndex]
          })
        })
      }
      midiOut.header.tempos = midi.header.tempos
      console.log("midiOut.header.tempos", midiOut.header.tempos)

      const tmpMidiName = file
      fs.writeFileSync(
        path.join(mainPath["outputDir"], tmpMidiName),
        new Buffer.from(midiOut.toArray())
      )


    }
    catch (e) {
      console.log(e)
    }
  })
})
