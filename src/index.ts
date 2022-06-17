#!/usr/bin/env node

import { program } from "commander";
import { Octokit } from "octokit";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VERSION: string = require("../package.json").version;

function initCLI() {
  program
    .version(VERSION)
    .name("cp-gh-label")
    .description("CLI tool to copy labels from a GitHub repository to another")
    .argument("<src>", "source repository (OWNER/REPO)")
    .argument("<dest>", "destination repository (OWNER/REPO)")
    .requiredOption("--pat <GitHub token>", "GitHub Personal Access Token");
}

function parseArgs() {
  const command = program.parse(process.argv);

  const [src, dest] = command.args;
  const [srcOwner, srcRepo] = src.split("/");
  if (!srcRepo) {
    console.log("Error: source repository should be OWNER/REPO");
    process.exit(1);
  }
  const [destOwner, destRepo] = dest.split("/");
  if (!destRepo) {
    console.log("Error: source repository should be OWNER/REPO");
    process.exit(1);
  }

  const { pat } = command.opts();

  return { srcOwner, srcRepo, destOwner, destRepo, pat };
}

async function getRepoLabels(octokit: Octokit, owner: string, repo: string) {
  return octokit.request("GET /repos/{owner}/{repo}/labels", {
    owner,
    repo,
  });
}

async function createRepoLabels(
  octokit: Octokit,
  owner: string,
  repo: string,
  labels: {
    name: string;
    description: string | null;
    color: string;
  }[]
) {
  for (const { name, description, color } of labels) {
    process.stdout.write(`Copying label '${name}' `);
    try {
      await octokit.request("POST /repos/{owner}/{repo}/labels", {
        owner,
        repo,
        name,
        description: description ?? undefined,
        color,
      });
      console.log(chalk.green("✅ success!"));
    } catch (err) {
      const code = err.response.data.errors[0].code;
      if (code === "already_exists") {
        console.log(chalk.red("❌ label already exists!"));
      } else {
        console.log(chalk.red(`❌ ${code}`));
      }
    }
  }
}

async function main() {
  initCLI();
  const { srcOwner, srcRepo, destOwner, destRepo, pat } = parseArgs();
  const octokit = new Octokit({ auth: pat });
  try {
    const { data: srcLabels } = await getRepoLabels(octokit, srcOwner, srcRepo);
    await createRepoLabels(octokit, destOwner, destRepo, srcLabels);
  } catch (err) {
    console.log(chalk.red("Unhandled error occurred"), err.response.data);
  }
}

main();
