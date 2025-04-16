import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {Course} from "../openu/types.ts";
import CourseEditor from "./CourseEditor.tsx";
import {ListItemText, Grid, useTheme, useMediaQuery} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function createDefaultCourse(): Course {
    return new Course("", "", 1, []);
}

type CoursesEditorProps = {
    courses: Course[];
    setCourses: Dispatch<SetStateAction<Course[]>>;
}

const CoursesEditor = ({courses, setCourses}: CoursesEditorProps) => {
    const [editedCourse, setEditedCourse] = useState<Course>(createDefaultCourse());

    const theme = useTheme();
    const isTiny = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const isWide = useMediaQuery(theme.breakpoints.between("lg", "xl"));

    const setIndexedCourse = useCallback((index: number, newCourse: Course) => {
        setCourses(courses => courses.map((originalCourse, i) =>
            i === index
                ? newCourse
                : originalCourse
        ));
    }, [setCourses])

    const onDeleteClick = useCallback((index: number) => {
        setCourses(
            courses.filter((_, i) => i !== index)
        );
    }, [setCourses]);

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
                            setCourse={course => setIndexedCourse(i, course)}
                            course={course}
                            button={{
                                icon: (<DeleteIcon/>),
                                onClick: () => onDeleteClick(i)
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
                        setCourse={setEditedCourse}
                        course={editedCourse}
                        button={{
                            icon: (<AddIcon/>),
                            onClick: () => {
                                if (courses.map(course => course.id).includes(editedCourse.id)) {
                                    throw Error(`Cannot add another course with the same id: ${editedCourse.id}`);
                                }
                                setCourses([...courses, editedCourse]);
                                setEditedCourse(createDefaultCourse());
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
export default CoursesEditor;