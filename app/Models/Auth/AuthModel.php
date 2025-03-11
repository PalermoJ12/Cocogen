<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class AuthModel extends Model
{
    use HasApiTokens, Notifiable;
    protected $table = 'users';
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = [
        'password',
    ];

    public function checkCredentials($email, $password)
    {
        $user = $this->where('email', $email)->first();

        if ($user && Hash::check($password, $user->password)) {
            return $user;
        }

        return null;
    }
}
