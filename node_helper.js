const NodeHelper = require("node_helper")
const https = require("https")

module.exports = NodeHelper.create({
  start: () => {
    console.log(this.name + " has started!")
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "CONFIG") {
      console.log("CONFIG notification received")
      this.config = payload
      this.sendSocketNotification("STARTED")
      console.log("STARTED notification sent back to front end")
    } else if (notification === "MMM_Splatoon2_ROTATIONS") {
      console.log("ROTATION notification received")
      console.log("STARTED2 notification sent back to front end")
      https.get(payload.url, (res) => {
        let data = ""

        // A chunk of data has been received.
        res.on("data", (chunk) => {
          data += chunk
        })

        res.on("end", () => {
          console.log(JSON.parse(data))
          this.sendSocketNotification("STARTED2", JSON.parse(data))
        })
      })
    }
  }
})
