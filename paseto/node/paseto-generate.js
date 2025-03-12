import Paseto from "paseto.js";
import addDays from "date-fns/addDays";

const args = process.argv.filter((arg) => !arg.endsWith("node"));
if (args.length !== 2) {
  console.error(`Usage: ${args[0]} <base64 encoded 32 byte paseto key>`);
  process.exit(1);
}

const key = Buffer.from(args[1], "base64");
if (key.length !== 32) {
  throw new Error("Length of the base64 decoded PASETO_KEY is not 32");
}

generatePasteoV2Token();

async function generatePasteoV2Token() {
  const tokenPayload = {
    iat: new Date(), // Issued at
    exp: addDays(new Date(), 24), // Expires in 24 hours
  };

  const sk = new Paseto.SymmetricKey(new Paseto.V2());
  await sk.inject(key);
  const encoder = sk.protocol();
  const token = await encoder.encrypt(JSON.stringify(tokenPayload), sk);
  console.log(token);
}
