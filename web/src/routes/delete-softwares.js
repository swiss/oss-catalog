import { deleteSoftware, getSoftwares } from "../api/softwares.js";

export async function deleteSoftwaresRoute(req, res, next) {
  try {
    const softwares = await getSoftwares();
    const ids = softwares.data.map(({ id }) => id);
    await Promise.all(ids.map(deleteSoftware));
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
