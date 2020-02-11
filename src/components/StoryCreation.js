import React, { Component } from "react";
import axios from "axios";

import StoryCreated from "./StoryCreated";

export default class StoryCreation extends Component {
  state = {
    stories: [],
    statusValue: "",
    storyValue: "",
    descriptionValue: "",
    storyStatus: [
      { name: "Story", value: "story" },
      {
        name: "Not Started",
        value: "notStarted"
      },
      { name: "In Progress", value: "inProgress" },
      { name: "Done", value: "done" }
    ]
  };

  async getData() {
    try {
      const res = await axios.get("http://localhost:3200/");
      this.setState({
        stories: res.data
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getData();
  }
  onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDrop = async (e, cat) => {
    let id = e.dataTransfer.getData("id");
    let stories = this.state.stories.filter(story => {
      if (story.storyValue === id) {
        story.statusValue = cat;
      }
      return story;
    });
    await axios.put("http://localhost:3200/update/" + id, {
      statusValue: cat
    });

    this.setState({ stories });
    this.getData();
  };

  changeStatus = e => {
    this.setState({
      statusValue: e.target.value
    });
  };

  changeStory = e => {
    this.setState({
      storyValue: e.target.value
    });
  };

  changeDescription = e => {
    this.setState({
      descriptionValue: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.statusValue === "" || this.state.storyValue === "") {
      alert("Please choose a status and name your story");
    } else {
      try {
        const res = await axios.post("http://localhost:3200/create", {
          statusValue: this.state.statusValue,
          storyValue: this.state.storyValue,
          descriptionValue: this.state.descriptionValue
        });
        this.setState({
          statusValue: "",
          storyValue: "",
          descriptionValue: ""
        });
        console.log(res.data);
        this.getData();
      } catch (error) {
        console.log(error.response);
      }
    }
    window.location.reload();
  };

  handleDelete = async id => {
    try {
      await axios.post("http://localhost:3200/delete/" + id);
      this.getData();
    } catch (error) {
      console.log(error.response);
    }
  };

  render() {
    const tables = {
      story: [],
      notStarted: [],
      inProgress: [],
      done: []
    };
    return (
      <React.Fragment>
        <form>
          <div className="createStory">
            <label>Status</label>
            <select
              id="storyStatus"
              onChange={this.changeStatus}
              name="status"
              required
            >
              <option value="" key="" defaultValue>
                Choose a status
              </option>
              {this.state.storyStatus.map(st => {
                return (
                  <option value={st.value} key={st.value}>
                    {st.name}
                  </option>
                );
              })}
            </select>

            <label>Story</label>
            <input
              type="text"
              name="story"
              maxLength="30"
              value={this.state.storyValue}
              onChange={this.changeStory}
              required
            />
            <label>Description</label>
            <textarea
              name="description"
              value={this.state.descriptionValue}
              onChange={this.changeDescription}
              required
            />
            <div>
              <button id="submit" type="submit" onClick={this.handleSubmit}>
                Create
              </button>
              <button id="cancel" type="reset">
                Clear
              </button>
            </div>
          </div>
        </form>

        {this.state.stories.forEach(s => {
          tables[s.statusValue].push(
            <StoryCreated
              id={s._id}
              key={s._id}
              status={s.statusValue}
              story={s.storyValue}
              description={s.descriptionValue}
              onClick={() => {
                this.handleDelete(s._id);
              }}
              styling={s.styling}
              dragStart={this.onDragStart}
              draggable
            />
          );
        })}
        <div className="container">
          <div
            className="stories"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, "story")}
          >
            <header>
              {" "}
              <h1>Story</h1>
            </header>
            {tables.story}
          </div>
          <div
            className="notStarted"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, "notStarted")}
          >
            <header>
              {" "}
              <h1>Not Started</h1>
            </header>
            {tables.notStarted}
          </div>
          <div
            className="inProgress"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, "inProgress")}
          >
            <header>
              {" "}
              <h1>In Progress</h1>
            </header>
            {tables.inProgress}
          </div>
          <div
            className="done"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, "done")}
          >
            <header>
              {" "}
              <h1>Done</h1>
            </header>
            {tables.done}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
