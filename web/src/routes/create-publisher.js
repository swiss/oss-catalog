import { createPublisher } from "../api/publishers.js";

export async function createPublisherRoute(req, res, next) {
  try {
    const description = req.body.description;
    const url = req.body.url;
    const group = req.body.group;

    if (!description && !url) {
      res.send(withLayout("Invalid"));
      return;
    }

    await createPublisher({
      description,
      codeHosting: [
        {
          url,
          group: group === "true",
        },
      ],
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
