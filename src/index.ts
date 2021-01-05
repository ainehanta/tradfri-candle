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

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
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

  const flicker = (deviceId: number, nextTimeout: number) => {
    console.log("device:", deviceId);
    console.log("\tnextTimeout", nextTimeout);
    setTimeout(() => {
      const device = lightbulbs[deviceId];

      if (device) {
        const dimmer = getRandomArbitrary(40, 80);
        console.log("\tdimmer", dimmer);
        const transitionTime = getRandomArbitrary(0, 0.3);
        console.log("\ttransitionTime", transitionTime);
        device.lightList[0].setBrightness(dimmer, transitionTime);
      }

      flicker(deviceId, getRandomInt(100, 800));
    }, nextTimeout);
  };

  const ids: number[] = JSON.parse(
    process.env.IDS || "[65544, 65543, 65545, 65546, 65538, 65547]"
  );

  ids.forEach((id) => {
    flicker(id, 0);
  });
})();
