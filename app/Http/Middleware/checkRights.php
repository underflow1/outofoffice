<?php
/**
 * Created by PhpStorm.
 * User: underflow
 * Date: 23.10.2016
 * Time: 21:31
 */

namespace App\Http\Middleware;


class checkRights
{
    public function handle($request, Closure $next) {
        $principal = explode("@",$_SERVER['REMOTE_USER']);
        $user_login = $principal[0];
        //$results = modelRequests::find($id);
    }

}