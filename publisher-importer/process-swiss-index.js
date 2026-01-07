const https = require("https");
const http = require("http");

/**
 * Fetches the Swiss index README.md file, parses GitHub URLs,
 * and sends POST requests for each organization to the API.
 */
async function processSwissIndex() {
  const pasetoToken = process.env.PASETO_TOKEN;

  if (!pasetoToken) {
    console.error("Error: The PASETO_TOKEN environment variable is not set.");
    process.exit(1);
  }

  const baseUrl = "http://localhost:3000";
  const apiEndpoint = new URL(`${baseUrl}/v1/publishers`);
  const indexUrl =
    "https://raw.githubusercontent.com/swiss/index/refs/heads/main/README.md";

  try {
    console.log("Fetching Swiss index README.md...");
    const readmeContent = await fetchUrl(indexUrl);

    const urls = parseUrls(readmeContent);
    console.log(`Found ${urls.length} GitHub organizations to process.`);

    // Process each URL
    const requestPromises = urls.map((url) => {
      // For the time being, we only allow group URLs.
      // As GitLabs allows subgroups, it is not possible to tell whether a URL is for a group or a repository.
      // Group URLs: https://github.com/group or https://gitlab.com/group/subgroup
      // Repo URLs: https://github.com/group/repo
      // const isGroupUrl = /^https:\/\/(?:github|gitlab)\.com\/[^\/]+\/?$/.test(url);
      const postData = JSON.stringify({
        codeHosting: [
          {
            url: url,
            group: true,
          },
        ],
        description: `Swiss Federal Organization: ${url}`,
      });

      const options = {
        hostname: apiEndpoint.hostname,
        path: apiEndpoint.pathname,
        method: "POST",
        port: apiEndpoint.port,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          Authorization: `Bearer ${pasetoToken}`,
        },
      };

      console.log(
        "posting options",
        options.hostname,
        options.path,
        options.port
      );
      console.log("postData:", postData);

      return new Promise((resolve, reject) => {
        const requestModule = apiEndpoint.protocol === "https:" ? https : http;
        const req = requestModule.request(options, (res) => {
          let responseBody = "";

          res.on("data", (chunk) => {
            responseBody += chunk;
          });

          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(
                `Successfully posted ${url}. Status: ${res.statusCode}`
              );
              resolve(res.statusCode);
            } else {
              console.error(
                `Failed to post ${url}. Status: ${res.statusCode}, Data: ${responseBody}`
              );
              reject(
                new Error(`Request failed with status code ${res.statusCode}`)
              );
            }
          });
        });

        req.on("error", (error) => {
          console.error(
            `Error setting up request for ${url}. Error: ${JSON.stringify(
              error
            )}`
          );
          reject(error);
        });

        req.write(postData);
        req.end();
      });
    });

    await Promise.allSettled(requestPromises);
    console.log("\nProcessing complete.");
  } catch (error) {
    console.error(`Error processing Swiss index: ${error.message}`);
  }
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const requestModule = url.startsWith("https:") ? https : http;
    const req = requestModule.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

function parseUrls(content) {
  return content
    .split("\n")
    .map((line) => line.match(/\* (https:\/\/(?:github|gitlab)\.com\/[^ ]+)/))
    .filter(Boolean)
    .map((match) => match[1]);
}

processSwissIndex();
