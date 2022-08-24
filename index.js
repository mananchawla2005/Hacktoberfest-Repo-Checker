require("dotenv").config();
const express = require("express");
const app = express();
const { Octokit } = require("@octokit/core");
const session = require("express-session");
const parseurl = require("parse-url");
const octokit = new Octokit({ auth: process.env.TOKEN });
const octoberChecker = require("./utils/octoberChecker");
app.use(
  session({ secret: process.env.SECRET, resave: false, saveUninitialized: false })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Methods
function getRepositoryDetailsObject(URL) {
  const owner = parseurl(URL).pathname.split("/")[1];
  const repository = parseurl(URL).pathname.split("/")[2];
  const isPrUrl = parseurl(URL).pathname.includes("pull");
  const repoObj = {
    owner: owner,
    repository: repository,
    isPrUrl: isPrUrl,
    URL: URL,
  };
  return JSON.stringify(repoObj);
}
function checkEligibilityForHacktoberfest(response) {
  // Getting All Labels from Response
  const labels = response.data.labels;
  let isHacktoberFestPr = false;
  // Searching for hacktoberfest labels
  labels.forEach((label) => {
    if (
      label.name == "hacktoberfest" ||
      label.name == "hacktoberfest-accepted"
    ) {
      isHacktoberFestPr = true;
    }
  });
  return JSON.stringify({
    status: response.status,
    isOpen: !(response.data.state === "closed"),
    isEligible: isHacktoberFestPr,
    valid: response.status == 200,
  });
}
async function getPRDetails(owner, repository, prNumber) {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: owner,
      repo: repository,
      pull_number: prNumber,
    }
  );
  return JSON.stringify(response);
}
async function handlePRURL({ owner, repository, isPrUrl, URL }) {
  let prNumber = parseInt(parseurl(URL).pathname.split("/")[4]);
  let resultObj = new Object();
  try {
    // Getting details corresponding to PR Number
    await getPRDetails(owner, repository, prNumber)
      .then((response) => {
        // Check repository for Hacktoberfest
        response = JSON.parse(response);
        const hacktoberfestEligibilityData = JSON.parse(
          checkEligibilityForHacktoberfest(response)
        );
        resultObj = hacktoberfestEligibilityData;
      })
      .catch((err) => {
        //console.log(err);
        const obj = {
          status: 404,
          isOpen: undefined,
          isEligible: undefined,
          valid: undefined,
        };
        resultObj = obj;
      });
  } catch (err) {
    //console.log(err);
    const obj = {
      status: 404,
      isOpen: undefined,
      isEligible: undefined,
      valid: undefined,
    };
    resultObj = obj;
  }
  return resultObj;
}
async function getIssues(owner, repository) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: owner,
    repo: repository,
    sort: "created",
    direction: "asc",
  });
  const issues = response.data;
  const status = response.status;
  return {
    issues: issues,
    status: status,
  };
}
async function getTopics(owner, repository) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/topics", {
    owner: owner,
    repo: repository,
    mediaType: { previews: ["mercy"] },
  });
  const topics = response.data;
  return topics;
}
async function handleNonPRURL({ owner, repository, isPrUrl, URL }) {
  let resultObj = new Object();
  try {
    await getIssues(owner, repository)
      .then((response) => {
        let isBanned = false;
        const issues = response.issues;
        const status = response.status;
        issues.forEach((issue) => {
          const banString =
            "Pull requests here won’t count toward Hacktoberfest.";

          if (issue.title.toLowerCase() == banString.toLowerCase()) {
            isBanned = true;
          }
        });
        return {
          isBanned: isBanned,
          status: status,
        };
      })
      .then(async (response) => {
        const isBanned = response.isBanned;
        const status = response.status;
        if (isBanned) {
          resultObj = {
            status: 15, //Blocked Error Code
            isOpen: undefined,
            isEligible: undefined,
            valid: undefined,
          };
        } else {
          await getTopics(owner, repository)
            .then((topics) => {
              resultObj = {
                status: 200,
                isOpen: undefined,
                isEligible: topics.names.includes("hacktoberfest"),
                valid: status == 200,
              };
            })
            .catch((err) => {
              //console.log(err);
              resultObj = {
                status: 404,
                isOpen: undefined,
                isEligible: undefined,
                valid: undefined,
              };
            });
        }
      })
      .catch((err) => {
        //console.log(err);
        resultObj = {
          status: 404,
          isOpen: undefined,
          isEligible: undefined,
          valid: undefined,
        };
      });
  } catch (err) {
    //console.log(err);
    resultObj = {
      status: 404,
      isOpen: undefined,
      isEligible: undefined,
      valid: undefined,
    };
  }
  return resultObj;
}

// Endpoints
app.get("/", (req, res) => {
  if(octoberChecker.isNotOctober()) {
    res.render("not-october")
  }
  else{
    res.render("index");
  }
});

app.get("/api", async (req, res) => {
  const URL = req.query.url;
  // Checking if URL is null
  if (URL == null) {
    return res.sendStatus(404);
  }
  // If not get owner, repository name
  const repoObj = JSON.parse(getRepositoryDetailsObject(URL));
  // Checking if URL is PR URL or not
  if (repoObj.isPrUrl) {
    // PR URL
    handlePRURL(repoObj).then((response) => res.json(response));
  } else {
    handleNonPRURL(repoObj).then((response) => {
      res.json(response);
    });
  }
});

app.listen(process.env.PORT || 80, () => console.log("Listening on port 80"));
