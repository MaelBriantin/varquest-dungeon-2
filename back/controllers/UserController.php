<?php
if(!isset($_SESSION))
{
    session_start();
}

include_once 'Controller.php';
class UserController extends Controller
{
    private string $table;
    function __construct()
    {
        $this->table = "users";
    }

    public function create ($post): void
    {

    }

    public function delete ($id): void
    {

    }

    function updateAll ($post, $id)
    {

    }

    function updateOne ($col, $value, $is_string, $id)
    {

    }

    function index ()
    {

    }

    function find ($username, $password)
    {
        $username = json_encode($username, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $password = json_encode($password, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $sql = "SELECT * FROM $this->table WHERE username = $username AND password = $password";
        $user = $this->getData($sql);

        if($user){
            $_SESSION['user_id'] = $user['id'];
            //echo json_encode($_SESSION, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            return $_SESSION;
        }
    }

    function logout ()
    {
        //session_start();
        $_SESSION = array();
        session_destroy();
        return 'disconnected';
    }
}