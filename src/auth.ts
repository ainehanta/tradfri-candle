import { promises as fs } from "fs";
import { discoverGateway, TradfriClient } from "node-tradfri-client";

(async function () {
  const result = await discoverGateway();

  console.log(result);

  const name = result?.name;

  if (!name) {
    console.error("GW not found");
    return;
  }

  const tradfri = new TradfriClient(name);

  const { identity, psk } = await tradfri.authenticate(
    process.env.SECURITY_CODE || ""
  );

  console.log(identity, psk);

  tradfri.destroy();

  await fs.writeFile(
    "./secrets.json",
    JSON.stringify({
      name,
      identity,
      psk,
    })
  );

  return;
})();
