import { GithubLogo } from "./GithubLogo";
import { GitlabLogo } from "./Gitlab.logo";

type RepositoryPlatformLogoProps = {
    url?: string;
};

function getRepositoryPlatform(url?: string) {
    if (!url) return "unknown";

    const normalized = url.toLowerCase();

    if (normalized.includes("gitlab")) return "gitlab";
    if (normalized.includes("github")) return "github";

    return "unknown";
}

export function RepositoryPlatformLogo({
    url,
}: RepositoryPlatformLogoProps) {
    const repositoryPlatform = getRepositoryPlatform(url);

    if (repositoryPlatform === "gitlab") {
        return <GitlabLogo />;
    }

    return <GithubLogo />;
}