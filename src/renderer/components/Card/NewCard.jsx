/* eslint-disable no-unused-vars */
import React from 'react';
import './NewsCard.scss';
import { parseToDirectusLink } from 'renderer/utils/tools';
import { NavLink } from 'react-router-dom';
const NewCard = ({ title, description, preview, id }) => {
  return (
    <NavLink to={'/show-news/' + id}>
      <div className="news-card">
        <img src={parseToDirectusLink(preview)} />
        <h2>{title}</h2>
      </div>
    </NavLink>
  );
};

export default NewCard;
