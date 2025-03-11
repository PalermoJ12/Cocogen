<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationItemsModel extends Model
{
    protected $table = 'tbl_quotation_items';
    protected $primaryKey = 'id';
    protected $fillable = [
        'quotation_id',
        'item_quantity',
        'item_id',
        'item_price'
    ];
    public $timestamps = true;

    public function item()
    {
        return $this->belongsTo(QuotationModel::class, 'quotation_id');
    }
    
}
