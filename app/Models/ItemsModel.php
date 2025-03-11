<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemsModel extends Model
{
    use HasFactory;
    protected $table = 'tbl_items'; // Ensure the table name is correctly set
    protected $fillable = ['item_name', 'price', 'quantity'];


    public function items()
    {
        return $this->all();
    }
}
