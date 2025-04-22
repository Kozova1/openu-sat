import {unstable_useEnhancedEffect as useEnhancedEffect} from '@mui/utils';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridRowModes,
    GridRowModesModel,
    GridRowParams,
    useGridApiContext
} from "@mui/x-data-grid";
import {Course, YearPart} from "../openu/types.ts";
import {CourseAction, createDefaultCourse} from "../openu/courses-state.ts";
import {ActionDispatch, useCallback, useMemo, useRef, useState} from "react";
import {
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    IconButton,
    Rating,
    styled,
    TextField,
    Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";


const DifficultyRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

type CoursesEditorProps = {
    courses: Course[];
    dispatchCourses: ActionDispatch<[CourseAction]>;
}

function renderCourseDifficulty({value}: GridRenderCellParams<Course, number>) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', pr: 2}}>
            <DifficultyRating
                max={10}
                value={value}
                readOnly
            />
        </Box>
    );
}

function CourseDifficultyEdit(props: GridRenderCellParams<Course, number>) {
    const {id, value, field, hasFocus} = props;
    const apiRef = useGridApiContext();
    const ref = useRef<HTMLElement>(null);

    const handleChange = (_: unknown, newValue: number | null) => {
        apiRef.current.setEditCellValue({id, field, value: newValue ?? value});
    };

    useEnhancedEffect(() => {
        if (hasFocus && ref.current) {
            const input = ref.current.querySelector<HTMLInputElement>(
                `input[value="${value}"]`,
            );
            input?.focus();
        }
    }, [hasFocus, value]);

    return (
        <Box sx={{display: 'flex', alignItems: 'center', pr: 2}}>
            <DifficultyRating
                ref={ref}
                name="rating"
                max={10}
                value={value}
                onChange={handleChange}
            />
        </Box>
    );
}

const renderCourseDifficultyEditInputCell: GridColDef['renderCell'] = (params) => {
    return (
        <CourseDifficultyEdit {...params} />
    );
}

function renderSemesters({value}: GridRenderCellParams<Course, string[]>) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', pr: 2}}>
            {
                Array.from("אבג").map(l => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={value?.includes(l as YearPart) ?? false}
                            />
                        }
                        label={`${l}`}
                        key={l}
                    />
                ))
            }
        </Box>
    )
}

function EditSemesters(props: GridRenderCellParams<Course, string[]>) {
    const {id, value, field} = props;
    const apiRef = useGridApiContext();

    return (
        <Box sx={{display: 'flex', alignItems: 'center', pr: 2}}>
            {
                Array.from("אבג").map(l => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={value?.includes(l as YearPart) ?? false}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        apiRef.current.setEditCellValue({id, field, value: [...(value ?? []), l]})
                                    } else {
                                        apiRef.current.setEditCellValue({
                                            id,
                                            field,
                                            value: value?.filter(sem => sem != l)
                                        });
                                    }
                                }}
                            />
                        }
                        label={`${l}`}
                        key={l}
                    />
                ))
            }
        </Box>
    )
}


const DependenciesAutocomplete = styled(Autocomplete<Course, true>)({
    "& .MuiAutocomplete-inputRoot:not(.Mui-expanded)": {
        flexWrap: "nowrap",
    },
    paddingTop: "0.2rem"
})

function CourseDependencyEditor(params: GridRenderCellParams<Course, string[]>) {
    const course = params.row;
    const {id, field} = params;
    const apiRef = useGridApiContext();
    const courses: Course[] = apiRef.current.getAllRowIds().map(apiRef.current.getRow);

    function doesRecursivelyRequire(maybeRequires: Course): boolean {
        let toCheckQueue = [maybeRequires];

        while (toCheckQueue.length > 0) {
            const dependencies = toCheckQueue.flatMap(
                course => course.dependencies.map(
                    depId => courses.find(c => c.id === depId)!
                )
            );

            for (const toCheck of toCheckQueue) {
                if (toCheck.id === course.id) {
                    return true;
                }
            }

            toCheckQueue = dependencies;
        }

        return false;
    }

    return (
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", paddingY: 2, width: "100%"}}>
            <DependenciesAutocomplete
                multiple
                disableCloseOnSelect
                fullWidth
                limitTags={1}
                getOptionLabel={option => option!.toString()}
                options={courses.filter(currentCourse => !doesRecursivelyRequire(currentCourse))}
                value={
                    course.dependencies
                        .map(depId => courses.find(c => c.id === depId))
                        .filter(course => course !== undefined)
                }
                renderInput={(params) => (
                    <TextField {...params} label="דרישות" />
                )}
                renderOption={(props, option, {selected}) => {
                    const {key, ...optionProps} = props;
                    return (
                        <li key={key} {...optionProps}>
                            <Checkbox
                                checked={selected}
                            />
                            {option!.toString()}
                        </li>
                    );
                }}
                sx={{ flexWrap: "nowrap", overflowX: "hidden" }}
                onChange={(_, dependencies: Course[]) => {
                    apiRef.current.setEditCellValue({
                        id, field, value: dependencies
                    })
                }}
            />
        </Box>
    )
}

export function CoursesEditor({courses, dispatchCourses}: CoursesEditorProps) {
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const deleteCourse = useCallback(
        (id: string) => {
            dispatchCourses({
                type: "DeleteCourse",
                id: id
            })
        },
        [dispatchCourses]
    );

    const addCourse = useCallback(
        () => {
        const newCourse = createDefaultCourse();
        dispatchCourses({
            type: "AddCourse",
            course: newCourse,
        });
        setRowModesModel(model => ({
            ...model,
            [newCourse.id]: {mode: GridRowModes.Edit, fieldToFocus: "name"}
        }));
    },
        [dispatchCourses]
    );

    const coursesColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "isActive",
                headerName: "הקורס נלמד",
                type: "boolean",
                display: "flex",
                editable: true,
            },
            {
                field: "courseId",
                headerName: "מספר הקורס",
                editable: true,
                display: "flex",
            },
            {
                field: "name",
                headerName: "שם הקורס",
                editable: true,
                display: "flex",
            },
            {
                field: "difficulty",
                headerName: "קושי",
                renderCell: renderCourseDifficulty,
                renderEditCell: renderCourseDifficultyEditInputCell,
                editable: true,
                display: "flex",
            },
            {
                field: "availableInSemesters",
                headerName: "מוצע בסמסטרים",
                editable: true,
                type: "custom",
                display: "flex",
                renderCell: renderSemesters,
                renderEditCell: EditSemesters
            },
            {
                field: "dependencies",
                headerName: "דרישות קודמות",
                type: "custom",
                editable: true,
                display: "flex",
                renderCell: CourseDependencyEditor,
                renderEditCell: CourseDependencyEditor
            },
            {
                field: "actions",
                type: "actions",
                renderHeader: () => (
                    <Tooltip title="הוסף קורס">
                        <IconButton onClick={addCourse}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                ),
                getActions(params: GridRowParams) {
                    return [
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="מחק קורס"
                            onClick={() => deleteCourse(params.row.id)}
                        />
                    ];
                }
            },
        ], [deleteCourse, addCourse]
    );

    return (
        <DataGrid
            rows={courses}
            columns={coursesColumns}
            getRowHeight={() => "auto"}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            processRowUpdate={(newRow: Course) => {
                dispatchCourses({
                    type: "UpdateCourse",
                    course: new Course(
                        newRow.id,
                        newRow.courseId,
                        newRow.name,
                        newRow.difficulty,
                        newRow.availableInSemesters,
                        newRow.dependencies
                    ),
                });
                return newRow;
            }}
            autosizeOnMount
        />
    )
}