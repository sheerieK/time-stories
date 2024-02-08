const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const TIME_URL = "https://time.com";



app.get("/", () => console.log("homePage"));

// Route for fetching the latest stories
app.get("/getTimeStories", async (req, res) => {
  try {
    // Fetch the Time.com Page
    const response = await axios.get(TIME_URL);

    //contains all the elements of Times.com
    const html = response.data;

    //defining pattern for required div( i.e. class of partial latest-stories)
    const divTag = '<div class="partial latest-stories" ';

    //find indexOf the required div which contains the links
    const startIndexOfDiv = html.indexOf(divTag);
    const substr = html.substring(startIndexOfDiv);

  

    const indexOfUl = substr.indexOf("<ul");

    //get index of closing tag of ul
    const closeIndexOfUl = substr.indexOf("</ul>");

    //GET THE WHOLE UL(unordered List) DATA THEN EXTRACT THE LINKS
    const subStrOfUl = substr.substring(indexOfUl, closeIndexOfUl);

    // remove escape sequence characters & spaces
    const data = subStrOfUl.replace(/\s+|\n/g, " ");

    //get the lists in the form of array
    const linkData = data.split("<li");

    //initialize a blank array to store the links
    const links = [];

    // WE HAVE TO GET THE <a></a> content which is within the list : so get the indexOf UL tag first
    for (let i = 1; i < 7; i++) {
    
      //1. index of < tag then then indexOf > and then closing tagindex of 'a': so that we can get the content between these <a></a>
      const h3Index = linkData[i].indexOf("<h3");
      const h3CloseIndex = linkData[i].indexOf(">", h3Index);
      const h3TagClose = linkData[i].indexOf("</h3>");
      const h3Content = linkData[i].substring(h3CloseIndex + 1, h3TagClose);



      //2. get index of " " then fetch the url in order to display in json format
      const getIndexOfHref = linkData[i].indexOf("href");
      const getIndexOfUrl = linkData[i].indexOf(`"`, getIndexOfHref);
      const getClosingIndexOfUrl = linkData[i].indexOf('"', getIndexOfUrl + 1);
      const getUrl = linkData[i].substring(
        getIndexOfUrl + 1,
        getClosingIndexOfUrl
      );

      //add href and title
      const linkObj = { title: h3Content, href: getUrl };
      links.push(linkObj);
    }

    res.json(links);
  } catch (error) {
    console.error("Error fetching latest stories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
