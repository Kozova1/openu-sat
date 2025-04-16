import {Dispatch, SetStateAction, useState} from "react";
import {Course} from "../openu/types.ts";
import CourseEditor from "./CourseEditor.tsx";
import {ListItemText, Grid, useTheme, useMediaQuery} from "@mui/material";
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

    const theme = useTheme();
    const isTiny = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const isWide = useMediaQuery(theme.breakpoints.between("lg", "xl"));

    const courseEditorSize = isTiny
        ? 12
        : (isSmall
            ? 6
            : (isMedium
                ? 4
                : (isWide
                    ? 3
                    : 12
                )
            )
        );

    return (
        <Grid container
            direction="row"
            spacing={2}
            sx={{
                height: 600,
                overflowY: "auto",
            }}
              paddingInlineEnd={2}
        >
            {
                courses.map((course, i) => (
                    <Grid
                        size={courseEditorSize}
                        key={i}
                    >
                        <CourseEditor
                            setCourses={setCourses}
                            courses={courses}
                            courseIndex={i}
                            button={{
                                icon: (<DeleteIcon/>),
                                onClick: () => {
                                    setCourses(
                                        prev => prev.filter(course2 => course.id !== course2.id)
                                    );
                                }
                            }}
                        />
                    </Grid>
                ))
            }
            <Grid
                container
                alignItems="flex-start"
                direction="column"
                size={12}
            >
                <ListItemText primary="הוסף קורס"/>
                <Grid
                    size={courseEditorSize}
                >
                    <CourseEditor
                        setCourses={setEditedCourses}
                        courses={editedCourses}
                        courseIndex={0}
                        button={{
                            icon: (<AddIcon/>),
                            onClick: () => {
                                if (courses.map(course => course.id).includes(editedCourses[0].id)) {
                                    throw Error(`Cannot add another course with the same id: ${editedCourses[0].id}`);
                                }
                                courses.push(editedCourses[0]);
                                setEditedCourses([createDefaultCourse()]);
                                setCourses(courses);
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}