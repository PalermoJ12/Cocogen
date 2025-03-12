<?php

namespace App\Http\Controllers;

use App\Models\QuotationModel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\QuotationItemsModel;
use App\Models\ItemsModel;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Foundation\Exceptions\Renderer\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuotationController extends Controller
{
    protected $quotationModel;
    protected $quotationItemsModel;
    protected $itemsModel;
    public function __construct()
    {
        $this->quotationModel = new QuotationModel();
        $this->quotationItemsModel = new QuotationItemsModel();
        $this->itemsModel = new ItemsModel();
    }
    public function summary()
    {
        try {

            $quotations = QuotationModel::with(['items.item'])->get();


            return response()->json(['success' => true, 'quotation' => $quotations]);


        } catch (\Exception $e) {




            return response()->json([
                'success' => false,
                'message' => 'Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {

            $quotation = QuotationModel::findOrFail($id);

            Log::info('Update Request Received', $request->all());
            $quotation->customer_name = $request->data['customer_name'] ?? null;
            $quotation->total_amount = $request->data['total_amount'] ?? 0;
            $quotation->status = $request->data['status'] ?? 0;
            $quotation->save();


            $quotation->items()->delete(); 

            foreach ($request->data['items'] as $itemData) {
                $quotation->items()->create([
                    'item_id' => $itemData['item_id'] ?? null,
                    'item_quantity' => $itemData['item_quantity'],
                    'item_price' => $itemData['item_price'],
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Quotation updated successfully!'
            ]);
        } catch (\Exception $e) {
            \Log::error("Quotation Update Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update quotation',
                'error' => $e->getMessage(),
            ], 500);
        }
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
                'quotation_id' => $nextId,
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
                'quotation_id' => $nextId,
                'item_quantity' => $item['quantity'],
                'item_price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Quotation saved successfully!',
            'quotation_number' => $quotationNumber
        ]);


    }



    public function viewSummary($id)
    {
        try {

            $quotation = QuotationModel::with(['items.item'])->findOrFail($id);


            return response()->json(['success' => true, 'quotation' => $quotation]);


        } catch (\Exception $e) {

            \Log::error("PDF Generation Error: " . $e->getMessage());


            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteSummary($id)
    {
        try {

            $quotation = QuotationModel::findOrFail($id)->delete();



            return response()->json(['success' => true, 'message' => 'Successfully deleted a summary.']);


        } catch (\Exception $e) {

            \Log::error("PDF Generation Error: " . $e->getMessage());


            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function downloadPDF($id)
    {
        try {

            $quotation = QuotationModel::with(['items.item'])->findOrFail($id);


            $pdf = Pdf::loadView('pdf.quotation', compact('quotation'));


            return $pdf->download("Quotation_{$quotation->quotation_number}_" . date('Ymd_His') . ".pdf");


        } catch (\Exception $e) {

            \Log::error("PDF Generation Error: " . $e->getMessage());


            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}