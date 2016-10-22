<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getADUsers()
    {
        $connection = ldap_connect("dc02.ce.int", 389);
        ldap_set_option($connection, LDAP_OPT_REFERRALS, 0);
        ldap_set_option($connection, LDAP_OPT_PROTOCOL_VERSION, 3);
        $bind = ldap_bind($connection, "ce\\book", "Dv15Gqwz6Z");
        $justthese = array("name", "mail", "samaccountname");
        $ldap_dn = "OU=comenergo real users, DC=ce, DC=int";
        $users = ldap_search($connection, $ldap_dn,"(cn=*)", $justthese);
        $entries = ldap_get_entries($connection, $users);
        $adusers = array();
        for($i = 0; $i < $entries["count"]; $i++){
            if(!(array_search("mail", $entries[$i]))){
                continue;
            }
            $login = $entries[$i]["samaccountname"][0];
            $fullname = $entries[$i]["name"][0];
            $email = $entries[$i]["mail"][0];

            $pattern = '/[а-яА-Я](\s)/';
            if(preg_match($pattern, $fullname ) && $email != ""){
                array_push($adusers, array("login" => $login, "fullname" => $fullname, "email" => $email));
            }
        }
        $result = array('success' => true, 'data' => $adusers);
        return  json_encode($result,JSON_UNESCAPED_UNICODE);
    }

    public function getCurrentUser()
    {
        $login = explode("@",$_SERVER['REMOTE_USER'])[0];
        $connection = ldap_connect("dc02.ce.int", 389);
        ldap_set_option($connection, LDAP_OPT_REFERRALS, 0);
        ldap_set_option($connection, LDAP_OPT_PROTOCOL_VERSION, 3);
        $bind = ldap_bind($connection, "ce\\book", "Dv15Gqwz6Z");
        $filter = "sAMAccountName=$login";
        $justthese = array("name", "mail");
        $ldap_dn = "DC=ce, DC=int";
        $users = ldap_search($connection, $ldap_dn, $filter, $justthese);
        $entries = ldap_get_entries($connection, $users);
                $fullname = $entries[0]["name"][0];
                $email = $entries[0]["mail"][0];
        $result = array('success' => true,
            'data' => array('login' => $login, 'fullname' => $fullname, 'email' => $email));
        return json_encode($result,JSON_UNESCAPED_UNICODE);
    }
    
    
}
