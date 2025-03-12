<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemsModelController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\QuotationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/save-draft', [QuotationController::class, 'saveToDraft']);
    Route::post('/save-quotation', [QuotationController::class, 'saveQuotation']);
    Route::put('/update-quotation/{id}', [QuotationController::class, 'update']);
    Route::get('/summary', [QuotationController::class, 'summary']);
    Route::get('/view-summary/{id}', [QuotationController::class, 'viewSummary']);
    Route::get('/quotation/{id}/download-pdf', [QuotationController::class, 'downloadPDF']);
    Route::delete('/summary/{id}/delete', [QuotationController::class, 'deleteSummary']);
    Route::get('/items', [ItemsModelController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
});



//Login Route/Endpoint
Route::post('/login', [AuthController::class, 'login']);