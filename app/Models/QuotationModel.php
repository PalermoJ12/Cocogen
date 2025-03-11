<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationModel extends Model
{
    protected $table = 'tbl_quotation';
    protected $primaryKey = 'id';
    protected $fillable = ['customer_name', 'quotation_number', 'quote_date', 'total_amount', 'status'];
    public $timestamps = true;

    public function items()
    {
        return $this->hasMany(QuotationItemsModel::class, 'id');
    }
}
