/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/***************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp() {
    addClickHandlersToElements();
    handleFormCheck();
    handlePopover();
    readStudentDatabase();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements() {
    $('.add').click(handleAddClicked);
    $('.cancel').click(handleCancelClick);
    $('.data').click(readStudentDatabase);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return:
       none
 */
function handleAddClicked() {
    addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
    clearAddStudentFormInputs();
}

/***************************************************************************************************
 * handlePopover - Event handler that when the mouse leaves the form element it hides the popover
 * @param: {undefined} none
 * @returns: {undefined} none
 */
function handlePopover() {
    $(".student-add-form").mouseleave(() => $(".student-icon, .course-icon, .grade-icon").popover("hide"));
}

/***************************************************************************************************
 * handleFormInputs - Event Handler that checks to see if the user input is valid before allowing the student to be added.
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: handleFormEntry
 */
function handleFormCheck() {
    $("#studentName, #course, #studentGrade").keyup(handleFormEntry);
}

/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
    var isValid = true;
    var studentName = $('#studentName').val();
    var studentCourse = $('#course').val();
    var studentGrade = $('#studentGrade').val();
    var studentObject = {};

    if (studentName.length < 2 || studentName === "") {
        $(".student-name").addClass("has-error");
        $(".student-icon").popover("show");
        isValid = false;
    } else {
        $(".student-name").removeClass("has-error");
        $(".student-name").addClass("has-success");
        $(".student-icon").popover("hide");
        studentObject.name = studentName;
    }

    if (studentCourse.length < 2 || studentCourse === "") {
        $(".student-course").addClass("has-error");
        $(".course-icon").popover("show");
        isValid = false;
    } else {
        $(".student-course").removeClass("has-error");
        $(".student-course").addClass("has-success");
        $(".course-icon").popover("hide");
        studentObject.course = studentCourse;
    }

    if (isNaN(studentGrade) || studentGrade === "" || studentGrade < 0 || studentGrade > 100) {
        $(".student-grade").addClass("has-error");
        $(".grade-icon").popover("show");
        isValid = false;
    } else {
        $(".student-grade").removeClass("has-error");
        $(".student-grade").addClass("has-success");
        $(".grade-icon").popover("hide");
        studentObject.grade = studentGrade;
    }

    if (isValid) {
        $(".add").attr("disabled", true);
        addWaitingIcon($(".add"));
        $('.noStudentData').remove();
        addStudentToServer(studentObject);
        clearAddStudentFormInputs();
    }
}

/***************************************************************************************************
 * deleteStudentSuccess - Function that checks to see if delete Ajax call function is successful.
 * @param: {element, data} object
 * @returns: {undefined} none
 */
function deleteStudentSuccess(element, data) {
    if (data.success === true) {
        element.remove();
        $("#confirm-delete").attr("disabled", false);
        setTimeout(() => {
            removeWaitingIcon($("#confirm-delete"));
        }, 250);
        ;
        renderGradeAverage(calculateGradeAverage(student_array));
    } else {
        $(".error-message").text(data.error[0]);
        $("#error-modal").modal("show");
    }
}

/***************************************************************************************************
 * enableDeleteModal - Function that will invoke the delete student confirmation modal.
 * @param: {student} object
 * @returns: {undefined} none
 */
function enableDeleteModal(student) {
    $("#delete-modal").modal("show");
    $(".modal-student-name")
        .empty()
        .text("Name: " + student.name);
    $(".modal-student-course")
        .empty()
        .text("Course: " + student.course);
    $(".modal-student-grade")
        .empty()
        .text("Grade: " + student.grade);
}

/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
    $(".student-grade, .student-name, .student-course").removeClass("has-success has-error");
    $(".student-icon, .course-icon, .grade-icon").popover("hide");
}

/***************************************************************************************************
 * handleFormEntry - Check the each individual input value to see if it is accurate, and if not doesn't allow user to continue
 * @param: {undefined} none
 * @returns: {undefined} none
 */
function handleFormEntry(event) {
    if (($(event.target).attr('id') === 'studentName') && $("#studentName").val().length < 2) {
        $(".student-name").addClass("has-error");
        $(".student-icon").popover("show");
    } else if (($(event.target).attr('id') === 'studentName') && $("#studentName").val().length >= 2) {
        $(".student-name").removeClass("has-error");
        $(".student-name").addClass("has-success");
        $(".student-icon").popover("hide");
    }
    if (($(event.target).attr('id') === 'course') && $("#course").val().length < 2) {
        $(".student-course").addClass("has-error");
        $(".course-icon").popover("show");
    } else if (($(event.target).attr('id') === 'course') && $("#course").val().length >= 2) {
        $(".student-course").removeClass("has-error");
        $(".student-course").addClass("has-success");
        $(".course-icon").popover("hide");
    }
    if (($(event.target).attr('id') === 'studentGrade') && ($("#studentGrade").val() === "" || $("#studentGrade").val() > 100 || isNaN($("#studentGrade").val()))) {
        $(".student-grade").addClass("has-error");
        $(".grade-icon").popover("show");
    } else if (($(event.target).attr('id') === 'studentGrade') && $("#studentGrade").val() !== "" && $("#studentGrade").val() <= 100 && ($("#studentGrade").val() >= 0)) {
        $(".student-grade").removeClass("has-error");
        $(".student-grade").addClass("has-success");
        $(".grade-icon").popover("hide");
    }
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array) {
    $('tbody').empty();
    for (let studentIndex = 0; studentIndex < array.length; studentIndex++) {
        (function (studentIndex) {
            let studentArray = array[studentIndex];
            let tableRow = $('<tr>').attr("id", studentArray.id);;
            let studentName = $('<td>').text(studentArray.name);
            let studentCourse = $('<td>').text(studentArray.course);
            let studentGrade = $('<td>').text(studentArray.grade);
            let deleteTd = $('<td>');
            let deleteButton = $('<button>', {
                'class': 'deleteButton btn btn-danger btn-sm',
                'id': 'delete',
                'text': 'Delete',
                'type': 'button',
                on: {
                    click: (function (studentRow) {
                        return function () {
                            deleteStudent(studentRow);
                        };
                    })(tableRow)
                }
            });
            function deleteStudent(row) {
                enableDeleteModal(studentArray);
                $("#confirm-delete").on("click", function () {
                    student_array.splice(studentArray, 1);
                    deleteStudentFromDB(studentArray, row);
                    addWaitingIcon("#confirm-delete");
                    renderGradeAverage(calculateGradeAverage(studentArray));
                    setTimeout(() => {
                        $("#delete-modal").modal("hide");
                    }, 500);
                });
            }
            deleteTd.append(deleteButton);
            tableRow.append(studentName, studentCourse, studentGrade, deleteTd);
            tableRow.appendTo('.student-list');
            renderGradeAverage(calculateGradeAverage(student_array));
        })(studentIndex);
    }
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array) {
    var gradeAverage;
    var number = 0;
    for (var i = 0; i < array.length; i++) {
        if (array.length === 0) {
            gradeAverage = 0;
        } else {
            number += parseFloat(array[i].grade);
        }
    }
    if (array.length > 0) {
        gradeAverage = (number / array.length).toFixed(2);
    } else {
        gradeAverage = 0;
    }
    return gradeAverage;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(number) {
    $('.avgGrade').text(number);
}

/***************************************************************************************************
 * addStudentToServer - send post request to database to add student
 * @param: {data} {api_key, action, name, course, grade}
 * @returns {undefined} none
 */
function addStudentToServer(studentObject) {
    $('tbody').empty();
    $.ajax({
        dataType: 'json',
        method: 'post',
        url: 'phpBackend/access.php',
        data: {
            action: 'create',
            name: studentObject.name,
            course: studentObject.course,
            grade: studentObject.grade
        },
        success: function (data) {
            console.log('data: ', data);
            if (data.success) {
                studentObject.id = data.id;
                student_array.push(studentObject);
                updateStudentList(student_array);
                $(".add").attr("disabled", false);
                removeWaitingIcon($(".add"));
            }
        },
        error: function (data) {
            console.log('full error: ', data.responseText);
            console.log('error: ', data.statusText);
        }
    });
}

/***************************************************************************************************
 * readStudentDatabase - ajax request to get all students in database
 * @param: {data} {api_key, action}
 * @returns {data} list of all students from database
 */
function readStudentDatabase() {
    $('tbody').empty();
    $(".data").attr("disabled", true);
    $.ajax({
        dataType: 'json',
        data: {
            'action': 'read'
        },
        method: 'post',
        url: 'phpBackend/access.php',
        success: function (data) {
            student_array.length = 0;
            for (let i = 0; i < data.data.length; i++) {
                let dataObj = {
                    name: data.data[i].name,
                    course: data.data[i].course,
                    grade: data.data[i].grade,
                    id: data.data[i].id,
                };
                student_array.push(dataObj);
            }
            updateStudentList(student_array);
            $(".data").attr("disabled", false);
        },
        error: function (error) {
            console.log('error: ', error.statusText);
        }
    });
}

/***************************************************************************************************
 * deleteStudentFromDB - Removes student from DB and the List
 * @param: {student, element} object
 * @returns: {undefined} none
 */
function deleteStudentFromDB(student, data) {
    $.ajax({
        dataType: "json",
        data: {
            'action': 'delete',
            student_id: student.id
        },
        method: "post",
        url: 'phpBackend/access.php',
        success: deleteStudentSuccess.bind(null, data),
        error: function (error) {
            console.log('error: ', error.statusText);
        }
    });
}

/***************************************************************************************************
 * addWaitingIcon - displays a loading icon on the cursor while waiting for data to load.
 * @param: {button} jquery identifier that determines which button
 * @returns {undefined} none
 */
function addWaitingIcon(button) {
    $(button)
        .children("span")
        .addClass("glyphicon glyphicon-refresh spinAnimation");
}

/***************************************************************************************************
 * removeWaitingIcon - remove the loading icon on the cursor after the data has loaded.
 * @param: {button} jquery identifier that determines which button
 * @returns {undefined} none
 */
function removeWaitingIcon(button) {
    $(button)
        .children("span")
        .removeClass("glyphicon glyphicon-refresh spinAnimation");
}






