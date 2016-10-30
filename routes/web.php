<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::GET('currentuser', 'Controller@getCurrentUser');
Route::GET('adusers', 'Controller@getADUsers');


Route::POST('addnewrequest', 'controlRequests@store');
Route::POST('deleterequest', 'controlRequests@softdelete');
Route::POST('approverequests', 'controlRequests@approverequests');
Route::POST('testbbb', 'controlRequests@getPreparedEmailData');

Route::POST('declinerequest/{id}', 'controlRequests@declinerequest');

Route::GET('testaaa/{id}', 'controlRequests@testaaa');
Route::GET('testccc/{id}', ['middleware' => 'checkRights', function ($id){
    return $id;
}]);


Route::GET('outgoingrequests', 'controlRequests@outgoingrequests');
Route::GET('incomingrequests', 'controlRequests@incomingrequests');
Route::GET('archivedrequestsrange/{archive_date_begin}/{archive_date_end}', 'controlRequests@archivedrequestsrange');
Route::GET('archivedrequestsrangeexcel/{archive_date_begin}/{archive_date_end}', 'controlRequests@archivedrequestsrangeexcel');
