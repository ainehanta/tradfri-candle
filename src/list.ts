import { Accessory, AccessoryTypes, TradfriClient } from "node-tradfri-client";

import { promises as fs } from "fs";

const lightbulbs: { [key: number]: Accessory } = {};
function deviceUpdated(device: Accessory) {
  if (device.type === AccessoryTypes.lightbulb) {
    lightbulbs[device.instanceId] = device;
  }
}

function deviceRemoved(instanceId: number) {
  delete lightbulbs[instanceId];
}

(async function () {
  const secrets = await fs.readFile("./secrets.json", "utf-8").then(JSON.parse);

  const tradfri = new TradfriClient(secrets.name);

  await tradfri.connect(secrets.identity, secrets.psk).catch((err) => {
    console.error(err);
    return;
  });

  tradfri
    .on("device updated", deviceUpdated)
    .on("device removed", deviceRemoved)
    .observeDevices();

  setTimeout(() => {
    console.log(lightbulbs);
    tradfri.destroy();
  }, 1000);
})();
