<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Modelrequests extends Model
{
    protected $table = 'requests';
    protected $primaryKey = 'id';
    //$outgoingRequests = model_requests::all();
}

