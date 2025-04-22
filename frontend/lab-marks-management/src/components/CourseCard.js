//components/CourseCard.js
import React from 'react';

const CourseCard = ({ course }) => {
    return (
        <div className="course-card">
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <button>View Details</button>
        </div>
    );
}

export default CourseCard;
