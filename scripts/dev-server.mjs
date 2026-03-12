import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { networkInterfaces } from "node:os";

const require = createRequire(import.meta.url);

function isPrivateIpv4(address) {
  if (address.startsWith("10.")) {
    return true;
  }

  if (address.startsWith("192.168.")) {
    return true;
  }

  const parts = address.split(".").map(Number);
  return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function isVirtualInterface(name) {
  return /(wsl|hyper-v|vethernet|docker|vmware|virtualbox|tailscale|hamachi|vpn|loopback)/i.test(name);
}

function getLanIp() {
  const candidates = [];

  for (const [name, entries] of Object.entries(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family !== "IPv4" || entry.internal || !isPrivateIpv4(entry.address)) {
        continue;
      }

      candidates.push({
        address: entry.address,
        isVirtual: isVirtualInterface(name),
        name,
      });
    }
  }

  candidates.sort((left, right) => {
    if (left.isVirtual !== right.isVirtual) {
      return left.isVirtual ? 1 : -1;
    }

    const leftWifi = /wi-?fi|wlan/i.test(left.name);
    const rightWifi = /wi-?fi|wlan/i.test(right.name);

    if (leftWifi !== rightWifi) {
      return leftWifi ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });

  return candidates[0]?.address ?? null;
}

const host = "0.0.0.0";
const port = process.env.PORT || "3000";
const lanIp = getLanIp();

console.log(`Starting Next dev server on http://${host}:${port}`);

if (lanIp) {
  console.log(`Phone URL: http://${lanIp}:${port}`);
  console.log("If Next prints a 172.x WSL address below, ignore it and use the Phone URL instead.");
} else {
  console.log("No LAN IPv4 address detected. Connect from the same Wi-Fi and use your machine's private IPv4 address.");
}

const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, "dev", "--hostname", host, "--port", port, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
