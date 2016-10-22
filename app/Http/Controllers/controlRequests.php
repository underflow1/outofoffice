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

    public function archivedrequests()
    {
        $results = modelRequests::where('deleted', 0)
            ->where('created_user', explode("@",$_SERVER['REMOTE_USER'])[0])
            ->where('status', 'Согласовано')
            ->orwhere('status', 'Отклонено')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return json_encode(
            $results
        ,JSON_UNESCAPED_UNICODE);
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
        $data = $request->get('data');
        $hash = json_decode($data, true);
        $newRecord = new modelRequests;
        foreach (array_keys($hash) as $key) {
            $newRecord->$key = $hash[$key];
        }
        $newRecord->created_user = explode("@",$_SERVER['REMOTE_USER'])[0];
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(1)->name;

        $newRecord->save();
        return response(json_encode(array(
            "success" => true,
            "data" => $newRecord->absent_time_begin  ,
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function softdelete(Request $request)
    {
        $string = '';
        $data = $request->get('data');
        $hash = json_decode($data, true);

        foreach (array_keys($hash) as $key) {
            $newRecord = modelRequests::find($hash[$key]);
            $newRecord->deleted = 1;
            $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
            $newRecord->save();
            $string.= $key . '->' . $hash[$key] . '     ';
        };

        return response(json_encode(array(
            "success" => true,
            "data" => $string,
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function approverequests(Request $request)
    {
        $string = '';
        $data = $request->get('data');
        $hash = json_decode($data, true);

        foreach (array_keys($hash) as $key) {
            $newRecord = modelRequests::find($hash[$key]);
            $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
            $newStatus = new ModelStatus;
            $newRecord->status = $newStatus::findOrFail(2)->name;
            $newRecord->save();
            $string.= $key . '->' . $hash[$key] . '     ';
        };

        return response(json_encode(array(
            "success" => true,
            "data" => $string,
        ),JSON_UNESCAPED_UNICODE), 200);
    }

    public function approverequest($id)
    {
        $newRecord = modelRequests::find($id);
        $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(2)->name;
        $newRecord->save();

    }

    public function declinerequest($id)
    {
        $newRecord = modelRequests::find($id);
        $newRecord->updated_user = explode("@",$_SERVER['REMOTE_USER'])[0];
        $newStatus = new ModelStatus;
        $newRecord->status = $newStatus::findOrFail(3)->name;
        $newRecord->save();

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
