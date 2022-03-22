const NodeHelper = require("node_helper")
const https = require("https")

module.exports = NodeHelper.create({
  start: () => {
    console.log(this.name + " has started!")
  },

  socketNotificationReceived: function (notification, payload) {
    // Recieved Startup notification
    if (notification === "STARTUP") {
      console.log("STARTUP notification received")
      this.sendSocketNotification("STARTED")
      console.log("STARTED notification sent back to front end")
    }

    // Recieved Rotation Request
    else if (notification === "MMM_Splatoon2_ROTATIONS_REQUESTED") {
      console.log("ROTATION notification received")

      // Make request
      https.get(payload.url, (res) => {
        let data = ""

        // A chunk of data has been received.
        res.on("data", (chunk) => {
          data += chunk
        })

        res.on("end", () => {
          const response = JSON.parse(data)
          this.sendSocketNotification(
            "MMM_Splatoon2_ROTATIONS_RECEIVED",
            response
          )
          console.log("ROTATION notification sent back to front end")
        })
      })
    }
  }
})
