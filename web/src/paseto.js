import Paseto from "paseto.js";
import addDays from "date-fns/addDays";

const { PASETO_KEY } = process.env;
if (!PASETO_KEY) {
  throw new Error("PASETO_KEY envrionment variable is not set");
}

const key = Buffer.from(PASETO_KEY, "base64");
if (key.length !== 32) {
  throw new Error("Length of the base64 decoded PASETO_KEY is not 32");
}

export async function getPasetoV2Token() {
  const tokenPayload = {
    iat: new Date(), // Issued at
    exp: addDays(new Date(), 24), // Expires in 24 hours
  };

  const sk = new Paseto.SymmetricKey(new Paseto.V2());
  await sk.inject(key);
  const encoder = sk.protocol();
  const token = await encoder.encrypt(JSON.stringify(tokenPayload), sk);
  return token;
}
