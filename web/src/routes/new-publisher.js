import { withLayout } from "../layout.js";

export function newPublisherRoute(req, res) {
  return res.send(
    withLayout(`
      <style>
        .form-actions {
          xmargin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .form-control {
          margin-bottom: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: start;
        }
      </style>
      <form method="POST" action="/publishers/">
        <div class="form-control">
          <label for="description">Description:</label>
          <input id="description" name="description" type="text" required>
        </div>

        <div class="form-control">
          <label for="url">URL:</label>
          <input id="url" name="url" type="url" required>
        </div>

        <div class="form-control">
          <label for="group">Group:</label>
          <input id="group" name="group" type="checkbox" value="true" checked>
        </div>
      
        <div class="form-actions">
          <a href="/">Cancel</a>
          <button type="submit">Create</button>
        </div>
      </form>
    `)
  );
}
