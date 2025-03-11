<?php

namespace App\Http\Controllers;

use App\Models\QuotationModel;
use App\Models\QuotationItemsModel;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    protected $quotationModel;
    protected $quotationItemsModel;
    public function __construct()
    {
        $this->quotationModel = new QuotationModel();
        $this->quotationItemsModel = new QuotationItemsModel();
    }
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function saveToDraft(Request $request)
    {

        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'customer' => 'required|string',
        ]);

        $year = now()->format('Y');


        $nextId = \DB::select("SHOW TABLE STATUS LIKE 'tbl_quotation'")[0]->Auto_increment ?? 1;


        $quotationNumber = 'QUOTE-' . $year . str_pad($nextId, 3, '0', STR_PAD_LEFT);


        $quotation = $this->quotationModel->create([
            'total_amount' => $request->total,
            'customer_name' => $request->customer,
            'quotation_number' => $quotationNumber,
            'quote_date' => now(),
            'user_id' => $request->user,
            'status' => 0,
        ]);


        if (!$quotation) {
            return response()->json(['error' => 'Failed to create quotation'], 500);
        }


        foreach ($request->items as $item) {
            $this->quotationItemsModel->create([
                'item_id' => $item['id'],
                'quotation_id' => $nextId ,
                'item_quantity' => $item['quantity'],
                'item_price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Quotation saved successfully!',
            'quotation_number' => $quotationNumber
        ]);


    }

    public function saveQuotation(Request $request)
    {

        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'customer' => 'required|string',
        ]);

        $year = now()->format('Y');


        $nextId = \DB::select("SHOW TABLE STATUS LIKE 'tbl_quotation'")[0]->Auto_increment ?? 1;


        $quotationNumber = 'QUOTE-' . $year . str_pad($nextId, 3, '0', STR_PAD_LEFT);


        $quotation = $this->quotationModel->create([
            'total_amount' => $request->total,
            'customer_name' => $request->customer,
            'quotation_number' => $quotationNumber,
            'quote_date' => now(),
            'user_id' => $request->user,
            'status' => 1,
        ]);


        if (!$quotation) {
            return response()->json(['error' => 'Failed to create quotation'], 500);
        }


        foreach ($request->items as $item) {
            $this->quotationItemsModel->create([
                'item_id' => $item['id'],
                'quotation_id' => $nextId ,
                'item_quantity' => $item['quantity'],
                'item_price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Quotation saved successfully!',
            'quotation_number' => $quotationNumber
        ]);


    }
    /**
     * Display the specified resource.
     */
    public function show(QuotationItemsModel $quotationItemsModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuotationItemsModel $quotationItemsModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QuotationItemsModel $quotationItemsModel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuotationItemsModel $quotationItemsModel)
    {
        //
    }
}
