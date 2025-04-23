import {Course, YearPart} from "../openu/types.ts";
import {ActionDispatch, ChangeEvent, memo, ReactNode, useCallback} from "react";
import {
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup, Grid, IconButton,
    TextField,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import {CourseAction} from "../openu/courses-state.ts";

type CourseEditorProps = {
    course: Course,
    dispatchCourses: ActionDispatch<[CourseAction]>,
    size: number,
    button?: {
        onClick: (id: string) => void,
        icon: ReactNode
    }
}

const CourseEditor = memo(
    ({size, course, dispatchCourses, button}: CourseEditorProps) => {
        const theme = useTheme();
        const isVeryWide = useMediaQuery(theme.breakpoints.up("xl"));

        const buttonOnClick = useCallback(
            () => {
                button?.onClick(course.id);
            },
            [button, course]
        );

        function semesterCheckboxChecked(semester: YearPart) {
            return (event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.checked && !course.availableInSemesters.includes(semester)) {
                    const newAvailableInSemesters = [...course.availableInSemesters, semester];
                    dispatchCourses({
                        type: "UpdateCourse",
                        course: new Course(
                            course.id,
                            course.courseId,
                            course.name,
                            course.difficulty,
                            newAvailableInSemesters,
                            [...course.dependencies],
                        )
                    });
                } else if (!event.target.checked) {
                    const newAvailableInSemesters = course.availableInSemesters.filter(sem => sem !== semester);
                    dispatchCourses({
                        type: "UpdateCourse",
                        course: new Course(
                            course.id,
                            course.courseId,
                            course.name,
                            course.difficulty,
                            newAvailableInSemesters,
                            [...course.dependencies],
                        )
                    });
                }
            }
        }

        return (
            <Grid size={size}>
                <Card
                    sx={{
                        padding: "1rem",
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        direction={isVeryWide ? "row" : "column"}
                        alignItems={isVeryWide ? "center" : "flex-start"}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            label="מספר הקורס"
                            value={course.courseId}
                            fullWidth={!isVeryWide}
                            onChange={event => {
                                dispatchCourses({
                                    type: "UpdateCourse",
                                    course: new Course(
                                        course.id,
                                        event.target.value,
                                        course.name,
                                        course.difficulty,
                                        [...course.availableInSemesters],
                                        [...course.dependencies],
                                    )
                                });
                            }}
                        />

                        <TextField
                            size="small"
                            variant="outlined"
                            label="שם הקורס"
                            value={course.name}
                            fullWidth={!isVeryWide}
                            onChange={event => {
                                dispatchCourses({
                                    type: "UpdateCourse",
                                    course: new Course(
                                        course.id,
                                        course.courseId,
                                        event.target.value,
                                        course.difficulty,
                                        [...course.availableInSemesters],
                                        [...course.dependencies],
                                    )
                                });
                            }}
                        />

                        <Grid
                            container
                            direction={isVeryWide ? "row" : "column"}
                            alignItems={isVeryWide ? "center" : "flex-start"}
                            width="100%"
                        >
                            <Typography component="legend">קושי</Typography>
                            <Grid
                                alignSelf={isVeryWide ? "flex-start" : "center"}
                            >

                            </Grid>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            alignItems={isVeryWide ? "center" : "flex-start"}
                        >
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                size={isVeryWide ? 4 : 12}
                            >
                                <Typography component="legend">מוצע בסמסטר</Typography>
                            </Grid>
                            <Grid size={isVeryWide ? 7 : 10}>
                                <FormGroup>
                                    <Grid
                                        container
                                        direction="row"
                                    >
                                        <Grid>
                                            {
                                                Array.from("אבג").map(l => (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                // size="small"
                                                                onChange={semesterCheckboxChecked(l as YearPart)}
                                                                checked={course.availableInSemesters.includes(l as YearPart)}/>
                                                        }
                                                        label={`${l}`}
                                                        key={l}
                                                    />
                                                ))
                                            }
                                        </Grid>
                                    </Grid>
                                </FormGroup>
                            </Grid>
                            <Grid size={1} justifySelf="flex-end">
                                {
                                    (button !== undefined)
                                        ? (
                                            <IconButton
                                                sx={{
                                                    alignSelf: "flex-end"
                                                }}
                                                onClick={buttonOnClick}
                                            >
                                                {button.icon}
                                            </IconButton>
                                        )
                                        : (
                                            <></>
                                        )
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        );
    }
);

export default CourseEditor;