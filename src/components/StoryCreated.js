import React from "react";

export default function StoryCreated(props) {
  return (
    <div
      className="createdStory"
      onDragStart={e => props.dragStart(e, props.id)}
      draggable
    >
      <h1>Story name</h1>
      <h3>{props.story}</h3>
      <h2>Description</h2>
      <p className="desc-content">{props.description}</p>
      <button onClick={props.onClick} className="x">
        X
      </button>
    </div>
  );
}
