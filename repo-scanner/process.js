const fs = require("fs/promises");
const path = require("path");
const https = require("https");
const http = require("http");

/**
 * Reads a text file of repository URLs, sending a POST request for each one
 * using the native Node.js https module.
 * Assumes 'repos.txt' is in the same directory as the script.
 * Each line in the file should be a single URL.
 */
async function processRepositories() {
  const pasetoToken = process.env.PASETO_TOKEN;

  if (!pasetoToken) {
    console.error("Error: The PASETO_TOKEN environment variable is not set.");
    console.error(
      'Please create a .env file and add PASETO_TOKEN="your_token_here"'
    );
    process.exit(1); // Exit with a failure code.
  }

  const filePath = path.join(__dirname, "repos.txt");
  // const apiEndpoint = new URL('https://oss-catalog-api.ocp.cloudscale.puzzle.ch/v1/publishers');
  const baseUrl = process.env.API_ENDPOINT;

  const apiEndpoint = new URL(`${baseUrl}/v1/publishers`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    const urls = fileContent.split("\n").filter((line) => line.trim() !== "");

    console.log(`Found ${urls.length} repositories to process.`);

    // Map each URL to a promise that resolves when the request is complete.
    const requestPromises = urls.map((url) => {
      const trimmedUrl = url.trim();

      // Determine if this is a group URL or a repository URL
      // Group URLs: https://github.com/groupname
      // Repo URLs: https://github.com/groupname/reponame
      const isGroupUrl = /^https:\/\/github\.com\/[^\/]+\/?$/.test(trimmedUrl);

      // Construct the data payload according to the required API schema.
      const postData = JSON.stringify({
        codeHosting: [
          {
            url: trimmedUrl,
            group: isGroupUrl,
          },
        ],
        description: trimmedUrl, // workaround - should be defined in repos.txt (maybe change it to json or csv)
      });

      // Configure the request options for the native https module.
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

      // Return a new promise for each request.
      return new Promise((resolve, reject) => {
        // Use http or https module based on the protocol
        const requestModule = apiEndpoint.protocol === "https:" ? https : http;
        const req = requestModule.request(options, (res) => {
          let responseBody = "";
          // A chunk of data has been received.
          res.on("data", (chunk) => {
            responseBody += chunk;
          });

          // The whole response has been received.
          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(
                `Successfully posted ${trimmedUrl}. Status: ${res.statusCode}`
              );
              resolve(res.statusCode);
            } else {
              console.error(
                `Failed to post ${trimmedUrl}. Status: ${res.statusCode}, Data: ${responseBody}`
              );
              reject(
                new Error(`Request failed with status code ${res.statusCode}`)
              );
            }
          });
        });
        // Handle network errors.
        req.on("error", (error) => {
          console.error(
            `Error setting up request for ${trimmedUrl}. Error: ${JSON.stringify(
              error
            )}`
          );
          reject(error);
        });

        // Write the JSON payload to the request body.
        req.write(postData);
        // Finalize the request.
        req.end();
      });
    });

    // Wait for all the requests to settle (either resolve or reject).
    await Promise.allSettled(requestPromises);

    console.log("\nProcessing complete.");
  } catch (error) {
    // Handle errors related to reading the file (e.g., file not found).
    console.error(`Error reading or processing file: ${error.message}`);
  }
}

processRepositories();
