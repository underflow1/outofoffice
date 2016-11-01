<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\modelRequests;
use App\modelRights;
use App\modelStatus;
use Excel;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class controlRequests extends Controller
{
    public function outgoingrequests()
    {
        $results = modelRequests::where('deleted', 0)
                                ->where('created_user', explode("@",$_SERVER['REMOTE_USER'])[0])
                                ->where('status', 'Новый')
                                ->orderBy('created_at', 'desc')
                                ->get();
        return json_encode(array(
            "success" => true,
            "data" => $results
        ),JSON_UNESCAPED_UNICODE);
    }

    public function incomingrequests()
    {
        $results = modelRequests::where('deleted', 0)
            ->where('approve_user', explode("@",$_SERVER['REMOTE_USER'])[0])
            ->where('status', 'Новый')
            ->orderBy('created_at', 'desc')
            ->get();
        return json_encode(array(
            "success" => true,
            "data" => $results
        ),JSON_UNESCAPED_UNICODE);
    }

    public function oebaccess()
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        try
        {
            $access = modelRights::findOrFail($login)->access;
        }
        catch(ModelNotFoundException $e)
        {
            return response(json_encode(array(
                "success" => false,
            ),JSON_UNESCAPED_UNICODE),401);
        }
        if ($access) {
            return response(json_encode(array(
                "success" => true
            ),JSON_UNESCAPED_UNICODE),200);
        } else {
            return response(json_encode(array(
                "success" => false
            ),JSON_UNESCAPED_UNICODE),401);
        }
    }

    public function preloadrecord($id)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $newRequest = ModelRequests::findOrFail($id);
        if ($newRequest->approve_user == $login) {
            return json_encode(array(
                "success" => true,
                "data" => $newRequest
            ),JSON_UNESCAPED_UNICODE);
        } else {
            return response(json_encode(array(
                "success" => false,
                "data" => ''
            ),JSON_UNESCAPED_UNICODE),401);
        }
    }

    public function archivedrequestsrange($archive_date_begin, $archive_date_end)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $results = modelRequests::where('deleted', 0)
            ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
            ->where('created_user', $login)
            ->whereIn('status', array('Согласовано', 'Отклонено'))
            ->orderBy('absent_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return json_encode(array(
            "success" => true,
            "data" => $results
        ),JSON_UNESCAPED_UNICODE);
    }

    public function allrequestsrange($archive_date_begin, $archive_date_end)
    {
        $succ = $this->oebaccess()->original;
        if ($succ == '{"success":true}') {
            $results = modelRequests::where('deleted', 0)
                ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
                ->orderBy('absent_date', 'desc')
                ->orderBy('id', 'desc')
                ->get();
            return json_encode(array(
                "success" => true,
                "data" => $results
            ),JSON_UNESCAPED_UNICODE);
        } else {
            return json_encode(array(
                "success" => false,
                "data" => ''
            ),JSON_UNESCAPED_UNICODE);
        }
    }

    public function allrequestsrangeexcel($archive_date_begin, $archive_date_end)
    {
        $succ = $this->oebaccess()->original;
        if ($succ == '{"success":true}') {
            $results = modelRequests::where('deleted', 0)
                ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
                ->orderBy('absent_date', 'desc')
                ->orderBy('id', 'desc')
                ->select(
                    'absent_fio as Отсутствующий',
                    'approve_fio as Согласующий',
                    'absent_date as Дата отсутствия',
                    'absent_time_begin as Начало',
                    'absent_time_end as Конец',
                    'absent_reason as Тип',
                    'absent_comment as Комментарий',
                    'status as Статус'
                )
                ->get();

            return Excel::create('Отчет вне офиса', function($excel) use ($results) {
                $excel->setTitle('Выгрузка')
                    ->setCreator(explode("@",$_SERVER['REMOTE_USER'])[0])
                    ->setCompany('')
                    ->setDescription('Выгрузка из базы данных вне офиса');
                $excel->sheet('Лист1', function($sheet) use ($results){
                    $sheet->fromArray($results);
                });
            })->download('xlsx');
        } else {
            return response(json_encode(array(
                "success" => false,
            ),JSON_UNESCAPED_UNICODE),401);
        }
    }

    public function archivedrequestsrangeexcel($archive_date_begin, $archive_date_end)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $results = modelRequests::where('deleted', 0)
            ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
            ->where('created_user', $login)
            ->whereIn('status', array('Согласовано', 'Отклонено'))
            ->orderBy('absent_date', 'desc')
            ->orderBy('id', 'desc')
            ->select(
                'absent_fio as Отсутствующий',
                'approve_fio as Согласующий',
                'absent_date as Дата отсутствия',
                'absent_time_begin as Начало',
                'absent_time_end as Конец',
                'absent_reason as Тип',
                'absent_comment as Комментарий',
                'status as Статус'
                )
            ->get();

        return Excel::create('Отчет вне офиса', function($excel) use ($results) {
            $excel->setTitle('Выгрузка')
                ->setCreator(explode("@",$_SERVER['REMOTE_USER'])[0])
                ->setCompany('')
                ->setDescription('Выгрузка из базы данных вне офиса');
            $excel->sheet('Лист1', function($sheet) use ($results){
                $sheet->fromArray($results);
            });
        })->download('xlsx');
    }

    public function store(Request $request)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        //$data = $request->get('data');
        // получение данных из формы:
        $requestArray = json_decode($request->get('data'), true);
        // заполнение модели данными из формы:
        $newRecord = new modelRequests;
        foreach (array_keys($requestArray) as $key) {
            $newRecord->$key = $requestArray[$key];
        }
        // заполнение модели метаданными:
        $newRecord->created_user = $login;
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(1)->name;
        // проверка на согласование "самому себе":
        if (($newRecord->approve_user == $login) && ($newRecord->absent_user == $login)){
            // и согласование в таком случае:
            $newRecord->updated_user = $login;
            $newRecord->status = $newStatus::findOrFail(2)->name;
            $state = 'created & approved';
        } else {
            $state = 'created';
        }
        // запись модели в БД
        $newRecord->save();
        switch ($state){
            case 'created & approved':
                // отправка уведомления о том что заявка согласована:
                $emailsendedcount = $this->sendEmailData($this->prepareEmailData([$newRecord->id]), 'approved');
                break;
            case 'created':
                // отправка уведомления о том, что заявку неоходимо согласовать:
                $emailsendedcount = $this->sendEmailData($this->prepareEmailData([$newRecord->id]), 'forapprove');
                break;
        }
        return response(json_encode(array(
            "success" => true,
            "state" => $state,
            "created_id" => $newRecord->id,
            "emailsendedcount" => $emailsendedcount
        ), JSON_UNESCAPED_UNICODE), 200);
    }

    public function softdelete(Request $request)
    {
        $failed = [];
        $deleted = [];
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $requestArray = json_decode($request->get('data'), true);

        foreach (array_keys($requestArray) as $key) {
            $newRecord = modelRequests::find($requestArray[$key]);
            if (($newRecord->status == 'Новый') && ($newRecord->absent_user == $login)){
                $newRecord->updated_user = $login;
                $newRecord->deleted = 1;
                $newRecord->save();
                array_push($deleted, $requestArray[$key]);
            } else {
                array_push($failed, $requestArray[$key]);
            }
        };
        return response(json_encode(array(
            "success" => true,
            "deleted" => $deleted,
            "failed" => $failed
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function approverequests(Request $request)
    {
        $failed = [];
        $approved = [];
        $emailsendedcount = 0;
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $requestArray = json_decode($request->get('data'), true);

        foreach (array_keys($requestArray) as $key) {
            $newRecord = modelRequests::find($requestArray[$key]);
            if (($newRecord->status == 'Новый') && ($newRecord->approve_user == $login) && ($newRecord->deleted == 0)) {
                $newRecord->updated_user = $login;
                $newStatus = new ModelStatus;
                $newRecord->status = $newStatus::findOrFail(2)->name;
                $newRecord->save();
                array_push($approved, $requestArray[$key]);
            } else {
                array_push($failed, $requestArray[$key]);
            }
        };
        if (count($approved) > 0) {
            $emailsendedcount = $this->sendEmailData($this->prepareEmailData($approved), 'approved');
        }
        return response(json_encode(array(
            "success" => true,
            "approved" => $approved,
            "failed" => $failed,
            "emailsendedcount" => $emailsendedcount
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function declinerequests(Request $request)
    {
        $failed = [];
        $declined = [];
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $requestArray = json_decode($request->get('data'), true);

        foreach (array_keys($requestArray) as $key) {
            $newRecord = modelRequests::find($requestArray[$key]);
            if (($newRecord->status == 'Новый') && ($newRecord->approve_user == $login) && ($newRecord->deleted == 0)) {
                $newRecord->updated_user = $login;
                $newStatus = new ModelStatus;
                $newRecord->status = $newStatus::findOrFail(3)->name;
                $newRecord->save();
                array_push($declined, $requestArray[$key]);
            } else {
                array_push($failed, $requestArray[$key]);
            }
        };

        if (count($declined) > 0) {
            $emailsendedcount = $this->sendEmailData($this->prepareEmailData($declined), 'declined');
        }

        return response(json_encode(array(
            "success" => true,
            "declined" => $declined,
            "failed" => $failed,
            "emailsendedcount" => $emailsendedcount
        ),JSON_UNESCAPED_UNICODE), 200);
    }

}
