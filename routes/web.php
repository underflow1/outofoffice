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


Route::GET('outgoingrequests', 'controlRequests@outgoingrequests');
Route::GET('incomingrequests', 'controlRequests@incomingrequests');
Route::GET('archivedrequestsrange/{archive_date_begin}/{archive_date_end}', 'controlRequests@archivedrequestsrange');
Route::GET('archivedrequestsrangeexcel/{archive_date_begin}/{archive_date_end}', 'controlRequests@archivedrequestsrangeexcel');
Route::GET('11', function () {

    $email =
        [
            "approve_fio" => "Харламов Алексей Олегович",
            "absent_email" => "akharlamov@teploset.ru",
            "requests" => [
                [
                    "id" => "123",
                    "absent_fio" => 'sdfsadfsdaff',
                    "absent_date" => "21.10.2016",
                    "absent_time_begin" => "09=>00",
                    "absent_time_end" => "12=>00",
                    "absent_reason" => "МК",
                    "absent_comment" => "Мой коммент adjsfh kjash kha ksdjfhkljsadfhарий"
                ],
                [
                    "id" => "123",
                    "absent_fio" => 'sdfsadfsdaff',
                    "absent_date" => "21.10.2016",
                    "absent_time_begin" => "09=>00",
                    "absent_time_end" => "12=>00",
                    "absent_reason" => "МК",
                    "absent_comment" => "Мой комментарий"
                ]
            ]
        ];

    Mail::send('approved', $email, function($message) use ($email)
    {
        $message->from('inout@teploset.ru', 'Вне офиса');
        $message->subject('вне офиса, утверждено');
        $message->to($email["absent_email"]);


    });
});
