import { deletePublisher } from "../api/publishers.js";

export async function deletePublisherRoute(req, res) {
  const id = req.params.id;

  if (!id) {
    res.send(withLayout("Invalid"));
    return;
  }

  await deletePublisher(id);
  res.redirect("/");
}
