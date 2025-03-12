import { deleteSoftware, getSoftwares } from "../api/softwares.js";

export async function deleteSoftwaresRoute(req, res) {
  const softwares = await getSoftwares();
  const ids = softwares.data.map(({ id }) => id);
  await Promise.all(ids.map(deleteSoftware));
  res.redirect("/");
}
