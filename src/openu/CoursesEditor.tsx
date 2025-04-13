import {Dispatch, SetStateAction, useState} from "react";
import {Course} from "./types.ts";
import CourseEditor from "./CourseEditor.tsx";
import {IconButton, ListItem, ListItemText, List} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function createDefaultCourse(): Course {
    return new Course("", "", 1, []);
}

export default function CoursesEditor({courses, setCourses}: {
    courses: Course[],
    setCourses: Dispatch<SetStateAction<Course[]>>
}) {

    const [editedCourses, setEditedCourses] = useState<Course[]>([createDefaultCourse()]);

    return (
        <List sx={{
            height: 500,
            overflowY: "auto",
        }}>
            {
                courses.map((_, i) => (
                    <ListItem
                        key={courses[i].id}
                    >
                        <CourseEditor setCourses={setCourses} courses={courses} courseIndex={i}/>
                        <IconButton onClick={() => {
                            setCourses(
                                prev => prev.filter(course2 => courses[i].id !== course2.id)
                            );
                        }}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                ))
            }
            <ListItem>
                <ListItemText primary="הוסף קורס"/>
            </ListItem>
            <ListItem>
                <CourseEditor setCourses={setEditedCourses} courses={editedCourses} courseIndex={0}/>
                <IconButton
                    onClick={() => {
                        if (courses.map(course => course.id).includes(editedCourses[0].id)) {
                            throw Error(`Cannot add another course with the same id: ${editedCourses[0].id}`);
                        }
                        courses.push(editedCourses[0]);
                        setEditedCourses([createDefaultCourse()]);
                        setCourses(courses);
                    }}
                >
                    <AddIcon/>
                </IconButton>
            </ListItem>
        </List>
    );
}