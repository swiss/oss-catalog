export type RepoInfo =
  | { type: "github"; owner: string; repo: string }
  | { type: "gitlab"; owner: string; repo: string };

export function parseRepoUrl(url: string | undefined): RepoInfo | undefined {
  if (!url) return undefined;

  const gitHubMatch = url.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/i,
  );
  if (gitHubMatch) {
    const [, owner, repo] = gitHubMatch;
    return { type: "github", owner, repo };
  }

  const gitLabMatch = url.match(
    /^(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/i,
  );
  if (gitLabMatch) {
    const [, owner, repo] = gitLabMatch;
    return { type: "gitlab", owner, repo };
  }

  return undefined;
}

export function getPubliccodeYmlUrl(
  repoUrl: string | undefined,
): string | undefined {
  const repo = parseRepoUrl(repoUrl);
  if (!repo) return undefined;

  if (repo.type === "github") {
    return `https://github.com/${repo.owner}/${repo.repo}/blob/HEAD/publiccode.yml`;
  }

  return `https://gitlab.com/${repo.owner}/${repo.repo}/-/blob/HEAD/publiccode.yml`;
}
