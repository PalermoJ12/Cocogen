<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\AuthModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller
{
    protected $AuthModel;

    public function __construct()
    {
        $this->AuthModel = new AuthModel();
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        
        $credentials = $request->only('email', 'password');
        $user = $this->AuthModel->checkCredentials($credentials['email'], $credentials['password']);

        if ($user) {

            $token = $user->createToken('authToken')->plainTextToken;


            $hashedToken = Hash::make($token);

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $hashedToken,
            ], 200);
        }

        return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
    }
}
