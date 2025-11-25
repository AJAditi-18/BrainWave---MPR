// /backend/scraper/ipuRank.js
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchBCARanklist() {
  try {
    const url = "https://www.ipuranklist.com/ranklist/bca";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let students = [];

    $("table tbody tr").each((i, row) => {
      const cols = $(row).find("td");

      students.push({
        rank: Number($(cols[0]).text().trim()),
        name: $(cols[1]).text().trim(),
        college: $(cols[2]).text().trim(),
        gpa: Number($(cols[3]).text().trim()),
      });
    });

    return students;
  } catch (err) {
    console.error("Scraper error:", err);
    return [];
  }
}

module.exports = { fetchBCARanklist };
