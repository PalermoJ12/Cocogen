<?php

namespace App\Http\Controllers;

use App\Models\ItemsModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ItemsModelController extends Controller
{
    protected $itemsModel;
    public function __construct()
    {
        $this->itemsModel = new ItemsModel();
    }


    public function index()
    {
        try {
            return response()->json($this->itemsModel->all());
        } catch (\Throwable $th) {
            throw $th;
        }
    }


}
