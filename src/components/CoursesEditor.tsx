import {unstable_useEnhancedEffect as useEnhancedEffect} from '@mui/utils';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridRowModes,
    GridRowModesModel,
    GridRowParams, GridSlotProps, Toolbar,
    ToolbarButton,
    useGridApiContext
} from "@mui/x-data-grid";
import {Course, YearPart} from "../openu/types.ts";
import {CourseAction, createDefaultCourse} from "../openu/courses-state.ts";
import {ActionDispatch, useCallback, useMemo, useRef, useState} from "react";
import {Box, Checkbox, FormControlLabel, Rating, styled, Tooltip} from "@mui/material";
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

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        dispatchCourses: ActionDispatch<[CourseAction]>;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel
        ) => void;
    }
}

function EditToolbar({dispatchCourses, setRowModesModel}: GridSlotProps['toolbar']) {
    const handleClick = () => {
        const newCourse = createDefaultCourse();
        dispatchCourses({
            type: "AddCourse",
            course: newCourse,
        });
        setRowModesModel(model => ({
            ...model,
            [newCourse.id]: {mode: GridRowModes.Edit, fieldToFocus: "name"}
        }));
    };

    return (
        <Toolbar>
            <Tooltip title="הוסף קורס">
                <ToolbarButton onClick={handleClick}>
                    <AddIcon />
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    );
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

    const coursesColumns: GridColDef[] = useMemo(
        () => [
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
                field: "actions",
                type: "actions",
                getActions(params: GridRowParams) {
                    return [
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="מחק"
                            onClick={() => deleteCourse(params.row.id)}
                        />
                    ];
                }
            }
        ], [deleteCourse]
    );

    return (
        <DataGrid
            rows={courses}
            columns={coursesColumns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            slots={{ toolbar: EditToolbar }}
            slotProps={{toolbar: {dispatchCourses, setRowModesModel }}}
            showToolbar
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