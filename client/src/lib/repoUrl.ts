export function getPubliccodeYmlUrl(
  repoUrl: string | undefined,
): string | undefined {
  if (!repoUrl) return undefined;

  const cleanUrl = repoUrl.replace(/\/+$/g, "").replace(/\.git$/i, "");

  const gitHubMatch = cleanUrl.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\/.*)?$/i,
  );
  if (gitHubMatch) {
    const [, owner, repo] = gitHubMatch;
    return `https://github.com/${owner}/${repo}/blob/HEAD/publiccode.yml`;
  }

  const gitLabMatch = cleanUrl.match(
    /^(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+?)(?:\/.*)?$/i,
  );
  if (gitLabMatch) {
    const [, owner, repo] = gitLabMatch;
    return `https://gitlab.com/${owner}/${repo}/-/blob/HEAD/publiccode.yml`;
  }

  return undefined;
}
