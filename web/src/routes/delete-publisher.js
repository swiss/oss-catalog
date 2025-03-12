import { deletePublisher } from "../api/publishers.js";

export async function deletePublisherRoute(req, res, next) {
  try {
    const id = req.params.id;

    if (!id) {
      res.send(withLayout("Invalid"));
      return;
    }

    await deletePublisher(id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
