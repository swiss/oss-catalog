export function resolveMediaUrl(
  repoUrl: string | undefined,
  path: string | undefined,
): string | undefined {
  if (!path) return undefined;

  const gitHubBlobMatch = path.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+?)\/blob\/([^/]+)\/([^?#]+)(?:[?#].*)?$/i,
  );
  if (gitHubBlobMatch) {
    const [, owner, repo, branch, filePath] = gitHubBlobMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${filePath}`;
  }

  const gitLabBlobMatch = path.match(
    /^(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+?)\/-\/blob\/([^/]+)\/([^?#]+)(?:[?#].*)?$/i,
  );
  if (gitLabBlobMatch) {
    const [, owner, repo, branch, filePath] = gitLabBlobMatch;
    return `https://gitlab.com/${owner}/${repo}/-/raw/${branch}/${filePath}`;
  }

  if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
  if (!repoUrl) return undefined;

  const cleanPath = path.replace(/^\/+/, "");

  const gitHubMatch = repoUrl.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/i,
  );
  if (gitHubMatch) {
    const [, owner, repo] = gitHubMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${cleanPath}`;
  }

  const gitLabMatch = repoUrl.match(
    /^(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/i,
  );
  if (gitLabMatch) {
    const [, owner, repo] = gitLabMatch;
    return `https://gitlab.com/${owner}/${repo}/-/raw/HEAD/${cleanPath}`;
  }

  return undefined;
}

export type VideoEmbed = {
  type: "youtube" | "vimeo";
  embedUrl: string;
  watchUrl: string;
};

export function getVideoEmbed(
  videoUrl: string | undefined,
): VideoEmbed | undefined {
  if (!videoUrl) return undefined;

  const youTubeMatch = videoUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  if (youTubeMatch) {
    const videoId = youTubeMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  const vimeoMatch = videoUrl.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
  );
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
      watchUrl: `https://vimeo.com/${videoId}`,
    };
  }

  return undefined;
}
