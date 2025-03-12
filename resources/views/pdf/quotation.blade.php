<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table,
        .table th,
        .table td {
            border: 1px solid black;
            padding: 10px;
            text-align: left;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>COCOGEN EXAM INC.</h2>
        <p>Cocogen Insurance, Inc., 22F One Corporate Center, Doña Julia Vargas Avenue, corner Meralco Ave, Ortigas
            Center, Pasig, Metro Manila</p>
        <p>Email: palermojericho14@gmail.com | Phone: +639451959211</p>
    </div>

    <h3>Quotation Summary</h3>
    <p><strong>Customer:</strong> {{ $quotation->customer_name }}</p>
    <p><strong>Quotation No:</strong> {{ $quotation->quotation_number }}</p>
    <p><strong>Date:</strong> {{ $quotation->quote_date }}</p>

    <h3>Quotation Items</h3>
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($quotation->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->item->item_name }}</td>
                    <td>{{ $item->item_quantity }}</td>
                    <td>{{ number_format($item->item_price, 2) }}</td>
                    <td>{{ number_format($item->item_quantity * $item->item_price, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h3>Total Amount: &#8369; {{ number_format($quotation->total_amount, 2) }}</h3>

    <div class="footer">
        <p>Thank you for your business!</p>
    </div>
</body>

</html>
