/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input:
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var student_array = [];
var idCounter;

/***************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    $('.add').click(handleAddClicked);
    $('.cancel').click(handleCancelClick);
    $('.student-list').on('click','.deleteButton', handleDeleteClick);
    $('.data').click(handleDataClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return:
       none
 */
function handleAddClicked(){
    addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    var studentName = $('#studentName').val();
    var studentCourse = $('#course').val();
    var studentGrade = $('#studentGrade').val();
    var studentId = idCounter;
    var studentObject = {
        'name': studentName,
        'course': studentCourse,
        'grade': studentGrade,
        'id': studentId
    };
    student_array.push(studentObject);
    clearAddStudentFormInputs();
    updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    var tableRow = $('<tr>');
    var studentName = $('<td>').text(studentObj.name);
    var studentCourse = $('<td>').text(studentObj.course);
    var studentGrade = $('<td>').text(studentObj.grade);
    var deleteTd = $('<td>');
    var deleteButton = $('<button>').addClass('deleteButton btn btn-danger btn-sm').attr('id', idCounter).text('Delete');
    idCounter++;
    deleteTd.append(deleteButton);
    tableRow.append(studentName,studentCourse,studentGrade,deleteTd);
    tableRow.appendTo('.student-list');
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(){
    renderStudentOnDom(student_array[student_array.length-1]);
    var gradeToPush = calculateGradeAverage(student_array);
    renderGradeAverage(gradeToPush);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    var gradeAverage;
    var number = 0;
    for(var i = 0; i < array.length; i++) {
        if(array.length === 0) {
            gradeAverage = 0;
        } else {
            number += parseFloat(array[i].grade);
        }
    }
    if(array.length > 0) {
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
function renderGradeAverage(number){
    $('.avgGrade').text(number);
}

function deleteStudentObject() {
    var buttonClicked = parseInt($(event.target).attr('id'));
    for(var i = 0; i < student_array.length; i++) {
        if(student_array[i].id === buttonClicked) {
            student_array.splice(i,1);
            break;
        }
    }
}

function handleDeleteClick() {
    deleteStudentObject();
    $(this).parentsUntil('tbody').remove();
    var gradeToPush = calculateGradeAverage(student_array);
    renderGradeAverage(gradeToPush);
}

function handleDataClick() {
    let dataFromServer;
    let ajaxConfig = {
        dataType: 'json',
        data: {
            api_key: 'mjzFvliPuy'
        },
        method: 'post',
        url: 'https://s-apis.learningfuze.com/sgt/get',
        success: function(data) {
            dataFromServer = data;
            console.log(dataFromServer);
            for(let i = 0; i < dataFromServer.data.length; i++) {
                let tableRow = $('<tr>');
                let studentName = $('<td>').text(dataFromServer.data[i].name);
                let studentCourse = $('<td>').text(dataFromServer.data[i].course);
                let studentGrade = $('<td>').text(dataFromServer.data[i].grade);
                let deleteTd = $('<td>');
                let deleteButton = $('<button>').addClass('deleteButton btn btn-danger btn-sm').attr('id', dataFromServer.data[i].id).text('Delete');
                deleteTd.append(deleteButton);
                tableRow.append(studentName,studentCourse,studentGrade,deleteTd);
                tableRow.appendTo('.student-list');
                let dataObj = {
                    name: dataFromServer.data[i].name,
                    course: dataFromServer.data[i].course,
                    grade: dataFromServer.data[i].grade,
                    id: dataFromServer.data[i].id
                };
                idCounter = dataFromServer.data[i].id;
                student_array.push(dataObj);
                let gradeToPush = calculateGradeAverage(student_array);
                renderGradeAverage(gradeToPush);
            }
            idCounter++;
        },
        error: function() {
            console.log(false);
        }
    };
    $.ajax(ajaxConfig);
}






