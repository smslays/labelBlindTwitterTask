import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  card: {
    margin: theme.spacing(2),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
}));

const TwitterTask = () => {
  const classes = useStyles();
  const [tweets, setTweets] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    axios
      .get("https://www.mocky.io/v2/5d1ef97d310000552febe99d")
      .then((response) => {
        setTweets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleGoToOriginalTweet = (tweet) => {
    window.open(tweet.url);
  };

  const handleLikeTweet = (tweet) => {
    let likedTweets = JSON.parse(localStorage.getItem("likedTweets")) || [];
    likedTweets.push(tweet);
    localStorage.setItem("likedTweets", JSON.stringify(likedTweets));
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredTweets = tweets.filter((tweet) => {
    let date = moment(tweet.publishedDate, "YYYY-MM-DD");
    let startDateFilter = startDate
      ? date.isSameOrAfter(startDate, "day")
      : true;
    let endDateFilter = endDate ? date.isSameOrBefore(endDate, "day") : true;
    return startDateFilter && endDateFilter;
  });
  return (
    <div className={classes.root}>
      <Typography variant="h4">Twitter Timeline</Typography>
      <div>
        <label>Start Date:</label>
        <input type="date" onChange={handleStartDateChange} value={startDate} />
        <label>End Date:</label>
        <input type="date" onChange={handleEndDateChange} value={endDate} />
      </div>
      {filteredTweets.map((tweet) => (
        <Card key={tweet._id} className={classes.card}>
          <CardHeader
            className={classes.header}
            title={tweet.author}
            subheader={moment(tweet.publishedDate, "YYYY-MM-DD").format(
              "MMMM D, YYYY"
            )}
          />
          <CardContent>
            <Typography>{tweet.text}</Typography>
            {tweet.imageUrl && <img src={tweet.imageUrl} alt="Tweet" />}
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleGoToOriginalTweet(tweet)}
            >
              Go to Original Tweet
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => handleLikeTweet(tweet)}
            >
              Like
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default TwitterTask;
