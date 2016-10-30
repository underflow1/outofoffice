<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\modelRequests;
use App\modelStatus;
use Excel;

class controlRequests extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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

    public function testaaa($id)
    {
        $results = modelRequests::find($id);

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

    public function archivedrequestsrange($archive_date_begin, $archive_date_end)
    {
        $results = modelRequests::where('deleted', 0)
            ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
            ->where('created_user', explode("@",$_SERVER['REMOTE_USER'])[0])
            ->whereIn('status', array('Согласовано', 'Отклонено'))
            ->orderBy('absent_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        return json_encode(
            $results
            ,JSON_UNESCAPED_UNICODE);
    }

    public function archivedrequestsrangeexcel($archive_date_begin, $archive_date_end)
    {
        $results = modelRequests::where('deleted', 0)
            ->whereBetween('absent_date', array($archive_date_begin, $archive_date_end))
            ->where('created_user', explode("@",$_SERVER['REMOTE_USER'])[0])
            ->whereIn('status', array('Согласовано', 'Отклонено'))
            ->orderBy('absent_date', 'desc')
            ->orderBy('id', 'desc')
            ->select(
                'created_at as Создано',
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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $data = $request->get('data');
        $requestArray = json_decode($data, true);
        $newRecord = new modelRequests;
        foreach (array_keys($requestArray) as $key) {
            $newRecord->$key = $requestArray[$key];
        }
        $newRecord->created_user = $login;
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(1)->name;

        $newRecord->save();
        //$state = '';
        //$emailsendedcount = '';
        $count = 0;

        if (($newRecord->absent_user == $login) && ($newRecord->absent_user == $newRecord->approve_user)) {
            $count = $this->approve([$newRecord->id], $login);
            $state = 'created & approved';
            $emailsendedcount = $this->sendEmailData($this->prepareEmailData([$newRecord->id]), 'approved');
        } else {
            $state = 'created';
            $emailsendedcount = $this->sendEmailData($this->prepareEmailData([$newRecord->id]), 'forapprove');
        }

        return response(json_encode(array(
            "success" => true,
            "state" => $state,
            "created_id" => $newRecord->id,
            "approvedcount" => $count,
            "emailsendedcount" => $emailsendedcount
        ), JSON_UNESCAPED_UNICODE), 200);
    }

    public function softdelete(Request $request)
    {
        $string = '';
        $data = $request->get('data');
        $requestArray = json_decode($data, true);

        foreach (array_keys($requestArray) as $key) {
            $newRecord = modelRequests::find($requestArray[$key]);
            $newRecord->deleted = 1;
            $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
            $newRecord->save();
            $string.= $key . '->' . $requestArray[$key] . '     ';
        };

        return response(json_encode(array(
            "success" => true,
            "data" => $string,
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function approverequests(Request $request)
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $data = $request->get('data');
        $requestArray = json_decode($data, true);
        $count = $this->approve($requestArray, $login);
        $emailsendedcount = 0;
        if ($count > 0) {
            $success = true;
            $emailsendedcount = $this->sendEmailData($this->prepareEmailData($requestArray), 'approved');
        } else {
            $success = false;
        }
        return response(json_encode(array(
            "success" => $success,
            "approvedcount" => $count,
            "emailsendedcount" => $emailsendedcount
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function approve($requestArray, $login)
    {
        $count = 0;
        foreach (array_keys($requestArray) as $key) {
            $newRecord = modelRequests::find($requestArray[$key]);
            if ($newRecord->approve_user == $login) {
                $newRecord->updated_user = $login;
                $newStatus = new ModelStatus;
                $newRecord->status = $newStatus::findOrFail(2)->name;
                $newRecord->save();
                $count++;
            };
        };
        return $count;
    }

    public function declinerequest($id)
    {
        $newRecord = modelRequests::find($id);
        $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(3)->name;
        $newRecord->save();
        $emailsendedcount = $this->sendEmailData($this->prepareEmailData([$id]), 'declined');

        return response(json_encode(array(
            "success" => true,
            "declinedrequest" => $newRecord->id,
            "emailsendedcount" => $emailsendedcount,
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
