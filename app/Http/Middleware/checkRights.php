<?php
/**
 * Created by PhpStorm.
 * User: underflow
 * Date: 23.10.2016
 * Time: 21:31
 */

namespace App\Http\Middleware;


use App\modelRights;
use Closure;

class checkRights
{
    public function handle($request, Closure $next)
    {
        $user_login = explode("@", $_SERVER['REMOTE_USER'])[0];
        $rights = new modelRights;
        //$rights::where('login', $user_login)->access
        $access = 0;
        if (count($access) > 0) {
            if ($access == 1) {
                return $next($request);
            }
        }
    }
}