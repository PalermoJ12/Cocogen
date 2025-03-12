<?php

namespace App\Http\Controllers;

use App\Models\QuotationModel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\QuotationItemsModel;
use App\Models\ItemsModel;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

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
        return response()->json($this->quotationModel->all());
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

       
            return response()->json(['success' => true , 'quotation'=> $quotation]);


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

            

            return response()->json(['success' => true , 'message'=>'Successfully deleted a summary.']);


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