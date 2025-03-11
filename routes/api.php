<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemsModelController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\QuotationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/items', [ItemsModelController::class, 'index']);
//     Route::post('/save-draft', [QuotationController::class, 'saveToDraft']);
//     Route::post('/save-quotation', [QuotationController::class, 'saveQuotation']);
// });
//Quotation Routes
Route::post('/save-draft', [QuotationController::class, 'saveToDraft']);
Route::post('/save-quotation', [QuotationController::class, 'saveQuotation']);
Route::get('/summary', [QuotationController::class, 'summary']);
Route::get('/quotation/{id}/download-pdf', [QuotationController::class, 'downloadPDF']);

//ito po is public route/endpoint
Route::get('/items', [ItemsModelController::class, 'index']);

//Login Route/Endpoint
Route::post('/login', [AuthController::class, 'login']);