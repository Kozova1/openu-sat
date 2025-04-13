import {Dispatch, SetStateAction, useState} from "react";
import {Course} from "./openu/types.ts";
import CourseEditor from "./openu/CourseEditor.tsx";
import {Stack, Typography, IconButton} from "@mui/material";
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
        <Stack direction="column" spacing={2}>
            <Typography variant="h2">קורסים</Typography>
            <Stack spacing={1}>
            {
                courses.map((_, i) => (
                    <div style={{ display: "flex", flexDirection: "row" }} key={courses[i].id}>
                        <CourseEditor setCourses={setCourses} courses={courses} courseIndex={i} />
                        <IconButton onClick={() => {
                            setCourses(
                                prev => prev.filter(course2 => courses[i].id !== course2.id)
                            );
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))
            }
            </Stack>
            <Typography variant="subtitle1">הוסף קורס</Typography>
            <div style={{
                display: "flex",
                flexDirection: "row",
            }}>
                <CourseEditor setCourses={setEditedCourses} courses={editedCourses} courseIndex={0} />
                <IconButton onClick={() => {
                    if (courses.map(course => course.id).includes(editedCourses[0].id)) {
                        throw Error(`Cannot add another course with the same id: ${editedCourses[0].id}`);
                    }
                    courses.push(editedCourses[0]);
                    setEditedCourses([createDefaultCourse()]);
                    setCourses(courses);
                }
                }>
                    <AddIcon />
                </IconButton>
            </div>
        </Stack>
    )
}